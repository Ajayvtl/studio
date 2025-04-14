import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// TODO: Add Groq support in next version
// import {groq} from '@genkit-ai/groq';

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
    // groq({
    //   apiKey: process.env.GROQ_API_KEY,
    // }),
  ],
  model: 'googleai/gemini-2.0-flash',
  // model: 'groq/mixtral-8x7b-32768',
});
