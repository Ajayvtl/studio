'use client';

import React, {useState, useCallback, useEffect} from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {SummarizeMarketSentimentInput, summarizeMarketSentiment} from "@/ai/flows/summarize-market-sentiment";
import {AnalyzeStockDataInput, analyzeStockData} from "@/ai/flows/analyze-stock-data";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
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
import {List, BarChart3, LineChart as LineChartIcon, AreaChart as AreaChartIcon, Settings, Shapes, Code} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import dynamic from 'next/dynamic';
import {toast} from "@/hooks/use-toast";
import {getCurrentStaff, getSession} from '@/lib/auth';
import {useSession} from "next-auth/react";
import TickerBar from "@/components/modules/TickerBar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {redirect} from "next/navigation";

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
    'patterns',
      'rssFeed'
  ]);
  const [rssFeedUrl, setRssFeedUrl] = useState<string>('https://finance.yahoo.com/rss/topstories');
  const [rssFeed, setRssFeed] = useState<any[]>([]);
  const [widgetCode, setWidgetCode] = useState<string>('');
  const [widgetType, setWidgetType] = useState<'horizontal' | 'vertical' | 'topExchanges' | 'depthGraph'>('horizontal');
    const [availableCharts, setAvailableCharts] = useState([
        {id: 'marketSentiment', name: 'Market Sentiment', icon: List, permission: 'marketSentiment'},
        {id: 'stockAnalysis', name: 'Stock Analysis', icon: Settings, permission: 'stockAnalysis'},
        {id: 'dataVisualization', name: 'Data Visualization', icon: AreaChartIcon, permission: 'dataVisualization'},
        {id: 'customization', name: 'Customization', icon: Settings, permission: 'customization'},
        {id: 'patterns', name: 'Patterns', icon: Shapes, permission: 'patterns'},
        {id: 'rssFeed', name: 'RSS Feed', icon: List, permission: 'rssFeed'},
    ]);
  const dummyPatterns = [
    {id: 'pattern1', name: 'Bullish Engulfing'},
    {id: 'pattern2', name: 'Bearish Engulfing'},
    {id: 'pattern3', name: 'Head and Shoulders'},
  ];

  useEffect(() => {
    const fetchRssFeed = async () => {
      try {
        const response = await fetch(`/api/rss?url=${rssFeedUrl}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRssFeed(data.items);
      } catch (error: any) {
        console.error('Error fetching RSS feed:', error);
        toast({
          title: "RSS Feed Error",
          description: `Failed to fetch RSS feed: ${error.message}`,
          variant: "destructive",
        });
      }
    };

    fetchRssFeed();
  }, [rssFeedUrl]);

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
        toast({
          title: "Stock Data Analysis Error",
          description: `Failed to analyze stock data for ${ticker}: ${error.message}`,
          variant: "destructive",
        });
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
        toast({
          title: "Sentiment Analysis Error",
          description: `Failed to summarize sentiment for ${ticker}: ${error.message}`,
          variant: "destructive",
        });
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
      toast({
        title: "Sentiment Analysis Error",
        description: `Failed to summarize sentiment for ${ticker}: ${error.message}`,
        variant: "destructive",
      });
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
      toast({
        title: "Stock Data Analysis Error",
        description: `Failed to analyze stock data for ${ticker}: ${error.message}`,
        variant: "destructive",
      });
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

  const handlePatternClick = (patternId: string) => {
    console.log(`Pattern ${patternId} clicked`);
    toast({
      title: "Pattern Clicked",
      description: `Pattern ${patternId} was clicked. Implement your pattern click logic here.`,
    });
  };

    const generateWidgetCode = () => {
        let code = '';
        switch (widgetType) {
            case 'horizontal':
                code = `<iframe src="your-domain/widget/horizontal" width="600" height="100"></iframe>`;
                break;
            case 'vertical':
                code = `<iframe src="your-domain/widget/vertical" width="300" height="400"></iframe>`;
                break;
            case 'topExchanges':
                code = `<iframe src="your-domain/widget/top-exchanges" width="400" height="300"></iframe>`;
                break;
            case 'depthGraph':
                code = `<iframe src="your-domain/widget/depth-graph?ticker=${ticker}" width="500" height="300"></iframe>`;
                break;
            default:
                code = 'Invalid widget type selected.';
                break;
        }
        setWidgetCode(code);
    };

    const renderWidgetPreview = () => {
        let previewContent;
        switch (widgetType) {
            case 'horizontal':
                previewContent = <div style={{ width: '600px', height: '100px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Horizontal Ticker</div>;
                break;
            case 'vertical':
                previewContent = <div style={{ width: '300px', height: '400px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Vertical Ticker</div>;
                break;
            case 'topExchanges':
                previewContent = <div style={{ width: '400px', height: '300px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Top Exchanges</div>;
                break;
            case 'depthGraph':
                previewContent = <div style={{ width: '500px', height: '300px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Depth Graph for {ticker}</div>;
                break;
            default:
                previewContent = <div>Invalid widget type selected.</div>;
                break;
        }
        return previewContent;
    };

  const getDashboardItems = async () => {
        const session = await getSession();

        if (!session?.user) {
            redirect('/api/auth/signin');
        }

        const staff = await getCurrentStaff();
        if (!staff) {
            console.log('No staff found');
            return [];
        }

        // Filter availableCharts based on staff permissions
        const permittedCharts = availableCharts.filter(chart =>
            staff.permissions && staff.permissions[chart.permission]
        ).map(chart => chart.id);

        // Set the dashboard items based on permitted charts
        setDashboardItems(permittedCharts);
    };

    useEffect(() => {
      getDashboardItems();
    }, []);

  return (
    <div className="flex h-full">
      {/* Sidebar for Charts and Patterns */}
      <div className="w-64 border-r p-4">
        <ScrollArea className="h-[calc(100vh-100px)]">
          <Accordion type="single" collapsible>
            <AccordionItem value="charts">
              <AccordionTrigger>Charts</AccordionTrigger>
              <AccordionContent>
                {availableCharts.filter(chart => dashboardItems.includes(chart.id)).map((chart) => (
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
                  <Button
                    key={pattern.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handlePatternClick(pattern.id)}
                  >
                    {pattern.name}
                  </Button>
                ))}
              </AccordionContent>
            </AccordionItem>
              <AccordionItem value="widgets">
                  <AccordionTrigger>Widgets</AccordionTrigger>
                  <AccordionContent>
                      <Select onValueChange={(value) => setWidgetType(value as 'horizontal' | 'vertical' | 'topExchanges' | 'depthGraph')} defaultValue={widgetType}>
                          <SelectTrigger className="w-[90%]">
                              <SelectValue placeholder="Select Widget Type" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="horizontal">Horizontal Ticker</SelectItem>
                              <SelectItem value="vertical">Vertical Ticker</SelectItem>
                              <SelectItem value="topExchanges">Top Exchanges</SelectItem>
                              <SelectItem value="depthGraph">Depth Graph</SelectItem>
                          </SelectContent>
                      </Select>
                      <div className="mt-2 w-[90%]">
                          {renderWidgetPreview()}
                      </div>
                      <Button className="mt-2 w-[90%]" onClick={generateWidgetCode}>Generate Widget Code</Button>
                      {widgetCode && (
                          <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="outline" className="mt-2 w-[90%]">
                                      View Widget Code
                                  </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>Widget Embed Code</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          Copy and paste this code into your website.
                                      </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <div className="relative">
                                      <textarea
                                          readOnly
                                          value={widgetCode}
                                          className="w-full h-40 p-2 border rounded resize-none"
                                      />
                                      <Button
                                          variant="secondary"
                                          size="sm"
                                          className="absolute top-2 right-2"
                                          onClick={() => navigator.clipboard.writeText(widgetCode)}
                                      >
                                          Copy
                                      </Button>
                                  </div>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel>Close</AlertDialogCancel>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                      )}
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
                    <Label>RSS Feed URL</Label>
                    <Input
                        type="text"
                        value={rssFeedUrl}
                        onChange={(e) => setRssFeedUrl(e.target.value)}
                    />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>

      {/* Main Content: Draggable Dashboard */}
      <div className="flex-1 p-10">
          <TickerBar ticker={ticker} setTicker={setTicker} handleSentimentAnalysis={handleSentimentAnalysis} />
        <DraggableDashboard
          dashboardItems={dashboardItems}
          setDashboardItems={setDashboardItems}
          ticker={ticker}
          setTicker={setTicker}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          volumeThreshold={volumeThreshold}
          setVolumeThreshold={setVolumeThreshold}
          chartType={chartType}
          setChartType={setChartType}
          zoomedData={zoomedData}
          handleZoomChange={handleZoomChange}
          sentimentSummary={sentimentSummary}
          handleSentimentAnalysis={handleSentimentAnalysis}
          stockAnalysis={stockAnalysis}
          handleStockDataAnalysis={handleStockDataAnalysis}
            rssFeed={rssFeed}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
