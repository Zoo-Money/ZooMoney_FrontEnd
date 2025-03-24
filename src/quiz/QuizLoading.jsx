import React from "react";
import Header from "../common/Header";
import giraffe04 from "../images/giraffe/giraffe04.png";
import "./css/quizLoading.css";

const QuizLoading = () => {
  return (
    <div className="mock-container">
      <Header title="오늘의 금융퀴즈" />

      {/* 로딩 콘텐츠 */}
      <div className="quizloading-content">
        <img src={giraffe04} alt="giraffe04" className="quizloading-image" />

        <p className="quizloading-description">잠시만 기다려주세요~</p>
      </div>
    </div>
  );
};

export default QuizLoading;
