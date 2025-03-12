import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJs, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';

ChartJs.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

function PlanChart({ values, allowance, formatCurrency, onSave}) {
   
  //Pie 차트에 사용될 데이터 생성성
  const chartData = {
    labels: Object.keys(values),
    datasets: [
      {
        data: Object.values(values).map((val) =>
          parseInt(val.replace(/[^0-9]/g, ""), 10)
        ),
        backgroundColor: [
          "#ffcb9a",
          "#c2f1ff",
          "#fff4c2",
          "#fec7c0",
          "#caffc2",
        ],
        borderWidth: 1,
        hoverOffset: 4,
        hoverBackgroundColor: [
          "#ffcb9a",
          "#c2f1ff",
          "#fff4c2",
          "#fec7c0",
          "#caffc2",
        ],
      },
    ],
  };
const total = Object.values(values).reduce(
  (acc, val) => acc + parseInt(val.replace(/[^0-9]/g, ""), 10),
  0
);
  const centerText = {
    id: 'centerText',
    beforeDraw: (chart) => {
        const {width, height, ctx} = chart;
        ctx.restore();
        const fontSize = (height / 150).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        const text = formatCurrency(allowance);
        const textX = width / 2;
        const textY = height / 2;

        ctx.fillText(text, textX, textY);
        ctx.save();
    }
  };

  //범례 스타일링
  const chartOption = {
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels:{
                font: {size: 12},
                color: '#333',
                padding: 10,
                boxWidth: 12,
                generateLabels: (chart) => {
                  const labels = chart.data.labels || [];
                  const datasets = chart.data.datasets || [];
                  return labels.map((label, i)=>{
                    const dataset = datasets[0];
                    const value = dataset.data[i];
                    const percentage = ((value / total) * 100).toFixed(2);
                    const amount = formatCurrency(value);
                    return{
                      text: `${label} - ${percentage}% (${amount})`,
                      fillStyle: dataset.backgroundColor[i],
                      strokeStyle: dataset.borderColor[i],
                      lineWidth: 2,
                    };
                  });
                },
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
        <Pie
          data={chartData}
          options={{ plugins: { legend: { display: false } } }}
          plugins={[centerText]}
          options={chartOption}
        ></Pie>
      </div>
      <button onClick={onSave}>용돈 계획 세우기</button>
    </div>
  );
}

export default PlanChart;