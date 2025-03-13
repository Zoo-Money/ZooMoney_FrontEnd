import React, { useEffect, useState } from "react";
import "./quizMain.css";
import Footer from "../common/Footer";
import giraffe2 from "../images/quiz/giraffe_main.png";
import Header from "../common/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuizMain = () => {
  const [quizCount, setQuizCount] = useState(0); // 퀴즈 데이터 개수를 저장할 상태

  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/quiz/count")
      .then((response) => {
        console.log("✅ 백엔드 응답:", response.data); // 백엔드 응답 확인
        setQuizCount(response.data.quizCount); // 상태 업데이트
      })
      .catch((error) => console.error("퀴즈의 개수를 알 수 없습니다.", error));
  }, []);

  const navigate = useNavigate();

  const startQuiz = () => {
    if (quizCount >= 5) {
      // 누적 퀴즈 data수가 5개 이상이면
      navigate("/quiz/end"); // 종료 페이지로 이동
    } else {
      // 5개 미만이면
      navigate("/quiz/quiz"); // 퀴즈 출제 페이지로 이동
    }
  };

  return (
    <div className="mock-container">
      <Header title="오늘의 금융퀴즈" />

      {/* 메인 콘텐츠 */}
      <div className="quizmain-content">
        <img src={giraffe2} alt="퀴즈 메인 캐릭터" className="quizmain-image" />

        {/* 총 점수 */}
        <div className="quizmain-total-box">
          <div className="quizmain-total">
            <p className="quizmain-total-title">
              <strong>나의 참여 현황</strong>
            </p>
            <div className="quizmain-total-content">
              <div className="quizmain-total-detail">
                <p className="quizmain-total-left">포인트 적립</p>
                <p className="quizmain-total-right">300P</p>
              </div>
              <div className="quizmain-total-detail">
                <p className="quizmain-total-left">도전한 퀴즈</p>
                <p className="quizmain-total-right">5문제</p>
              </div>
              <div className="quizmain-total-detail">
                <p className="quizmain-total-left">맞힌 정답</p>
                <p className="quizmain-total-right">3문제</p>
              </div>
            </div>
            <div className="quizmain-total-rate">
              <div className="quizmain-total-graph"></div>
              <div className="quizmain-total-calc">
                <p className="quizmain-calc-left">오늘의 정답률</p>
                <p className="quizmain-calc-right">77%</p>
              </div>
            </div>
          </div>
        </div>

        <p className="quizmain-today">
          <strong>오늘 푼 퀴즈: 2/5</strong>
        </p>
        <button className="quizmain-button" onClick={startQuiz}>
          퀴즈 시작하기
        </button>

        {/* 주의사항 */}
        <p className="quizmain-check">
          <strong>꼭 확인해주세요</strong>
        </p>
        <p className="quizmain-description">
          <li>매일 5개의 퀴즈에 도전할 수 있어요.</li>
          <li>퀴즈를 맞힐 때마다 100p를 받아요.</li>
          {/* <li>
            퀴즈를 풀다가 중간에 화면이나 앱을 나가면 퀴즈 결과에서 틀린 걸로
            반영돼요.
          </li> */}
        </p>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default QuizMain;
