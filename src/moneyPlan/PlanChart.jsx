import axios from "axios";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../common/Header";
import deer03 from "../images/deer/deer03.png";
import "../moneyPlan/css/planChart.css";
import { categoryColor, categoryHoverColor, categoryName } from "../moneyPlan/resource/planCommon.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function PlanChart(props) {
  const location = useLocation();
  const planMoney = location.state?.planMoney || 0;
  const category = location.state?.category || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const navi = useNavigate();
  const data = {
    labels: categoryName,
    datasets: [
      {
        data: Object.values(category).map((value) => Number(value) || 0),
        backgroundColor: categoryColor,
        hoverBackgroundColor: categoryHoverColor,
      },
    ],
  };

  //DB저장 함수
  const handleSavePlan = () => {
    const requestData = {
      planMoney: planMoney,
      categoryAmounts: category,
    };
    const memberNum = sessionStorage.getItem("member_num");
    axios
      .post(`http://localhost:7777/zoomoney/moneyplan/save/${memberNum}`, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        navi("/moneyPlan/complete");
      })
      .catch((error) => {
        console.error("저장오류: ", error);
        toast.error("저장 중 오류가 발생했습니다.");
      });
  };

  //차트 스타일
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            let value = tooltipItem.raw || 0;
            return `${tooltipItem.label}: ${value.toLocaleString()}원`;
          },
        },
      },
    },
  };

  return (
    <div className="mock-container">
      <Header title="용돈 계획 세우기" />
      <img src={deer03} alt="deer03" className="chart-deer03" />
      <div className="planchart-box">
        <div className="plan-chart-content">
          <p>
            일주일 동안 <span>{planMoney.toLocaleString()}원</span>을
            <br />
            아래와 같이 쓰기로 계획했어요.
          </p>
        </div>
        <div className="plan-confirm-chart">
          <Doughnut data={data} options={options} />
        </div>
        <div className="select-chart-legend">
          {Object.keys(category).map((key) => {
            const amount = category[key];
            return (
              <div className="select-box-list" key={key}>
                <div className="name-box">
                  <div
                    className="select-eat"
                    style={{
                      backgroundColor: categoryColor[key - 1],
                      borderRadius: "50%",
                      width: "15px",
                      height: "15px",
                    }}
                  ></div>
                  <p>{categoryName[key -1]}</p>
                </div>
                <div className="percent">
                  <p>{Math.floor((amount / planMoney) * 100)}%</p>
                </div>
                <div className="box-amount">
                  <p>{(amount || 0).toLocaleString()}원</p>
                </div>
              </div>
            );
          })}
              </div>
      </div>
      <button className="planmain-button" onClick={handleSavePlan}>
        다음
      </button>
    </div>
  );
}

export default PlanChart;
