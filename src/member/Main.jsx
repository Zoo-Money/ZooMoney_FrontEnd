import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge } from "@mui/material";
import axios from "axios";
import { API_PATH } from "../common/config.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCardInfo, fetchMetadata } from "../card/resources/CardService";
import defaultCardImage from "../images/cardmain.png"; // 기본 이미지 경로
import deer02 from "../images/deer/deer02.png";
import giraffe05 from "../images/giraffe/giraffe05.png";
import pig00 from "../images/pig/pig00.png";
import point01 from "../images/point/point01.jpg";
import rabbit01 from "../images/rabbit/rabbit01.png";
import { Link } from "react-router-dom";
import "./Main.css";

const Main = () => {
  const memberNum = sessionStorage.getItem("member_num"); // 세션에서 member_num 가져오기
  const navigate = useNavigate();

  const [metadata, setMetadata] = useState(null);
  const [, setMetadataUrl] = useState("");
  const [, setTokenId] = useState("");
  const [, setLoading] = useState(true);
  const [loading, setNewLoading] = useState(true);
  const [allowanceAmount, setAllowanceAmount] = useState("0원");
  const [notifyList, setNotifyList] = useState([]);
  const [count, setCount] = useState(0);
  const [view, setView] = useState(false);
  const [shake, setShake] = useState(false);
  const [memberPoint, setMemberPoint] = useState("0");

  useEffect(() => {
    // 서버와 SSE 연결
    const conn = () => {
      const eventSource = new EventSource(
        `${API_PATH}/zoomoney/notify/subscribe/${memberNum}`
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
          `${API_PATH}/zoomoney/notify/list/${memberNum}`
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
          `${API_PATH}/zoomoney/notify/unread/${memberNum}`
        );
        setCount(response.data);
      } catch (error) {
        console.error("조회 실패");
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      // 카드 정보 가져오기
      await fetchCardInfo(memberNum, setTokenId, setNewLoading);
      const savedAllowance = sessionStorage.getItem("card_money");
      const tokenId = sessionStorage.getItem("cardMetadata");
      // memberNum이나 tokenId가 없으면 데이터를 가져오지 않음
      if (!tokenId || !memberNum) {
        setLoading(false); // 바로 로딩 상태를 false로 변경하여 UI 업데이트
        return;
      }

      try {
        // 메타데이터 가져오기
        await fetchMetadata(tokenId, setMetadata, setMetadataUrl, setLoading);

        // allowanceAmount 값이 있으면 설정
        if (savedAllowance) {
          setAllowanceAmount(`${Number(savedAllowance).toLocaleString()} 원`);
        }
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      } finally {
        setLoading(false); // 모든 작업이 끝난 후 로딩 상태 변경
      }
    };

    // 포인트 조회
    const fetchMemberPoint = async () => {
      try {
        const response = await axios.get(
          `${API_PATH}/zoomoney/member/point/${memberNum}`
        );
        const formattedPoint = Number(
          response.data.member_point
        ).toLocaleString(); // 숫자에 , 추가
        setMemberPoint(`${formattedPoint}`);
      } catch (error) {
        console.error("포인트 불러오기 실패", error);
      }
    };

    fetchMemberPoint();

    conn();
    fetchData();
  }, [memberNum]);

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

  // 데이터 로드 후 렌더링
  if (loading) return null;

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
    <div className="mock-container">
      {/* 메인로고ZooMoney */}
      <div className="main-zoomoney-text">
        <div>
          <span className="main-zoo">Zoo</span>
          <span className="main-money">Money</span>
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
                borderRadius: "20px",
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
                ))}
              </div>
              <div style={{ margin: "0.5rem" }}></div>
            </div>
          )}
        </div>
      </div>

      <div className="card-main-container">
        {/* 카드 이미지 미리보기 */}
        <div className="card-main-box">
          <div className="mycard-preview">
            {loading ? (
              <div className="loading-overlay">로딩 중...</div> // 로딩 중 UI (예: 텍스트나 애니메이션)
            ) : (
              <>
                <img
                  src={
                    metadata && metadata.image
                      ? metadata.image
                      : defaultCardImage // metadata가 있을 때만 이미지 사용, 없으면 기본 이미지
                  }
                  alt="카드 미리보기"
                  className={
                    metadata && metadata.image
                      ? "mycard-image custom-image"
                      : "mycard-image default-image"
                  }
                  onClick={() => {
                    navigate("/card/modify");
                  }}
                />
                {!metadata?.image && (
                  <Link to="/card/create">
                    <img
                      src={defaultCardImage} // 기본 이미지를 사용
                      alt="기본 카드 이미지"
                      className="mycard-image default-image"
                    />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* 용돈 정보 카드 */}
        <div className="main-allowance-box">
          <div className="main-point-box">
            <img src={point01} alt="point01" className="main-point-image" />
            <div className="main-point-num">
              <p>{memberPoint}</p>
            </div>
          </div>
          <div className="main-allowance-text">
            <span>나의 용돈</span>
            <span>{allowanceAmount}</span>
          </div>
          <div
            className="main-button-group"
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <button
              onClick={() =>
                navigate(
                  metadata && metadata.image
                    ? "/card/usehistory"
                    : "/card/create"
                )
              }
            >
              카드사용내역
            </button>
            <button
              onClick={() =>
                navigate(
                  metadata && metadata.image
                    ? "/contract/contractSelect"
                    : "/card/create"
                )
              }
            >
              용돈 계약서
            </button>
          </div>
        </div>

        {/* 기능 카드 버튼 */}
        <div className="main-grid grid-cols-2 gap-2 mt-1 w-full">
          <div
            className="main-grid-box box-skyblue"
            onClick={() =>
              navigate(
                metadata && metadata.image ? "/card/pattern" : "/card/create"
              )
            }
          >
            <div>
              <img
                src={rabbit01}
                className="card-rabbit"
                alt="소비 패턴 분석"
              />
              <p>소비 패턴 분석</p>
            </div>
          </div>
          <div
            className="main-grid-box box-blue"
            onClick={() =>
              navigate(
                metadata && metadata.image ? "/moneyplan/main" : "/card/create"
              )
            }
          >
            <div>
              <img src={deer02} className="card-deer" alt="용돈 계획 세우기" />
              <p>용돈 계획</p>
            </div>
          </div>
          <div
            className="main-grid-box box-yellow"
            onClick={() => navigate("/quiz/main")}
          >
            <div>
              <img src={giraffe05} className="card-giraffe" alt="금융퀴즈" />
              <p>금융 퀴즈</p>
            </div>
          </div>
          <div
            className="main-grid-box box-pink"
            onClick={() => navigate("/daily/main")}
          >
            <div>
              <img src={pig00} className="card-pig" alt="출석체크" />
              <p>출석체크</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Main;
