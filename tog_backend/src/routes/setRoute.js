import { Router } from 'express'
import { listSets, setCards } from '../controllers/setController.js';

let setRouter = Router()
    .get('/all', listSets)
    .get('/:code', setCards)

export { setRouter }