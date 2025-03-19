import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../common/Footer";
import Header from "../common/Header";
import giraffe05 from "../images/giraffe/giraffe05.png";
import O from "../images/quiz/O.png";
import X from "../images/quiz/X.png";
import QuizLoading from "./QuizLoading";
import "./css/quizQuiz.css";

const QuizQuiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const navigate = useNavigate();

  const memberNum = sessionStorage.getItem("member_num");

  // ✅ 백엔드에서 퀴즈 가져오기
  useEffect(() => {
    axios
      .post("http://localhost:7777/zoomoney/quiz/generate")
      .then((response) => setQuiz(response.data))
      .catch((error) => console.error("퀴즈 불러오기 실패", error));
  }, []);

  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast.error("정답을 선택해주세요!");
      return;
    }

    // 백엔드로 보낼 데이터
    const payload = {
      correctAnswer: quiz.answer, // AI가 제공한 정답
      userAnswer: selectedAnswer, // 사용자가 선택한 답변
    };

    axios
      .post("http://localhost:7777/zoomoney/quiz/submit", payload, {
        params: { memberNum: memberNum },
      })
      .then((response) => {
        const isCorrect = response.data.isCorrect; // 백엔드에서 받은 정답 여부
        if (isCorrect === true) {
          navigate("/quiz/success", {
            state: { quiz },
            explanation: quiz.explanation,
          }); // 결과 페이지로 이동
        } else {
          navigate("/quiz/failure", {
            state: { quiz },
            explanation: quiz.explanation,
          }); // 결과 페이지로 이동
        }
      })
      .catch((error) => console.error("퀴즈 제출 실패", error));
  };

  const [quizCount, setQuizCount] = useState(0); // 퀴즈 데이터 개수를 저장할 상태

  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/quiz/count", {
        params: { memberNum: memberNum },
      })
      .then((response) => {
        setQuizCount(response.data.quizCount); // 상태 업데이트
      })
      .catch((error) => console.error("퀴즈의 개수를 알 수 없습니다.", error));
  });

  if (!quiz) return <QuizLoading />; // 퀴즈 로딩 화면

  return (
    <div className="mock-container">
      <Header title="오늘의 금융퀴즈" />
      <div className="quizquiz-content">
        <img src={giraffe05} alt="giraffe05" className="quizquiz-image" />
        <div className="quizquiz-board">
          <div className="quizquiz-num">
            <p className="quizquiz-number">
              QUIZ {String(quizCount + 1).padStart(2, "0")}
            </p>
          </div>
          <div className="quizquiz-description-box">
            <p className="quizquiz-description">
              <strong>{quiz.question}</strong>
            </p>
          </div>
        </div>
        <div className="quizquiz-ox-button">
          <button
            className={`quizquiz-o-button ${
              selectedAnswer === "O" ? "quizquiz-o-selected" : ""
            }`}
            onClick={() => setSelectedAnswer("O")}
          >
            <img src={O} alt="O" className="quizquiz-o-image" />
          </button>
          <button
            className={`quizquiz-x-button ${
              selectedAnswer === "X" ? "quizquiz-x-selected" : ""
            }`}
            onClick={() => setSelectedAnswer("X")}
          >
            <img src={X} alt="X" className="quizquiz-x-image" />
          </button>
        </div>
        <button className="quizquiz-answer-button" onClick={handleSubmit}>
          정답 제출
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default QuizQuiz;
