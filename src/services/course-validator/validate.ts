import { zodResponseFormat } from 'openai/helpers/zod'
import { createGPTCompletion } from '../openai'
import type { ValidateObjectiveUserData, ValidatedObjective } from '../../types/curricula'
import { CurriculaSubmissionType } from '../../types/curricula'
import { createUserPrompt } from './prompt'
import { SubmissionSchema } from './schema'

/**
 * Function to validate if the objective is educational and suitable for curriculum creation
 *
 * todo: Adding a field to capture required prior knowledge can help in sequencing pages more effectively.
 * Encouraging the AI to deconstruct broad objectives into smaller, specific sub-objectives can enhance content granularity.
 * Implementing mechanisms for learners to provide feedback can help in refining the content over time.
 *
 * @param {string} objective - The user's learning objective to analyze
 * @param {CCSubmissionType} submissionType - The type of submission (TEXT, PDF, DESCRIPTION)
 * @returns {Promise<Object>} Object with validation status, reason, objective summary, and potential subject classification
 */
export async function validateLearningObjective(params: ValidateObjectiveUserData, submissionType: CurriculaSubmissionType): Promise<ValidatedObjective | false> {
  const systemPrompt = getSubmissionTypeSystemPrompt(submissionType)

  if (!systemPrompt.length) {
    return false
  }

  const userPrompt = createUserPrompt(params)

  const response_format = zodResponseFormat(SubmissionSchema, 'validation_response')

  const completion = await createGPTCompletion(systemPrompt, userPrompt, response_format)

  if (!completion) {
    return false
  }

  let parsedJson
  try {
    parsedJson = JSON.parse(completion)
  }
  catch (error) {
    return false
  }

  // Validate parsed JSON against the schema
  try {
    const validatedData = SubmissionSchema.parse(parsedJson)
    return validatedData // Todo -> fix type error
  }
  catch (validationError) {
    return false
  }
}

export function getSubmissionTypeSystemPrompt(type: string) {
  let prompt = ''

  switch (type) {
    case CurriculaSubmissionType.TEXT:
      prompt = 'As an expert educational evaluator, analyze the provided text for suitability in curriculum creation. Your analysis should be based on educational frameworks including SMART goals, Bloom\'s Taxonomy, Cognitive Load Theory, Mastery Learning, Universal Design for Learning (UDL), and 21st-Century Skills.'
      break

    case CurriculaSubmissionType.PDF:
      prompt = 'As an expert educational evaluator, analyze the content of the provided PDF for suitability in curriculum creation. Your analysis should be based on educational frameworks including SMART goals, Bloom\'s Taxonomy, Cognitive Load Theory, Mastery Learning, Universal Design for Learning (UDL), and 21st-Century Skills.'
      break

    case CurriculaSubmissionType.DESCRIPTION:
      prompt = 'As an expert educational evaluator, analyze the following description for suitability in curriculum creation. Your analysis should be based on educational frameworks including SMART goals, Bloom\'s Taxonomy, Cognitive Load Theory, Mastery Learning, Universal Design for Learning (UDL), and 21st-Century Skills.'
      break

    default:
      return ''
  }

  return prompt
}
