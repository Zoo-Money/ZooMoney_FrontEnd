import { Chart, registerables } from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import CompanyInfo from "./CompanyInfo";
import "./css/StockDetail.css";
import StockNews from "./StockNews";

Chart.register(...registerables);
const StockDetail = () => {
  const { stockId, stockName } = useParams();
  const [tr_key] = useState(stockId);

  const [activeTab, setActiveTab] = useState("company");
  const [latestPrice, setLatestPrice] = useState(null);

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/stock/stockBuy", { state: { latestPrice } });
  };

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "실시간 체결가",
        data: [],
        borderColor: "rgb(255, 40, 40)",
        fill: false,
      },
    ],
  });
  useEffect(() => {
    const ws = new WebSocket(`ws://192.168.0.104:7777/zoomoney/ws/stocks`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", symbol: tr_key }));
    };
    ws.onmessage = (event) => {
      const text = event.data;

      // 응답 데이터 파싱
      const parts = text.split("|");
      if (parts.length > 3) {
        const stockInfo = parts[3].split("^");
        if (stockInfo.length > 3) {
          const currentPrice = parseFloat(stockInfo[2]); // 현재가
          const time = stockInfo[1]; // 체결 시간
          const timeString = String(time); // time 값을 문자열로 변환

          // 데이터 추가 (최대 50개로 제한)
          setChartData((prevData) => {
            const newLabels = [...prevData.labels, timeString]; // 시간
            const newData = [...prevData.datasets[0].data, currentPrice]; // 가격
            return {
              labels: newLabels,
              datasets: [
                {
                  label: "체결가",
                  data: newData,
                  borderColor: "rgb(255, 40, 40)",
                  fill: false,
                },
              ],
            };
          }, setLatestPrice(currentPrice));
        }
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket 에러 발생:", error);
    };

    return () => {
      ws.close();
    };
  }, [tr_key]);
  return (
    <div className="mock-container">
      <Header title="모의 투자 종목" />

      <div className="StockDetail-info">
        {stockName}의 현재 가격은 <br />
        {latestPrice}원 이에요
      </div>

      <div style={{ margin: "5%" }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  display: false,
                },
              },
              y: {
                grid: {
                  display: false,
                },
                ticks: {
                  display: false,
                },
              },
            },
            elements: {
              point: {
                radius: 0,
              },
            },
          }}
        />
      </div>

      <div className="tabOption-container">
        <button
          className={`Detailtab-button ${
            activeTab === "company" ? "active" : ""
          }`}
          onClick={() => setActiveTab("company")}
        >
          회사정보
        </button>
        <button
          className={`Detailtab-button ${activeTab === "news" ? "active" : ""}`}
          onClick={() => setActiveTab("news")}
        >
          뉴스
        </button>
      </div>

      <div className="DetailOption-content">
        {activeTab === "company" ? <CompanyInfo /> : <StockNews />}
      </div>
      {activeTab === "company" && (
        <div>
          <button className="goToBuy-button" onClick={handleButtonClick}>
            사러가기
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
};
export default StockDetail;
