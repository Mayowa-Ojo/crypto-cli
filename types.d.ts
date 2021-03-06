export interface CoinData {
   data: CoinData[]
   id: string
   symbol: string
   name: string
   price_usd: string
}

export interface Flag {
   [key: string]: string
}