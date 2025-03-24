import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge } from "@mui/material";
import axios from "axios";
import { API_PATH } from "../common/config.js";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import rabbit02 from "../images//rabbit/rabbit02.png";
import bear04 from "../images/bear/bear04.png";
import deer02 from "../images/deer/deer02.png";
import pig02 from "../images/pig/pig02.png";
import profile1 from "../images/profile1.png";
import profile2 from "../images/profile2.png";
import "./css/parentMain.css";

const ParentMain = () => {
  const navigate = useNavigate();
  const handleMoneyContractManageClick = () => {
    navigate("/contract/moneyContractManage");
  };
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const selectedChildInfo = children.find(
    (child) => child.memberNum === selectedChild
  );
  const [cardMoney, setCardMoney] = useState(0);
  const [count, setCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [view, setView] = useState(false);
  const [notifyList, setNotifyList] = useState([]);
  const [, setLoading] = useState(true);
  const isFirstLoad = useRef(true);

  // 부모, 아이 정보가 모두 필요한 화면이라 혼동을 막기 위해 parentId 사용
  const parentId = sessionStorage.getItem("member_num");
  // 부모 ID 기반으로 자녀 목록 불러오기

  const f_getChildren = async () => {
    if (!parentId) {
      console.error("부모 ID가 없습니다. 로그인 후 시도하세요.");
      return;
    }
    await axios
      .get(`${API_PATH}/zoomoney/contract/getChildByParent`, {
        params: { parentId: parentId },
      })
      .then((response) => {
        setChildren(response.data);

        // query parameter에서 childNum이 있는지 확인
        let queryChildNum = 0;
        if (response.data.length > 0) {
          queryChildNum = response.data[0].memberNum;
        }
        queryChildNum = Number(queryChildNum);
        setSelectedChild(queryChildNum);
        sessionStorage.setItem("childNum", String(queryChildNum));
      })
      .catch((error) => {
        console.error("자녀 목록 불러오기 실패:", error);
      });
  };

  const f_getChildMoney = async () => {
    let child;
    if (selectedChild == null) {
      child = sessionStorage.getItem("childNum");
    } else {
      child = selectedChild;
    }

    await axios
      .get(`${API_PATH}/zoomoney/contract/child/money`, {
        params: { memberNum: Number(child) },
      })
      .then((response) => {
        setCardMoney(response.data.cardMoney);
      })
      .catch((error) => {
        console.error("카드 정보 불러오기 실패:", error);
        setCardMoney(0); // 카드 데이터가 없을 경우 기본 값 0 설정
      });
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      f_getChildren();
      isFirstLoad.current = false; //
    }
  });

  useEffect(() => {
    f_getChildMoney();
  });

  // 자녀 선택 시 상태 업데이트
  const handleChildSelect = (childNum) => {
    setSelectedChild(childNum);
    sessionStorage.setItem("childNum", String(childNum)); // 문자열로 저장해야 함
  };

  useEffect(() => {
    // 서버와 SSE 연결
    const conn = () => {
      const eventSource = new EventSource(
        `${API_PATH}/zoomoney/notify/subscribe/${parentId}`
      );

      // 알림 정보 갱신
      list();
      count();

      eventSource.addEventListener("NOTIFY", async () => {
        // 알림 아이콘 애니메이션
        setShake(true);
        setTimeout(() => setShake(false), 500);

        // 알림 정보 갱신
        await list();
        await count();
      });
    };

    // 사용자의 알림 목록 조회
    const list = async () => {
      try {
        const response = await axios.get(
          `${API_PATH}/zoomoney/notify/list/${parentId}`
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
          `${API_PATH}/zoomoney/notify/unread/${parentId}`
        );
        setCount(response.data);
      } catch (error) {
        console.error("조회 실패");
      } finally {
        setLoading(false);
      }
    };

    conn();
  }, [parentId]);

  const animate = () => {
    // 알림 아이콘 애니메이션
    setShake(true);
    setTimeout(() => setShake(false), 500);

    setView(!view);
  };

  const selectNotify = async (notifyNum, notifyUrl) => {
    // 알림 상태(읽음 여부) 변경
    try {
      await axios.put(`${API_PATH}/zoomoney/notify/check/${notifyNum}`);
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

  const goMoneyPlan = () => {
    navigate("/parent/confirm");
  };
  const goChildEventSend = () => {
    navigate("/parent/childEventSend");
  };
  const gocusumehistory = () => {
    navigate("/parent/usehistoryParent");
  };
  const goPattern = () => {
    navigate("/parent/patternParent");
  };
  const goAccount = () => {
    navigate("/parent/account", { state: { target: selectedChild } }); // state로 전달
  };

  return (
    <div className="mock-container">
      <div className="parent-main-zoo-money-title">
        <div>
          <span className="parent-main-zoo">Zoo</span>
          <span className="parent-main-money">Money</span>
        </div>
        <div style={{ position: "relative" }}>
          {/* 종 모양 아이콘 */}
          <Badge badgeContent={count} color="error">
            <NotificationsIcon
              className={shake ? "bell-shake" : ""}
              color="action"
              style={{
                color: view ? "#ff9500" : "",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
              onClick={animate}
            />
          </Badge>
          {/* 알림 리스트 */}
          {view && (
            <div
              className="notifyList"
              style={{
                padding: "10px",
                paddingBottom: "5px",
                position: "absolute",
                right: "-15px",
                minWidth: "200px",
                minHeight: "350px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                zIndex: 1,
                fontSize: "1rem",
              }}
            >
              <div
                className="AccountMainResult"
                style={{
                  maxHeight: "325px",
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
                        notify.notifyCheck === false ? "#F5F5F5" : "#E5E5E5",
                      border:
                        notify.notifyCheck === false
                          ? "2px solid #FF9500"
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
      {/* 프로필 영역 */}
      <div className="parent-main-profile-container">
        {" "}
        {/* 가로로 정렬을 위한 추가 */}
        {children.map((child) => (
          <div
            key={child.memberNum}
            className={`profile-wrapper ${
              selectedChild === child.memberNum ? "selected" : ""
            }`}
            onClick={() => {
              handleChildSelect(child.memberNum);
              setTimeout(
                () => sessionStorage.setItem("childNum", child.memberNum),
                0
              ); // 즉시 실행 (이 시점에서 selectedChild는 아직 변경되지 않았을 수 있음)
            }}
          >
            <img
              className="profile-image"
              src={child.memberNum % 2 === 0 ? profile1 : profile2}
              alt={child.memberName}
            />
            <div className="profile-name">
              {/* 이름을 프로필 아래에 위치 */}
              <span>{child.memberName}</span>
            </div>
          </div>
        ))}
      </div>
      {/* 용돈 정보 카드 */}
      <div className="parent-main-allowance-card">
        <div className="parent-main-card-header">
          <div className="parent-main-allowance-text">
            <p className="parent-main-allowance-title">
              <span className="parent-main-allowance-cild-name">
                {selectedChildInfo ? selectedChildInfo.memberName : "자녀 없음"}
              </span>
              의 용돈
            </p>
            <p className="parent-main-allowance-amount">
              {cardMoney.toLocaleString()} 원
            </p>
          </div>
          <button
            className="parent-main-consumptionhistory-button"
            onClick={gocusumehistory}
          >
            소비내역 확인
          </button>
        </div>
        <button className="sendmoney-button" onClick={goChildEventSend}>
          용돈 보내기
        </button>
      </div>
      {/* 기능 카드 버튼 */}
      <div className="parent-grid grid-cols-2 gap-3 mt-1 w-full">
        <div
          className="parent-card card-blue"
          onClick={handleMoneyContractManageClick}
        >
          <img className="parent-bear" src={bear04} alt="용돈 계약서" />
          <p>용돈 계약서</p>
        </div>
        <div className="parent-card card-yellow" onClick={goMoneyPlan}>
          <img className="parent-deer" src={deer02} alt="용돈 계획확인" />
          <p>용돈 계획 확인</p>
        </div>
        <div className="parent-card card-pink" onClick={goPattern}>
          <img className="parent-rabbit" src={rabbit02} alt="소비패턴 분석" />
          <p>소비 패턴 분석</p>
        </div>
        <div className="parent-card card-green" onClick={goAccount}>
          <img className="parent-pig" src={pig02} alt="저금통 확인" />
          <p>저금통 확인</p>
        </div>
      </div>
    </div>
  );
};
export default ParentMain;
