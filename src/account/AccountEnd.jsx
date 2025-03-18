import React from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../common/Footer";
import pig01 from "../images/pig/pig01.png";
import pig02 from "../images/pig/pig02.png";
import pig03 from "../images/pig/pig03.png";
import pig04 from "../images/pig/pig04.png";
import pig05 from "../images/pig/pig05.png";
import "./css/AccountEnd.css";

const AccountEnd = () => {
  const location = useLocation(); // 상태를 받아오기 위해 useLocation 사용

  // state에서 추출
  const accountName = location.state?.accountName;
  const status = location.state?.status;

  const data = {
    1: {
      message: "저금통 해지가 완료되었어요",
      image: pig01,
    },
    2: {
      message: (
        <>
          <span>저금통을 만들었어요</span>
          <br />
          <span style={{ fontSize: "1rem", fontWeight: "normal" }}>
            꾸준히 관리하면서 <br />
            목표금액까지 모아보세요!
          </span>
        </>
      ),
      image: pig02,
    },
    3: {
      message: "저금을 완료했어요",
      image: pig03,
    },
    4: {
      message: "목표를 달성했어요",
      image: pig04,
    },
    5: {
      message: (
        <>
          <span>부모님에게</span>
          <br />
          <span>해지 요청을 보냈어요</span>
        </>
      ),
      image: pig05,
    },
  };

  const content = data[status];

  return (
    <div className="mock-container">
      {/* 메인 콘텐츠 */}
      <div className="AccountEndContent">
        {content && (
          <div>
            <span style={{ color: "#ff9500" }}>{accountName}</span>
            <br />
            {content.message}
            <img src={content.image} alt={`pig0${status}`} />
          </div>
        )}
        <Link to={"/account"}>
          <button>확인</button>
        </Link>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default AccountEnd;
