'use server';
/**
 * @fileOverview Summarizes the market sentiment for a given stock using news articles and social media posts.
 *
 * - summarizeMarketSentiment - A function that summarizes the market sentiment.
 * - SummarizeMarketSentimentInput - The input type for the summarizeMarketSentiment function.
 * - SummarizeMarketSentimentOutput - The return type for the summarizeMarketSentiment function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeMarketSentimentInputSchema = z.object({
  ticker: z.string().describe('The stock ticker symbol (e.g., AAPL).'),
});
export type SummarizeMarketSentimentInput = z.infer<typeof SummarizeMarketSentimentInputSchema>;

const SummarizeMarketSentimentOutputSchema = z.object({
  sentimentSummary: z.string().describe('A summary of the market sentiment for the given stock.'),
});
export type SummarizeMarketSentimentOutput = z.infer<typeof SummarizeMarketSentimentOutputSchema>;

export async function summarizeMarketSentiment(input: SummarizeMarketSentimentInput): Promise<SummarizeMarketSentimentOutput> {
  return summarizeMarketSentimentFlow(input);
}

const summarizeMarketSentimentPrompt = ai.definePrompt({
  name: 'summarizeMarketSentimentPrompt',
  input: {
    schema: z.object({
      ticker: z.string().describe('The stock ticker symbol.'),
    }),
  },
  output: {
    schema: z.object({
      sentimentSummary: z.string().describe('A summary of the market sentiment for the given stock.'),
    }),
  },
  prompt: `Summarize the market sentiment for {{ticker}} based on recent news articles and social media posts.\nConsider the overall tone and opinions expressed in the content.\nProvide a concise summary of the general market feeling towards the stock.\n\nSummary: `,
});

const summarizeMarketSentimentFlow = ai.defineFlow<
  typeof SummarizeMarketSentimentInputSchema,
  typeof SummarizeMarketSentimentOutputSchema
>({
  name: 'summarizeMarketSentimentFlow',
  inputSchema: SummarizeMarketSentimentInputSchema,
  outputSchema: SummarizeMarketSentimentOutputSchema,
},
async input => {
  const {output} = await summarizeMarketSentimentPrompt(input);
  return output!;
});
