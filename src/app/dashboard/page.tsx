'use client';

import React, {useState, useCallback, useEffect} from 'react';
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
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {Slider} from "@/components/ui/slider";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {List, BarChart3, LineChart as LineChartIcon, AreaChart as AreaChartIcon, Settings} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import dynamic from 'next/dynamic';

interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface DashboardItemProps {
  id: string;
  title: string;
  content: React.ReactNode;
}

const DashboardItem: React.FC<DashboardItemProps> = ({id, title, content}) => {
  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

const DraggableDashboard = dynamic(() => import('./DraggableDashboard'), {
  ssr: false,
});

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
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('line');
  const [dashboardItems, setDashboardItems] = useState([
    'marketSentiment',
    'stockAnalysis',
    'dataVisualization',
    'customization',
  ]);

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

      data.push({date: dateString, open, high, low, close, volume});
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(dashboardItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDashboardItems(items);
  };

  const availableCharts = [
    {id: 'marketSentiment', name: 'Market Sentiment', icon: List},
    {id: 'stockAnalysis', name: 'Stock Analysis', icon: Settings},
    {id: 'dataVisualization', name: 'Data Visualization', icon: AreaChartIcon},
    {id: 'customization', name: 'Customization', icon: Settings},
  ];

  const dummyPatterns = [
    {id: 'pattern1', name: 'Bullish Engulfing'},
    {id: 'pattern2', name: 'Bearish Engulfing'},
    {id: 'pattern3', name: 'Head and Shoulders'},
  ];

  const handlePatternClick = (patternId: string) => {
    console.log(`Pattern ${patternId} clicked`);
    // Implement your pattern click logic here
  };

  return (
    <div className="flex h-full">
      {/* Sidebar for Charts and Patterns */}
      <div className="w-64 border-r p-4">
        <ScrollArea className="h-[calc(100vh-100px)]">
          <Accordion type="single" collapsible>
            <AccordionItem value="charts">
              <AccordionTrigger>Charts</AccordionTrigger>
              <AccordionContent>
                {availableCharts.map((chart) => (
                  <div key={chart.id} className="flex items-center space-x-2 py-2">
                    {chart.icon && <chart.icon className="h-4 w-4"/>}
                    <span>{chart.name}</span>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="patterns">
              <AccordionTrigger>Patterns</AccordionTrigger>
              <AccordionContent>
                {dummyPatterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className="flex items-center space-x-2 py-2 cursor-pointer"
                    onClick={() => handlePatternClick(pattern.id)}
                  >
                    <span>{pattern.name}</span>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="settings">
              <AccordionTrigger>Settings</AccordionTrigger>
              <AccordionContent>
                <div>
                  <Label>Ticker</Label>
                  <Input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)}/>
                  <Label>Start Date</Label>
                  <Input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                  <Label>End Date</Label>
                  <Input type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                  <Label>Volume Threshold</Label>
                  <Input type="number" value={volumeThreshold} onChange={(e) => setVolumeThreshold(Number(e.target.value))}/>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>

      {/* Main Content: Draggable Dashboard */}
      <div className="flex-1 p-10">
        <DraggableDashboard dashboardItems={dashboardItems} setDashboardItems={setDashboardItems}
                             ticker={ticker} setTicker={setTicker}
                             startDate={startDate} setStartDate={setStartDate}
                             endDate={endDate} setEndDate={setEndDate}
                             volumeThreshold={volumeThreshold} setVolumeThreshold={setVolumeThreshold}
                             chartType={chartType} setChartType={setChartType}
                             zoomedData={zoomedData} handleZoomChange={handleZoomChange}
                             sentimentSummary={sentimentSummary} handleSentimentAnalysis={handleSentimentAnalysis}
                             stockAnalysis={stockAnalysis} handleStockDataAnalysis={handleStockDataAnalysis}/>
      </div>
    </div>
  );
};

export default DashboardPage;
