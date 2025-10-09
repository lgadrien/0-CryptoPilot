import React, { useEffect, useState } from 'react';
import './App.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    // Fetch data from the API using fetch
    fetch('http://localhost:3000/api/prices')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setPrices(data);
      })
      .catch(error => {
        console.error('Error fetching prices:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Crypto Prices</h1>

      {/* Individual Charts for Each Crypto */}
      <div className="charts-container">
        {prices.map(price => {
          const chartData = {
            labels: ['Current'],
            datasets: [
              {
                label: `${price.name} (${price.symbol})`,
                data: [price.price],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
              },
            ],
          };

          return (
            <div key={price.id} className="chart" style={{ width: '300px', margin: '20px' }}>
              <Line data={chartData} />
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Change (24h)</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {prices.map(price => (
            <tr key={price.id}>
              <td>{price.symbol}</td>
              <td>{price.name}</td>
              <td>${price.price.toFixed(2)}</td>
              <td>{price.change24h.toFixed(2)}%</td>
              <td>${price.market_cap.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
