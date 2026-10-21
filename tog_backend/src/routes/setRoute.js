import { Router } from 'express'
import { listSets, listBlocks, listRange, setCards, iconProxy } from '../controllers/setController.js';

let setRouter = Router()
    .get('/all', listSets)
    .get('/blocksSelect', listBlocks)
    .get('/byRange', listRange)
    .get('/:code', setCards)
    .get('/icon/:icon', iconProxy)

export { setRouter }