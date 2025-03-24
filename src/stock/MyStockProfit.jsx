import React, { useState } from "react";
import { AiOutlineClose, AiOutlineQuestionCircle } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import Header from "../common/Header";
import rabbit from "../images/rabbit/rabbit02.png";
import "./css/MyStockProfit.css";

const descriptions = {
  총매입:
    "총매입은 주식 구매에 사용한 총 금액입니다!\n\n매수 금액 300만원이라면 총매입 300만원!",
  총평가금액:
    "총평가는 현재 주식의 평가 금액입니다!\n\n현재 보유 주식의 가격 × 수량 ",
  평가손익:
    "평가손익은 주식을 샀을 때 금액과\n현재 주가의 차이를 뜻해요!\n\n매수 가격 10만원, 현재 주가 50만원이라면\n평가 이익은 40만원!",
  수익률:
    "수익률은 투자 대비 수익의 비율입니다!\n\n(평가손익 ÷ 총매입금액) × 100",
  추정자산:
    "추정자산은 전체 자산의 예상 금액입니다!\n\n보유 주식 + 예수금 = 추정 자산",
};

const MyStockProfit = () => {
  const location = useLocation();
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    totalPurchase,
    totalEvaluation,
    evaluationProfitLoss,
    totalProfitRate,
  } = location.state || {};

  const openModal = (title) => {
    setModalTitle(title);
    setModalContent(descriptions[title]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
    setModalTitle("");
  };

  return (
    <div className="mock-container">
      <Header title="내 주식" />
      <div className="myStockProfit-container">
        <div className="myStockProfit-item" onClick={() => openModal("총매입")}>
          <span>
            총매입
            <AiOutlineQuestionCircle className="question-white2" />
          </span>
          <span className="myStockProfit-value">
            {totalPurchase.toLocaleString()} 원
          </span>
        </div>
        <div
          className="myStockProfit-item"
          onClick={() => openModal("총평가금액")}
        >
          <span>
            총평가금액
            <AiOutlineQuestionCircle className="question-white3" />
          </span>
          <span className="myStockProfit-value">
            {totalEvaluation.toLocaleString()} 원
          </span>
        </div>
        <div
          className="myStockProfit-item"
          onClick={() => openModal("평가손익")}
        >
          <span>
            평가손익
            <AiOutlineQuestionCircle className="question-white" />
          </span>
          <span className={evaluationProfitLoss >= 0 ? "my-profit" : "my-loss"}>
            {evaluationProfitLoss.toLocaleString()} 원
          </span>
        </div>
        <div className="myStockProfit-item" onClick={() => openModal("수익률")}>
          <span>
            수익률
            <AiOutlineQuestionCircle className="question-white2" />
          </span>
          <span className={totalProfitRate >= 0 ? "my-profit" : "my-loss"}>
            {totalProfitRate.toFixed(2)} %
          </span>
        </div>
        <div
          className="myStockProfit-item"
          onClick={() => openModal("추정자산")}
        >
          <span>
            추정자산
            <AiOutlineQuestionCircle className="question-white" />
          </span>
          <span className="myStockProfit-value">
            {totalEvaluation.toLocaleString()} 원
          </span>
        </div>
        {isModalOpen && (
          <div className="mystockmodal">
            <div className="mystockmodal-content">
              <div className="mystockmodal-header">
                <img
                  src={rabbit}
                  alt="설명 아이콘"
                  className="mystockmodal-image"
                />
                <h2 className="mystockmodal-title">{modalTitle}이란?</h2>
                <AiOutlineClose
                  className="mystockclose-icon"
                  onClick={closeModal}
                />
              </div>
              <div className="mystockmodal-body">
                <p>{modalContent}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStockProfit;
