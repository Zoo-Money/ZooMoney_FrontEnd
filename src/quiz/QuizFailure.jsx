import React, { useEffect, useState } from "react";
import "./quizFailure.css";
import Footer from "../common/Footer";
import giraffeFailure from "../images/quiz/giraffe_failure.png";
import Header from "../common/Header";
import X from "../images/quiz/X.png";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const QuizFailure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quiz = location.state?.quiz; // ✅ 전달된 퀴즈 데이터 가져오기

  const [quizCount, setQuizCount] = useState(0); // 퀴즈 데이터 개수를 저장할 상태

  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/quiz/count")
      .then((response) => {
        setQuizCount(response.data.quizCount); // 상태 업데이트
      })
      .catch((error) => console.error("퀴즈의 개수를 알 수 없습니다.", error));
  }, []);

  const nextQuiz = () => {
    if (quizCount >= 5) {
      // 누적 퀴즈 data수가 5개 이상이면
      navigate("/quiz/end"); // 종료 페이지로 이동
    } else {
      // 5개 미만이면
      navigate("/quiz/quiz"); // 퀴즈 출제 페이지로 이동
    }
  };

  const goToMain = () => {
    navigate("/quiz/main");
  };

  const goToEnd = () => {
    navigate("/quiz/end");
  };

  return (
    <div className="mock-container">
      <Header title="QUIZ 결과" />

      {/* 메인 콘텐츠 */}
      <div className="quizfailure-content">
        <div className="quizfailure-num-image">
          <p className="quizfailure-number">
            QUIZ {String(quizCount).padStart(2, "0")}
          </p>
          <img
            src={giraffeFailure}
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

        {quizCount >= 5 ? (
          <>
            <p className="quizfailure-quiz-done">
              오늘의 퀴즈를 모두 응시했어요!
            </p>
            <button className="quizfailure-button" onClick={goToEnd}>
              포인트는 총 몇점?
            </button>
          </>
        ) : (
          <>
            <button className="quizfailure-button" onClick={nextQuiz}>
              다음 QUIZ 풀기
            </button>
            <button className="quizfailure-button-stop" onClick={goToMain}>
              그만 풀기
            </button>
          </>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default QuizFailure;
