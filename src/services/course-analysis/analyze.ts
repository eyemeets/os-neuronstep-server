// analyze.ts
import { zodResponseFormat } from 'openai/helpers/zod'
import { sendMessageAndParseResponse, setupAssistantAndThread } from '../openai' // Adjust the import path as needed
import type { CurriculumPlan } from '../../types/curricula'
import type { ValidatedObjective } from '../../types/curricula'
import { createUserPromptForCurriculumOutlineSchema, createUserPromptForCurriculumPlan } from './prompt'
import { ZodCurriculumOutlineSchema, ZodCurriculumPlanSchema } from './schema'
import type { AssistantResponseFormatOption } from 'openai/resources/beta/threads/threads'

import mockupCurriculumOutline from '../../mockup/curriculum-outline'
import { generateCourseImagePrompt, generateSubtopicImagePrompt, generateTopicImagePrompt } from '../../utils/image-prompts'

export async function analyzeContent(params: ValidatedObjective) {
  const assistant = await setupAssistantAndThread({
    name: 'Curriculum Designer',
    instructions: 'You are an expert curriculum designer with a deep understanding of educational frameworks and adaptive learning strategies.',
    assistantId: params.assistant_id,
    threadId: params.threadId
  })

  // Step 1: Generate Curriculum Plan
  console.log('Generate Curriculum Plan')

  const curriculumPlan = params.use_mockup_data ?
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

  // Generate content
  const curriculumOutline = params.use_mockup_data ?
    mockupCurriculumOutline.outline :
    await createContentOutlineForCurriculum({
      validatedObjective: params,
      curriculumPlan: curriculumPlan,
      threadId: assistant.threadId,
      assistantId: assistant.assistantId,
      responseFormat: zodResponseFormat(ZodCurriculumOutlineSchema, 'validation_response')
    })

  // Add this guard clause
  if (!curriculumOutline) {
    throw new Error('Failed to generate curriculum outline.')
  }
  // Format data
  const courseTitle = curriculumOutline.title
  const courseDescription = curriculumOutline.description

  console.log('user_query', params.user_query)

  const courseImagePrompt = generateCourseImagePrompt(params.image_theme, courseTitle, courseDescription, params.user_query)
  curriculumOutline.image_prompt = courseImagePrompt
  console.log('courseImagePrompt -> ', courseImagePrompt)

  const formattedChapters = curriculumOutline.chapters.map((chapter) => {
    const topicImagePrompt = generateTopicImagePrompt(params.image_theme, chapter.topic)
    console.log('topicImagePrompt -> ', topicImagePrompt)

    return {
      ...chapter,
      image_prompt: topicImagePrompt, // This assigns the image prompt for the topic
      subtopics: chapter.subtopics.map((subtopic) => {
        const subtopicImagePrompt = generateSubtopicImagePrompt(params.image_theme, subtopic.subtopic)
        console.log('subtopicImagePrompt -> ', subtopicImagePrompt)

        return {
          ...subtopic,
          image_prompt: subtopicImagePrompt,
          pages: subtopic.pages.map((page) => {
            return {
              ...page,
              content: page.content || '' // Ensure content always has a value
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
}): Promise<CurriculumPlan | undefined> {
  const userMsgForCurriculumPlan = createUserPromptForCurriculumPlan(params.validatedObjective)

  // Send the message and get the curriculum plan
  const plan = await sendMessageAndParseResponse<CurriculumPlan>({
    stream: false,
    assistantId: params.assistantId,
    threadId: params.threadId,
    userMessageContent: userMsgForCurriculumPlan,
    responseFormat: params.responseFormat,
    schema: ZodCurriculumPlanSchema,
    errorMessage: 'Failed to parse curriculum plan'
  })

  // If plan is undefined, return undefined
  if (!plan) {
    return undefined
  }

  // Assign the assistantId and threadId to the plan
  plan.assistantId = params.assistantId
  plan.threadId = params.threadId

  return plan
}

async function createContentOutlineForCurriculum(params: {
  stream?: boolean
  validatedObjective: ValidatedObjective
  curriculumPlan: CurriculumPlan | undefined
  assistantId: string
  threadId: string
  responseFormat: AssistantResponseFormatOption | null | undefined
}, processChunk?: (chunk: string) => void) {
  // Handle case where curriculumPlan is undefined
  if (!params.curriculumPlan) {
    console.error('Curriculum plan is undefined, cannot proceed with content outline generation.')
    return undefined // Return early if curriculumPlan is undefined
  }

  // Create the user message for curriculum outline schema
  const userMsgForTopics = createUserPromptForCurriculumOutlineSchema(params.validatedObjective, params.curriculumPlan)

  // Use sendMessageAndParseResponse with streaming enabled and pass the processChunk callback
  const topics = await sendMessageAndParseResponse({
    stream: params.stream,
    assistantId: params.assistantId,
    threadId: params.threadId,
    userMessageContent: userMsgForTopics,
    responseFormat: params.responseFormat,
    schema: ZodCurriculumOutlineSchema,
    errorMessage: 'Failed to parse educational outline'
  }, processChunk) // Pass the callback function to handle streamed chunks

  console.log('Received response:', topics) // Log the final response when streaming is complete

  return topics // Return the final topics (could be valid or undefined)
}
