import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import rabbit07 from "../images/rabbit/rabbit07.png";
import "../stock/css/stockBuy.css";

function StockSell(props) {
  const location = useLocation();
  const navigate = useNavigate();

  // 세션에서 memberNum 가져오기
  const memberNum = sessionStorage.getItem("member_num") || 0;

  // 주식 번호 및 가격 설정
  const [stockId] = useState(location.state?.stockId || 1);
  const [stockName] = useState(location.state?.stockName || "Unknown");
  const [price, setPrice] = useState(location.state?.latestPrice || ""); // 가격 입력 가능
  const [amount, setAmount] = useState(""); // 수량 입력 상태

  // 최초 로드 시, price가 없으면 latestPrice를 기본값으로 설정
  useEffect(() => {
    if (!price && location.state?.latestPrice) {
      setPrice(location.state.latestPrice);
    }
  }, [location.state?.latestPrice]);

  // 판매 요청
  const handleSell = async () => {
    if (!price || !amount) {
      alert("가격과 수량을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:7777/zoomoney/stock/sell",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberNum,
            stockId,
            amount,
            price,
          }),
        }
      );

      const result = await response.text();
      alert(result); // 응답 메시지 출력

      if (response.ok) {
        navigate("/stock/TradeDone", {
          state: {
            stockName,
            amount,
            totalPrice: amount * price, // 총 매도 금액
          },
        });
      }
    } catch (error) {
      console.error("매도 실패:", error);
      alert("매도 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mock-container">
      <Header title="판매하기" />
      <div className="buy-header">
        주식을 <span>매도</span>하면,
        <br />
        해당 주식을 <span>소유자</span>가 아니에요.
        <img src={rabbit07} alt="rabbit07" className="buy-rabbit07" />
      </div>
      <div className="buy-container">
        <div className="buy-box">
          현재 <span>매도</span> 가격
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="가격을 입력하세요."
          />
        </div>
        <div className="buy-box">
          판매 <span>수량</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="수량을 입력해주세요."
          />
        </div>
      </div>
      <button className="buy-button" onClick={handleSell}>
        판매하기
      </button>
      <Footer />
    </div>
  );
}

export default StockSell;
