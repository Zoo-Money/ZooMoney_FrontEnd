import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // ⬅️ Axios 추가
import Footer from "../common/Footer";
import Header from "../common/Header";
import rabbit07 from "../images/rabbit/rabbit07.png";
import "../stock/css/stockBuy.css";

function StockBuy() {
  const location = useLocation();
  const latestPrice = location.state?.latestPrice || "";
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState(""); // ⬅️ 구매 수량 입력받기
  const navigate = useNavigate();

  // ✅ 세션에서 memberNum 가져오기
  const memberNum = sessionStorage.getItem("memberNum");

  useEffect(() => {
    if (latestPrice) {
      setPrice(latestPrice);
    }
  }, [latestPrice]);

  // ✅ 매수 API 호출 함수
  const handleBuyStock = async () => {
    if (!memberNum) {
      alert("로그인이 필요합니다.");
      return;
    }

    const stockNum = location.state?.stockNum || 1; // ⬅️ 주식 ID (예제)

    if (!amount || amount <= 0) {
      alert("구매 수량을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/stock/buy",
        null,
        {
          params: {
            memberNum,
            stockNum,
            amount,
            price,
          },
        }
      );

      alert(response.data); // "매수 완료" 메시지 출력
      navigate("/stock/buyDone"); // ✅ 성공 시 페이지 이동
    } catch (error) {
      console.error("매수 요청 실패:", error);
      alert("매수에 실패했습니다.");
    }
  };

  return (
    <div className="mock-container">
      <Header title="구매하기" />
      <div className="buy-header">
        주식을 <span>매수</span>하면, <br />
        해당 주식의 <span>소유자</span>가 돼요. <br />
        회사의 성장에 따라 <br />
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
          <input
            type="number"
            placeholder="수량을 입력해주세요."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      <button className="buy-button" onClick={handleBuyStock}>
        구매하기
      </button>
      <Footer />
    </div>
  );
}

export default StockBuy;
