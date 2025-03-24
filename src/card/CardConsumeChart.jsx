import axios from "axios";
import { API_PATH } from "../common/config.js";
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from "chart.js";
import React, { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Header from "../common/Header";
// css -> moneyplan 의 planMain.css, selectChart.css 사용
import { useNavigate } from "react-router-dom";
import deer01 from "../images/deer/deer01.png";
import {
  categoryColor,
  categoryHoverColor,
  categoryName,
} from "../moneyPlan/resource/planCommon";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function PatternChart() {
  const [groupedData, setGroupedData] = useState({}); // 1주일 단위로 그룹화된 데이터
  const [currentCardNum, setCurrentCardNum] = useState(0); // 현재 보고 있는 주차 인덱스
  const [highestCategory, setHighestCategory] = useState(""); // 가장 많이 소비한 카테고리
  const memberNum = sessionStorage.getItem("member_num");
  const previousHighestCategoryRef = useRef(""); // 이전 카테고리를 추적
  const navi = useNavigate();
  const goToMain = () => {
    navi("/main");
  };

  useEffect(() => {
    axios
      .get(`${API_PATH}/zoomoney/card/select`, {
        params: { member_num: memberNum },
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
  }, [memberNum]); // memberNum이 변경될 때만 실행

  const groupDataByWeek = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const date = new Date(item.usehistDate);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // 해당 주의 시작
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // 해당 주의 종료
      // 날짜 문자열 형식: YYYY-MM-D
      const weekKey = `${weekStart.toISOString().split("T")[0]} ~ ${
        weekEnd.toISOString().split("T")[0]
      }`;

      if (!acc[weekKey]) {
        acc[weekKey] = { totalAmount: 0, transactions: [] };
      }
      const money = Number(item.usehistMoney) || 0;
      acc[weekKey].totalAmount += money;
      acc[weekKey].transactions.push(item);
      return acc;
    }, {});

    // 날짜를 내림차순으로 정렬하여 반환
    const sortedGroupedData = Object.keys(groupedData)
      .sort((a, b) => new Date(b.split(" ~ ")[0]) - new Date(a.split(" ~ ")[0])) // 주 시작 날짜 기준 내림차순
      .reduce((acc, key) => {
        acc[key] = groupedData[key];
        return acc;
      }, {});
    return sortedGroupedData; // 내림차순 정렬된 데이터를 반환
  };

  // 카테고리별 금액 합산 함수
  const groupDataByCategory = (weekData) => {
    const categorizedData = categoryName.reduce((acc, category) => {
      acc[category] = 0; // 각 카테고리의 초기 금액을 0으로 설정
      return acc;
    }, {});
    weekData.transactions.forEach((item) => {
      const category = item.category?.categoryName?.trim() || "기타";
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
  if (!chartData) return null;
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
  };
  return (
    <div className="mock-container">
      <Header title="소비 내역" />
      <div className="planmain-content">
        <div className="planmain-description">
          <p>
            한 눈에 보는 내 <span>소비 패턴</span>!
            <br />
            똑똑한 소비 습관을 길러보아요
          </p>
          <img src={deer01} alt="deer01" className="planmain-deer" />
        </div>
        <div className="planmain-box">
          <div className="planmain-chart-box">
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
              <span>{chartData.totalAmount.toLocaleString()}원</span>
              <br />
              <span>{highestCategory}</span>에 가장 많이 사용했어요
            </div>
            <div className="selectchart-box">
              <Doughnut id="myChart2" data={chartData} options={chartOptions} />
            </div>
            <div className="select-chart-legend">
              {chartData?.datasets[0]?.data?.map((amount, index) => (
                <div className="select-box-list" key={index}>
                  <div className="name-box">
                    <div
                      className="pattern-index"
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
      <button className="planmain-button" onClick={goToMain}>
        메인
      </button>
    </div>
  );
}
export default PatternChart;
