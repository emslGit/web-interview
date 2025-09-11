import express from 'express'
import cors from 'cors'
import { initDB } from './database/db.js'

import { listRouter } from './api/listRouter.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/lists', listRouter)

const PORT = 3001

initDB().then(() => {
  app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
})