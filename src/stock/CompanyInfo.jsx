import React, { useEffect, useState } from "react";
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
      <div className="company-info-container">
        <h6>💡 {stockName}가 어떤 회사냐면요...</h6>
        <br />
        <ul className="company-info-list">
          {stockInfo.split("\n").map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompanyInfo;
