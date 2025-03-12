import React, { useEffect, useState } from "react";
import "./quizEnd.css";
import Footer from "../common/Footer";
import giraffe1 from "../images/quiz/giraffe_end.png";
import Header from "../common/Header";
import axios from "axios";

const QuizEnd = () => {
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0); // 맞춘 퀴즈 데이터 개수를 저장할 상태

  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/quiz/total")
      .then((response) => {
        console.log("✅ 백엔드 응답:", response.data); // 백엔드 응답 확인
        setCorrectAnswerCount(response.data.correctAnswerCount); // 상태 업데이트
      })
      .catch((error) =>
        console.error("맞춘 퀴즈의 개수를 알 수 없습니다.", error)
      );
  }, []);

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        <Header title="퀴즈 완료" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="quizend-content">
        <img src={giraffe1} alt="퀴즈완료 캐릭터" className="quizend-image" />
        <p className="quizend-description">
          오늘의 퀴즈를 모두 풀었어요
          <br />총 <strong>{String(correctAnswerCount) * 100} 포인트</strong>를
          획득했어요!
        </p>
        <p className="quizend-description">내일 다시 만나요!</p>
        <button className="quizend-button">퀴즈 풀이 완료</button>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default QuizEnd;
