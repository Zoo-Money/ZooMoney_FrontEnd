import axios from "axios";
import React, { useState } from "react";
import { Button } from "react-bootstrap";

function NotifyTest() {
  const [target, setTarget] = useState(0);

  const sendNotification = async () => {
    try {
      await axios.post("http://localhost:7777/zoomoney/notify/send", {
        memberNum: target,
        notifyContent: "test",
        notifyUrl: "test.com",
      });
    } catch (error) {
      console.error("알림 전송 실패", error);
    }
  };

  return (
    <div className="content">
      <h1>알림 전송 테스트</h1>
      <div>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="알림 대상"
        />

        <Button onClick={sendNotification}>알림 보내기</Button>
      </div>
    </div>
  );
}

export default NotifyTest;
