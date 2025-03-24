import axios from "axios";
import { API_PATH } from "../common/config.js";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import rabbit1 from "../images/rabbit/rabbit01.png";
import "./css/StockBegin.css";

const StockBegin = () => {
  const [, setHasJoined] = useState(false);
  const memberNum = sessionStorage.getItem("member_num");
  const navigate = useNavigate();

  const handleJoin = () => {
    axios
      .post(`${API_PATH}/zoomoney/stock/start`, { memberNum })
      .then((response) => {
        setHasJoined(response.data); // 응답 데이터를 상태에 저장
        navigate("/stock/list");
      })
      .catch((error) => {
        console.error("Error fetching stock info:", error);
        alert("참여 실패! 다시 시도해주세요."); // 에러 발생 시 알림
      });
  };

  return (
    <div className="mock-container">
      <Header title="모의투자" />

      <div className="stockBegin-content">
        <img src={rabbit1} alt="모의투자 캐릭터" className="StockBegin-image" />
        <p className="SB-description">
          모의투자대회에 참여하면 <strong>1,000,000원</strong>이 입금돼요
          <br />이 돈은 실제 돈이 아닌 연습을 위해 사용하는
          <br />
          가상의 돈이에요
        </p>
        <p className="SB-description">
          첫 주식을 사면 모의투자 시작!
          <br />
          실시간으로 내가 산 주식으로 얼마를 벌고, 잃었는지
          <br />
          확인할 수 있어요.
        </p>
        <p className="StockBegin-question">모의투자대회에 참여하시겠어요?</p>
        <button className="joinStock-button" onClick={handleJoin}>
          참여하기
        </button>
      </div>
    </div>
  );
};

export default StockBegin;
