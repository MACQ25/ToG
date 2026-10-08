import { Router } from 'express'
import { listSets, listBlocks, setCards } from '../controllers/setController.js';

let setRouter = Router()
    .get('/all', listSets)
    .get('/blocksSelect', listBlocks)
    .get('/:code', setCards)

export { setRouter }