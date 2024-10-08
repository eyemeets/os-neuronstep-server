// content-analysis/schema.ts
import { z } from 'zod'
import { ContentTypeEnum } from '../../types/curricula'

export type CurriculumPlanZod = z.infer<typeof ZodCurriculumPlanSchema>

export const ZodCurriculumPlanSchema = z.object({
  title: z.string(), // Title of the curriculum
  description: z.string(), // 50-100 words description of the curriculum
  //image_prompt: z.string(),
  estimated_total_minutes: z.number(), // Total estimated hours
  number_of_main_topics: z.number(), // Number of main topics (e.g., based on courseDetails.topics)
  number_of_sub_topics: z.number(), // Number of subtopics per topic (e.g., courseDetails.subtopics)
  number_of_pages: z.number(), // Number of content pages per subtopic (e.g., courseDetails.pagesPerSubtopic)
  learning_objectives: z.array(z.string()), // Learning objectives for the course
  key_focus_areas: z.array(z.string()), // Key focus areas for the course
  approach_and_structure: z.string(), // Overall approach and structure description
  assessment_strategy: z.string(), // Description of how assessments will be integrated
  engagement_strategy: z.string(), // Description of how engagement strategies will be implemented
  adaptive_learning_strategy: z.string(), // Description of how adaptive learning will be incorporated
  prerequisites: z.array(z.string()), // List of prerequisites
  learning_frameworks: z.array(z.string()), // List of recommended learning frameworks
  UDL_compliance: z.boolean(), // Whether the course is UDL compliant
  mastery_learning_applicability: z.boolean(), // Whether mastery learning applies
  personalization_options: z.string(), // Description of how personalization is offered
  lang: z.string().describe('ISO 639-1 language code (e.g., en for English)'), // Language code
  languageName: z.string().describe('Human-readable language name (e.g., English)'), // Human-readable language name
  countryCode: z.string().describe('ISO 3166-1 alpha-2 country code (e.g., US for United States)'), // Country code
  countryName: z.string().describe('Human-readable country name (e.g., United States)'), // Country name
  educational_level: z.string().describe('Educational level (e.g., undergraduate, graduate, etc.)'), // Educational level
  tone: z.string().describe('Tone for the curriculum (e.g., academic, fun, etc.)') // Preferred tone
})

export const ZodCurriculumOutlineSchema = z.object({
  title: z.string(),
  description: z.string(),
  image_prompt: z.string(),
  chapters: z.array(
    z.object({
      topic: z.string(),
      image_prompt: z.string(),
      subtopics: z.array(
        z.object({
          subtopic: z.string(),
          image_prompt: z.string(),
          pages: z.array(
            z.object({
              block_title: z.string(),
              content_type: z.nativeEnum(ContentTypeEnum),  // Using the defined enum for content type
              description: z.string(),
              estimated_time: z.string(),
              content: z.string().optional(),
              image_prompt: z.string()
            })
          )
        })
      )
    })
  ),
  assistantId: z.string().optional(), // Add this field
  threadId: z.string().optional()    // Add this field
})