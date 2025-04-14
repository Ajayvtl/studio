/**
 * Represents historical stock data for a given period.
 */
export interface HistoricalData {
  /**
   * The date of the stock data.
   */
  date: string;
  /**
   * The opening price of the stock.
   */
  open: number;
  /**
   * The highest price of the stock during the period.
   */
  high: number;
  /**
   * The lowest price of the stock during the period.
   */
  low: number;
  /**
   * The closing price of the stock.
   */
  close: number;
  /**
   * The adjusted closing price of the stock.
   */
  adjClose: number;
  /**
   * The volume of shares traded during the period.
   */
  volume: number;
}

/**
 * Represents live stock data.
 */
export interface LiveData {
  /**
   * The current price of the stock.
   */
  currentPrice: number;
  /**
   * The change in price since the previous day's close.
   */
  change: number;
  /**
   * The percentage change in price since the previous day's close.
   */
  changePercent: number;
  /**
   * The time of the last price update.
   */
  lastUpdated: string;
}

/**
 * Asynchronously retrieves historical stock data for a given stock symbol and period.
 *
 * @param symbol The stock symbol (e.g., AAPL).
 * @param startDate The start date for the historical data (YYYY-MM-DD).
 * @param endDate The end date for the historical data (YYYY-MM-DD).
 * @returns A promise that resolves to an array of HistoricalData objects.
 */
export async function getHistoricalData(
  symbol: string,
  startDate: string,
  endDate: string
): Promise<HistoricalData[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      date: '2024-01-01',
      open: 150.0,
      high: 155.0,
      low: 148.0,
      close: 152.0,
      adjClose: 152.0,
      volume: 1000000,
    },
    {
      date: '2024-01-02',
      open: 152.0,
      high: 156.0,
      low: 151.0,
      close: 155.0,
      adjClose: 155.0,
      volume: 1200000,
    },
  ];
}

/**
 * Asynchronously retrieves live stock data for a given stock symbol.
 *
 * @param symbol The stock symbol (e.g., AAPL).
 * @returns A promise that resolves to a LiveData object.
 */
export async function getLiveData(symbol: string): Promise<LiveData> {
  // TODO: Implement this by calling an API.

  return {
    currentPrice: 155.50,
    change: 0.50,
    changePercent: 0.32,
    lastUpdated: '2024-01-03 10:00:00',
  };
}
