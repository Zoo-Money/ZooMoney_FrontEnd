import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_PATH } from "../common/config.js";
import Header from "../common/Header";
import "./css/AccountClose.css";

const AccountClose = () => {
  const location = useLocation(); // 상태를 받아오기 위해 useLocation 사용
  const navigate = useNavigate();

  const member_name = sessionStorage.getItem("member_name");
  const memberNum = sessionStorage.getItem("member_num");

  // state에서 추출
  const accountNum = location.state?.accountNum;
  const accountName = location.state?.accountName;
  const accountMoneyLeft = location.state?.accountMoneyLeft;

  const closeAccount = async (accountNum) => {
    try {
      // 저금통 해지 요청
      await axios.put(
        `${API_PATH}/zoomoney/account/request/${accountNum}`,
        null,
        {
          params: { request: true }, // 쿼리 파라미터로 request 전달
        }
      );

      const response = await axios.get(`${API_PATH}/zoomoney/member/select`, {
        params: { memberNum: memberNum },
      });

      // 해지 요청 알림 전송
      await axios.post(`${API_PATH}/zoomoney/notify/send`, {
        memberNum: response.data[0].memberParent.memberNum,
        notifyContent: `🐷 ${member_name}님이 저금통 해지 요청을 보냈어요`,
        notifyUrl: "/parent/account",
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
        <div style={{ fontSize: "1.5rem" }}>
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
              backgroundColor: "#ff9500",
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
    </div>
  );
};

export default AccountClose;
