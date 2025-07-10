import React, { useEffect, useState } from 'react';
import TrendChart from './TrendChart';
import { subscribeToPush } from './pushSetup';

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');
    ws.onmessage = (event) => {
      const { symbol, price, time } = JSON.parse(event.data);
      setData(prev => ({
        ...prev,
        [symbol]: [...(prev[symbol] || []), { time, price }]
      }));
    };

    subscribeToPush();

    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>📊 Analyse Boursière en Temps Réel</h1>
      {Object.keys(data).map((symbol) => (
        <div key={symbol}>
          <h2>{symbol.toUpperCase()}</h2>
          <TrendChart symbol={symbol} data={data[symbol]} />
        </div>
      ))}
    </div>
  );
}

export default App;
