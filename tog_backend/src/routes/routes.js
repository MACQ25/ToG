// import the router
import { Router } from 'express'

// Import all the routes
import { accountRouter } from './accountRoute.js'

// Use all these routes in the router
let apiRouter = Router() 
  .use('/account', accountRouter)

  
export { apiRouter }