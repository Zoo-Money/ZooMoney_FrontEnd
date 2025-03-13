import React from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../common/Footer";
import pig02 from "../images/pig02.png";
import "./css/AccountClose.css";

const AccountClose = () => {
  const location = useLocation(); // 상태를 받아오기 위해 useLocation 사용

  // state에서 추출
  const accountName = location.state?.accountName;

  return (
    <div className="mock-container">
      {/* 메인 콘텐츠 */}
      <div className="AccountCloseContent">
        <div>
          <span style={{ color: "#ff9500" }}>{accountName}</span>
          <br />
          저금통 해지가 완료되었어요
        </div>
        <img src={pig02} alt="pig02" />
        <Link to={"/account"}>
          <button>확인</button>
        </Link>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default AccountClose;
