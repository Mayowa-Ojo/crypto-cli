import { parse } from "https://deno.land/std@v0.38.0/flags/mod.ts";
import { CoinData } from "./types.d.ts";

const { args } = Deno;
const BASE_URL: string = "https://api.coinlore.net/api/";

const _validArgs  = [
   "-c",
   "--coins",
   "-a",
   "--coin",
   "-h",
   "--help",
   "--limit",
   "-l"
]

const parsedArgs = parse(args);
// console.log(parsedArgs);

async function getCoins(): Promise<any> {
   const res = await fetch(`${BASE_URL}tickers/?start=0&limit=10`);
   const data = await res.json();

   return data;
}

async function getCoin(): Promise<any> {
   const res = await fetch(`${BASE_URL}ticker/?id=90`);
   const data = await res.json();

   return data;
}

function formatData(raw: CoinData[] | CoinData): string {
   let formattedData: string = ``;
   
   if(Array.isArray(raw)) {
      formattedData = `${raw[0].name}[${raw[0].symbol}] - USD${raw[0].price_usd}`
      return formattedData;
   }

   raw.data.forEach(data => {
      formattedData += `${data.name}[${data.symbol}] - USD${data.price_usd}\n`;
   })

   return formattedData;
}

function displayHelpMsg() {
   return `
   -> crypto-cli v1.0
   run the cli command with the following flags:
   -h, --help: display help message
   -c, --coin: get data for currency with id
   -a, --coins: get data for all currencies within limit
   -l, --limit: maximum results per request
   -i, --id: crypto-currency id
   `
}

(async function() {
   let data;
   let formattedData
   switch (Object.keys(parsedArgs)[1]) {
      case "help":
      case "h":
         console.log(displayHelpMsg());
         break;
      case "coins":
      case "a":
         data = await getCoins();
         formattedData = formatData(data);
         console.log(formattedData);
         break;
      case "coin":
      case "c":
         data = await getCoin();
         formattedData = formatData(data);
         console.log(formattedData);
         break;
      default:
         console.log(displayHelpMsg());
   }
})();

// console.dir(Object.keys(parse(args))[1] == "c");
// console.log(await getCoins())