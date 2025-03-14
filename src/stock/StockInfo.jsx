import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import axios from "axios";
import "./StockInfo.css";
import { Link } from "react-router-dom";

function StockInfo() {
  const [stockInfoList, setStockInfoList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/stock/StockInfoAll")
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
                <Link key={item.infoNum} to={`/stock/info/${item.infoNum}`}>
                  {item.infoTitle}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StockInfo;
