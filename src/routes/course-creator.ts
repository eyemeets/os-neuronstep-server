import type { Request, Response } from 'express'
import pdfParse from 'pdf-parse'
import * as Tesseract from 'tesseract.js'
import type { CurriculumObjectivePlanAndOutlineStructure } from '../types/curricula'
import { createContentForCourse } from '../services/course-creator/create'

/**
 * Handles POST requests for '/api/topic-content', processing different types of input (PDF, image, text, description).
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns A JSON object with the processed content or an error message.
 */
export const post = async (req: Request, res: Response) => {
  try {
    const file = req.file
    const params = Object.assign(req.body, { file }) as CurriculumObjectivePlanAndOutlineStructure

    if (!params) return

    const curriculumOutline = await createContentForCourse(params)

    if (curriculumOutline) {
      return res.json(curriculumOutline)
    }

    if (file) {
      // Determine if it's a PDF or image
      if (file.mimetype === 'application/pdf') {
        const pdfText = await pdfParse(file.buffer)
        return res.json({ message: 'Processing PDF file...', content: pdfText.text })
      }
      else if (file.mimetype.startsWith('image/')) {
        Tesseract.recognize(file.buffer, 'eng')
          .then((result) => {
            return res.json({ message: 'Processing image file...', content: result.data.text })
          })
          .catch((error) => {
            return res.status(500).json({ error: 'Error processing image', details: error })
          })
      }
      else {
        return res.status(400).json({ error: 'Unsupported file type' })
      }
    }

    return res.status(400).json({ error: 'No valid input provided' })
  }
  catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: 'Server error', details: error.message })
    }
    return res.status(500).json({ error: 'Server error', details: 'Unknown error occurred' })
  }
}