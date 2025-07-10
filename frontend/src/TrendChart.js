import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function TrendChart({ symbol, data }) {
  const canvasRef = useRef();

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(p => new Date(p.time).toLocaleTimeString()),
        datasets: [{
          label: `${symbol} (USD)`,
          data: data.map(p => p.price),
          borderColor: 'green',
          fill: false
        }]
      },
      options: {
        animation: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={canvasRef}></canvas>;
}

export default TrendChart;
