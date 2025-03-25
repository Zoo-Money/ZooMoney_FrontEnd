import React from "react";
import { Link } from "react-router-dom";
import bear01 from "../images/bear/bear01.png";
import "./css/CardCreateSuccess.css";

const CardCreateSuccess = () => {
  return (
    <div className="mock-container">
      {/* 메인 콘텐츠 */}
      <div className="content">
        <img src={bear01} alt="bear01" className="main-image" />
      </div>
      <p className="description">카드 발급이 완료되었어요</p>
      <Link
        to="/main" // 상대경로로 수정
        className="success-button"
        style={{ textDecoration: "none" }}
      >
        <button className="success-button">홈으로</button>
      </Link>
    </div>
  );
};

export default CardCreateSuccess;
