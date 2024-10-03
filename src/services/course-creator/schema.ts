// content-generator/schemas.ts
import { z } from 'zod'
import { JSDOM } from 'jsdom'  // Importing jsdom

/**
 * Schema for validating the model's response to the initial instruction prompt.
 */
export const ZodInitialInstructionResponseSchema = z.object({
  confirmation: z.string() // Simply checks for a string without the min length restriction
})

// Type inferred from the schema
export type InitialInstructionResponse = z.infer<typeof ZodInitialInstructionResponseSchema>

/**
 * Schema for validating the model's response when generating content for a block.
 * Ensures that the response is a non-empty string containing valid HTML.
 */
export const ZodBlockContentResponseSchema = z.object({
  content: z.string().refine((val) => isValidHTML(val), {
    message: 'Content must be valid HTML.'
  })
})

// Type inferred from the schema
export type BlockContentResponse = z.infer<typeof ZodBlockContentResponseSchema>

/**
 * Utility function to validate if a string is valid HTML using jsdom.
 * @param html - The HTML string to validate.
 * @returns True if valid, else false.
 */
function isValidHTML(html: string): boolean {
  const dom = new JSDOM(html)  // Parsing HTML with jsdom
  const parserErrors = dom.window.document.querySelectorAll('parsererror')
  return parserErrors.length === 0
}
