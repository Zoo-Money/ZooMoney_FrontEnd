import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NotifyTest() {
  // 세션 값 불러오기
  const memberNum = sessionStorage.getItem("member_num");
  const navigate = useNavigate();

  const [target, setTarget] = useState(0);
  const [notifyList, setNotifyList] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState(false);

  useEffect(() => {
    // 사용자의 알림 목록 조회
    const list = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7777/zoomoney/notify/list/${memberNum}`
        );
        setNotifyList(response.data);
      } catch (error) {
        console.error("조회 실패");
      } finally {
        setLoading(false);
      }
    };

    // 읽지 않은 알림 개수 조회
    const count = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7777/zoomoney/notify/unread/${memberNum}`
        );
        setCount(response.data);
      } catch (error) {
        console.error("조회 실패");
      } finally {
        setLoading(false);
      }
    };

    list();
    count();
  }, [memberNum]);

  // 데이터 로드 후 렌더링
  if (loading) return null;

  const send = async () => {
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

  const handleBellClick = () => {
    setView(!view);
  };

  const selectNotify = async (notifyNum, notifyUrl) => {
    // 알림 상태(읽음 여부) 변경
    try {
      await axios.put(
        `http://localhost:7777/zoomoney/notify/check/${notifyNum}`
      );
    } catch (error) {
      console.error("알림 상태변경 실패", error);
    }

    navigate(notifyUrl);
  };

  // 알림 시간 계산
  function time(timestamp) {
    const now = Date.now(); // 현재 시간 (밀리초)
    const diff = now - new Date(timestamp); // 차이 계산 (밀리초)

    // 시간 단위 계산
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;

    if (diff < minute) {
      return "방금 전";
    } else if (diff < hour) {
      return `${Math.floor(diff / minute)}분 전`;
    } else if (diff < day) {
      return `${Math.floor(diff / hour)}시간 전`;
    } else if (diff < week) {
      return `${Math.floor(diff / day)}일 전`;
    } else if (diff < month) {
      return `${Math.floor(diff / week)}주 전`;
    } else {
      return `${Math.floor(diff / month)}개월 전`;
    }
  }

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

        <Button onClick={send}>알림 보내기</Button>
      </div>

      <div style={{ position: "relative" }}>
        {/* 종 모양 아이콘 */}
        <button
          onClick={handleBellClick}
          style={{ fontSize: "24px", cursor: "pointer" }}
        >
          🔔
        </button>

        {/* 알림 리스트 */}
        {view && (
          <div
            style={{
              position: "absolute",
              right: "20px",
              minWidth: "300px",
              minHeight: "300px",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              zIndex: 1,
              fontWeight: "bold",
            }}
          >
            <div style={{ marginTop: "20px" }}>
              🔔 읽지 않은 알림: {count}개
            </div>
            <hr />
            <div
              className="AccountMainResult"
              style={{
                maxHeight: "225px",
                overflowY: "auto",
              }}
            >
              {notifyList.map((notify) => (
                <form
                  key={notify.notifyNum}
                  className="AccountMainForm"
                  style={{
                    width: "90%",
                    height: "50%",
                    padding: "10px",
                    marginBottom: "10px",
                    backgroundColor:
                      notify.notifyCheck === false ? "#f5f5f5" : "#e5e5e5",
                    border:
                      notify.notifyCheck === false
                        ? "2px solid #ff9500"
                        : "none",
                  }}
                  onClick={() =>
                    selectNotify(notify.notifyNum, notify.notifyUrl)
                  }
                >
                  <div
                    style={{
                      textAlign: "right",
                      fontSize: "0.75rem",
                      fontWeight: "none",
                      color: "#666",
                    }}
                  >
                    {time(notify.notifyTime)}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: notify.notifyContent,
                    }}
                  />
                </form>
              ))}{" "}
            </div>
            <div style={{ margin: "0.5rem" }}></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotifyTest;
