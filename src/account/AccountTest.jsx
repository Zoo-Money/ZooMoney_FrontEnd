import axios from "axios";
import React, { useState } from "react";
import { Button } from "react-bootstrap";

function AccountTest() {
  const [target, setTarget] = useState(0);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(0);
  const [now, setNow] = useState(0);
  const [date, setDate] = useState("");

  const insertAccount = async () => {
    try {
      await axios.post("http://localhost:7777/zoomoney/account/insert", {
        memberNum: target,
        accountName: name,
        accountGoal: goal,
        accountNow: now,
        accountEnd: date,
      });
    } catch (error) {
      console.error("저금통 생성 실패", error);
    }
  };

  return (
    <div className="content">
      <h1>저금통 생성 테스트</h1>
      <div>
        <label>회원번호</label>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="회원번호"
        />
        <br></br>
        <label>저금통 이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="저금통 이름"
        />
        <br></br>
        <label>목표금액</label>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="저금통 금액"
        />
        <br></br>
        <label>입금</label>
        <input
          type="number"
          value={now}
          onChange={(e) => setNow(e.target.value)}
          placeholder="입금 금액"
        />
        <br></br>
        <label>목표날짜</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <br></br>

        <Button onClick={insertAccount}>저금통 생성</Button>
      </div>
    </div>
  );
}

export default AccountTest;
