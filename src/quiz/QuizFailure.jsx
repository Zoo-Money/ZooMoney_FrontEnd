import React from "react";
import "./quizFailure.css";
import Footer from "../common/Footer";
import giraffeQuiz from "../images/quiz/giraffe_failure.png";
import Header from "../common/Header";
import X from "../images/quiz/X.png";

const QuizFailure = () => {
  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="퀴즈 결과" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="quizfailure-content">
        <div className="quizfailure-num-image">
          <p className="quizfailure-number">QUIZ 01</p>
          <img
            src={giraffeQuiz}
            alt="퀴즈실패 캐릭터"
            className="quizfailure-image"
          />
        </div>
        <div className="quizfailure-board">
          <div className="quizfailure-box">
            <div className="quizfailure-nemo">
              <img src={X} alt="O" className="quizfailure-failure-image"></img>
              <p className="quizfailure-answer">오답이에요!</p>
            </div>
          </div>
          <div className="quizfailure-description-box">
            <p className="quizfailure-description">
              <strong>아쉽게도 오답이에요..</strong>
            </p>
            <p className="quizfailure-description">
              <strong>
                보통 예금은 필요할 때 언제든지 돈을 맡기고 찾을 수 있는 대신,
                이자를 많이 주지는 않아요.
              </strong>
            </p>
          </div>
        </div>

        <p className="quizfailure-point">포인트를 획득하지 못했어요..</p>

        <button className="quizfailure-button">다음 퀴즈 풀기</button>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default QuizFailure;
