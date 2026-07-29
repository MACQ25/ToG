/** @type {import('mongoose').Model} */
import Set from "../models/Set.js";

export async function getAllSets() {
    try {
        const sets = await Set.find(
            { $and: [{"data.type": { $in: ["expansion", "core", "masters"] }}, {"data.isForeignOnly": {$ne: true} }, {"data.isOnlineOnly": {$ne: true} } ] },
            { "data.code": 1, "data.name": 1, "data.block": 1, "data.type": 1, "data.releaseDate": 1, "data.tcgplayerGroupId": 1 }
        ).sort({ "data.releaseDate": 1 });
        return sets
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getSetCards(code) {
    try {
        const result = await Set.aggregate([
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
                                "promoTypes": "$$card.promoTypes",
                                "boosterTypes": "$$card.boosterTypes"
                            }
                        }
                    },
                }
            }]
        )
        console.log(result)
        return result[0]?.cards ?? []
    } catch (error) {
        console.log(error)
        throw error
    }
}