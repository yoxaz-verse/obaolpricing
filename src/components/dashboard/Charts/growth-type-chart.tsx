import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Filler,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip,
  LineController,
  BarController
);

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

// export const data = {
//   labels,
//   datasets: [
//     {
//       type: 'line' as const,
//       label: 'Dataset 1',
//       borderColor: '#A155B9',
//       borderWidth: 2,
//       fill: false,
//       data: [10, 200, 0, 30, 0, 20, 10],
//     },
//     {
//       type: 'line' as const,
//       label: 'Dataset 1',
//       borderColor: '#16BFD6',
//       borderWidth: 2,
//       fill: false,
//       borderDash: [5, 5],
//       data: [10, 20, 100, 300, 25, 21, 122],
//     },
//     {
//       type: 'line' as const,
//       label: 'Dataset 1',
//       borderColor: '#165BAA',
//       borderWidth: 2,
//       fill: true,
//       backgroundColor: '#165BAA',
//       data: [100, -20, -10, 350, 0, 201, 102],
//     },
//   ],
// };

// const labels = Utils.months({count: 7});
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data = {
  labels: labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1
  }]
};

export function GrowthTypeChart() {
  return <Chart type='bar' data={data} options={{
    scales: {
      y: {
        beginAtZero: true
      }
    },
  }} />;
}
