'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {SummarizeMarketSentimentInput, summarizeMarketSentiment} from "@/ai/flows/summarize-market-sentiment";
import {AnalyzeStockDataInput, analyzeStockData} from "@/ai/flows/analyze-stock-data";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {Slider} from "@/components/ui/slider";
import {Label} from "@/components/ui/label";
import {useEffect} from "react";

interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const DashboardPage: React.FC = () => {
  const [ticker, setTicker] = useState<string>('AAPL');
  const [sentimentSummary, setSentimentSummary] = useState<string | null>(null);
  const [stockAnalysis, setStockAnalysis] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>('2024-01-03');
  const [historicalData, setHistoricalData] = useState<StockDataPoint[]>([]);
  const [dataFetchProgress, setDataFetchProgress] = useState<number>(0);
  const [chartZoom, setChartZoom] = useState<[number, number]>([0, 99]);
  const [volumeThreshold, setVolumeThreshold] = useState<number>(500000);

  useEffect(() => {
    const fetchAndSetStockAnalysis = async () => {
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

    fetchAndSetStockAnalysis();
  }, [ticker, startDate, endDate]);

  useEffect(() => {
    const fetchAndSetSentimentSummary = async () => {
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

    fetchAndSetSentimentSummary();
  }, [ticker]);

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

  const generateRandomStockData = (count: number): StockDataPoint[] => {
    const data: StockDataPoint[] = [];
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const timeBetween = endDateObj.getTime() - startDateObj.getTime();
    const dayDiff = Math.ceil(timeBetween / (1000 * 3600 * 24));

    for (let i = 0; i < count; i++) {
      const randomDate = new Date(startDateObj.getTime() + Math.random() * timeBetween);
      const dateString = randomDate.toISOString().slice(0, 10);

      const open = Math.random() * 200 + 50;
      const high = open + Math.random() * 50;
      const low = open - Math.random() * 50;
      const close = low + (high - low) * Math.random();
      const volume = Math.floor(Math.random() * 1000000);

      data.push({ date: dateString, open, high, low, close, volume });
    }

    return data;
  };

  useEffect(() => {
    const mockData = generateRandomStockData(100);
    setHistoricalData(mockData);
  }, [ticker, startDate, endDate]);

  const volumeFilteredData = historicalData.filter(dataPoint => dataPoint.volume > volumeThreshold);

  const handleZoomChange = (values: number[]) => {
    setChartZoom([values[0], values[1]]);
  };

  const startIndex = Math.floor((chartZoom[0] / 100) * volumeFilteredData.length);
  const endIndex = Math.ceil((chartZoom[1] / 100) * volumeFilteredData.length);
  const zoomedData = volumeFilteredData.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="marketSentiment" className="w-full">
        <TabsList>
          <TabsTrigger value="marketSentiment">Market Sentiment</TabsTrigger>
          <TabsTrigger value="stockAnalysis">Stock Analysis</TabsTrigger>
          <TabsTrigger value="dataVisualization">Data Visualization</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>
        <TabsContent value="marketSentiment">
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
        </TabsContent>
        <TabsContent value="stockAnalysis">
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
        </TabsContent>
        <TabsContent value="dataVisualization">
          <Card>
            <CardHeader>
              <CardTitle>Historical Stock Data Visualization</CardTitle>
              <CardDescription>Visualize historical stock data with interactive charts.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={zoomedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="close" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Zoom Chart</Label>
                <Slider
                  defaultValue={[0, 99]}
                  onValueChange={(values) => handleZoomChange(values.map(Number))}
                  max={99}
                  step={1}
                  value={chartZoom}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customization">
          <Card>
            <CardHeader>
              <CardTitle>Customization Options</CardTitle>
              <CardDescription>Customize data visualization and analysis parameters.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Volume Threshold</Label>
                <Input
                  type="number"
                  placeholder="Enter volume threshold"
                  value={volumeThreshold}
                  onChange={(e) => setVolumeThreshold(Number(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  Filter data points with volume greater than the threshold.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
