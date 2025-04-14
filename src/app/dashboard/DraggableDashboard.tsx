'use client';

import React from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Slider} from "@/components/ui/slider"; // Import Slider

interface DraggableDashboardProps {
  dashboardItems: string[];
  setDashboardItems: (items: string[]) => void;
  ticker: string;
  setTicker: (ticker: string) => void;
  startDate: string;
  setStartDate: (startDate: string) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
  volumeThreshold: number;
  setVolumeThreshold: (volumeThreshold: number) => void;
  chartType: 'area' | 'line' | 'bar';
  setChartType: (chartType: 'area' | 'line' | 'bar') => void;
  zoomedData: any[];
  handleZoomChange: (values: number[]) => void;
  sentimentSummary: string | null;
  handleSentimentAnalysis: () => void;
  stockAnalysis: string | null;
  handleStockDataAnalysis: () => void;
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


const DraggableDashboard: React.FC<DraggableDashboardProps> = ({
  dashboardItems,
  setDashboardItems,
  ticker,
  setTicker,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  volumeThreshold,
  setVolumeThreshold,
  chartType,
  setChartType,
  zoomedData,
  handleZoomChange,
  sentimentSummary,
  handleSentimentAnalysis,
  stockAnalysis,
  handleStockDataAnalysis
}) => {

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(dashboardItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDashboardItems(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="dashboard">
        {(provided) => (
          <div
            className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {dashboardItems.map((itemId, index) => (
              <Draggable key={itemId} draggableId={itemId} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {(() => {
                      switch (itemId) {
                        case 'marketSentiment':
                          return (
                            <DashboardItem key="marketSentiment" id="marketSentiment" title="Market Sentiment">
                              <div className="flex flex-col space-y-4">
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
                              </div>
                            </DashboardItem>
                          );
                        case 'stockAnalysis':
                          return (
                            <DashboardItem key="stockAnalysis" id="stockAnalysis" title="Stock Analysis">
                              <div className="flex flex-col space-y-4">
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
                              </div>
                            </DashboardItem>
                          );
                        case 'dataVisualization':
                          return (
                            <DashboardItem key="dataVisualization" id="dataVisualization" title="Data Visualization">
                              <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                  <Select value={chartType} onValueChange={setChartType}>
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Select chart type"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="line">Line Chart</SelectItem>
                                      <SelectItem value="area">Area Chart</SelectItem>
                                      <SelectItem value="bar">Bar Chart</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="w-full h-[400px]">
                                  <ResponsiveContainer width="100%" height="100%">
                                    {chartType === 'line' && (
                                      <LineChart data={zoomedData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="date"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Line type="monotone" dataKey="close" stroke="#8884d8" name="Close Price"/>
                                        <Line type="monotone" dataKey="open" stroke="#82ca9d" name="Open Price"/>
                                      </LineChart>
                                    )}
                                    {chartType === 'area' && (
                                      <AreaChart data={zoomedData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="date"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Area type="monotone" dataKey="close" stroke="#8884d8" fill="#8884d8"
                                              name="Close Price"/>
                                      </AreaChart>
                                    )}
                                    {chartType === 'bar' && (
                                      <BarChart data={zoomedData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="date"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Bar dataKey="close" fill="#8884d8" name="Close Price"/>
                                        <Bar dataKey="open" fill="#82ca9d" name="Open Price"/>
                                      </BarChart>
                                    )}
                                  </ResponsiveContainer>
                                </div>
                                <div className="flex flex-col space-y-2">
                                  <Label>Zoom Chart</Label>
                                  <Slider
                                    defaultValue={[0, 99]}
                                    onValueChange={(values) => handleZoomChange(values.map(Number))}
                                    max={99}
                                    step={1}
                                    value={[Number(zoomedData.length > 0 ? (zoomedData[0].date) : 0), Number(zoomedData.length > 0 ? (zoomedData[zoomedData.length - 1].date) : 99)]}
                                  />
                                </div>
                              </div>
                            </DashboardItem>
                          );
                        case 'customization':
                          return (
                            <DashboardItem key="customization" id="customization" title="Customization Options">
                              <div className="flex flex-col space-y-4">
                                <div className="flex flex-col space-y-2">
                                  <Label>Volume Threshold</Label>
                                  <Input
                                    type="number"
                                    placeholder="Enter volume threshold"
                                    value={String(volumeThreshold)}
                                    onChange={(e) => setVolumeThreshold(Number(e.target.value))}
                                  />
                                  <p className="text-sm text-muted-foreground">
                                    Filter data points with volume greater than the threshold.
                                  </p>
                                </div>
                              </div>
                            </DashboardItem>
                          );
                        default:
                          return null;
                      }
                    })()}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableDashboard;
