import React from "react";
import Header from "../common/Header";
import rabbit07 from "../images/rabbit/rabbit07.png";
import "./css/stockRankResult.css";

function StockRankResult(props) {
  return (
    <div className="mock-container">
      <Header title="모의투자 결과"></Header>
      <div className="stock-result-box">
        <img className="rabbit07" src={rabbit07} alt="rabbit07" />
        <p>
          <span>박은수</span>
          님은
          <br />
          <span className="stock-result-rank">57 위</span>를 했어요!
        </p>
        <p>다음 시즌에 다시 만나요!</p>
      </div>
      <button className="stock-result-button">투자내역 보러가기</button>
    </div>
  );
}

export default StockRankResult;
