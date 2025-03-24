import axios from "axios";
import { API_PATH } from "../common/config.js";
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from "chart.js";
import React, { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Header from "../common/Header";
import {
  categoryColor,
  categoryHoverColor,
  categoryName,
} from "../moneyPlan/resource/planCommon.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function PatternChart() {
  const [groupedData, setGroupedData] = useState({}); // 1주일 단위로 그룹화된 데이터
  const [currentCardNum, setCurrentCardNum] = useState(0); // 현재 보고 있는 주차 인덱스
  const [highestCategory, setHighestCategory] = useState(""); // 가장 많이 소비한 카테고리
  const childNum = sessionStorage.getItem("childNum");
  const previousHighestCategoryRef = useRef(""); // 이전 카테고리를 추적

  //카드 내역 가져오기
  useEffect(() => {
    axios
      .get(`${API_PATH}/zoomoney/card/select`, {
        params: { member_num: childNum },
      })
      .then((response) => {
        if (!Array.isArray(response.data) || response.data.length === 0) {
          return;
        }
        const filteredData = response.data.filter(
          (item) => item.usehistType?.trim() === "출금"
        );
        if (filteredData.length === 0) {
          return;
        }
        const groupedData = groupDataByWeek(filteredData);
        if (!groupedData) {
          return;
        }
        setGroupedData(groupedData);
      })
      .catch((error) => {});
  }, [childNum]); // childNum이 변경될 때만 실행

  const groupDataByWeek = (data) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.usehistDate);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // 해당 주의 시작
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // 해당 주의 종료

      // 날짜 문자열 형식: YYYY-MM-D
      const weekKey = `${weekStart.toISOString().split("T")[0]} ~ ${
        weekEnd.toISOString().split("T")[0]
      }`;

      // 날짜 범위가 이미 존재하는지 확인하여 겹치지 않게 처리
      if (!acc[weekKey]) {
        acc[weekKey] = { totalAmount: 0, transactions: [] };
      }

      // NaN 방지를 위해 숫자로 변환 후 합산
      const money = Number(item.usehistMoney) || 0;
      acc[weekKey].totalAmount += money;
      acc[weekKey].transactions.push(item);

      return acc;
    }, {});
  };

  // 카테고리별 금액 합산 함수
  const groupDataByCategory = (weekData) => {
    const categorizedData = categoryName.reduce((acc, category) => {
      acc[category] = 0; // 각 카테고리의 초기 금액을 0으로 설정
      return acc;
    }, {});

    weekData.transactions.forEach((item) => {
      const category = item.category?.categoryName?.trim() || "기타"; // category 객체에서 categoryName을 가져오고 없으면 "기타"로 처리
      const money = Number(item.usehistMoney) || 0; // 금액 값 가져오기

      // 카테고리가 존재하고, categoryName 배열에 포함되면 해당 카테고리에 금액을 추가
      if (categoryName.includes(category)) {
        categorizedData[category] += money;
      }
    });

    // 가장 많이 소비한 카테고리
    const highestCategory = Object.keys(categorizedData).reduce(
      (max, category) => {
        return categorizedData[category] > categorizedData[max]
          ? category
          : max;
      }
    );

    // 상태가 변했을 때만 업데이트
    if (highestCategory !== previousHighestCategoryRef.current) {
      setHighestCategory(highestCategory);
      previousHighestCategoryRef.current = highestCategory; // 가장 최근의 값을 저장
    }

    return categorizedData;
  };

  // 차트 변경 함수
  const handleChartChange = (direction) => {
    const patternsKeys = Object.keys(groupedData);
    const totalWeeks = patternsKeys.length;

    if (totalWeeks === 0) return;
    if (direction === "next") {
      setCurrentCardNum((prevIndex) => (prevIndex + 1) % totalWeeks);
    } else {
      setCurrentCardNum((prevIndex) =>
        prevIndex === 0 ? totalWeeks - 1 : prevIndex - 1
      );
    }
  };

  // 현재 주차 데이터 가져오기
  const getCurrentChartData = () => {
    const weeks = Object.keys(groupedData);
    if (weeks.length === 0) {
      return null; // 데이터가 없을 경우 null을 반환
    }
    const selectedWeek = weeks[currentCardNum]; // 현재 선택된 주차
    const dataForWeek = groupedData[selectedWeek] || {};

    // 카테고리별 금액 데이터 그룹화
    const categorizedData = groupDataByCategory(dataForWeek);
    const chartData = categoryName.map((category) => categorizedData[category]);
    return {
      labels: categoryName,
      datasets: [
        {
          data: chartData,
          backgroundColor: categoryColor,
          hoverBackgroundColor: categoryHoverColor,
        },
      ],
      weekLabel: selectedWeek,
      totalAmount: dataForWeek.totalAmount, // 총 금액을 추가
    };
  };

  const chartData = getCurrentChartData();

  if (!chartData) {
    return <div>소비 내역이 없습니다!</div>;
  }

  //차트 옵션
  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `${tooltipItem.label}: ${tooltipItem.raw.toLocaleString()}원`,
        },
      },
    },
  };

  return (
    <div className="mock-container">
      <Header title="자녀 소비 내역" />
      <div className="parent-planmain-content">
        <div className="parent-planmain-description">
          <p>
            우리 아이의 일주일 소비 내역!
            <br />
            좋은 <span>소비 습관</span>을 위해 조언해 주세요
          </p>
        </div>
        <div className="parent-planmain-box">
          <div className="parent-planmain-chart-box">
            <div className="selectchart-icon">
              <span>{chartData.weekLabel}</span>
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
              사용한 총 용돈은{" "}
              <span>{chartData?.totalAmount?.toLocaleString()}원</span>
              <br />
              <span>{highestCategory}</span>에 가장 많이 사용했어요
            </div>
            <div className="selectchart-box">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
            <div className="select-chart-legend">
              {chartData?.datasets[0]?.data?.map((amount, index) => (
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
                    <p>
                      {chartData?.totalAmount > 0
                        ? Math.floor((amount / chartData.totalAmount) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="box-amount">
                    <p>{amount.toLocaleString()}원</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatternChart;
