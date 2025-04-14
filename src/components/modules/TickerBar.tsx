import React from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

interface TickerBarProps {
    ticker: string;
    setTicker: (ticker: string) => void;
    handleSentimentAnalysis: () => void;
}

const TickerBar: React.FC<TickerBarProps> = ({ ticker, setTicker, handleSentimentAnalysis }) => {
    return (
        <div className="flex items-center justify-start space-x-4 p-4 bg-muted rounded-md mb-4">
            <Input
                type="text"
                placeholder="Enter stock ticker (e.g., AAPL)"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-48"
            />
            <Button onClick={handleSentimentAnalysis}>Analyze Sentiment</Button>
        </div>
    );
};

export default TickerBar;
