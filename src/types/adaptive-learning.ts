// Define the TypeScript interface for adaptive learning themes
export interface AdaptiveLearningTheme {
  pacedLearning: {
    selfPaced: boolean
    instructorLed: boolean
  }
  skillBasedLearning: {
    competencyBased: boolean
    masteryBased: boolean
  }
  personalizedPathways: {
    interestBased: boolean
    goalOriented: boolean
  }
  realTimeFeedback: {
    immediateFeedback: boolean
    dynamicContentAdjustments: boolean
  }
  adaptiveAssessment: {
    adaptiveTesting: boolean
    formativeAssessments: boolean
  }
  learningStyleBasedAdaptation: {
    visual: boolean
    auditory: boolean
    kinesthetic: boolean
    readingWriting: boolean
  }
  socialCollaborativeLearning: {
    collaborativeLearning: boolean
    peerBasedLearning: boolean
  }
  remedialAdvancedLearning: {
    remediation: boolean
    advancedContent: boolean
  }
  gamificationEngagement: {
    pointsBadges: boolean
    challengesCompetitions: boolean
  }
  contextualLearning: {
    realWorldApplications: boolean
    projectBasedLearning: boolean
  }
  languageCulturalAdaptation: {
    languagePreference: boolean
    culturalRelevance: boolean
  }
  behaviorBasedAdaptation: {
    motivationDrivenAdaptation: boolean
    cognitiveLoadManagement: boolean
  }
}