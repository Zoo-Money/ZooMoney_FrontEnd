import axios from "axios";
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from "chart.js";
import React, { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import "./css/CardConsumeChart.css";
import { categoryName } from "./resources/patternCommon";
ChartJS.register(ArcElement, Tooltip, Legend, Title);
function PatternChart() {
  const navigate = useNavigate();
  const [groupedData, setGroupedData] = useState({}); // 1주일 단위로 그룹화된 데이터
  const [currentCardNum, setCurrentCardNum] = useState(0); // 현재 보고 있는 주차 인덱스
  const [highestCategory, setHighestCategory] = useState(""); // 가장 많이 소비한 카테고리
  const memberNum = sessionStorage.getItem("member_num");
  const previousHighestCategoryRef = useRef(""); // 이전 카테고리를 추적

  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/card/select", {
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
      // :흰색_확인_표시: NaN 방지를 위해 숫자로 변환 후 합산
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
      labels: categoryName, // labels에 카테고리 이름 설정
      datasets: [
        {
          data: chartData,
          backgroundColor: [
            "#FFCB9A",
            "#C2F1FF",
            "#FFF4C2",
            "#FEC7C0",
            "#CAFFC2",
          ],
          hoverBackgroundColor: [
            "#E6B183",
            "#A6D7E6",
            "#E6DBAB",
            "#E6ADA6",
            "#ACD9A6",
          ],
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
        position: "bottom",
        labels: {
          generateLabels: (chart) => {
            const data = chart.data.datasets[0].data;
            return chart.data.labels.map((label, i) => ({
              text: `${label}: ${data[i].toLocaleString()}원`,
              fillStyle: chart.data.datasets[0].backgroundColor[i],
            }));
          },
          usePointStyle: true,
          boxWidth: 20,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `${tooltipItem.label}: ${tooltipItem.raw.toLocaleString()}원`,
        },
      },
      doughnutlabel: {
        id: "doughnutlabel",
        beforeDraw: (chart) => {
          const { ctx, chartArea } = chart;
          // 차트 중앙에 금액 표시
          ctx.save();
          ctx.font = "bold 24px Arial";
          ctx.fillStyle = "#000";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            `{availableMoney}원`,
            chartArea.width / 2,
            chartArea.height / 2
          );
          ctx.restore();
        },
      },
    },
    responsive: true,
    cutout: "70%",
  };
  return (
    <div className="mock-container">
      <Header title="소비 내역" />
      <div className="patternmain-content">
        <p>
          짜임새 있는 소비 내역을 분석하고,
          <br />
          알뜰한 <span>소비 습관</span>을 길러봐요!
        </p>
        <div className="patternmain-box">
          <div className="patternchart-icon">
            <span>{chartData.weekLabel}</span>
            <IoIosArrowBack
              className="patternchart-back"
              onClick={() => handleChartChange("prev")}
            />
            <IoIosArrowForward
              className="patternchart-forward"
              onClick={() => handleChartChange("next")}
            />
          </div>
          <div className="chart-box">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      <div className="available-money">
        <p>
          사용한 총 용돈은
          <span>{chartData.totalAmount.toLocaleString()}원</span>
        </p>
      </div>
      <div className="highest-category">
        <p>
          <span>{highestCategory}</span>에 가장 많이 사용했어요
        </p>
      </div>
      <button className="patternmain-button" onClick={() => navigate("/main")}>
        메인 페이지
      </button>
      <Footer />
    </div>
  );
}
export default PatternChart;
