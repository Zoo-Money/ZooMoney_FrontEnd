import React from "react";
import "./quizFailure.css";
import Footer from "../common/Footer";
import giraffeQuiz from "../images/quiz/giraffe_failure.png";
import Header from "../common/Header";
import X from "../images/quiz/X.png";
import { useLocation, useNavigate } from "react-router-dom";

const QuizFailure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quiz = location.state?.quiz; // ✅ 전달된 퀴즈 데이터 가져오기

  const nextQuiz = () => {
    navigate("/");
  };

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
            <p className="quizfailure-description">{quiz?.explanation}</p>
          </div>
        </div>

        <p className="quizfailure-point">포인트를 획득하지 못했어요..</p>

        <button className="quizfailure-button" onClick={nextQuiz}>
          다음 퀴즈 풀기
        </button>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default QuizFailure;
