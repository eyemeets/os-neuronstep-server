import { z } from 'zod'
import type { CustomUserSchemaParams } from '../../types/course-validator'

export const imageThemeSchema = z.object({
  theme: z.enum(['cinematic', '3D', 'abstract', 'surreal', 'minimalistic']).describe('The overall visual style or theme of the image'),
  tone: z.enum(['realistic', 'artistic', 'minimalistic', 'futuristic', 'technical']).describe('The tone of the image that sets the mood and context'),
  style: z.enum(['photorealistic', 'illustrative', 'schematic', 'digital', 'hand-drawn']).optional().describe('Specific artistic style used in the image'),
  complexity: z.enum(['simple', 'detailed', 'elaborate', 'complex', 'minimal']).optional().describe('The level of detail in the image'),
  resolution: z.enum(['low', 'medium', 'high', 'ultra']).optional().describe('Resolution of the generated image'),
  color_scheme: z.enum(['monochromatic', 'vibrant', 'pastel', 'neutral', 'dark', 'bright']).optional().describe('The color palette or scheme to use in the image'),
  theme_description: z.string().describe('A short description that outlines the key theme and subject of the image'),
  mood: z.enum(['calm', 'energetic', 'dramatic', 'mysterious', 'inspiring', 'melancholic', 'uplifting']).describe('The overall mood conveyed by the image'),
  lighting: z.enum(['natural', 'artificial', 'soft', 'bright', 'shadowy', 'dramatic', 'low-light']).optional().describe('The lighting setup used in the image'),
  focus: z.enum(['wide', 'close-up', 'medium-shot', 'panorama']).optional().describe('The focus or framing of the image'),
  composition: z.enum(['balanced', 'asymmetrical', 'minimal', 'complex']).optional().describe('How the elements in the image are arranged'),
  background: z.enum(['simple', 'complex', 'blurred', 'sharp', 'transparent']).optional().describe('The complexity and style of the background in the image'),
  texture: z.enum(['smooth', 'rough', 'glossy', 'matte', 'gritty']).optional().describe('The texture or feel of surfaces in the image'),
  contrast: z.enum(['high', 'low', 'normal']).optional().describe('The level of contrast between colors or elements in the image'),
  depth_of_field: z.enum(['shallow', 'deep', 'normal']).optional().describe('The depth and focus used in the image'),
  framing: z.enum(['central', 'rule-of-thirds', 'symmetrical', 'dynamic']).optional().describe('How the subject is framed in the image'),
  shadows: z.enum(['strong', 'subtle', 'none']).optional().describe('The intensity and presence of shadows'),
  saturation: z.enum(['high', 'low', 'normal']).optional().describe('The intensity of the colors in the image'),
  viewpoint: z.enum(['bird’s eye', 'eye level', 'worm’s eye', 'tilted']).optional().describe('The perspective or angle from which the image is viewed'),
  environment: z.string().describe('A description of the environment where the image is set, tailored to the specific subject or context')
})

