export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
    [key: string]: string;
  };
  links: {
    homepage: string[];
    [key: string]: any;
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
      [key: string]: number;
    };
    market_cap: {
      usd: number;
      [key: string]: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    [key: string]: any;
  };
  tickers: any[];
}
