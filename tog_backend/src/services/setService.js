/** @type {import('mongoose').Model} */
import { type } from 'os';
import SetModel from '../models/Set.js';
import { set } from 'mongoose';

const SetObj = { 
    "data.code": 1, 
    "data.name": 1, 
    "data.block": 1, 
    "data.type": 1, 
    "data.releaseDate": 1,
    "data.parentCode": 1
}


function handleFaces(cards){

    const div ={...Object.groupBy(cards, ({number}) => number )};

    const melded = []

    Object.values(div).forEach((arr) => {
        if (arr[0]["layout"] !== "normal") {
            //console.log(arr)
            if(arr.length > 1){
                arr[0]['otherFaceId'] = arr[1]['uuid'];
                arr[0]['otherFace'] = {
                    'scryfallImageUrl': (['transform', 'modal_dfc', 'reversible_card'].includes(arr[0]['layout']) ? arr[1]['scryfallImageUrl'].replace('front', 'back') : arr[1]['scryfallImageUrl'])
                    //we'll probably put more data here later
                }
                arr.pop();
            } else if (arr[0]["layout"] === "meld") {
                if(arr[0]['otherFaceId'].length > 1){
                   melded.push(arr[0])
                } else {
                    arr[0]['otherFaceId'] = arr[0]['cardback']
                    arr[0]['otherFace'] = {
                        'thisBack': `https://backs.scryfall.io/large/${arr[0]['cardback'].substring(0,1)}/${arr[0]['cardback'].substring(1,2)}/${arr[0]['cardback']}.jpg`
                    }
                }
            }
        }
    })

    let toReturn = Object.values(div).flat();

    melded.forEach((mld) => {
        let f1 = toReturn.find(c => c.uuid == mld.otherFaceId[0]);
        let f2 = toReturn.find(c => c.uuid == mld.otherFaceId[1]);

        let nObj = {
            'scryfallImageUrl': mld.scryfallImageUrl,
            'frontTop' : f1.scryfallImageUrl,
            'backTop' : f1.otherFace.thisBack,
            'frontBot' : f2.scryfallImageUrl,
            'backBot' : f2.otherFace.thisBack,
        }

        f1.otherFace = nObj
        f2.otherFace = nObj
        f1.otherFaceId = mld.uuid
        f2.otherFaceId = mld.uuid
    });

    const filterOut = melded.map(o => o.uuid);

    toReturn = toReturn.filter((elem) => !filterOut.includes(elem.uuid))

    return toReturn
}

function handleCategories(cards){
    const div ={...Object.groupBy(cards, ({origin}) => origin?.[0] ?? "variant" )};
    let bfPart
    let overview;

    if (div.boosterfun) {

        const frameBlacklist = new Set(["legendary", "enchantment"])

        bfPart = {...Object.groupBy(div.boosterfun, ({frameEffects}) => {
            const validEffect = frameEffects?.find(effect => !frameBlacklist.has(effect));
            return validEffect ?? "other";
        })}

        delete div.boosterfun
    }

    overview = Object.entries(div).map(([key, value]) => ({
        label: key,
        count: value.length
    }));


    if(bfPart){
        overview = overview.concat(
            Object.entries(bfPart)
                .map(([key, value]) => (
                    { label: key, count: value.length }
                ))
        )
    }

    let categorized = { ...div, ...bfPart }

    Object.entries(categorized).map(([key, value]) => ( value.map((ent) => { ent.inner_category = key }) ))

    return overview
}

