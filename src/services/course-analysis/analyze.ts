// analyze.ts

import { zodResponseFormat } from 'openai/helpers/zod'
import { sendMessageAndParseResponse, setupAssistantAndThread } from '../openai' // Adjust the import path as needed
import type { CurriculumObjectivePlanAndOutlineStructure, CurriculumPlan } from '../../types/curricula'
import type { ValidatedObjective } from '../../types/curricula'
import { createUserPromptForCurriculumOutlineSchema, createUserPromptForCurriculumPlan } from './prompt'
import { ZodCurriculumOutlineSchema, ZodCurriculumPlanSchema } from './schema'
import type { AssistantResponseFormatOption } from 'openai/resources/beta/threads/threads'

import mockupCurriculumOutline from '../../mockup/curriculum-outline'
import { generateCourseImagePrompt, generatePageImagePrompt, generateSubtopicImagePrompt, generateTopicImagePrompt } from '../../utils/image-prompts'

export async function analyzeContent(params: ValidatedObjective): Promise<CurriculumObjectivePlanAndOutlineStructure> {
  const assistant = await setupAssistantAndThread({
    name: 'Curriculum Designer',
    instructions: 'You are an expert curriculum designer with a deep understanding of educational frameworks and adaptive learning strategies.',
    assistantId: params.assistantId,
    threadId: params.threadId
  })

  // Step 1: Generate Curriculum Plan
  console.log('Generate Curriculum Plan')
  console.log('params.useMockupData -> ', params.useMockupData)

  const curriculumPlan = params.useMockupData ?
    mockupCurriculumOutline.plan :
    await generateCurriculumPlan({
      validatedObjective: params,
      threadId: assistant.threadId,
      assistantId: assistant.assistantId,
      responseFormat: zodResponseFormat(ZodCurriculumPlanSchema, 'validation_response')
    })

  console.log('Finished generating Curriculum Plan')

  // Step 4: Generate Main Topics, Sub Topics, and Pages based on the plan
  console.log('Generate Main Topics, Sub Topics, and Pages based on the plan')
  console.log('params.useMockupData -> ', params.useMockupData)
  const curriculumOutline = params.useMockupData ?
    mockupCurriculumOutline.outline :
    await createContentOutlineForCurriculum({
      validatedObjective: params,
      curriculumPlan: curriculumPlan,
      threadId: assistant.threadId,
      assistantId: assistant.assistantId,
      responseFormat: zodResponseFormat(ZodCurriculumOutlineSchema, 'validation_response')
    })

  const courseTitle = curriculumOutline.title
  const courseDescription = curriculumOutline.description

  const courseImagePrompt = generateCourseImagePrompt(params.image_theme, courseTitle, courseDescription)
  curriculumOutline.image_prompt = courseImagePrompt

  const formattedChapters = curriculumOutline.chapters.map((chapter) => {
    const topicImagePrompt = generateTopicImagePrompt(params.image_theme, courseTitle)

    return {
      ...chapter,
      image_prompt: topicImagePrompt,
      subtopics: chapter.subtopics.map((subtopic) => {
        const subtopicImagePrompt = generateSubtopicImagePrompt(params.image_theme, courseTitle)

        return {
          ...subtopic,
          image_prompt: subtopicImagePrompt,
          pages: subtopic.pages.map((page) => {
            //const pageImagePrompt = generatePageImagePrompt(params.image_theme, courseTitle)
            return {
              ...page,
              content: page.content || '' // Ensure content always has a value
              // image_prompt: pageImagePrompt
            }
          })
        }
      })
    }
  })

  curriculumOutline.chapters = formattedChapters

  return {
    objective: params,
    plan: curriculumPlan,
    outline: curriculumOutline
  }
}

async function generateCurriculumPlan(params: {
  validatedObjective: ValidatedObjective
  assistantId: string
  threadId: string
  responseFormat: AssistantResponseFormatOption | null | undefined
}): Promise<CurriculumPlan> {
  const userMsgForCurriculumPlan = createUserPromptForCurriculumPlan(params.validatedObjective)

  const plan = await sendMessageAndParseResponse<CurriculumPlan>({
    assistantId: params.assistantId,
    threadId: params.threadId,
    userMessageContent: userMsgForCurriculumPlan,
    responseFormat: params.responseFormat,
    schema: ZodCurriculumPlanSchema,
    errorMessage: 'Failed to parse curriculum plan'
  })

  plan.assistantId = params.assistantId
  plan.threadId = params.threadId

  return plan
}

async function createContentOutlineForCurriculum(params: {
  validatedObjective: ValidatedObjective
  curriculumPlan: CurriculumPlan
  assistantId: string
  threadId: string
  responseFormat: AssistantResponseFormatOption | null | undefined
}) {

  const userMsgForTopics = createUserPromptForCurriculumOutlineSchema(params.validatedObjective, params.curriculumPlan)

  const topics = await sendMessageAndParseResponse({
    assistantId: params.assistantId,
    threadId: params.threadId,
    userMessageContent: userMsgForTopics,
    responseFormat: params.responseFormat,
    schema: ZodCurriculumOutlineSchema,
    errorMessage: 'Failed to parse educational outline'
  })

  console.log('Received response:', topics) // Add this log

  return topics
}