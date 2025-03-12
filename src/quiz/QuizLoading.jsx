import React from "react";
import "./quizLoading.css";
import Footer from "../common/Footer";
import giraffe2 from "../images/quiz/giraffe_main.png";
import Header from "../common/Header";

const QuizLoading = () => {
  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="오늘의 금융퀴즈" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="quizloading-content">
        <img
          src={giraffe2}
          alt="퀴즈 메인 캐릭터"
          className="quizloading-image"
        />

        <p className="quizloading-description">잠시만 기다려주세요~</p>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default QuizLoading;
