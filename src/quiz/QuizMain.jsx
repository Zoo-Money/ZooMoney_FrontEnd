import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import giraffe04 from "../images/giraffe/giraffe04.png";
import emptyStamp from "../images/quiz/empty_stamp.avif";
import oStamp from "../images/quiz/o_stamp.png";
import xStamp from "../images/quiz/x_stamp.png";
import "./css/quizMain.css";

const QuizMain = () => {
  const [quizCount, setQuizCount] = useState(0); // 도전한 퀴즈 개수
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0); // 맞힌 정답 개수
  const [answerList, setAnswerList] = useState([]); // 푼 퀴즈 데이터 리스트

  const memberNum = sessionStorage.getItem("member_num");

  useEffect(() => {
    if (!memberNum) return; // memberNum이 없으면 API 요청하지 않음

    // 📌 도전한 퀴즈 개수 가져오기
    axios
      .get("http://localhost:7777/zoomoney/quiz/count", {
        params: { memberNum: memberNum },
      })
      .then((response) => {
        setQuizCount(response.data.quizCount);
      })
      .catch((error) =>
        console.error("❌ 도전한 퀴즈 개수를 가져오는 데 실패했습니다.", error)
      );

    // 📌 맞힌 정답 개수 가져오기
    axios
      .get("http://localhost:7777/zoomoney/quiz/total", {
        params: { memberNum: memberNum },
      })
      .then((response) => {
        setCorrectAnswerCount(response.data.correctAnswerCount);
      })
      .catch((error) =>
        console.error("❌ 맞힌 정답 개수를 가져오는 데 실패했습니다.", error)
      );

    //  📌 문제별 정답 여부 List 가져오기
    axios
      .get("http://localhost:7777/zoomoney/quiz/answerlist", {
        params: { memberNum: memberNum },
      })
      .then((response) => {
        setAnswerList(response.data.answerList || []); // 만약 answerList가 undefined이면 빈 배열로 설정
      })
      .catch((error) =>
        console.error("❌ 정답 리스트를 가져오는 데 실패했습니다.", error)
      );
  }, [memberNum]);

  const navigate = useNavigate();

  const startQuiz = () => {
    if (quizCount >= 5) {
      navigate("/main"); // 자녀 메인 페이지로 이동
    } else {
      navigate("/quiz/quiz"); // 퀴즈 출제 페이지로 이동
    }
  };

  // stamp image처리 (반복)
  const stampMap = [...Array(5)].map((_, index) => (
    <div className="quizmain-stamp" key={index}>
      {answerList.length > index && answerList[index] !== undefined ? (
        <img
          src={answerList[index] === 1 ? oStamp : xStamp}
          alt={answerList[index] === 1 ? "정답 스탬프" : "오답 스탬프"}
          className="quizmain-stamp-image"
        />
      ) : (
        <img
          src={emptyStamp}
          alt="기본 스탬프"
          className="quizmain-stamp-image"
        />
      )}
    </div>
  ));

  return (
    <div className="mock-container">
      <Header title="오늘의 금융퀴즈" />

      {/* 메인 콘텐츠 */}
      <div className="quizmain-content">
        <img src={giraffe04} alt="giraffe04" className="quizmain-image" />
        {/* 총 점수 */}
        <div className="quizmain-total-box">
          <div className="quizmain-total">
            <p className="quizmain-total-title">
              <strong>나의 참여 현황</strong>
            </p>
            <div className="quizmain-total-content">
              <div className="quizmain-total-detail">
                <p className="quizmain-total-left">포인트 적립</p>
                <p className="quizmain-total-right">
                  {correctAnswerCount * 100}P
                </p>
              </div>
              <div className="quizmain-total-detail">
                <p className="quizmain-total-left">도전한 퀴즈</p>
                <p className="quizmain-total-right">{quizCount}문제</p>
              </div>
              <div className="quizmain-total-detail">
                <p className="quizmain-total-left">맞힌 정답</p>
                <p className="quizmain-total-right">{correctAnswerCount}문제</p>
              </div>
            </div>
          </div>
        </div>

        {/* 스탬프 */}
        <div className="quizmain-stamp-box">{stampMap}</div>

        {quizCount < 5 ? (
          <>
            <p className="quizmain-today">퀴즈를 풀러 가볼까요?</p>
            <button className="quizmain-button" onClick={startQuiz}>
              시작하기
            </button>
            {/* 주의사항 */}
            <p className="quizmain-check">
              <strong>꼭 확인해주세요</strong>
            </p>
          </>
        ) : (
          <>
            <p className="quizmain-today-done">오늘의 퀴즈를 다 풀었어요!</p>
            <button className="quizmain-button" onClick={startQuiz}>
              메인으로 돌아가기
            </button>
          </>
        )}
        <p className="quizmain-description">
          <li>매일 5개의 퀴즈에 도전할 수 있어요.</li>
          <li>퀴즈를 맞힐 때마다 100P를 받아요.</li>
        </p>
      </div>
    </div>
  );
};

export default QuizMain;
