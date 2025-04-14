
'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {SummarizeMarketSentimentInput, summarizeMarketSentiment} from "@/ai/flows/summarize-market-sentiment";
import {AnalyzeStockDataInput, analyzeStockData} from "@/ai/flows/analyze-stock-data";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

const DashboardPage: React.FC = () => {
  const [ticker, setTicker] = useState<string>('AAPL');
  const [sentimentSummary, setSentimentSummary] = useState<string | null>(null);
  const [stockAnalysis, setStockAnalysis] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>('2024-01-03');

  const handleSentimentAnalysis = async () => {
    const input: SummarizeMarketSentimentInput = {
      ticker: ticker,
    };
    try {
      const result = await summarizeMarketSentiment(input);
      setSentimentSummary(result.sentimentSummary);
    } catch (error: any) {
      console.error('Error during sentiment analysis:', error);
      setSentimentSummary(`Error: ${error.message}`);
    }
  };

  const handleStockDataAnalysis = async () => {
    const input: AnalyzeStockDataInput = {
      stockSymbol: ticker,
      startDate: startDate,
      endDate: endDate,
    };
    try {
      const result = await analyzeStockData(input);
      setStockAnalysis(JSON.stringify(result));
    } catch (error: any) {
      console.error('Error during stock data analysis:', error);
      setStockAnalysis(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Market Sentiment Analysis</CardTitle>
          <CardDescription>Get a summary of the market sentiment for a given stock.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter stock ticker (e.g., AAPL)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
            <Button onClick={handleSentimentAnalysis}>Analyze Sentiment</Button>
          </div>
          {sentimentSummary && (
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-semibold">Sentiment Summary:</h3>
              <p>{sentimentSummary}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock Data Analysis</CardTitle>
          <CardDescription>Analyze historical stock data to get insights and recommendations.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter stock ticker (e.g., AAPL)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Start Date (YYYY-MM-DD)"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="text"
              placeholder="End Date (YYYY-MM-DD)"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button onClick={handleStockDataAnalysis}>Analyze Stock Data</Button>
          </div>
          {stockAnalysis && (
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-semibold">Stock Analysis:</h3>
              <p>{stockAnalysis}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
