import axios from "axios";
import { API_PATH } from "../common/config.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import giraffe02 from "../images/giraffe/giraffe02.png";
import "./css/quizEnd.css";

const QuizEnd = () => {
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0); // 맞춘 퀴즈 데이터 개수를 저장할 상태

  const memberNum = sessionStorage.getItem("member_num");

  useEffect(() => {
    axios
      .get(`${API_PATH}/zoomoney/quiz/total`, {
        params: { memberNum: memberNum },
      })
      .then((response) => {
        setCorrectAnswerCount(response.data.correctAnswerCount); // 상태 업데이트
      })
      .catch((error) =>
        console.error("맞춘 퀴즈의 개수를 알 수 없습니다.", error)
      );
  });

  const navigate = useNavigate();

  const goToMain = () => {
    navigate("/quiz/main"); // 퀴즈를 다 풀면 퀴즈 main 페이지로 이동
  };

  return (
    <div className="mock-container">
      <Header title="오늘의 금융퀴즈" />

      {/* 메인 콘텐츠 */}
      <div className="quizend-content">
        <img src={giraffe02} alt="giraffe02" className="quizend-image" />
        <p className="quizend-description">
          풀 수 있는 퀴즈를 다 풀었어요
          <br />
          오늘 총 <span>{String(correctAnswerCount) * 100} 포인트</span>를
          획득했어요
        </p>
        <p className="quizend-description">내일 다시 만나요!</p>
        <button className="quizend-button" onClick={goToMain}>
          확인
        </button>
      </div>
    </div>
  );
};

export default QuizEnd;
