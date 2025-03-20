import axios from "axios";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import rabbit07 from "../images/rabbit/rabbit07.png";
import "./css/stockHistory.css";
import Footer from "../common/Footer";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function StockHistory(props) {
  const navi = useNavigate();
  const [ranking, setRanking] = useState([]);
  const memberNum = sessionStorage.getItem("member_num");
  //디테일 값 가지고 페이지 넘어가기
  const goHistoryDetail = (item) => {
    navi("/stock/stockHistoryDetail", { state: { item } });
  };
  const goStockMain = () => {
    navi("/stock/main");
  };

  //시즌별 결과 받아오기기
  useEffect(() => {
    axios
      .get(`http://localhost:7777/zoomoney/stock/result/list/${memberNum}`, {
        params: { memberNum },
      })
      .then((responseData) => {
        setRanking(responseData.data);
      })
      .catch((err) => {
        console.error(err);
      });
  },[]);

  //일주일 뒤 날짜 폼
  const afterOneWeek = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 6);
    return d.toISOString().split("T")[0].replace(/-/g, ".");
  };

  const labels = ranking.map((item) => {
    const date = new Date(item.result_date);
    return date.toISOString().split("T")[0].replace(/-/g, ".");
  });
  const resultRate = ranking.map((item) => item.result_rate);

  //차트데이터
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "수익률",
        data: resultRate,
        borderColor: "red",
        borderWidth: 2,
        pointBackgroundColor: ["red", "red"],
        pointRadius: 5,
        pointStyle: "circle",
        fill: false,
      },
    ],
  };

  //차트스타일
  const options = {
    responsive: true,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 4,
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            return "수익률 " + tooltipItem.raw + "%";
          },
        },
      },
    },
    layout: {
      padding: {
        bottom: 30,
      },
    },
  };

  return (
    <div className="mock-container">
      <Header title="나의 랭킹 히스토리"></Header>
      <div className="history-box">
        <p>
          내가 참여한 모든 시즌들의
          <br />
          나의 <span>랭킹</span>을 모아놨어요
          <br />
          내가 얼마나 <span>성장</span>했는지
          <br />
          확인할 수 있어요.
        </p>
        <img className="rabbit07" src={rabbit07} alt="rabbit07" />
      </div>
      <div className="history-detail-chart">
        <Line data={chartData} options={options}></Line>
      </div>
      <div className="history-list-box">
        {ranking &&
          ranking.map((item, index) => (
            <div className="history-list" key={index} onClick={() => goHistoryDetail(item)}>
              <span className="history-list-title">시즌{index + 1}</span>
              <span className="history-list-date">
                {new Date(item.result_date).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
                ~ {afterOneWeek(item.result_date)}
              </span>
              <span className="history-list-rank">{item.result_rank}위</span>
              <IoIosArrowForward className="forwardIcon" />
            </div>
          ))}
      </div>
      <button className="history-button" onClick={goStockMain}>
        모의 투자 하러 가기
      </button>
      <Footer />
    </div>
  );
}

export default StockHistory;
