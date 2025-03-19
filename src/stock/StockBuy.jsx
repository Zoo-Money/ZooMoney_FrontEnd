import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import rabbit07 from "../images/rabbit/rabbit07.png";
import "../stock/css/stockBuy.css";

function StockBuy(props) {
  const location = useLocation();
  const navigate = useNavigate();

  // 세션에서 memberNum 가져오기
  const memberNum = sessionStorage.getItem("member_num") || 0;

  // 주식 번호 및 가격 설정
  const [stockId] = useState(location.state?.stockId || 1);
  const [stockName] = useState(location.state?.stockName || "Unknown");
  const [price, setPrice] = useState(location.state?.latestPrice || ""); // 가격 입력 가능
  const [amount, setAmount] = useState(""); // 수량 입력 상태

  // stockName이 정상적으로 들어오는지 확인
  console.log("StockBuy - stockName:", stockName);

  // 가격이 바뀌면 업데이트
  useEffect(() => {
    if (location.state?.latestPrice) {
      setPrice(location.state.latestPrice);
    }
  }, [location.state?.latestPrice]);

  // 구매 요청
  const handleBuy = async () => {
    if (!price || !amount) {
      alert("가격과 수량을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:7777/zoomoney/stock/buy", {
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
      });

      const result = await response.text();
      alert(result); // 응답 메시지 출력

      if (response.ok) {
        navigate("/stock/buyDone", {
          state: {
            stockName,
            amount,
            totalPrice: price * amount, // 총 구매 금액액
          },
        });
      }
    } catch (error) {
      console.error("매수 실패:", error);
      alert("매수 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mock-container">
      <Header title="구매하기" />
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
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="가격을 입력하세요."
          />
        </div>
        <div className="buy-box">
          구매 <span>수량</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="수량을 입력해주세요."
          />
        </div>
      </div>
      <button className="buy-button" onClick={handleBuy}>
        구매하기
      </button>
      <Footer />
    </div>
  );
}

export default StockBuy;
