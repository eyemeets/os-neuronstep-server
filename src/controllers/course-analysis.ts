import type { Request, Response } from 'express'
import { analyzeContent } from '../services/course-analysis/analyze'

import type { ValidatedObjective } from '../types/curricula'
import { processFile } from '../services/file-processor'

/**
 * Controller function to handle content analysis or file processing.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const courseAnalysisController = async (req: Request, res: Response) => {
  try {
    const file = req.file
    const params = Object.assign(req.body, { file }) as ValidatedObjective

    if (!params) return res.status(400).json({
      error: 'No parameters provided'
    })

    const curriculumOutline = await analyzeContent(params)

    if (curriculumOutline) {
      return res.json(curriculumOutline)
    }

    if (file) {
      const fileProcessingResult = await processFile(file)
      return res.json(fileProcessingResult)
    }

    return res.status(400).json({
      error: 'No valid input provided'
    })
  }
  catch (error) {
    return res.status(500)
      .json({
        error: 'Server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      })
  }
}