import React, { useEffect, useState } from "react";
import { API_PATH } from "../common/config.js";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import rabbit1 from "../images/rabbit/rabbit01.png";
import "./css/StockList.css";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_PATH}/zoomoney/stock/rank`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStocks(data);
        } else {
          console.error("Invalid data format:", data);
          setStocks([]);
        }
      })
      .catch((error) => console.error("Error fetching stocks:", error));
  }, []);

  const handleStockClick = (stockId, stockName) => {
    navigate(`/stock/list/${stockId}/${stockName}`); // ✅ 종목 상세 페이지로 이동
  };

  return (
    <div className="mock-container">
      <Header title="모의투자" />
      <div className="stock-header">
        <div className="stock-header-text">
          다양한 <span>종목</span>을 살펴보아요
        </div>
        <img src={rabbit1} alt="모의투자 캐릭터" className="stockList-image" />
      </div>
      {/* 메인 콘텐츠 */}
      <div className="stock-list">
        {stocks.length > 0
          ? stocks.map((stock, index) => (
              <div
                key={index}
                className="stock-item"
                onClick={() =>
                  handleStockClick(stock.stock_id, stock.stock_name)
                }
              >
                <div className="stock-info">
                  <span className="stock-rank">{index + 1}</span>
                  <span className="stock-name">
                    {stock.stock_name || "이름 없음"}
                  </span>
                </div>
                <div className="stock-price">
                  <span>
                    {stock.stock_price.toLocaleString() || "가격 없음"} 원
                  </span>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default StockList;
