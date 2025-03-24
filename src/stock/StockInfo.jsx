import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_PATH } from "../common/config.js";
import Header from "../common/Header";
import "./css/StockInfo.css";

function StockInfo() {
  const [stockInfoList, setStockInfoList] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_PATH}/zoomoney/stock/StockInfoAll`)
      .then((response) => {
        setStockInfoList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock info:", error);
      });
  }, []);

  return (
    <div className="mock-container">
      <Header title="주식에 대해 궁금해요" />
      <div className="faqInfo">
        <div className="faqDetail">
          {stockInfoList.map((item) => {
            return (
              <div className="faq-InfoTitle">
                <Link
                  key={item.infoNum}
                  to={`/stock/info/${item.infoNum}`}
                  state={{ infoTitle: item.infoTitle }}
                >
                  <div>{item.infoTitle}</div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StockInfo;
