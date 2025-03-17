import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import "./css/AccountClose.css";

const AccountClose = () => {
  const location = useLocation(); // 상태를 받아오기 위해 useLocation 사용
  const navigate = useNavigate();

  const member_name = sessionStorage.getItem("member_name");
  const target = sessionStorage.getItem("member_parent");

  // state에서 추출
  const accountNum = location.state?.accountNum;
  const accountName = location.state?.accountName;
  const accountMoneyLeft = location.state?.accountMoneyLeft;

  const closeAccount = async (accountNum) => {
    try {
      // 저금통 해지 요청
      await axios.put(
        `http://localhost:7777/zoomoney/account/request/${accountNum}`,
        null,
        {
          params: { request: true }, // 쿼리 파라미터로 request 전달
        }
      );

      // 해지 요청 알림 전송
      await axios.post("http://localhost:7777/zoomoney/notify/send", {
        memberNum: target,
        notifyContent: `🐷 ${member_name}님이 저금통 해지 요청을 보냈어요`,
        notifyUrl: "부모 저금통 상세 페이지 링크",
      });
    } catch (error) {
      console.error("알림 전송 실패", error);
    }

    navigate("/account/end", { state: { accountNum, status: 5 } }); // state로 전달
  };

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="해지 요청" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="AccountCloseContent">
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          목표금액까지
          <br />
          <span style={{ color: "#ff9500" }}>
            {accountMoneyLeft.toLocaleString()}
          </span>{" "}
          원 남았어요
        </div>
        <div>
          정말로 <span style={{ color: "#ff9500" }}>{accountName}</span>{" "}
          저금통을
          <br />
          해지하시겠어요?
        </div>
        <div style={{ marginTop: "2rem" }}>
          <button
            style={{
              backgroundColor: "#f9a825",
            }}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
        <div>
          <button
            style={{
              backgroundColor: "#c4c0ba",
            }}
            onClick={() => closeAccount(accountNum)}
          >
            해지 요청하기
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default AccountClose;
