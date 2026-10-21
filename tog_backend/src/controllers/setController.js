import { getAllSets, getAllBlocks, getByRange, getSetCards } from "../services/setService.js";
import http from 'http'
import { config } from "../config/config.js";
import axios from "axios";


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

export async function listRange(req, res) {
    try {
        const { date, range, ori } = req.query;
        console.log(date, range, ori);

        const inRange = await getByRange(Number.parseInt(date), Number.parseInt(range), ori === 'true')
        console.log(inRange)
        return res.status(200).json(inRange)

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

export async function iconProxy(req, res) {
    const { icon } = req.params;

    try {

        if (!/^[a-z0-9_-]+$/i.test(icon)) {
            return res.status(204).end();
        }

        const ares = await axios.get(`https://svgs.scryfall.io/sets/${icon}.svg`, {
            responseType: 'text',
            timeout: 5000,
        });
        res.set('Cache-Control', 'public, max-age=86400');
        return res.status(200).type('image/svg+xml').send(ares.data);

    } catch (err) {

        console.error(`Icon proxy failed for "${icon}":`, err.message);
        res.set('Cache-Control', 'public, max-age=60');
        return res.status(204).end();

    }
}