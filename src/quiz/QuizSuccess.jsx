import axios from "axios";
import { API_PATH } from "../common/config.js";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../common/Header";
import giraffe05 from "../images/giraffe/giraffe05.png";
import O from "../images/quiz/O.png";
import "./css/quizSuccess.css";

const QuizSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quiz = location.state?.quiz; // ✅ 전달된 퀴즈 데이터 가져오기

  const memberNum = sessionStorage.getItem("member_num");

  const [quizCount, setQuizCount] = useState(0); // 퀴즈 데이터 개수를 저장할 상태

  useEffect(() => {
    axios
      .get(`${API_PATH}/zoomoney/quiz/count`, {
        params: { memberNum: memberNum },
      })
      .then((response) => {
        setQuizCount(response.data.quizCount); // 상태 업데이트
      })
      .catch((error) => console.error("퀴즈의 개수를 알 수 없습니다.", error));
  });

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
      <Header title="오늘의 금융퀴즈" />

      {/* 메인 콘텐츠 */}
      <div className="quizsuccess-content">
        <div className="quizsuccess-num-image">
          <p className="quizsuccess-number">
            QUIZ {String(quizCount).padStart(2, "0")}
          </p>
          <img src={giraffe05} alt="giraffe05" className="quizsuccess-image" />
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

        {quizCount >= 5 ? (
          <>
            <p className="quizsuccess-quiz-done">
              오늘의 퀴즈를 모두 응시했어요!
            </p>
            <button className="quizsuccess-point-button" onClick={goToEnd}>
              결과 보기
            </button>
          </>
        ) : (
          <>
            <button className="quizsuccess-button" onClick={nextQuiz}>
              다음 퀴즈 풀기
            </button>
            <button className="quizsuccess-button-stop" onClick={goToMain}>
              그만 풀기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizSuccess;
