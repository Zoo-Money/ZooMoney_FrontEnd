import React from "react";
import "./quizSuccess.css";
import Footer from "../common/Footer";
import giraffeQuiz from "../images/quiz/giraffe_quiz.png";
import Header from "../common/Header";
import O from "../images/quiz/O.png";
import { useLocation, useNavigate } from "react-router-dom";

const QuizSuccess = () => {
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
      <div className="quizsuccess-content">
        <div className="quizsuccess-num-image">
          <p className="quizsuccess-number">QUIZ 01</p>
          <img
            src={giraffeQuiz}
            alt="퀴즈성공 캐릭터"
            className="quizsuccess-image"
          />
        </div>
        <div className="quizsuccess-board">
          <div className="quizsuccess-box">
            <div className="quizsuccess-nemo">
              <img src={O} alt="O" className="quizsuccess-success-image"></img>
              <p className="quizsuccess-answer">정답이에요!</p>
            </div>
          </div>
          <div className="quizsuccess-description-box">
            <p className="quizsuccess-description">{quiz?.explanation}</p>
          </div>
        </div>

        <p className="quizsuccess-point">100포인트를 획득했어요!</p>

        <button className="quizsuccess-button" onClick={nextQuiz}>
          다음 퀴즈 풀기
        </button>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default QuizSuccess;
