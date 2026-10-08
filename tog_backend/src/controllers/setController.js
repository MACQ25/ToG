import { getAllSets, getAllBlocks, getSetCards } from "../services/setService.js";

export async function listSets(req, res) {
    try {
        const allSets = await getAllSets();
        return res.status(200).json(allSets)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

export async function listBlocks(req, res){
    try {
        const allBlocks = await getAllBlocks();
        return res.status(200).json(allBlocks)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
    
}

export async function setCards(req, res){
    try {
        const { code } = req.params;
        console.log(code);
        
        const set = await getSetCards(code);
        return res.status(200).json(set);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}