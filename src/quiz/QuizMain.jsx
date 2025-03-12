import React from "react";
import "./quizMain.css";
import Footer from "../common/Footer";
import giraffe2 from "../images/quiz/giraffe_main.png";
import Header from "../common/Header";

const QuizMain = () => {
  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="오늘의 금융퀴즈" /> {/* 원하는 제목을 props로 전달 */}
      </div>

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
        <button className="quizmain-button">퀴즈 시작하기</button>

        {/* 주의사항 */}
        <p className="quizmain-check">
          <strong>꼭 확인해주세요</strong>
        </p>
        <p className="quizmain-description">
          <li>매일 5개의 퀴즈에 도전할 수 있어요.</li>
          <li>퀴즈를 맞힐 때마다 100p를 받아요.</li>
          <li>
            퀴즈를 풀다가 중간에 화면이나 앱을 나가면 퀴즈 결과에서 틀린 걸로
            반영돼요.
          </li>
        </p>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default QuizMain;
