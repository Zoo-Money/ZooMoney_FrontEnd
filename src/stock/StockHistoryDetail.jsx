import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../common/Header";
import rabbit05 from "../images/rabbit/rabbit05.png";
import "./css/stockHistoryDetail.css";
import axios from "axios";

function StockHistoryDetail(props) {
  const location = useLocation();
  const { item } = location.state || {};

  const [history, setHistory] = useState([]);
  const memberNum = sessionStorage.getItem("member_num");

  useEffect(() => {
    axios
      .get(`http://localhost:7777/zoomoney/stock/history/list/${memberNum}`, {
        params: { memberNum },
      })
      .then((response) => {
        setHistory(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  return (
    <div className="mock-container">
      <Header title="나의 투자 내역" />
      <div className="history-detail-container">
        <div className="history-detail-box">
          <img src={rabbit05} alt="rabbit05" />
          <p>
            지난 시즌 나의 등수는
            <br />
            <span>{item.result_rank}등</span> 이에요.
          </p>
        </div>

        <div className="history-detail-list-box">
          {history &&
            history.map((item, index) => (
              <div className="history-detail-list" key={index}>
                <span className="history-detail-list-title">
                  {item.stock_name}
                </span>
                <span className="history-detail-list-date">
                  {new Date(item.stockhist_date).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false, // 24시간 형식
                  })}
                </span>
                <span className="history-detail-list-count">
                  {item.stockhist_amount}주
                </span>
                <span className={`history-detail-list-price ${item.stockhist_type === "1" ? "buy" : "sell"}`}>
                  {item.stockhist_price.toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default StockHistoryDetail;
