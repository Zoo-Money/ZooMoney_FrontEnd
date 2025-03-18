import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import rabbit07 from "../images/rabbit07.png";
import "../stock/css/stockBuy.css";

function StockBuy(props) {
  const location = useLocation();
  const latestPrice = location.state?.latestPrice || "";
  const [price, setPrice] = useState("");
  useEffect(() => {
    if (latestPrice) {
      setPrice(latestPrice);
    }
  }, [latestPrice]);

  const navi = useNavigate();
  const goBuyDone = () => {
    navi("/stock/buyDone");
  };

  return (
    <div className="mock-container">
      <Header title="구매하기"></Header>
      <div className="buy-header">
        주식을 <span>매수</span>하면,
        <br />
        해당 주식의 <span>소유자</span>가 돼요.
        <br />
        회사의 성장에 따라
        <br />
        이익을 얻을 수 있어요.
        <img src={rabbit07} alt="rabbit07" className="buy-rabbit07" />
      </div>
      <div className="buy-container">
        <div className="buy-box">
          현재 <span>매수</span> 가격
          <input type="text" value={price} readOnly />
        </div>
        <div className="buy-box">
          구매 <span>수량</span>
          <input type="number" placeholder="수량을 입력해주세요." />
        </div>
      </div>
      <button className="buy-button" onClick={goBuyDone}>
        구매하기
      </button>
      <Footer />
    </div>
  );
}

export default StockBuy;
