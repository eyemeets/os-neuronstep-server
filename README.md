# NeuronStep Server

## NeuronStep Course Curriculum Generator

**NeuronStep** is an AI-driven course generation system designed for students, educators, course creators, and anyone interested in structured learning. By leveraging the "gpt-4o-mini" model, it creates, analyzes, and validates course objectives, curricula, and outlines. NeuronStep utilizes educational frameworks like Bloom's Taxonomy and Cognitive Load Theory, providing users with a structured, adaptive learning experience tailored to their needs.

## Features
- **Course Objective Validation**: Validate learning objectives against curricula and receive feedback on their suitability.
- **Course Analysis**: Perform deep analysis of validated learning objectives, ensuring alignment with educational standards, Bloom’s Taxonomy, and learning styles.
- **Course Creation**: Automatically generate a detailed curriculum, including chapters, subtopics, and assessment strategies.
- **AI-Driven Feedback**: Adaptive learning recommendations and feedback are tailored to user inputs.
- **Modular Design**: Allows for highly customizable curricula generation.


## Technologies Used

🚀 **Node.js** with **Express** - fast and minimal server framework

🔒 **Zod** - schema validation for type-safe API handling

📂 **Express File-Based Routing** - route management via file structure

📜 **Tesseract.js** - OCR capabilities for image and text extraction

📄 **PDF-Parse** - extract information from PDFs

🌐 **OpenAI API** - AI-powered responses integrated into the system

🛠 **TypeScript** - static typing for maintainable and scalable code

⚡ **Vitest** - unit testing for a fast and efficient test setup

🔧 **ESLint** - for clean and consistent code formatting

🖥 **Vercel** - for effortless deployment and hosting

💾 **Multer** & **Express FileUpload** - for file uploads and form handling


## Getting Started

### Prerequisites

- Node.js (v16+)
- `pnpm` as the package manager (Or any other)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/eyemeets/express-ts-starter.git
   cd express-ts-starter
   ```

2. Install dependencies:
  ```bash
  pnpm install
  ```

3. Run the development server:
  ```bash
  pnpm dev
  ```

4. Build the project:
  ```bash
  pnpm build
  ```

## OpenAI API Key

1. Sign up at [OpenAI](https://platform.openai.com/signup) to obtain an API key.
2. Add your API key to the `.env` file by setting `OPENAI_API_KEY`.

## Image Generation with Stable Diffusion

1. Sign up at [Replicate](https://replicate.com/account/api-tokens) to obtain an API key.
2. Add your API key to the `.env` file by setting `REPLICATE_API_KEY`.

### Auto File-Based Routing

This project uses `express-file-routing` to map files directly to routes. For example:

- **`src/routes/index.ts`** handles `GET /`
- **`src/routes/dynamic/[id].ts`** handles `GET /dynamic/:id`

To add a new route, simply add a new file to `src/routes/` and export route handlers like `get`, `post`, etc.

### Example: Add a New Route

1. Create a new route file:

   ```bash
   touch src/routes/hello.ts
   ````

2. Add a route handler:

  ```ts
  import { Request, Response } from 'express';

  export const get = (req: Request, res: Response) => {
    res.json({ message: 'Hello, World!' });
  };
  ```

3. Access the new route at GET /hello.

## API Usage

### 1. Course Objective Validation
This API validates a given learning objective and returns feedback, validation results, and suggestions.

- : **Endpoint** `POST http://localhost:3000/course-validator`

- **Request Payload**:
```JSON
{
  "objective": "I want to learn about AI",
  "lang": "en-US",
  "educationLevel": "undergraduate",
  "curriculum": "UIS",
  "learningStyle": "readingWriting",
  "tone": "academic"
}
```

### 2. Course Analysis
After the course objective has been validated, this API performs a detailed analysis of the course, including recommendations for improvement, learning styles, and educational frameworks.

- **Endpoint**: `POST http://localhost:3000/course-analysis`

- **Request Payload**: Use the validated learning objective from the previous step.

- **Response**
```JSON
{
  "objective": {
    "valid": true,
    "reason": "The objective of learning about AI is broad but appropriate...",
    "curriculum": "UIS",
    "learning_outcomes": ["Understand core AI concepts", "Develop critical thinking skills"],
    "bloom_taxonomy_level": "Understanding",
    "cognitive_load_assessment": "The information can be structured to prevent overload...",
    "skills_21st_century": ["Critical Thinking", "Collaboration"],
    "learning_style": "readingWriting"
  },
  "plan": {
    "title": "Introduction to Artificial Intelligence",
    "description": "This undergraduate curriculum provides an in-depth exploration of artificial intelligence...",
    "estimated_total_minutes": 80,
    "learning_objectives": ["Understand core AI concepts", "Assess AI's impacts on society"],
    "key_focus_areas": ["AI technologies", "Ethical considerations", "Practical applications in industry"]
  }
}
```

### 3. Course Creation
This API generates a detailed curriculum structure based on the analyzed course objective and includes chapters, subtopics, and suggested content.

- **Endpoint**: `POST http://localhost:3000/course-creator`

- **Request Payload**: Use the analyzed course plan from the previous step.

- **Response**
```JSON
{
  "title": "Introduction to Artificial Intelligence",
  "description": "This undergraduate curriculum provides an in-depth exploration of artificial intelligence, including its foundational technologies, ethical issues, and real-world applications.",
  "chapters": [
    {
      "topic": "Foundations of AI",
      "subtopics": [
        {
          "subtopic": "History of AI",
          "pages": [
            {
              "block_title": "Introduction to AI History",
              "content_type": "text_article",
              "description": "Overview of the history and evolution of artificial intelligence...",
              "content": "<h1>Introduction to AI History</h1><p>The history of artificial intelligence...</p>"
            }
          ]
        }
      ]
    }
  ]
}
```

## Testing

This project uses **Vitest** for unit testing.

### Running Tests

To run tests, use the following command:

  ```bash
  pnpm test
  ```

Vitest is configured with TypeScript support and uses `ts-node/esm` to handle TypeScript files during tests. The tests are located in the `tests/` directory, and Vitest will automatically run all the test files.

### Example Test
Here’s an example of a basic test for the `GET /` route:

  ```ts
  import request from 'supertest'
  import { describe, it, expect } from 'vitest'
  import app from '~/app.ts' // Use .ts extension explicitly

  describe('GET /', () => {
    it('should return hello world', async () => {
      const res = await request(app).get('/')
      expect(res.status).toBe(200)
      expect(res.body).toEqual({   hello: 'world' }) // Update to match the actual response
    })
  })
  ```

## Deploying to Vercel

You can deploy the app to [Vercel](https://vercel.com).

### Vercel Commands

Login to Vercel first
  ```bash
  pnpm v:login
  ```

To run the project locally with Vercel for development:

  ```bash
  pnpm dev:ship
  ```

To deploy the project to production:
```bash
pnpm ship
```

## 🤝 Want to Collaborate?

I’m always open to new ideas, collaborations, and contributions! If you want to contribute to this project, have suggestions, or just want to discuss anything related to NeuronStep, feel free to reach out.

You can contact me via:

- **Email**: [daniel@eyemeets.com](mailto:daniel@eyemeets.com)

Looking forward to hearing from you!
