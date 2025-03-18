import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import dailyEnd from "../images/daily/giraffe_end.png";
import "./dailyEnd.css";
import { useNavigate } from "react-router-dom";

const DailyEnd = () => {
  const navigate = useNavigate();
  const goToMain = () => {
    navigate("/main");
  };
  return (
    <div className="mock-container">
      <Header title="출석체크 완료" />

      {/* 메인 콘텐츠 */}
      <div className="dailyend-content">
        <img src={dailyEnd} alt="출첵완료 캐릭터" className="dailyend-image" />
        <p className="dailyend-description">
          오늘의 출석체크 완료로
          <br />
          <strong>10 포인트</strong>를 획득했어요!
        </p>
        <p className="dailyend-description">내일 다시 만나요!</p>
        <button className="dailyend-button" onClick={goToMain}>
          메인으로 돌아가기
        </button>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default DailyEnd;
