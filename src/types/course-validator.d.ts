import type { UserTonePreferences, UserLearningPreferences } from './curricula'

export interface CustomUserSchemaParams {
  curriculum: string
  friendly_feedback: string
  educational_level: string
  tone: string
  learning_style_alignment: string
}