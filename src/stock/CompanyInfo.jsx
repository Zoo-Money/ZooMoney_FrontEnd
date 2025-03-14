import React, { useEffect, useState } from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { useParams } from "react-router-dom";
import "./CompanyInfo.css";
const CompanyInfo = () => {
  // URL에서 stockId, stockName 가져오기
  const { stockId, stockName } = useParams();
  const [stockInfo, setStockInfo] = useState("");
  // "info" | "news"
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:7777/zoomoney/stock/info/${stockId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data);
        setStockInfo(data.stock_info || "정보 없음");
      })
      .catch((err) => {
        console.error("Error fetching stock info:", err);
        setStockInfo("정보를 가져올 수 없습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [stockId]);

  return (
    <div>
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="모의투자" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="stock-info-container">
        <h2 className="stock-title">📈 {stockName} 어떤 회사냐면요...</h2>

        <div className="tabs">
          <button
            className={activeTab === "info" ? "active" : ""}
            onClick={() => setActiveTab("info")}
          >
            회사정보
          </button>
          <button
            className={activeTab === "news" ? "active" : ""}
            onClick={() => setActiveTab("news")}
          >
            뉴스
          </button>
        </div>

        {activeTab === "info" ? (
          <div className="info-content">
            <p>{stockInfo}</p>
          </div>
        ) : (
          <div className="news-content">
            <p>🚧 뉴스 데이터는 아직 준비 중입니다.</p>
          </div>
        )}

        <button className="buy-button">{stockName} 사기</button>
      </div>

      <div className="footer">
        {/* 하단 네비게이션 */}
        <Footer />
      </div>
    </div>
  );
};

export default CompanyInfo;
