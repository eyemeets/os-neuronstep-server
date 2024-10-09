import pdfParse from 'pdf-parse'
import * as Tesseract from 'tesseract.js'
import multer from 'multer'

// Set up multer for file handling (storing files in memory)
const upload = multer({ storage: multer.memoryStorage() })

/**
 * Processes the uploaded file, either PDF or image.
 * @param file - The uploaded file.
 * @returns The processed content or error message.
 */
export const processFile = async (file: Express.Multer.File) => {
  if (file.mimetype === 'application/pdf') {
    const pdfText = await pdfParse(file.buffer)
    return { message: 'Processing PDF file...', content: pdfText.text }
  }
  else if (file.mimetype.startsWith('image/')) {
    try {
      const result = await Tesseract.recognize(file.buffer, 'eng')
      return { message: 'Processing image file...', content: result.data.text }
    }
    catch (error) {
      throw new Error('Error processing image')
    }
  }
  throw new Error('Unsupported file type')
}

/**
 * Middleware to handle file uploads for the POST request.
 * This allows express-file-routing to apply multer middleware.
 */
export const middleware = [upload.single('file')]
