import React from "react";
import "./CardCreateSuccess.css";
import Footer from "../common/Footer";
import bear02 from "../images/bear02.png";
import { Link } from "react-router-dom";

const CardCreateSuccess = () => {
  return (
    <div className="mock-container">
      {/* 메인 콘텐츠 */}
      <div className="content">
        <img src={bear02} alt="모의투자 캐릭터" className="main-image" />
      </div>
      <p className="description">카드 발급이 완료되었어요</p>
      <button className="success-button">
        <Link
          to="/card/main" // 상대경로로 수정
          className="success-button"
          style={{ textDecoration: "none" }}
        >
          홈으로
        </Link>
      </button>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default CardCreateSuccess;
