import { Router } from 'express'
import { listSets, listBlocks, setCards, iconProxy } from '../controllers/setController.js';

let setRouter = Router()
    .get('/all', listSets)
    .get('/blocksSelect', listBlocks)
    .get('/:code', setCards)
    .get('/icon/:icon', iconProxy)

export { setRouter }