const useStableDiffusion = process.env.STABLE_DIFFUSION === 'true'

export function generateCourseImagePrompt(params: any, courseTitle: string, courseDescription: string, userQuery: string) {
  if (useStableDiffusion) {
    return `
    Generate a ${params.theme} image in a ${params.tone} tone that uses a ${params.style || 'style'} style to depict a ${params.complexity} representation of the course "${courseTitle}". 
    The image should be in ${params.resolution} resolution with a ${params.color_scheme} color scheme. 
    It should visually represent the overall themes of "${courseTitle}" and provide an engaging and inspiring introduction to the course. 
    Include visual elements that hint at the key concepts of the course, such as "${courseDescription}", in a ${params.environment}. 
    The overall mood should be ${params.mood}, with ${params.lighting} lighting to suggest curiosity, exploration, and knowledge. 
    Use a ${params.focus} focus to balance between high-level overview and detailed concepts. 
    The composition should be ${params.composition}, with a ${params.background} background to keep the focus on the key elements of the image. 
    The textures should be ${params.texture}, and the contrast should be ${params.contrast} to ensure the elements stand out clearly. 
    The depth of field should be ${params.depth_of_field}, keeping the primary concepts in focus while softening any peripheral elements. 
    Frame the image according to the ${params.framing}, with ${params.shadows} shadows for depth. 
    The colors should have ${params.saturation} saturation, and the viewpoint should be at ${params.viewpoint} to make the viewer feel directly connected to the course theme "${courseTitle}".
    `
  }
  else {
    return createDalePrompt(userQuery)
  }
}

export function generateTopicImagePrompt(params: any, topic: string) {
  if (useStableDiffusion) {
    return `
    Generate a ${params.theme} image in a ${params.tone} tone that uses a ${params.style || 'style'} style to depict a ${params.complexity} representation of the topic "${topic}". 
    The image should be in ${params.resolution} resolution with a ${params.color_scheme} color scheme. 
    It should showcase key elements related to "${topic}" in a clean, high-tech environment. 
    The overall mood should be ${params.mood}, with ${params.lighting} lighting to suggest clarity and knowledge. 
    Use a ${params.focus} focus that captures both details and the overall structure of "${topic}". 
    The composition should be ${params.composition}, with a ${params.background} background to keep the focus on the key elements. 
    The textures should be ${params.texture}, and the contrast should be ${params.contrast} to ensure the elements stand out clearly. 
    The depth of field should be ${params.depth_of_field}, keeping the main objects in focus while softening the background. 
    Frame the image according to the ${params.framing}, with ${params.shadows} shadows for depth. 
    The colors should have ${params.saturation} saturation, and the viewpoint should be at ${params.viewpoint} to make the viewer feel directly connected to the theme "${topic}".
    `
  }
  else {
    return createDalePrompt(topic)
  }
}

export function generateSubtopicImagePrompt(params: any, subtopic: string) {
  if (useStableDiffusion) {
    return `
    Generate a ${params.theme} image in a ${params.tone} tone that uses a ${params.style || 'style'} style to depict a ${params.complexity} representation of the subtopic "${subtopic}". 
    The image should be in ${params.resolution} resolution with a ${params.color_scheme} color scheme. 
    It should showcase key elements related to "${subtopic}" in a clean, high-tech environment. 
    The overall mood should be ${params.mood}, with ${params.lighting} lighting to suggest clarity and knowledge. 
    Use a ${params.focus} focus that captures both details and the overall structure of "${subtopic}". 
    The composition should be ${params.composition}, with a ${params.background} background to keep the focus on the key elements. 
    The textures should be ${params.texture}, and the contrast should be ${params.contrast} to ensure the elements stand out clearly. 
    The depth of field should be ${params.depth_of_field}, keeping the main objects in focus while softening the background. 
    Frame the image according to the ${params.framing}, with ${params.shadows} shadows for depth. 
    The colors should have ${params.saturation} saturation, and the viewpoint should be at ${params.viewpoint} to make the viewer feel directly connected to the theme "${subtopic}".
    `
  }
  else {
    return createDalePrompt(subtopic)
  }
}

export function generatePageImagePrompt(params: any, pageTitle: string) {
  if (useStableDiffusion) {
    return `
    Generate a ${params.theme} image in a ${params.tone} tone that uses a ${params.style || 'style'} style to depict a ${params.complexity} representation of the page "${pageTitle}". 
    The image should be in ${params.resolution} resolution with a ${params.color_scheme} color scheme. 
    It should showcase the content of "${pageTitle}" in a clean, high-tech environment. 
    The overall mood should be ${params.mood}, with ${params.lighting} lighting to suggest clarity and knowledge. 
    Use a ${params.focus} focus that captures both details and the overall structure of "${pageTitle}". 
    The composition should be ${params.composition}, with a ${params.background} background to keep the focus on the key elements. 
    The textures should be ${params.texture}, and the contrast should be ${params.contrast} to ensure the elements stand out clearly. 
    The depth of field should be ${params.depth_of_field}, keeping the main objects in focus while softening the background. 
    Frame the image according to the ${params.framing}, with ${params.shadows} shadows for depth. 
    The colors should have ${params.saturation} saturation, and the viewpoint should be at ${params.viewpoint} to make the viewer feel directly connected to the theme "${pageTitle}".
    `
  }
  else {
    return createDalePrompt(pageTitle)
  }
}

function createDalePrompt(value: string) {
  const promptIntro = 'Create a concise 20-word photorealistic image prompt focused on'
  const style = 'with a cinematic style'
  const include = 'real-world visuals and real random world and everyday scenarios and settings related to the subject settings.'
  const exclude = 'No futuristic, tech-related, no visible letters, no text, no symbols, no signs.'
  return `${promptIntro} "${value}" ${style}. \n\nInclude: ${include}. \n\nExclude: ${exclude}.`
}

// Create a concise 20-word photorealistic image prompt focused on
//  \"I want to learn about AI" with a cinematic style.
// Include: real-world visuals and real random world and everyday scenarios and settings related to the subject settings.
// Exclude: No futuristic, tech-related, no visible letters, no text, no symbols, no signs.