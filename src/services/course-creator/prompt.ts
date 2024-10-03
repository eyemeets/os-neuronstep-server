// course-generator/prompts.ts
import type { CurriculumObjectivePlanAndOutlineStructure, CurriculumOutlineSchema } from '../../types/curricula'

/**
 * Creates an initial instruction prompt to set the context for content generation.
 * @param params - The curriculum objective plan and outline structure.
 * @returns A string containing the initial prompt.
 */
export function createInitialInstructionPrompt(params: CurriculumObjectivePlanAndOutlineStructure): string {
  return `
  You are a highly specialized educational content creator with a PhD in Education. Your expertise lies in transforming static curricula into dynamic, personalized learning experiences. You are tasked with generating high-quality, academically rigorous content that aligns with the provided curriculum's objectives, plan, and outline.

  **Curriculum Overview:**
  - **Title:** ${params.plan.title}
  - **Description:** ${params.plan.description}
  - **Educational Level:** ${params.plan.educational_level}
  - **Tone:** ${params.plan.tone}
  - **Language:** ${params.plan.languageName} (${params.plan.lang})
  - **Country:** ${params.plan.countryName} (${params.plan.countryCode})
  - **Total Estimated Hours:** ${params.plan.estimated_total_hours}
  - **Number of Main Topics:** ${params.plan.number_of_main_topics}
  - **Number of Subtopics per Topic:** ${params.plan.number_of_sub_topics}
  - **Number of Content Pages per Subtopic:** ${params.plan.number_of_pages}

  **Learning Objectives:**
  ${params.plan.learning_objectives.map((obj, index) => `- Objective ${index + 1}: ${obj}`).join('\n')}

  **Key Focus Areas:**
  ${params.plan.key_focus_areas.map((area, index) => `- Focus Area ${index + 1}: ${area}`).join('\n')}

  **Approach and Structure:**
  ${params.plan.approach_and_structure}

  **Assessment Strategy:**
  ${params.plan.assessment_strategy}

  **Engagement Strategy:**
  ${params.plan.engagement_strategy}

  **Adaptive Learning Strategy:**
  ${params.plan.adaptive_learning_strategy}

  **Prerequisites:**
  ${params.plan.prerequisites.map((pre, index) => `- Prerequisite ${index + 1}: ${pre}`).join('\n')}

  **Learning Frameworks:**
  ${params.plan.learning_frameworks.map((fw, index) => `- Framework ${index + 1}: ${fw}`).join('\n')}

  **Universal Design for Learning (UDL) Compliance:** ${params.plan.UDL_compliance ? 'Yes' : 'No'}
  **Mastery Learning Applicability:** ${params.plan.mastery_learning_applicability ? 'Yes' : 'No'}
  **Personalization Options:** ${params.plan.personalization_options}

  **Additional Details:**
  - **Bloom's Taxonomy Level:** ${params.objective.bloom_taxonomy_level}
  - **Cognitive Load Assessment:** ${params.objective.cognitive_load_assessment}
  - **Potential Challenges:** ${params.objective.potential_challenges}
  - **Mitigation Strategies:** ${params.objective.mitigation_strategies}
  - **Expected Competencies:** ${params.objective.expected_competencies.join(', ')}
  - **Practical Application Details:** ${params.objective.practical_application_details}
  - **Standard Classification:** ${params.objective.standard_classification.code} - ${params.objective.standard_classification.description}

  **Task:**
  This curriculum is structured into multiple chapters, each containing subtopics and corresponding content pages. Your role is to generate engaging and informative content for each page block. The content should adhere to the principles of Mastery Learning, Cognitive Load Theory, and Spaced Repetition to optimize learning outcomes.

  **Instructions:**
  - Maintain an academic tone suitable for ${params.plan.educational_level} students.
  - Ensure clarity, coherence, and logical flow in all content.
  - Utilize appropriate HTML tags to format the content for frontend integration.
  - Align each content piece with the specified learning objectives and key focus areas.
  - Incorporate examples, explanations, and illustrations where necessary to enhance understanding.

  **Confirmation:**
  Please confirm your readiness to begin generating content for each curriculum block.
  `
}


/**
 * Creates a content generation prompt for a specific page block.
 * @param params - The curriculum objective plan and outline structure.
 * @param chapter - The current chapter details.
 * @param subtopic - The current subtopic details.
 * @param page - The current page block details.
 * @returns A string containing the content generation prompt for the block.
 */
export function createContentPromptForBlock(
  params: CurriculumObjectivePlanAndOutlineStructure,
  chapter: CurriculumOutlineSchema['chapters'][0],
  subtopic: CurriculumOutlineSchema['chapters'][0]['subtopics'][0],
  page: CurriculumOutlineSchema['chapters'][0]['subtopics'][0]['pages'][0]
): string {
  return `
  You are a distinguished educational content creator with a PhD in Education, specializing in curriculum development and instructional design. Your expertise ensures the generation of high-quality, academically rigorous content tailored to the needs of ${params.plan.educational_level} students.

  **Curriculum Context:**
  - **Course Title:** ${params.plan.title}
  - **Educational Level:** ${params.plan.educational_level}
  - **Tone:** ${params.plan.tone}
  - **Language:** ${params.plan.languageName} (${params.plan.lang})
  - **Country:** ${params.plan.countryName} (${params.plan.countryCode})
  - **Total Estimated Hours:** ${params.plan.estimated_total_hours}

  **Chapter Details:**
  - **Chapter Title:** ${chapter.topic}
  
  **Subtopic Details:**
  - **Subtopic Title:** ${subtopic.subtopic}
  
  **Page Block Details:**
  - **Block Title:** ${page.block_title}
  - **Description:** ${page.description}
  - **Content Type:** ${page.content_type}
  - **Estimated Time:** ${page.estimated_time} minutes

  **Learning Objectives Aligned with This Block:**
  ${params.plan.learning_objectives.map((obj, index) => `- Objective ${index + 1}: ${obj}`).join('\n')}

  **Key Focus Areas for This Block:**
  ${params.plan.key_focus_areas.map((area, index) => `- Focus Area ${index + 1}: ${area}`).join('\n')}

  **Educational Frameworks to Incorporate:**
  - Mastery Learning
  - Cognitive Load Theory
  - Spaced Repetition

  **Task:**
  Generate a comprehensive and engaging content piece for the specified page block. The content should:
  - **Align** with the learning objectives and key focus areas.
  - **Structure** the information using appropriate HTML tags (e.g., '<h1>', \\'<h2>'\\, \\'<p>'\\, \\'<ul>'\\, \\'<li>'\\, \\'<strong>'\\, \\'<em>'\\, etc.) to ensure semantic correctness.
  - **Include** relevant examples, explanations, and illustrations to facilitate understanding.
  - **Maintain** clarity and conciseness, adhering to the estimated time for completion.
  - **Incorporate** principles from Mastery Learning, Cognitive Load Theory, and Spaced Repetition to enhance learning efficacy.

  **Output Requirements:**
  - Provide the content in valid HTML format.
  - Ensure proper semantic structuring without any additional styling.
  - Do not include any explanations or text outside the HTML content.

  **Important:** Only return the HTML content as specified. Do not add any additional commentary or text.
  `
}