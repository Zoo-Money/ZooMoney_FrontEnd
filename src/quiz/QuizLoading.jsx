import React from "react";
import "./css/quizLoading.css";
import Footer from "../common/Footer";
import giraffeLoading from "../images/quiz/giraffe_main.png";
import Header from "../common/Header";

const QuizLoading = () => {
  return (
    <div className="mock-container">
      <Header title="오늘의 금융QUIZ" />

      {/* 로딩 콘텐츠 */}
      <div className="quizloading-content">
        <img
          src={giraffeLoading}
          alt="퀴즈 로딩 캐릭터"
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
