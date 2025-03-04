import React from "react";
import "./StockBegin.css";
import Footer from "../common/Footer";
import rabbit1 from "../images/rabbit01.png";
import Header from "../common/Header";

const StockBegin = () => {
  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="모의투자" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="content">
        <img src={rabbit1} alt="모의투자 캐릭터" className="main-image" />
        <p className="description">
          모의투자대회에 참여하면 <strong>1,000,000원</strong>이 입금돼요
          <br />이 돈은 실제 돈이 아닌 연습을 위해 사용하는
          <br />
          가상의 돈이에요
        </p>
        <p className="description">
          첫 주식을 사면 모의투자 시작!
          <br />
          실시간으로 내가 산 주식으로 얼마를 벌고, 잃었는지
          <br />
          확인할 수 있어요.
        </p>
        <p className="question">모의투자대회에 참여하시겠어요?</p>
        <button className="join-button">참여하기</button>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default StockBegin;
