import React from 'react'
import { Chart as ChartJS,ArcElement,Tooltip,Legend} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)
const DoughnutChart = ({data}:{data:any}) => {
    const options = {
        plugins: {
          legend: {
            display: false, 
          },
        },
      };
      const textCentre = {
        id: 'textCenter',
        beforeDatasetsDraw(chart:any) {
          const { ctx, data } = chart;
          ctx.save();
          // ctx.font = 'bolder 1rem sans-serif';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
      
          const x = chart.getDatasetMeta(0).data[0].x;
          const y = chart.getDatasetMeta(0).data[0].y;
      
        //   const line1 = `${data.datasets[0].data[0]}%`;
        //   const line2 = 'Direct';
      
          const line1FontSize = 20; 
    const line2FontSize = 8;
    const spacing = 4;

    const totalHeight = line1FontSize + spacing + line2FontSize;
    const line1Y = y - totalHeight / 2;
    const line2Y = line1Y + line1FontSize + spacing;

    ctx.font = `bolder ${line1FontSize}px sans-serif`;

    ctx.font = `bolder ${line2FontSize}px sans-serif`;
        },
      };      
      
  return (
    <Doughnut data={data} options={options} plugins={[textCentre]}/>
  )
}

export default DoughnutChart