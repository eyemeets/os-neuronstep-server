import express from 'express'
import path from 'path'
import { createRouter } from 'express-file-routing'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(fileUpload())
const port = 3000

app.listen(port, async () => {
  // Specify the routes directory inside 'src'
  await createRouter(app, {
    directory: path.join(__dirname, 'routes')
  })

  console.log(`Running on http://${port}`)
})

export default app
