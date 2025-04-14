// src/ai/flows/analyze-stock-data.ts
'use server';

/**
 * @fileOverview A stock data analysis AI agent.
 *
 * - analyzeStockData - A function that handles the stock data analysis process.
 * - AnalyzeStockDataInput - The input type for the analyzeStockData function.
 * - AnalyzeStockDataOutput - The return type for the analyzeStockData function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getHistoricalData, getLiveData} from '@/services/yahoo-finance';

const AnalyzeStockDataInputSchema = z.object({
  stockSymbol: z.string().describe('The stock symbol to analyze (e.g., AAPL).'),
  startDate: z.string().describe('The start date for historical data (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date for historical data (YYYY-MM-DD).'),
  newsArticles: z.string().optional().describe('News articles related to the stock.'),
  socialMediaPosts: z.string().optional().describe('Social media posts related to the stock.'),
});
export type AnalyzeStockDataInput = z.infer<typeof AnalyzeStockDataInputSchema>;

const AnalyzeStockDataOutputSchema = z.object({
  summary: z.string().describe('A summary of the stock data analysis.'),
  sentimentAnalysis: z.string().describe('Sentiment analysis of news and social media related to the stock.'),
  keyInsights: z.array(z.string()).describe('Key insights derived from the data analysis.'),
});
export type AnalyzeStockDataOutput = z.infer<typeof AnalyzeStockDataOutputSchema>;

export async function analyzeStockData(input: AnalyzeStockDataInput): Promise<AnalyzeStockDataOutput> {
  return analyzeStockDataFlow(input);
}

const analyzeStockDataPrompt = ai.definePrompt({
  name: 'analyzeStockDataPrompt',
  input: {
    schema: z.object({
      stockSymbol: z.string().describe('The stock symbol to analyze (e.g., AAPL).'),
      startDate: z.string().describe('The start date for historical data (YYYY-MM-DD).'),
      endDate: z.string().describe('The end date for historical data (YYYY-MM-DD).'),
      historicalData: z.string().describe('Historical stock data in JSON format.'),
      liveData: z.string().describe('Live stock data in JSON format.'),
      newsArticles: z.string().optional().describe('News articles related to the stock.'),
      socialMediaPosts: z.string().optional().describe('Social media posts related to the stock.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summary of the stock data analysis.'),
      sentimentAnalysis: z.string().describe('Sentiment analysis of news and social media related to the stock.'),
      keyInsights: z.array(z.string()).describe('Key insights derived from the data analysis.'),
    }),
  },
  prompt: `You are a financial analyst who analyzes stock data to provide insights and recommendations.

Analyze the provided historical and live stock data, news articles, and social media posts to generate a summary, sentiment analysis, and key insights.

Historical Data: {{{historicalData}}}
Live Data: {{{liveData}}}
News Articles: {{{newsArticles}}}
Social Media Posts: {{{socialMediaPosts}}}

Summary: Summarize the overall performance and trends of the stock.
Sentiment Analysis: Analyze the sentiment of news articles and social media posts related to the stock.
Key Insights: Provide key insights derived from the data analysis, such as potential investment opportunities or risks.`,
});

const analyzeStockDataFlow = ai.defineFlow<
  typeof AnalyzeStockDataInputSchema,
  typeof AnalyzeStockDataOutputSchema
>(
  {
    name: 'analyzeStockDataFlow',
    inputSchema: AnalyzeStockDataInputSchema,
    outputSchema: AnalyzeStockDataOutputSchema,
  },
  async input => {
    const historicalData = await getHistoricalData(input.stockSymbol, input.startDate, input.endDate);
    const liveData = await getLiveData(input.stockSymbol);

    const {output} = await analyzeStockDataPrompt({
      ...input,
      historicalData: JSON.stringify(historicalData),
      liveData: JSON.stringify(liveData),
    });
    return output!;
  }
);
