import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { FaQuestionCircle } from "react-icons/fa";
import "./stockMain.css";
import rabbit01 from "../images/rabbit01.png";
import { useNavigate } from "react-router-dom";

function StockMain(props) {
    const navi = useNavigate();
    const goStockList = ()=>{
        navi("/stock/list");
    };
  return (
    <div className="mock-container">
      <Header title="모의투자" />
      <div className="stock-main-header">
        <div className="stock-main-info">
          <FaQuestionCircle className="questionmark"/>
          <span>주식에 대해 궁금해요!</span>
        </div>
        <img src={rabbit01} alt="rabbit01" />
      </div>
      <div className="stock-main-box">
        <h2>내 투자</h2>
        <div className="stock-main-box-amount">771,900 원</div>
        <div className="stock-main-box-text">예상 수수료 * 세금 포함</div>
        <div className="stock-main-box-detail">
          <div>
            <span>원금</span>
            <span>7,194원</span>
          </div>
          <div>
            <span>총 수익</span>
            <span class="loss">- 3,724원 ( 51.8% )</span>
          </div>
          <div>
            <span>일간 수익</span>
            <span class="loss">- 61원 ( 0.8% )</span>
          </div>
        </div>
      </div>
      <div className="stock-main-mystock-list-box">
        <div className="stock-main-mystock-list"></div>
      </div>

      <button className="stock-main-button" onClick={goStockList}>투자하러 가기</button>
      <Footer />
    </div>
  );
}

export default StockMain;
