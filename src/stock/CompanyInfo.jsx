import React, { useEffect, useState } from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { useParams } from "react-router-dom";
import "./CompanyInfo.css";
const CompanyInfo = () => {
  // URL에서 종목 코드, 이름 가져오기
  const { stockId, stockName } = useParams();
  const [stockInfo, setStockInfo] = useState("");

  useEffect(() => {
    fetch(`http://localhost:7777/zoomoney/stock/info/${stockId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Stock info not found");
        }
        // JSON으로 변환
        return response.json();
      })
      .then((data) => {
        console.log("Stock Info:", data);
        // stock_info에 저장
        setStockInfo(data.stock_info || "정보 없음");
      })
      .catch((error) => console.error("Error fetching stock info:", error));
  }, [stockId]);

  return (
    <div>
      <div className="header">
        <Header title="회사 정보" />
      </div>

      {/* 회사 정보 섹션 */}
      <div className="company-info-container">
        <h2>💡 {stockName}가 어떤 회사냐면요...</h2>
        <p>{stockInfo || "정보 없음"}</p>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default CompanyInfo;
