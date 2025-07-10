import axios from 'axios';

const API_KEY = process.env.ALPHA_KEY;
const actions = ['AAPL', 'MSFT'];
const cryptos = ['bitcoin', 'ethereum'];

export function startFetching(onData) {
  setInterval(async () => {
    try {
      for (let sym of actions) {
        const res = await axios.get(`https://www.alphavantage.co/query`, {
          params: {
            function: 'TIME_SERIES_INTRADAY',
            symbol: sym,
            interval: '1min',
            apikey: API_KEY
          }
        });
        const latest = Object.values(res.data['Time Series (1min)'])[0];
        const price = parseFloat(latest['4. close']);
        onData(sym, { type: 'stock', price, time: new Date().toISOString() });
      }

      const res2 = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: cryptos.join(','),
          vs_currencies: 'usd'
        }
      });
      for (let id of cryptos) {
        onData(id, { type: 'crypto', price: res2.data[id].usd, time: new Date().toISOString() });
      }
    } catch (e) {
      console.error('Erreur fetch:', e.message);
    }
  }, 60 * 1000);
}
