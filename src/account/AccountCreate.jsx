import axios from "axios";
import React, { useState } from "react";
import { InputGroup, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import "./css/AccountCreate.css";
import { toast } from "react-toastify";

const AccountTest = () => {
  // 세션 값 불러오기
  const memberNum = sessionStorage.getItem("member_num");
  const navigate = useNavigate();

  // 오늘 날짜 구하기
  const today = new Date().toISOString().split("T")[0];

  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [date, setDate] = useState("");

  const insertAccount = async () => {
    if (!name || !goal || !date) {
      toast.warning("모든 빈 칸을 채워주세요.");
      return;
    }

    try {
      await axios.post("http://localhost:7777/zoomoney/account/create", {
        memberNum: memberNum,
        accountName: name,
        accountGoal: goal,
        accountEnd: date,
      });

      navigate("/account/end", { state: { accountName: name, status: 2 } }); // state로 전달
    } catch (error) {
      console.error("저금통 생성 실패", error);
    }
  };

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="저금통 만들기" />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="AccountCreateContent">
        <div className="AccountCreateText">
          저금통의 <span style={{ color: "#FF9500" }}>이름</span>을 지어주세요.
        </div>
        <InputGroup className="AccountCreateInput">
          <Form.Control
            type="text"
            placeholder="저금통 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputGroup>
        <div className="AccountCreateText">
          돈을 <span style={{ color: "#FF9500" }}>얼마나</span> 모을까요?
        </div>
        <InputGroup className="AccountCreateInput">
          <Form.Control
            type="number"
            placeholder="목표 금액"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <InputGroup.Text>원</InputGroup.Text>
        </InputGroup>
        <div className="AccountCreateText">
          돈을 <span style={{ color: "#FF9500" }}>언제까지</span> 모을까요?
        </div>
        <InputGroup className="AccountCreateInput">
          <Form.Control
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
          />
        </InputGroup>
      </div>

      {/* 저금통 생성 버튼 */}
      <div className="AccountCreate">
        <button onClick={insertAccount}>
          <span>다음</span>
        </button>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};
export default AccountTest;
