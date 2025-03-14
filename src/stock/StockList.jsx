import React, { useEffect, useState } from "react";
import "./StockList.css";
import rabbit1 from "../images/rabbit01.png";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:7777/zoomoney/stock/rank")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data);
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
    console.log(`선택한 종목 코드와 이름: ${stockId},${stockName}`);
    navigate(`/stock-detail/${stockId}/${stockName}`); // ✅ 종목 상세 페이지로 이동
  };

  return (
    <div className="stock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="모의투자" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="stock-list">
        <img src={rabbit1} alt="모의투자 캐릭터" className="main-image" />
        <div className="stock-list">
          {stocks.length > 0 ? (
            stocks.map((stock, index) => (
              <div key={index} className="stock-item">
                <div className="stock-info">
                  <span className="stock-rank">{index + 1}</span>
                  <span
                    className="stock-name clickable"
                    onClick={() =>
                      handleStockClick(stock.stock_id, stock.stock_name)
                    }
                  >
                    {stock.stock_name || "이름 없음"}
                  </span>
                </div>
                <div className="stock-price">
                  <span>{stock.stock_price || "가격 없음"}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="loading-message">데이터를 불러오는 중...</p>
          )}
        </div>
      </div>
      <div className="footer">
        {/* 하단 네비게이션 */}
        <Footer />
      </div>
    </div>
  );
};

export default StockList;
