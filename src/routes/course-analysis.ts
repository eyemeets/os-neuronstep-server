import type { Request, Response } from 'express'
import { courseAnalysisController } from '../controllers/course-analysis'

/**
 * Handles POST requests for '/api/topic-content', processing different types of input (PDF, image, text, description).
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns A JSON object with the processed content or an error message.
 */
export const post = async (req: Request, res: Response) =>
  courseAnalysisController(req, res)
