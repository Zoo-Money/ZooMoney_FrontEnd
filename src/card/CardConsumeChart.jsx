import React, { useEffect, useState, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend, Tooltip, Title } from "chart.js";
import axios from "axios";
import { categoryName } from "./patternCommon";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import dayjs from "dayjs";
import Header from "../common/Header";
import Footer from "../common/Footer";
import "./CardConsumeChart.css";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// 날짜를 1주일 단위로 나누는 함수
const getWeekRange = (date) => {
  const startOfWeek = dayjs(date).startOf("week");
  const endOfWeek = startOfWeek.add(6, "day");
  return `${startOfWeek.format("YYYY-MM-DD")} ~ ${endOfWeek.format(
    "YYYY-MM-DD"
  )}`;
};

function PatternChart() {
  const [historyList, setHistoryList] = useState([]); // 소비 내역 원본
  const [groupedData, setGroupedData] = useState({}); // 1주일 단위로 그룹화된 데이터
  const [currentCardNum, setCurrentCardNum] = useState(0); // 현재 보고 있는 주차 인덱스
  const [highestCategory, setHighestCategory] = useState(""); // 가장 많이 소비한 카테고리
  const memberNum = sessionStorage.getItem("member_num");

  const previousHighestCategoryRef = useRef(""); // useRef로 이전 카테고리를 추적

  const availableMoney = sessionStorage.getItem("card_money") || 0; // 세션에서 사용 가능한 금액 가져오기

  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/card/select", {
        params: { period: "all" },
        headers: { member_num: memberNum },
      })
      .then((response) => {
        console.log("🔍 백엔드에서 받은 원본 데이터:", response.data);

        if (!Array.isArray(response.data) || response.data.length === 0) {
          console.log("❌ 소비 내역이 없습니다. 데이터가 비어 있음");
          return;
        }

        const filteredData = response.data.filter(
          (item) => item.usehistType?.trim() === "출금"
        );

        console.log("🔹 출금 내역만 필터링한 결과:", filteredData);

        if (filteredData.length === 0) {
          console.log("⚠️ 출금 데이터가 없습니다.");
          return;
        }

        const groupedData = groupDataByWeek(filteredData);
        console.log("📊 1주일 단위 그룹화된 데이터:", groupedData);

        if (!groupedData) {
          console.log("🚨 그룹화된 데이터가 undefined입니다!");
          return;
        }

        setGroupedData(groupedData);
        console.log("✅ setGroupedData 실행됨", groupedData); // groupedData 상태 확인
      })
      .catch((error) => {
        console.error("🚨 데이터 요청 오류:", error);
      });
  }, [memberNum]); // memberNum이 변경될 때만 실행

  const groupDataByWeek = (data) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.usehistDate);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // 해당 주의 시작 (일요일)
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // 해당 주의 종료 (토요일)

      // 날짜 문자열 형식: 2025-01-05 ~ 2025-01-11
      const weekKey = `${weekStart.toISOString().split("T")[0]} ~ ${
        weekEnd.toISOString().split("T")[0]
      }`;

      // 날짜 범위가 이미 존재하는지 확인하여 겹치지 않게 처리
      if (!acc[weekKey]) {
        acc[weekKey] = { totalAmount: 0, transactions: [] };
      }

      // ✅ NaN 방지를 위해 숫자로 변환 후 합산
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

      console.log("아이템 카테고리:", category); // 카테고리 확인
      console.log("아이템 금액:", money); // 금액 확인

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

    console.log(
      "카테고리별 합산된 금액:",
      JSON.stringify(categorizedData, null, 2)
    );
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
      console.log("⚠️ 그룹화된 데이터가 없습니다.");
      return null; // 데이터가 없을 경우 null을 반환
    }

    const selectedWeek = weeks[currentCardNum]; // 현재 선택된 주차
    const dataForWeek = groupedData[selectedWeek] || {};

    console.log("📊 현재 주차 데이터:", dataForWeek);

    // 카테고리별 금액 데이터 그룹화
    const categorizedData = groupDataByCategory(dataForWeek);

    const chartData = categoryName.map((category) => categorizedData[category]);

    console.log("카테고리별 합산된 금액:", categorizedData);

    return {
      labels: categoryName, // labels에 카테고리 이름 설정
      datasets: [
        {
          data: chartData,
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
      weekLabel: selectedWeek,
      totalAmount: dataForWeek.totalAmount, // 총 금액을 추가
    };
  };

  const chartData = getCurrentChartData();

  if (!chartData) {
    return <div>소비 내역이 없습니다!</div>;
  }

  const chartOptions = {
    plugins: {
      legend: { position: "bottom" },
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
          const { totalAmount } = chart.config.data;

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
      <div className="planmain-content">
        <div className="planmain-description">
          <p>
            짜임새 있는 소비 내역을 분석하고,
            <br />
            알뜰한 <span>소비 습관</span>을 길러봐요!
          </p>
        </div>
        <div className="patternmain-box">
          <div className="patternmain-chart-box">
            <div className="patternchart-box">
              <button
                className="patternchart-back"
                onClick={() => handleChartChange("prev")}
              >
                <IoIosArrowBack />
              </button>

              <div>
                <h2>{chartData.weekLabel}</h2>
                <Doughnut data={chartData} options={chartOptions} />
              </div>

              <button
                className="patternchart-forward"
                onClick={() => handleChartChange("next")}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
        <div className="available-money">
          <p>사용 가능한 금액: {availableMoney}원</p>
        </div>
        <div className="highest-category">
          <p>가장 많이 소비한 카테고리: {highestCategory}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PatternChart;
