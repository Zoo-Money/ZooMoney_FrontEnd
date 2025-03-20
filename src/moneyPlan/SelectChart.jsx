import axios from "axios";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { categoryName } from "../moneyPlan/resource/planCommon.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function SelectChart() {
  const [plansData, setPlansData] = useState({}); //각 plan_num별 데이터 저장
  const [currentPlanNum, setCurrentPlanNum] = useState(0); //현재 보여줄 plan_num
  const [planDate, setPlanDate] = useState([]);
  const memberNum = sessionStorage.getItem("member_num");

  // plan_date를 일주일 단위로 변환
  const formatPlanDate = (dateString) => {
    const formattedStart = dayjs(dateString).format("YYYY-MM-DD");
    const formattedEnd = dayjs(dateString).add(7, "day").format("YYYY-MM-DD");
    return `${formattedStart} ~ ${formattedEnd}`;
  };

  // 데이터 받아오기
  useEffect(() => {
    axios
      .get(`http://localhost:7777/zoomoney/moneyplan/select/${memberNum}`, {
        params: {memberNum},
      })
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => b.plan_num - a.plan_num
        );
        const dateArr = sortedData.map((plan) => plan.plan_date.split("T")[0]);
        setPlanDate(dateArr);
        const plansGroupedByNum = groupByPlanNum(response.data);
        setPlansData(plansGroupedByNum); // plan_num 별로 그룹화된 데이터 저장
      })
      .catch((error) => {
        console.error("데이터 로딩 오류: ", error);
      });
  });

  // plan_num별로 데이터를 그룹화
  const groupByPlanNum = (data) => {
    return data.reduce((acc, plan) => {
      const { plan_num, planDetails } = plan;
      if (!acc[plan_num]) {
        acc[plan_num] = [];
      }
      acc[plan_num].push(...planDetails);
      return acc;
    }, {});
  };

  // 총합을 구하는 로직
  const getTotalAmount = (planDetails) => {
    return planDetails.reduce((sum, item) => sum + item.detail_money, 0);
  };

  // plan_num에 해당하는 차트 데이터 생성
  const getChartData = (planDetails) => {
    // const totalAmount = getTotalAmount(planDetails); //총합계산
    const data = categoryName.map((category, index) => {
      const detail = planDetails.find(
        (item) => item.category_num === index + 1
      );
      return detail ? detail.detail_money : 0;
    });

    return {
      labels: categoryName,
      datasets: [
        {
          data: data,
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
  };

  // 차트 옵션
  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        fullSize: true,
        labels: {
          generateLabels: (chart) => {
            const data = chart.data.datasets[0].data;
            return chart.data.labels.map((label, i) => ({
              text: `${label}: ${data[i].toLocaleString()}원`,
              fillStyle: chart.data.datasets[0].backgroundColor[i],
            }));
          },
          usePointStyle: true,
          boxWidth: 40,
          padding: 20,
          font: {
            size: 12,
          },
        },
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

  // 차트 전환 함수
  const handleChartChange = (direction) => {
    const planKeys = Object.keys(plansData);
    const totalPlans = planKeys.length;

    if (direction === "next") {
      setCurrentPlanNum((prevIndex) => (prevIndex + 1) % totalPlans);
    } else {
      setCurrentPlanNum((prevIndex) =>
        prevIndex === 0 ? totalPlans - 1 : prevIndex - 1
      );
    }
  };

  // 데이터가 없다면 차트가 표시되지 않도록
  if (!Object.keys(plansData).length) {
    return <div>현재 세운 용돈 계획이 없습니다!</div>;
  }

  const currentPlanDetails = plansData[Object.keys(plansData)[currentPlanNum]];
  const totalAmout = getTotalAmount(currentPlanDetails);

  return (
    <>
      <div className="selectchart-icon">
        <span>{formatPlanDate(planDate[currentPlanNum]) || "날짜없음"}</span>
        <IoIosArrowBack
          className="selectchart-back"
          onClick={() => handleChartChange("prev")}
        />
        <IoIosArrowForward
          className="selectchart-forward"
          onClick={() => handleChartChange("next")}
        />
      </div>
      <div className="chart-total-amount">
        <p>
          일주일 용돈 <span>{totalAmout.toLocaleString()}원</span>
        </p>
      </div>
      <div className="selectchart-box">
        <Doughnut
          id="myChart"
          data={getChartData(currentPlanDetails)}
          options={chartOptions}
        />
      </div>
    </>
  );
}

export default SelectChart;
