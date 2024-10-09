import * as dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import path from 'path'
import { createRouter } from 'express-file-routing'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import { getLocalNetworkIp } from './utils/utils'

const app = express()

// CORS options setup
const corsOptions = {
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(fileUpload())

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`)
  next()
})

const localIp = getLocalNetworkIp() // Get the Wi-Fi IP address dynamically
const port = 8080

app.listen(port, localIp, async () => {
  await createRouter(app, {
    directory: path.join(__dirname, 'routes')
  })

  console.log(`\n Express server running on http://${localIp}:${port}`)

  return
})

export default app
