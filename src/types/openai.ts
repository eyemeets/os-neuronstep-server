import type { AssistantTool } from 'openai/resources/beta/assistants'

export interface Message {
  id: string
  role: 'assistant' | 'user'
  content: MessageContent[]
  // Other properties...
}

export interface MessageContentText {
  type: 'text'
  text: {
    value: string
    annotations: any[]
  }
}

export interface MessageContentOther {
  type: string
  [key: string]: any
}

type MessageContent = MessageContentText | MessageContentOther

// Define the shape of the parameters for creating an assistant
export interface CreateAssistantParams {
  name: string
  instructions: string
  tools?: AssistantTool[] | undefined
  model?: string
  assistantId?: string
  threadId?: string
}

// Define the shape of the returned IDs
export interface SetupResult {
  assistantId: string
  threadId: string
}