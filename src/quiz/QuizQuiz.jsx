import React from "react";
import "./quizQuiz.css";
import Footer from "../common/Footer";
import giraffeQuiz from "../images/quiz/giraffe_quiz.png";
import Header from "../common/Header";
import O from "../images/quiz/O.png";
import X from "../images/quiz/X.png";

const QuizQuiz = () => {
  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="퀴즈풀기" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="quizquiz-content">
        <img
          src={giraffeQuiz}
          alt="퀴즈 출제 캐릭터"
          className="quizquiz-image"
        />
        <div className="quizquiz-board">
          <div className="quizquiz-num">
            <p className="quizquiz-number">QUIZ 01</p>
          </div>
          <div className="quizquiz-description-box">
            <p className="quizquiz-description">
              <strong>
                은행 저축 중 필요할 때 언제든지 돈을 맡기고 찾을 수 있는 저축은
                보통예금이다.
              </strong>
            </p>
          </div>
        </div>
        <div className="quizquiz-ox-button">
          <button className="quizquiz-o-button">
            <img src={O} alt="O" className="quizquiz-o-image"></img>
          </button>
          <button className="quizquiz-x-button">
            <img src={X} alt="X" className="quizquiz-x-image"></img>
          </button>
        </div>
        <button className="quizquiz-answer-button">정답제출</button>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default QuizQuiz;
