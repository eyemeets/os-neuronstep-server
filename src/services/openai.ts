import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions'
import { openai } from '../clients/openai'
import type { AssistantCreateParams, AssistantTool } from 'openai/resources/beta/assistants'
import type { MessageCreateParams } from 'openai/resources/beta/threads/messages'
import type { AssistantResponseFormatOption } from 'openai/resources/beta/threads/threads'
import type { z } from 'zod'
import { ZodError } from 'zod'
import type { CreateAssistantParams, MessageContentText, SetupResult } from '../types/openai'

/**
 * Creates a GPT completion using the given system and user messages.
 *
 * @param systemMsg - The system message to initialize the assistant.
 * @param userMsg - The user's message to the assistant.
 * @param response_format - The format of the response (e.g., 'text', 'json').
 * @returns The assistant's response as a string.
 */
export async function createGPTCompletion(systemMsg: string, userMsg: string, response_format: ChatCompletionCreateParamsBase['response_format']) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemMsg },
      {
        role: 'user',
        content: userMsg
      }
    ],
    response_format
  })

  return completion.choices[0].message.content
}

/**
 * Creates a GPT Assistant with the specified parameters.
 *
 * @param params - The configuration parameters for creating the assistant, including the name, instructions, tools, and model.
 * @returns The created assistant object.
 */
export async function createGPTAssistant(params: { name: string; instructions: AssistantCreateParams['instructions']; tools: AssistantTool[] | undefined; model: AssistantCreateParams['model'] }) {
  const assistant = await openai.beta.assistants.create({
    name: params.name,
    instructions: params.instructions,
    tools: params.tools,
    model: params.model || 'gpt-4o-mini'
  })
  return assistant
}


/**
 * Creates a GPT Thread to represent a conversation.
 *
 * @returns The created thread object.
 */
export async function createGPTThread() {
  const thread = await openai.beta.threads.create()
  return thread
}

/**
 * Adds a user message to a specific GPT thread.
 *
 * @param params - The message details and the thread to which the message should be added.
 * @returns The message object that was created in the thread.
 */
export async function addMessageToGPTThread(params: {
  msg: MessageCreateParams
  thread: {
    id: string
  }
}) {
  const message = await openai.beta.threads.messages.create(
    params.thread.id,
    params.msg
  )

  return message
}

/**
 * Creates and runs a thread with the specified assistant and instructions, and polls the response.
 *
 * @param params - The thread ID, assistant ID, instructions, and the response format.
 * @returns The run object containing the result of the assistant's processing.
 */
export async function createRunThreadWithAssistant(params: {
  thread: {
    id: string
    assistantId: string
    instructions: string
  }
  responseFormat: AssistantResponseFormatOption | null | undefined
}) {
  const run = await openai.beta.threads.runs.createAndPoll(
    params.thread.id,
    {
      assistant_id: params.thread.assistantId,
      instructions: params.thread.instructions,
      response_format: params.responseFormat
    },
  )

  return run
}

/**
 * Creates and runs a thread stream with the specified assistant and instructions, and processes the response in real-time using a callback.
 *
 * @param params - The thread ID, assistant ID, instructions, and the response format.
 * @param processChunk - A callback function to handle each chunk of streamed data.
 * @returns The stream object of the assistant's processing.
 */
export async function createRunThreadStreamWithAssistant(params: {
  thread: {
    id: string
    assistantId: string
    instructions: string
  }
  responseFormat: AssistantResponseFormatOption | null | undefined
}, processChunk: (chunk: string) => void) {
  const run = openai.beta.threads.runs.stream(
    params.thread.id,
    {
      assistant_id: params.thread.assistantId,
      instructions: params.thread.instructions,
      response_format: params.responseFormat
    },
  )

  // Async iteration over the stream
  for await (const chunk of run) {
    const text = chunk.toString()  // Assuming the chunk is a buffer

    // Call the provided callback to process the streamed text
    processChunk(text)
  }

  return run  // Returning the stream object in case it's needed elsewhere
}

/**
 * Retrieves a GPT run by its thread and run IDs.
 *
 * @param params - The thread ID and run ID to retrieve the run.
 * @returns The retrieved run object.
 */
export async function retrieveGPTRun(params: { threadId: string; runId: string }) {
  const run = await openai.beta.threads.runs.retrieve(
    params.threadId,
    params.runId
  )
  return run
}

/**
 * Lists all messages in a specified GPT thread.
 *
 * @param threadId - The ID of the thread to list messages from.
 * @returns An array of message objects.
 */
export async function listGPTMessages(threadId: string) {
  const threadMessages = await openai.beta.threads.messages.list(
    threadId
  )

  return threadMessages.data
}

/**
 * Creates a run for a thread with the specified assistant, retrieves the run status, and returns the messages in the thread.
 *
 * @param params - Parameters including thread ID, assistant ID, instructions, and response format.
 * @returns An array of messages from the thread after the run is completed.
 */