export async function getAllSets() {
    try {
        const sets = await SetModel.find(
            { $and: [{"data.type": { $in: ["expansion", "core", "masters"] }}, {"data.isForeignOnly": {$ne: true} }, {"data.isOnlineOnly": {$ne: true} } ] },
            SetObj
        ).sort({ "data.releaseDate": 1 });
        return sets
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getAllBlocks(){
    try {
        const blocks = await SetModel.aggregate(
            [
                { $match: {  'data.block': { $exists: true }, 'data.type': { $eq: 'expansion' } } },
                { $set: { data: { _id: '$_id' } } },
                { $group: {
                        _id: '$data.block',
                        parent_id: {
                        $top: {
                            output: '$data._id',
                            sortBy: { 'data.releaseDate': 1 }
                        }
                        },
                        code: {
                        $top: {
                            output: '$data.code',
                            sortBy: { 'data.releaseDate': 1 }
                        }
                        },
                        members: { $addToSet: {
                            id: "$data._id",
                            name: "$data.name",
                            code: "$data.code",
                            releaseDate: "$data.releaseDate"
                        } 
                        },
                        releaseDate: { $min: '$data.releaseDate' }
                    }
                },
                {
                    $project: {
                    _id: '$parent_id', 
                    data: {
                        'code': '$code', 
                        'name': '$_id', 
                        'releaseDate': '$releaseDate', 
                        'members': '$members'
                        }
                    }
                },
                { $sort: { 'data.releaseDate': 1 } }
            ],
        );



        return blocks
    } catch (error) {
        console.log(error)
        throw error
    }


}

export async function getByRange(date, range, opt, stnd) {
    try {

        const target = new Date(date)

        /*
        const lThresh = new Date(date);
        const hThresh = new Date(date);

        lThresh.setFullYear(lThresh.getFullYear() - (range - 1));
        hThresh.setFullYear(hThresh.getFullYear() + 1);

        console.log(lThresh, hThresh)

        */
        
        let expansionType = [ "expansion", "core" ]

        if(opt.allowMasters) expansionType.push("masters");
        if(opt.allowPromo) expansionType.push("promo")
        if(opt.allowStarter) expansionType.push("starter")

        let dateFilter = {
            $gte: [],
            $lt: []
        };

        if(stnd) {
            dateFilter = {
                $gte: `${target.getFullYear() - (range - 1)}-09-01`,
                $lt: `${target.getFullYear() + 1}-09-01`,
            }
        } else {
            // this is for the progression one
            const upper = new Date(range)

            dateFilter = {
                $gte: `${target.toISOString().split('T')[0]}`,
                $lt: `${upper.toISOString().split('T')[0]}`,
            }
        }

        let cond = {
            $and: [
                {"data.type": { $in: expansionType }},
                {"data.isForeignOnly": {$ne: true} }, 
                {"data.isOnlineOnly": {$ne: true} } ,
                {"data.releaseDate": dateFilter }
            ] 
        }

        if(opt.sixthEd) {
            cond = {
                $or: [
                    {"data.code": { $eq: "6ED" }},
                    cond
                ]
            }
        }


        const sets = await SetModel.find( cond, SetObj ).sort({ "data.releaseDate": 1 });

        let res = { included: [], toRelease: [] }

        if(stnd){
            sets.forEach((set) => {
                if(new Date(Date.parse(set.data.releaseDate)).getFullYear() <= Number.parseInt(date)){
                    res.included.push(set);
                } else res.toRelease.push(set);
            })

            if(opt.displayRotated) {
                        
                const rotationRange = {
                    $gte: `${target.getFullYear() - range}-09-01`,
                    $lt: `${target.getFullYear() - (range - 1)}-09-01`,
                }

                const rotateOut = await SetModel.find(
                    { 
                        $and: [
                            {"data.type": { $in: expansionType }},
                            {"data.isForeignOnly": {$ne: true} }, 
                            {"data.isOnlineOnly": {$ne: true} } ,
                            {"data.releaseDate": rotationRange }
                        ] 
                    },
                    SetObj
                ).sort({ "data.releaseDate": 1 })

                Object.assign(res, { justRotated: [...rotateOut] })
            }
        } else {
            
            const [base, starter, promo] = sets.reduce((acc, val, i) => { 
                const base = sets[i].data.type === "core" || sets[i].data.type === "expansion"  || sets[i].data.type === "masters" 
                const starter = !base && sets[i].data.type === "starter"
                acc[base ? 0 : starter ? 1 : 2].push(val);
                return acc;
            }, [[], [], []])

            if(opt.customStart){
                res.toRelease = base.slice(1);
            } else {
                res.included = base.slice(0, 4);
                res.toRelease = base.slice(4);                
            }


            if (starter.length > 0 ) Object.assign(res, { starterSet: starter });
            
            if (promo.length > 0 ) {
                let alt_promo = promo.map((ent) => {
                    ent.data.code = ent.data.parentCode ?? ent.data.code;
                    return ent
                })
                Object.assign(res, { promo: alt_promo })
            };

        }


        return res;
    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function getSetCards(code) {
    try {
        const result = await SetModel.aggregate([
            { $match: { "data.code": code }}, 
            { 
               $project:{
                 "cards": {
                        $map: {
                            input: {$getField : { field: "cards", input: { $getField: "data" } } },
                            as: "card",
                            in: {
                                "uuid": "$$card.uuid",
                                "name": "$$card.name",
                                "number": "$$card.number",
                                "otherFaceId": "$$card.otherFaceIds",
                                "scryfallId": "$$card.identifiers.scryfallId",
                                "scryfallImageUrl": {
                                    $concat: [
                                        "https://cards.scryfall.io/normal/front/",
                                        { $substrCP: ["$$card.identifiers.scryfallId", 0, 1] },
                                        "/",
                                        { $substrCP: ["$$card.identifiers.scryfallId", 1, 1] },
                                        "/",
                                        "$$card.identifiers.scryfallId",
                                        ".jpg"
                                    ]
                                },
                                "frameEffects": "$$card.frameEffects",
                                "origin": {
                                    $ifNull: ["$$card.promoTypes", "$$card.boosterTypes"]
                                },
                                "layout": "$$card.layout",
                                "cardback": "$$card.identifiers.scryfallCardBackId",
                                "set": code
                            }
                        }
                    },
                }
            }]
        )

        const formatted = handleFaces(result[0].cards)
        const categories = handleCategories(formatted)
        return { cards: formatted, categories: categories }
    } catch (error) {
        console.log(error)
        throw error
    }
}