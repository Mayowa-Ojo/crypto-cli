import { parse } from "https://deno.land/std@v0.38.0/flags/mod.ts";
import { CoinData, Flag } from "./types.d.ts";

const { args } = Deno;
const BASE_URL: string = "https://api.coinlore.net/api/";

const parsedArgs = parse(args);

async function getCoins(flag: Flag): Promise<CoinData> {
   if(!flag.limit) {
      flag = {limit: "10"};
   }

   const res = await fetch(`${BASE_URL}tickers/?start=0&limit=${flag.limit}`);
   const data = await res.json();

   return data;
}

async function getCoin(flag: Flag): Promise<CoinData> {
   if(!flag.id) {
      flag.id = "90";
   }

   const res = await fetch(`${BASE_URL}ticker/?id=${flag.id}`);
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

function displayHelpMsg(): string {
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

if(import.meta.main) {

   (async function() {
      let data;
      let formattedData;
      let flags: Flag = {};

      switch (Object.keys(parsedArgs)[1]) {
         case "help":
         case "h":
            console.log(displayHelpMsg());
            break;
         case "coins":
         case "a":
            if(Object.keys(parsedArgs).length > 2) {
               flags["limit"] = parsedArgs.l || parsedArgs.limit
            }
            data = await getCoins(flags);
            formattedData = formatData(data);
            console.log(formattedData);
            break;
         case "coin":
         case "c":
            if(Object.keys(parsedArgs).length > 2) {
               flags["id"] = parsedArgs.i || parsedArgs.id
            }
            data = await getCoin(flags);
            formattedData = formatData(data);
            console.log(formattedData);
            break;
         default:
            console.log(displayHelpMsg());
      }
   })();
}
