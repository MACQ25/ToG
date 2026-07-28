/**
 * Heavily based on
 * https://namastedev.com/blog/implementing-modular-architectures-in-node-js-backends/
 */

import { Router } from 'express'
import { registerAccount, loginAccount, rememberAccount, logout, accountTest } from '../controllers/accountController.js';

let accountRouter = Router()
    .get('/test', accountTest)
    .post('/register', registerAccount)
    .post('/login', loginAccount)
    .get('/remember', rememberAccount)
    .get('/logout', logout)

export { accountRouter }