export const ZodSubmissionSchema = (params: CustomUserSchemaParams) => z.object({
  user_query: z.string().optional().describe('Leave this as an empty string'),
  valid: z.boolean().describe('Indicates if the objective is valid for curriculum creation'),
  reason: z.string().describe('Explanation of why the objective is suitable or not'),
  title: z.string().describe('The title of the course to provide context and identification.'),
  course_description: z.string().describe('A brief description of the course content and objectives for the user.'),
  curriculum: z.string()
    .describe(params.curriculum || 'The curriculum or educational framework that the user has chosen'),

  appropriate_for_curriculum: z.boolean().describe('If the objective is appropriate for the chosen curriculum'),
  rejection_reason: z.string().optional().describe('The reason the objective was rejected, if applicable'),

  friendly_feedback: z.string()
    .describe(params.friendly_feedback || 'Constructive feedback for the user, in the specified language'),

  feedback_prompts: z.array(z.string()).optional().describe('Follow-up questions to guide the user in improving the objective'),
  user_prompts: z.array(z.string()).optional().describe('Enhanced versions of the user’s original objective prompts'),
  content_description: z.string().describe('A summary of the learning objective and its content'),
  objective_match: z.boolean().describe('Whether the objective aligns with curriculum requirements'),
  relevance_score: z.number().describe('A score assessing the relevance of the objective to the curriculum'),
  complexity_score: z.number().describe('A score assessing the complexity of the objective'),

  educational_level: z.string()
    .describe(params.educational_level || 'The educational level targeted by the curriculum'),

  missing_information: z.array(z.string()).optional().describe('Any missing key information required to create the curriculum'),
  ethical_compliance: z.boolean().describe('Whether the objective adheres to ethical standards'),
  ethical_compliance_details: z.string().describe('Details about any ethical considerations'),
  learning_outcomes: z.array(z.string()).optional().describe('The skills and knowledge learners will gain'),
  learning_style: z.enum(['visual', 'auditory', 'kinesthetic', 'readingWriting']).describe('The preferred learning style for the course content'),

  tone: z.enum([
    'fun', 'serious', 'academic', 'motivational', 'satirical', 'friendly', 'reflective', 'inspirational'
  ])
    .describe(params.tone || 'The tone or voice that the curriculum will use'),

  suitability_for_adaptive_learning: z.number().describe('A score assessing how well the curriculum adapts to different learners'),
  adaptive_learning_recommendations: z.string().describe('Suggestions for improving the curriculum’s adaptability'),
  practical_application_score: z.number().describe('A score assessing the practical application of the learning objective'),
  practical_application_details: z.string().describe('Details about how the objective applies to real-world contexts'),
  SMART_goal_check: z.boolean().describe('Whether the objective meets SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)'),
  SMART_criteria: z.object({
    specific: z.boolean().describe('Is the objective specific?'),
    measurable: z.boolean().describe('Is the objective measurable?'),
    achievable: z.boolean().describe('Is the objective achievable?'),
    relevant: z.boolean().describe('Is the objective relevant?'),
    time_bound: z.boolean().describe('Is the objective time-bound?')
  }).describe('SMART criteria for assessing the learning objective'),
  bloom_taxonomy_level: z.string().describe('The cognitive level targeted according to Bloom’s Taxonomy'),
  bloom_taxonomy_reasoning: z.string().describe('Reasoning for the Bloom’s Taxonomy level selection'),
  cognitive_load_assessment: z.string().describe('Assessment of the cognitive load the curriculum will place on learners'),
  mastery_learning_applicability: z.boolean().describe('Whether the curriculum can support mastery learning principles'),
  UDL_compliance: z.boolean().describe('Whether the curriculum complies with Universal Design for Learning principles'),
  skills_21st_century: z.array(z.string()).optional().describe('Which 21st-century skills the curriculum promotes'),
  standard_classification: z.object({
    code: z.string().describe('ISCED-F 2013 classification code for the curriculum content'),
    description: z.string().describe('Description of the curriculum content according to the ISCED-F 2013 classification')
  }).optional().describe('The classification of the curriculum content'),
  recommended_learning_frameworks: z.array(z.string()).optional().describe('Recommended educational frameworks for structuring the curriculum'),

  learning_style_alignment: z.union([
    z.literal('visual'),
    z.literal('auditory'),
    z.literal('kinesthetic'),
    z.literal('readingWriting')
  ]).describe(params.learning_style_alignment || 'Which learning styles the user aligns with'),

  sub_learning_objectives: z.array(z.string()).optional().describe('The sub-objectives that break down the main learning objective'),
  prerequisites: z.array(z.string()).optional().describe('The knowledge or skills required before taking the course'),
  estimated_time_to_complete: z.string().optional().describe('The estimated time to complete the curriculum'),
  recommended_content_types: z.array(z.string()).optional().describe('Types of content recommended for the curriculum (e.g., videos, simulations)'),
  potential_challenges: z.string().optional().describe('Challenges learners might face and how to overcome them'),
  assessment_methods: z.array(z.string()).optional().describe('The methods for assessing learner progress'),
  expected_competencies: z.array(z.string()).optional().describe('The competencies learners will gain upon completing the curriculum'),
  personalization_options: z.string().optional().describe('Ways to personalize the learning experience'),
  engagement_strategies: z.array(z.string()).optional().describe('Methods to maintain learner engagement'),
  estimated_timeframe: z.number().describe('The total estimated time to complete the course'),
  timeframe_adjustment_reasoning: z.string().optional().describe('Reasoning behind any changes to the estimated time'),
  mitigation_strategies: z.string().describe('Strategies to handle any challenges or difficulties that arise during the course'),
  lang: z.string().optional().describe('The language code for the curriculum (ISO 639-1)'),
  language_name: z.string().optional().describe('The name of the language used for the curriculum'),
  country_code: z.string().optional().describe('ISO 3166-1 alpha-2 country code'),
  country_name: z.string().optional().describe('The name of the country associated with the curriculum'),
  image_theme: imageThemeSchema.describe('Schema defining the image generation parameters for curriculum visuals')
  //visual_elements: z.array(z.string()).describe('An array of visual elements to be included in the image prompt.')
})

