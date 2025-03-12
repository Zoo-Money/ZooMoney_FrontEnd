import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJs, ArcElement, Tooltip, Legend, plugins } from 'chart.js';
import axios from 'axios';
import { id } from 'ethers';
import { color } from 'chart.js/helpers';

ChartJs.register(ArcElement, Tooltip, Legend);

function PlanChart({ values, allowance, onSave, formatCurrency }) {
  const chartData = {
    labels: Object.keys(values),
    datasets: [
      {
        data: Object.values(values).map((val) =>
          parseInt(val.replace(/[^0-9]/g, ""), 10)
        ),
        backgroundColor: [
          "#007bff",
          "#ffc107",
          "#dc3545",
          "#17a2b8",
          "#28a745",
        ],
        borderWidth: 1,
        hoverOffset: 4,
        hoverBackgroundColor: [
          "#FF4364",
          "#2692DB",
          "#DDBE46",
          "#3A9090",
          "#7746FF",
        ],
      },
    ],
  };

  const centerText = {
    id: 'centerText',
    beforeDraw: (chart) => {
        const {width, height, ctx} = chart;
        ctx.restore();
        const fontSize = (height / 150).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        const text = `${allowance}`;
        const textX = width / 2;
        const textY = height / 2;

        ctx.fillText(text, textX, textY);
        ctx.save();
    }
  };

  const chartOption = {
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels:{
                font: {size: 14},
                color: '#333',
                padding: 10,
                boxWidth: 12,
            },
        },
    },
    layout: {
        padding: {
            bottom: 20
        },
    },
  };

 const handelSave = () => {
    const planDetails = Object.keys(values).map((label, index)=>({
        categoryNum: index + 1,
        detailMoney: parseInt(values[label].replace(/[^0-9]/g, ''), 10),
    }));
    // const memberNum = sessionStorage.getItem('memberNum');
    const memberNum = 1;
    axios.post('http://localhost:7777/zoomoney/moneyplan/savePlan', {
        memberNum,
        planMoney: allowance,
        planDetails
    })
    .then(response => {
        console.log('Plan saved : ', response.data);
        onSave();
    })
    .catch(error => {
        console.log('error', error);
    });
 };
  return (
    <div className="mock-container">
      <div className="chart-container">
        <Doughnut data={chartData} options={{plugins: {legend: {display: false}}}} plugins={[centerText]} options={chartOption}></Doughnut>
        <button onClick={onSave}>용돈 계획 세우기</button>
      </div>
    </div>
  );
}

export default PlanChart;