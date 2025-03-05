import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import "./StockInfo.css";

function StockInfo(props) {
  return (
    <div className="mock-container">
      <div className="header">
        <Header title="주식에 대해 궁금해요" />
      </div>
      <div className="faqInfo">
        <div className="faqDetail">
          <div className="InfoTitle">주식이 뭘까?</div>
          <div className="InfoTitle">주식은 어떻게 사고팔 수 있을까?</div>
          <div className="InfoTitle">주식 가격은 왜 자주 바뀌는 걸까?</div>
          <div className="InfoTitle">주식으로 어떻게 돈을 벌 수 있을까?</div>
          <div className="InfoTitle">좋은 주식을 고르는 방법은?</div>
          <div className="InfoTitle">주식 차트는 어떻게 보는 걸까?</div>
          <div className="InfoTitle">주식 투자에는 어떤 전략이 있을까?</div>
          <div className="InfoTitle">주식 시장에는 어떤 참가자들이 있을까?</div>
          <div className="InfoTitle">
            주식 시장은 언제 열리고, 어떻게 운영될까?
          </div>
          <div className="InfoTitle">주식 투자에서 조심해야 할 것은?</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StockInfo;
