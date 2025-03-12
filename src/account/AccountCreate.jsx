import axios from "axios";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Header from "../common/Header";
import Footer from "../common/Footer";

const AccountTest = () => {
  // 세션 값 불러오기
  const memberNum = sessionStorage.getItem("member_num");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(0);
  const [date, setDate] = useState("");

  const insertAccount = async () => {
    try {
      await axios.post("http://localhost:7777/zoomoney/account/insert", {
        memberNum: memberNum,
        accountName: name,
        accountGoal: goal,
        accountEnd: date,
      });
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
      <div className="content">
        <div>
          <div>
            저금통의 <span style={{ color: "#FF9500" }}>이름</span>을
            지어주세요.
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="저금통 이름 입력"
          />
          <div>
            돈을 <span style={{ color: "#FF9500" }}>얼마나</span> 모을까요?
          </div>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="목표 금액 입력"
          />
          <div>
            돈을 <span style={{ color: "#FF9500" }}>언제까지</span> 모을까요?
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div>
            <Button onClick={insertAccount}>저금통 생성</Button>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default AccountTest;
