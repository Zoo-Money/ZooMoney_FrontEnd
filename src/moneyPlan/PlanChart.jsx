import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import "./moneyPlan.css";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from 'chart.js';
import axios from 'axios';
import {categoryName} from "./planCommon.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function PlanChart(props) {
    const location = useLocation();
    const planMoney = location.state?.planMoney || 0;
    const category = location.state?.category || {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    const navi = useNavigate();
    const data = {
      labels: categoryName,
      datasets: [
        {
          data: Object.values(category).map((value) => Number(value) || 0),
          backgroundColor: [
            "#ffcb9a",
            "#c2f1ff",
            "#fff4c2",
            "#fec7c0",
            "#caffc2",
          ],
          hoverBackgroundColor: [
            "#e6b183",
            "#a6d7e6",
            "#e6dbab",
            "#e6ada6",
            "#acd9a6",
          ],
        },
      ],
    };

    //DB저장 함수
    const handleSavePlan = () => {
        const requestData = {
            planMoney: planMoney,
            categoryAmounts: category,
        };
        axios.post("http://localhost:7777/zoomoney/moneyplan/save", requestData, {
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then((response) => {
            alert("계획이 저장되었습니다.");
            navi("/moneyPlan/complete");
        })
        .catch((error)=>{
            console.error("저장오류: ", error);
            alert("저장 중 오류가 발생했습니다.");
        });
    };
    //차트 스타일
    const options = {
        responsive: true,
        plugins: {
            legend: {
            position: "bottom",
                labels: {
                    boxWidth: 20,
                    padding: 20,
                    usePointStyle: true,
                    generateLabels: (chart) => {
                        const data = chart.data;
                        return data.labels.map((label, i) => {
                            const value = data.datasets[0].data[i];
                            return {
                                text: `${label}: ${value.toLocaleString()} 원 `,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                index: i,
                            };
                        });
                    }, 
                },
                onClick: (e, legendItem, legend) => {
                    // 범례 클릭 시 데이터 숨기기 기능을 비활성화
                },
            },
        },
    };

    return (
      <div className="mock-container">
        <Header title="용돈 계획 세우기"></Header>
        <div className="planwrite-content">
          <p>
            일주일 동안 <span>{planMoney}원</span>을
            <br />
            아래와 같이 쓰기로 계획했어요.
          </p>
        </div>
        <div className="planchart-box">
          <Doughnut data={data} options={options}></Doughnut>
        </div>
        <button className="planmain-button" onClick={handleSavePlan}>
          용돈 계획 세우기
        </button>
        <Footer></Footer>
      </div>
    );
}

export default PlanChart;