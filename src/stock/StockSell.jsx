import React, { useState } from "react";
import { API_PATH } from "../common/config.js";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
  const [price] = useState(location.state?.stockPrice || 1);
  const [stockName] = useState(location.state?.stockName || "Unknown");
  const [amount, setAmount] = useState(""); // 수량 입력 상태

  // 판매 요청
  const handleSell = async () => {
    if (!price || !amount) {
      alert("가격과 수량을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${API_PATH}/zoomoney/stock/sell`, {
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
      toast.error("매도 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mock-container">
      <Header title="판매하기" />
      <div className="buy-header">
        주식을 <span style={{ color: "#2667E1" }}>매도</span>하면,
        <br />
        해당 주식의 <span>소유권</span>이 사라져요.
        <br />
        매도한 금액은
        <br />
        다른 기회로 활용할 수 있어요!
        <img src={rabbit07} alt="rabbit07" className="buy-rabbit07" />
      </div>
      <div className="buy-container">
        <div className="buy-box">
          현재 <span>매도</span> 가격
          <p className="buy-text-left">{price.toLocaleString()}원</p>
        </div>
        <div className="buy-box">
          판매 <span>수량</span>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="수량을 입력해주세요."
          />
        </div>
      </div>
      <button
        className="buy-button"
        style={{ backgroundColor: "#2667e1" }}
        onClick={handleSell}
      >
        판매하기
      </button>
    </div>
  );
}

export default StockSell;
