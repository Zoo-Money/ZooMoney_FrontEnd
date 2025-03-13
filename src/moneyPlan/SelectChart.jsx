import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import axios from "axios";
import { categoryName } from "./planCommon";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

ChartJS.register(ArcElement, Tooltip, Legend);

function SelectChart() {
  const [plansData, setPlansData] = useState({}); // 각 plan_num별 데이터 저장
  const [currentPlanNum, setCurrentPlanNum] = useState(0); // 현재 보여줄 plan_num

  // plan_date를 형식에 맞게 변환하는 함수
  const formatPlanDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth()+1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    // const formattedStart = (dateString).format("YYYY-MM-DD");
    // const formattedEnd = (dateString).add(7, "day").format("YYYY-MM-DD");
    // return `${formattedStart} ~ ${formattedEnd}`;
  };

  // 데이터 받아오기
  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/moneyplan/select") // 여러 개의 계획 데이터 요청
      .then((response) => {
        
        response.data.forEach((plan)=>{
            console.log(plan.plan_date);
        });

        // const transformedData = response.data.map((plan) => ({
        //   ...plan,
        //   formattedPlanDate: formatPlanDate(plan.plan_date),
        // }));
        const plansGroupedByNum = groupByPlanNum(response.data);
        setPlansData(plansGroupedByNum); // plan_num 별로 그룹화된 데이터 저장
      })
      .catch((error) => {
        console.error("데이터 로딩 오류: ", error);
      });
  }, []);

  // plan_num별로 데이터를 그룹화
  const groupByPlanNum = (data) => {
    return data.reduce((acc, plan) => {
        const dateFormatted = formatPlanDate(plan.plan_date);
      const { plan_num, planDetails } = plan;
      if (!acc[plan_num]) {
        acc[plan_num] = [];
      }
      acc[plan_num].push(...planDetails);
      return acc;
    }, {});
  };

  // plan_num에 해당하는 차트 데이터 생성
  const getChartData = (planDetails) => {
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
        position: "bottom", // 범례를 아래 배치
        labels: {
          generateLabels: (chart) => {
            const data = chart.data.datasets[0].data;
            return chart.data.labels.map((label, i) => ({
              text: `${label}: ${data[i].toLocaleString()}원`, // 범례에 가격 추가
              fillStyle: chart.data.datasets[0].backgroundColor[i], // 색상 유지
            }));
          },
          usePointStyle: true,
          boxWidth: 20,
          padding: 15,
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
      layout: {
        padding: {
          bottom: 50,
        },
      },
    },
  };

  // 차트 전환
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

  return (
    <>
      <div className="selectchart-icon">
        <IoIosArrowBack
          className="selectchart-back"
          onClick={() => handleChartChange("prev")}
        />
        <p></p>
        <IoIosArrowForward
          className="selectchart-forward"
          onClick={() => handleChartChange("next")}
        />
      </div>
      <div className="selectchart-box">
        <Doughnut
          data={getChartData(currentPlanDetails)}
          options={chartOptions}
        />
      </div>
    </>
  );
}

export default SelectChart;
