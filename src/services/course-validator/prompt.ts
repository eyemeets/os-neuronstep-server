import type { ValidateObjectiveUserData } from '../../types/curricula'
import { courseDurationRange, generateLearningStyleDescription, generateToneDescription } from '../../utils/curricula'

export function createUserPrompt(params: ValidateObjectiveUserData) {
  const courseDetails = courseDurationRange(params.educationLevel)
  const learningStyle = generateLearningStyleDescription(params.learningStyle)
  const tone = generateToneDescription(params.tone)
  return `
  A user has submitted a request. Analyze the following objective: "${params.objective}". 

  The user’s learning goal is "${params.objective}". 
  The user's Language is "${params.lang || 'en-US'}",
  Expected outcome is "${params.outcome || 'N/A'}",
  Age: "${params.age || 'N/A'}",
  Timeframe in hours: "${params.timeframe || 'N/A'}",  
  The user prefers to follow the curriculum of school / university / educational institution "${params.curriculum}"

  The user prefers the course to be at the ${params.educationLevel} level, which means the course will cover:

  - **Total hours**: Between ${courseDetails.totalHours.min} and ${courseDetails.totalHours.max} hours.
  - **Topics**: Between ${courseDetails.topics.min} and ${courseDetails.topics.max} main topics.
  - **Subtopics per topic**: Between ${courseDetails.subtopics.min} and ${courseDetails.subtopics.max} subtopics per topic.
  - **Content pages per subtopic**: Between ${courseDetails.pagesPerSubtopic.min} and ${courseDetails.pagesPerSubtopic.max} content pages for each subtopic.
  
  The user has selected the **"${params.learningStyle}"** learning style, so content should be adapted to: "${learningStyle}".
  The user prefers the tone to be **"${params.tone}"**, so content should be generated in a **"${tone}"** tone.

  Please write in the user's language (${params.lang}) when filling out the JSON schema.
 
  Please respect the users preferences.

  Perform a comprehensive analysis based on the following criteria:
  0. **Appropriateness and Relevance Check:**
   - Determine if the learning objective is appropriate for curriculum creation on this educational platform.
   - Check for objectives that are:
     - Urgent actions or emergency instructions (e.g., "Call the police immediately")
     - Not educational or lack scope for a learning curriculum
     - Violating any platform policies or ethical guidelines
   - If the objective is inappropriate, set "valid": false and "appropriate_for_curriculum": false.
   - Provide a "rejection_reason" explaining why the objective is not suitable.
   - Do not proceed with further analysis if the objective is inappropriate.

  1. **SMART Goals Assessment:**
   - **Specific:** Is the goal clear and specific?
   - **Measurable:** Can progress be quantified or measured?
   - **Achievable:** Is the goal realistic and attainable?
   - **Relevant:** Does it align with broader learning objectives?
   - **Time-bound:** Is there a defined timeframe?

  2. **Bloom's Taxonomy Alignment:**
   - Identify the primary cognitive level targeted (Remembering, Understanding, Applying, Analyzing, Evaluating, Creating).
   - Provide reasoning based on action verbs and expected outcomes associated with that level.

  3. **Practical Application:**
   - Identify real-life scenarios or industries where this learning objective is applicable.
   - Discuss how achieving this objective can impact the learner's professional or personal life.
   - Provide a practical_application_score (0-100) and practical_application_details.

  4. **Ethical Compliance:**
   - Check for adherence to ethical standards in education.
   - Ensure the objective promotes inclusivity and cultural sensitivity.
   - Provide ethical_compliance_details.

  5. **Suitability for Adaptive Learning:**
   - Determine if the content can be broken down into modular units.
   - Assess if the learning path can be personalized based on learner performance.
   - Provide suitability_for_adaptive_learning score (0-100) and adaptive_learning_recommendations.

  6. **Cognitive Load Assessment:**
   - Assess whether the content is appropriately challenging without causing overload.
   - Provide cognitive_load_assessment details.

  7. **Mastery Learning Applicability:**
   - Can the learning objective be structured to allow for mastery at each stage?
   - Provide mastery_learning_applicability as true or false.

  8. **Universal Design for Learning (UDL) Compliance:**
   - Does the objective accommodate different learning styles and needs?
   - Provide UDL_compliance as true or false.

  9. **21st-Century Skills Integration:**
   - Identify which of these skills the objective promotes: critical thinking, creativity, collaboration, communication.
   - List skills_21st_century.

  10. **Educational Level and Complexity:**
    - Determine the appropriate educational level (e.g., K-12, Undergraduate, Vocational Training).
    - Provide complexity_score (0-100).

  11. **Feedback to User:**
    - Begin by acknowledging the strengths of the objective.
    - Suggest specific improvements using educational terminology explained in layman's terms.
    - Offer examples or alternatives to illustrate suggestions.
    - Maintain an encouraging and supportive tone throughout.

  12. **Standard Classification Mapping:**
    - Classify the learning objective according to the ISCED-F 2013 classification system.
    - Provide the most relevant code and description.

  13. **Recommended Learning Frameworks:**
    - Based on the learning objective and content analysis, suggest which learning frameworks or instructional strategies would be most effective (e.g., Mastery Learning, Spaced Repetition, Project-Based Learning, Gamification).

  14. **Feedback to User:**
    - Begin by acknowledging the strengths of the objective.
    - Suggest specific improvements using educational terminology explained in layman's terms.
    - Offer examples or alternatives to illustrate suggestions.
    - Maintain an encouraging and supportive tone throughout.

  15. **Breakdown of Learning Objectives:**
    - Decompose the main objective into as many specific sub-objectives or modules as necessary to cover the subject comprehensively.
    - Ensure that the sub-objectives reflect all critical areas of the subject.

  16. **Prerequisite Knowledge and Skills:**
    - Identify any prior knowledge or skills required to effectively engage with the content.

  17. **Estimated Time Commitment:**
    - Based on the complexity, educational level, depth of content, and learning objectives, provide an estimate of the **total number of hours** required to complete the learning path.
    - Explain your reasoning, considering factors such as the typical time needed to master the subject matter at the specified educational level.

  18. **Recommended Content Types and Modalities:**
    - Suggest the types of content that will be included (e.g., videos, readings, interactive simulations).

  19. **Learning Style Alignment:**
    - Indicate which learning styles the curriculum aligns with (visual, auditory, kinesthetic).

  20. **Potential Challenges and Mitigation Strategies:**
    - Highlight possible difficulties and suggest ways to overcome them.

  21. **Assessment Methods:**
    - Describe how the learner's progress will be measured.

  22. **Expected Competencies and Outcomes:**
    - Outline the skills and knowledge the learner will acquire upon completion.

  23. **Personalization Options:**
    - Offer ways the learner can customize their learning experience.

  24. **Engagement Strategies:**
    - Suggest techniques that will be used to maintain learner engagement.

  25. **Prerequisite Knowledge and Skills:**
    - Identify any prior knowledge or skills required to effectively engage with the content.

  26. **Estimated Timeframe:**
    - Provide a realistic estimate of the **total number of hours** required to complete the learning path.
    - If the user's desired timeframe is specified (e.g., 'Approximately hours'), consider whether this timeframe is sufficient given the content and complexity.
    - If there is a discrepancy between the user's desired timeframe and the realistic estimate, explain the reasoning behind any adjustments.
    - Emphasize that this is informative and that AI agents will tailor content to meet the user's demand as closely as possible.

  27. **Potential Challenges and Mitigation Strategies:**
   - Identify possible difficulties learners might encounter.
   - Suggest strategies to overcome these challenges.

  28. **Comprehensive Topic Identification:**
    - Provide a detailed list of all major topics and subtopics relevant to the learning objective.
    - Consider the curriculum structures of established educational programs in this subject.

  Provide your response in the following JSON format:

    {
    "valid": true/false,
    "reason": "why the objective is suitable or not for curriculum creation",
    "appropriate_for_curriculum": true/false,
    "rejection_reason": "Explanation if the objective is not appropriate",
    "friendly_feedback": "Constructive feedback in language code \"${params.lang}\" to the user",
    "feedback_prompts": ["question 1", "question 2", ...]
    "user_prompts": ["Enhanced prompt version of the users objective", "another one", ...]
    "content_description": "Summary of what the objective is about",
    "objective_match": true/false,
    "relevance_score": number,
    "complexity_score": number,
    "educational_level": ${params.educationLevel},
    "tone": "${params.tone}"
    "missing_information": ["missing key elements"],
    "ethical_compliance": true/false,
    "ethical_compliance_details": "Details on ethical considerations",
    "learning_outcomes": ["Cognitive Skills", "Technical Skills", ...],
    "suitability_for_adaptive_learning": number,
    "adaptive_learning_recommendations": "Recommendations for adaptive learning",
    "practical_application_score": number,
    "practical_application_details": "Details on practical application",
    "SMART_goal_check": true/false,
    "SMART_criteria": {
      "specific": true/false,
      "measurable": true/false,
      "achievable": true/false,
      "relevant": true/false,
      "time_bound": true/false
    },
    "bloom_taxonomy_level": "Remembering, Understanding, Applying, Analyzing, Evaluating, Creating",
    "bloom_taxonomy_reasoning": "Reasoning for the level",
    "cognitive_load_assessment": "Assessment of cognitive load",
    "mastery_learning_applicability": true/false,
    "UDL_compliance": true/false,
    "skills_21st_century": ["Critical Thinking", "Creativity", "Collaboration", "Communication"],
    "standard_classification": {
      "code": "ISCED-F 2013 code",
      "description": "Description of the classification"
    },
    "recommended_learning_frameworks": ["Mastery Learning", "Spaced Repetition", ...],
    "learning_style_alignment": ["Visual", "Auditory", "Kinesthetic"],
    "learning_style": ${params.learningStyle}",
    "sub_learning_objectives": ["Sub-objective 1", "Sub-objective 2", ...],
    "prerequisites": ["Prerequisite knowledge or skills"],
    "estimated_time_to_complete": "Estimated time in hours,
    "recommended_content_types": ["Videos", "Interactive Simulations", ...],
    "potential_challenges": "Possible difficulties and mitigation strategies",
    "assessment_methods": ["Quizzes", "Projects", ...],
    "expected_competencies": ["Competency 1", "Competency 2", ...],
    "personalization_options": "Ways to customize the learning experience",
    "engagement_strategies": ["Gamification", "Social Learning", ...],
    "estimated_timeframe": number, // Total hours estimated by AI
    "timeframe_adjustment_reasoning": "Reasoning behind any adjustments compared to the user's desired timeframe",
    "mitigation_strategies": "Description of strategies",
    "lang": "ISO 639-1 language code (e.g., 'en' for English)",
    "languageName": "Human-readable language name (e.g., 'English')",
    "countryCode": "ISO 3166-1 alpha-2 country code (e.g., 'US' for United States)",
    "countryName": "Human-readable country name (e.g., 'United States')"
    "curriculum": "The curriculum or educational framework that the user has chosen (${params.curriculum})"
  }

  Please ensure that your response is in valid JSON format.`

}