export async function createRunAndRetrieveMessages(params: {
  threadId: string
  assistantId: string
  assistantInstructions: string
  responseFormat: AssistantResponseFormatOption | null | undefined
  stream: boolean
}, processChunk?: (chunk: string) => void) {

  // Step 1: Handle streaming
  if (params.stream) {
    if (!processChunk) {
      throw new Error('processChunk callback is required when streaming is enabled.')
    }

    // Call the stream version of the function and handle the streamed data with the callback
    await createRunThreadStreamWithAssistant(
      {
        thread: {
          id: params.threadId,
          assistantId: params.assistantId,
          instructions: params.assistantInstructions
        },
        responseFormat: params.responseFormat
      },
      processChunk // Pass the callback function for processing chunks
    )
  }

  else {
  // Step 4: Create a Run
    const assistantRun = await createRunThreadWithAssistant({
      thread: {
        id: params.threadId,
        assistantId: params.assistantId,
        instructions: params.assistantInstructions
      },
      responseFormat: params.responseFormat
    })

    // Step 5: Polling Logic to Check Completion Status
    const assistantRunStatus = await retrieveGPTRun({
      threadId: assistantRun.thread_id,
      runId: assistantRun.id
    })

    // Step 6: Once completed, list messages
    const contentAnalysisMessages = await listGPTMessages(assistantRunStatus.thread_id)
    return contentAnalysisMessages
  }
}

/**
 * Sends a user message to a GPT assistant, runs the assistant, and parses the response.
 *
 * @template T - The expected type of the parsed response.
 * @param params - Parameters including the assistant ID, thread ID, user message content, response format, schema for validation, and error message.
 * @param processChunk - A callback function to handle streaming chunks, only used when `stream` is true.
 * @returns The parsed response of type T.
 * @throws An error if the assistant does not provide a response or if validation fails.
 */
export async function sendMessageAndParseResponse<T>(params: {
  stream: boolean
  assistantId: string
  threadId: string
  userMessageContent: string
  responseFormat: AssistantResponseFormatOption | null | undefined
  schema: z.ZodType<T>
  errorMessage: string
}, processChunk?: (chunk: string) => void): Promise<T | undefined> {
  const { assistantId, threadId, userMessageContent, responseFormat, schema, errorMessage } = params

  // Add user message to thread
  await addMessageToGPTThread({
    msg: {
      role: 'user',
      content: userMessageContent
    },
    thread: {
      id: threadId
    }
  })

  let messages  // Declare messages variable

  // Run assistant
  if (params.stream) {
    // Handle streaming case
    if (!processChunk) {
      throw new Error('processChunk callback is required when streaming is enabled.')
    }

    await createRunAndRetrieveMessages({
      threadId: threadId,
      assistantId: assistantId,
      assistantInstructions: '', // Instructions are already set in the assistant
      responseFormat: responseFormat,
      stream: params.stream
    }, processChunk)

    // When streaming is enabled, return nothing since processChunk will handle the stream
    return
  }
  else {
    // Handle non-streaming case
    messages = await createRunAndRetrieveMessages({
      threadId: threadId,
      assistantId: assistantId,
      assistantInstructions: '', // Instructions are already set in the assistant
      responseFormat: responseFormat,
      stream: params.stream
    })

    // If no messages are returned, exit early
    if (!messages?.length) return
  }

  // Extract the assistant's response
  const assistantMessage = messages.find((message) => message.role === 'assistant')

  if (!assistantMessage) {
    throw new Error('Assistant did not provide a response.')
  }

  let assistantResponse: string | undefined

  if (assistantMessage.content && Array.isArray(assistantMessage.content)) {
    const textContentBlock = assistantMessage.content.find(
      (contentItem): contentItem is MessageContentText => contentItem.type === 'text' && !!contentItem.text
    )
    if (textContentBlock) {
      assistantResponse = textContentBlock.text.value
    }
  }

  if (assistantResponse === undefined) {
    throw new Error('Assistant response is undefined.')
  }

  // Parse and validate the response
  let parsedResponse: T
  try {
    parsedResponse = schema.parse(JSON.parse(assistantResponse))
  }
  catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2))
      console.error('Assistant response:', assistantResponse)
      throw new Error(`${errorMessage} due to validation errors.`)
    }
    else if (error instanceof Error) {
      throw new Error(`${errorMessage}: ${error.message}`)
    }
    else {
      throw new Error('An unknown error occurred while parsing the assistant’s response.')
    }
  }

  return parsedResponse
}


/**
 * Sets up a GPT Assistant and creates a corresponding thread.
 *
 * @param params - The parameters for creating the assistant.
 * @returns An object containing the assistant's ID and the thread's ID.
 */
export async function setupAssistantAndThread(params: CreateAssistantParams): Promise<SetupResult> {
  if (params.assistantId && params.threadId) {
    return {
      assistantId: params.assistantId,
      threadId: params.threadId
    }
  }

  else {
  // Step 1: Create an Assistant
    const assistant = await createGPTAssistant({
      name: params.name,
      instructions: params.instructions,
      tools: params.tools,
      model: params.model || 'gpt-4o-mini'
    })

    // Step 2: Create a Thread
    const thread = await createGPTThread()

    return {
      assistantId: assistant.id,
      threadId: thread.id
    }
  }
}

export async function generateDalleImage(prompt: string, size: '1024x1024' | '256x256' | '512x512' | '1792x1024' | '1024x1792' = '1024x1024') {
  if (!size) {
    size = '1024x1024' // Default value in case size is undefined
  }

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size
    })

    const imageUrl = response.data[0].url

    console.log(JSON.stringify(response.data, null, 2))
    return imageUrl
  }
  catch (error) {
    console.error('Error generating image:', error)
    throw new Error('Image generation failed')
  }
}

