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
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      type: 'line' as const,
      label: 'Dataset 1',
      borderColor: '#A155B9',
      borderWidth: 2,
      fill: false,
      data: [10,200,400,30,20,20,10],
    },
    {
      type: 'bar' as const,
      label: 'Dataset 2',
      backgroundColor: '#165BAA',
      data: [10,200,400,30,20,20,10],
      borderColor: 'white',
      borderWidth: 2,
    },
  ],
};

export function MultiTypeChart() {
  return <Chart type='bar' data={data}  options={{
    plugins: {
      legend: {
        display: false, 
      },
    },
  }}/>;
}
