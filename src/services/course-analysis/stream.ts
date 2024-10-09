import { emptyCurriculumOutlineSchema } from './schema'

// Store the global state for the schema and control whether we send the entire schema or just chapters
const curriculumSchema = { ...emptyCurriculumOutlineSchema }
let isFirstChapterSent = false
let currentChapter: any = null // Track the current chapter being built
let currentSubtopic: any = null // Track the current subtopic being built
let accumulatedChunks = '' // Accumulate chunk data

const stack = [] as string[]

/**
 * Handles streaming content, processes chunks, and builds the schema once a full object is received.
 * @param chunk - The streamed data chunk (JSON or text).
 * @param callback - Function to process and send the completed data.
 */
export function onHandleContentOutlineStream(chunk: any, callback: (updatedSchema: any) => void) {
  try {
    // Accumulate chunks
    const deltaContent = extractDeltaContent(chunk)
    if (deltaContent) {
      accumulatedChunks += deltaContent

      // Try parsing the accumulated buffer
      try {
        const parsedData = JSON.parse(accumulatedChunks)

        // Reset buffer after successful parse
        accumulatedChunks = ''

        // Update the schema with parsed data
        updateSchemaWithDelta(parsedData)

        // Send schema or chapter when complete
        if (!isFirstChapterSent && chapterIsComplete(currentChapter)) {
          callback(curriculumSchema)
          isFirstChapterSent = true
        }
        else if (currentChapter && chapterIsComplete(currentChapter)) {
          callback({ chapters: [currentChapter] })
          currentChapter = null
        }

      }
      catch (e) {
        // Parsing failed, likely because the JSON is incomplete; wait for more chunks
        console.log('Waiting for more chunks...')
      }
    }
  }
  catch (error) {
    console.error('Error processing streamed chunk:', error)
  }
}


/**
 * Helper function to check if the accumulated data is a complete JSON object.
 * @param accumulatedData - The accumulated chunk data.
 * @returns Boolean indicating whether the accumulated data is a complete JSON.
 */
function isCompleteJSON(accumulatedData: string): boolean {
  try {
    JSON.parse(accumulatedData) // Attempt to parse the data
    return true // If parsing succeeds, it's complete
  }
  catch (e) {
    return false // If parsing fails, it's still incomplete
  }
}


/**
 * Helper function to check if the chapter and its children (subtopics, pages) are fully parsed.
 * @param chapter - The chapter object to check.
 * @returns Boolean indicating whether the chapter is complete.
 */
function chapterIsComplete(chapter: any): boolean {
  return chapter?.topic && Array.isArray(chapter?.subtopics) && chapter.subtopics.every((subtopic: any) =>
    subtopic?.subtopic && Array.isArray(subtopic?.pages) && subtopic.pages.length > 0)
}

/**
 * Parses incoming chunk data, handling objects and strings.
 * @param chunk - The incoming data chunk.
 * @returns Parsed object or null if parsing fails.
 */
function parseChunk(chunk: any): any | null {
  if (typeof chunk === 'object') {
    return chunk // Already an object
  }
  else if (typeof chunk === 'string') {
    const cleanedChunk = chunk.trim().replace(/^data:\s*/, '')
    if (cleanedChunk === '[DONE]') {
      console.log('Stream finished')
      return null
    }
    try {
      return JSON.parse(cleanedChunk)
    }
    catch (error) {
      return null
    }
  }
  else {
    console.log('Unknown chunk type:', typeof chunk)
    return null
  }
}

/**
 * Extracts the delta content from a `thread.message.delta` event.
 * @param parsedChunk - The parsed chunk containing the delta.
 * @returns The delta content as a string or null if not found.
 */
function extractDeltaContent(parsedChunk: any): string | null {
  const deltaArray = parsedChunk?.data?.delta?.content
  if (deltaArray && Array.isArray(deltaArray)) {
    return deltaArray.map((delta: any) => delta?.text?.value || '').join('')
  }
  return null
}

/**
 * Updates the curriculum schema with the parsed delta content.
 * @param deltaContent - The parsed delta content string.
 */
function updateSchemaWithDelta(deltaContent: string): void {
  if (deltaContent.includes('title')) {
    curriculumSchema.title = extractFieldValue(deltaContent, 'title')
  }
  if (deltaContent.includes('description')) {
    curriculumSchema.description = extractFieldValue(deltaContent, 'description')
  }
  if (deltaContent.includes('chapters')) {
    extractChapters(deltaContent)
  }
}

/**
 * Extracts chapter-related information from the delta content and updates the current chapter.
 * @param content - The entire delta content as string.
 */
function extractChapters(content: string): void {
  const chapterRegex = /"chapters":\s*\[([^\]]+)\]/i
  const match = content.match(chapterRegex)
  if (match) {
    const chaptersData = match[1]

    try {
      const chaptersArray = JSON.parse(`[${chaptersData}]`)

      chaptersArray.forEach((chapter: any) => {
        if (!currentChapter) {
          currentChapter = {
            topic: chapter.topic || 'Untitled Topic',
            subtopics: []
          }
        }
        if (chapter.subtopics) {
          chapter.subtopics.forEach((subtopic: any) => {
            if (!currentSubtopic) {
              currentSubtopic = {
                subtopic: subtopic.subtopic || 'Untitled Subtopic',
                pages: []
              }
            }
            if (subtopic.pages) {
              currentSubtopic.pages = subtopic.pages.map((page: any) => ({
                block_title: page.block_title || '',
                content_type: page.content_type || '',
                description: page.description || '',
                estimated_time: page.estimated_time || '',
                content: page.content || '',
                image_prompt: page.image_prompt || ''
              }))
            }
            currentChapter.subtopics.push(currentSubtopic)
            currentSubtopic = null
          })
        }
        curriculumSchema.chapters.push(currentChapter)
      })
    }
    catch (error) {
      console.error('Failed to parse chapters data:', error)
    }
  }
}

/**
 * Helper function to extract field value based on the field name.
 * @param content - The entire delta content as string.
 * @param fieldName - The name of the field to extract.
 * @returns Extracted field value or empty string if not found.
 */
function extractFieldValue(content: string, fieldName: string): string {
  const regex = new RegExp(`${fieldName}"\\s*:\\s*"([^"]+)"`, 'i')
  const match = content.match(regex)
  return match ? match[1] : ''
}
