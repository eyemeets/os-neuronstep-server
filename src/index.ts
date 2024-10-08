import * as dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import path from 'path'
import { createRouter } from 'express-file-routing'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import { getLocalNetworkIp } from './utils/utils'
import { generateDalleImage } from './services/openai'

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

  const prompt = 'Create a concise 20-word photorealistic image prompt focused on \"I want to learn about AI\" with a cinematic style. Include: real-world visuals and professional settings. Exclude: Ensure there is no text, sci-fi, or holographic elements in the image.'.trim()
  // Works great w dale-3 -> const promptAlt = 'A serene classroom setting with books, a philosopher statue, and abstract thought bubbles, representing philosophy study.'
  console.log(`\n Express server running on http://${localIp}:${port}`)
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY)
  //const url = await generateDalleImage(prompt)
  //console.log('Url -> ', url)
  return

  // const url = await generateDalleImage(prompt)
  // console.log('Url -> ', url)
  /*const output = await replicate.run(
    'stability-ai/stable-diffusion', // The model you want to use
    {
      input: {
        prompt
      }
    }
  )
  console.log(output)*/
})

export default app
