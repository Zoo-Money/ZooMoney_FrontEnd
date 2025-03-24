import axios from "axios";
import { API_PATH } from "../common/config.js";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React, { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  categoryColor,
  categoryHoverColor,
  categoryName,
} from "../moneyPlan/resource/planCommon.js";
import "../moneyPlan/css/selectChart.css";
ChartJS.register(ArcElement, Tooltip, Legend);
dayjs.extend(utc);
dayjs.extend(timezone);

function SelectChart() {
  const [plansData, setPlansData] = useState({}); //각 plan_num별 데이터 저장
  const [currentPlanNum, setCurrentPlanNum] = useState(0); //현재 보여줄 plan_num
  const [planDate, setPlanDate] = useState([]); //날짜짜
  const [legendData, setLegendData] = useState([]); //범례
  const [money, setMoney] = useState({});
  const chartInstanceRef = useRef(null); // 차트 인스턴스 저장
  const memberNum = sessionStorage.getItem("member_num");

  // plan_date를 일주일 단위로 변환
  const formatPlanDate = (dateString) => {
    // 1. DB에서 UTC로 저장된 날짜를 가져옴
    const formattedStart = dayjs
      .utc(dateString)
      .tz("Asia/Seoul", true)
      .startOf("day")
      .format("YYYY-MM-DD");

    // 2. 시작 날짜를 기준으로 6일을 더해 종료 날짜 계산
    const formattedEnd = dayjs
      .utc(dateString)
      .tz("Asia/Seoul", true)
      .add(6, "days")
      .startOf("day")
      .format("YYYY-MM-DD");

    return `${formattedStart} ~ ${formattedEnd}`;
  };

  // plan_num 별로 그룹화된 데이터 저장
  useEffect(() => {
    axios
      .get(`${API_PATH}/zoomoney/moneyplan/select/${memberNum}`, {
        params: { memberNum },
      })
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => b.plan_num - a.plan_num
        );

        const dateArr = sortedData.map((plan) => plan.plan_date.split("T")[0]);
        setPlanDate(dateArr);

        // 각 plan_num별 plan_money 값을 배열로 저장
        const moneyArr = sortedData.map((plan) => plan.plan_money);
        setMoney(moneyArr);

        const plansGroupedByNum = groupByPlanNum(response.data);
        setPlansData(plansGroupedByNum);
      })
      .catch((error) => {
        console.error("데이터 로딩 오류: ", error);
      });
  },[]);

  //카테고리별 세부 금액
  useEffect(() => {
    const currentPlanDetails =
      plansData[Object.keys(plansData)[currentPlanNum]] || [];
    const data = categoryName.map((category, index) => {
      const detail = currentPlanDetails.find(
        (item) => item.category_num === index + 1
      );
      return detail ? detail.detail_money : 0;
    });
    setLegendData(data); // legendData 업데이트
  }, [currentPlanNum, plansData]);

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

  // 입력 값 총합
  const getTotalAmount = (planDetails) => {
    return planDetails.reduce((sum, item) => sum + item.detail_money, 0);
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
          backgroundColor: categoryColor,
          hoverBackgroundColor: categoryHoverColor,
        },
      ],
    };
  };

  //차트 옵션
  const chartOptions = {
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
    responsive: true,
    maintainAspectRatio: false, // 비율 고정 해제
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

    setTimeout(() => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.resize();
      }
    }, 100); // 리사이징 강제 적용
  };

  // 데이터가 없다면 차트가 표시되지 않도록
  if (!Object.keys(plansData).length) {
    return <div>현재 세운 용돈 계획이 없습니다!</div>;
  }

  const currentPlanDetails = plansData[Object.keys(plansData)[currentPlanNum]];
  const totalAmout = getTotalAmount(currentPlanDetails);
  const currentPlanMoney = money[currentPlanNum];

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
          일주일 용돈{" "}
          <span>
            {currentPlanMoney ? currentPlanMoney.toLocaleString() : 0}원
          </span>
        </p>
      </div>
      <div className="selectchart-box">
        <Doughnut
          ref={(chart) => (chartInstanceRef.current = chart)}
          id="myChart"
          data={getChartData(currentPlanDetails)}
          options={chartOptions}
        />
      </div>
      <div className="select-chart-legend">
        {legendData.map((amount, index) => (
          <div className="select-box-list" key={index}>
            <div className="name-box">
              <div
                className="select-eat"
                style={{
                  backgroundColor: categoryColor[index],
                  borderRadius: "50%",
                  width: "15px",
                  height: "15px",
                }}
              ></div>
              <p>{categoryName[index]}</p>
            </div>
            <div className="percent">
              <p>{Math.floor((amount / totalAmout) * 100)}%</p>
            </div>
            <div className="box-amount">
              <p>{amount.toLocaleString()}원</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default SelectChart;
