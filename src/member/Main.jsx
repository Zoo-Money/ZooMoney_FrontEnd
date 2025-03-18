import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCardInfo, fetchMetadata } from "../card/CardService";
import Footer from "../common/Footer";
import defaultCardImage from "../images/bear01.png"; // 기본 이미지 경로
import daily from "../images/daily.png";
import moneyplan from "../images/moneyplan.png";
import pattern from "../images/pattern.png";
import quiz from "../images/quiz.png";
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

  useEffect(() => {
    // 서버와 SSE 연결
    const conn = () => {
      const eventSource = new EventSource(
        `http://localhost:7777/zoomoney/notify/subscribe/${memberNum}`
      );

      list();
      count();

      eventSource.addEventListener("NOTIFY", function (event) {
        list();
        count();
      });
    };

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

    conn();
    fetchData();
  }, [memberNum]);

  // 데이터 로드 후 렌더링
  if (loading) return null;

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
    <div className="mock-container">
      {/* 메인로고ZooMoney */}
      <div className="zoo-money">
        <div>
          <span className="zoo">Zoo</span>
          <span className="money">Money</span>
        </div>
        <div style={{ position: "relative" }}>
          {/* 종 모양 아이콘 */}
          <Badge badgeContent={count} color="error">
            <NotificationsIcon
              color="action"
              onClick={handleBellClick}
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
            />
          </Badge>

          {/* 알림 리스트 */}
          {view && (
            <div
              style={{
                paddingTop: "10px",
                position: "absolute",
                right: "-20px",
                minWidth: "200px",
                minHeight: "300px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                zIndex: 1,
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              <div
                className="AccountMainResult"
                style={{
                  maxHeight: "290px",
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

      <div className="cardMain-container">
        {/* 카드 이미지 미리보기 */}
        <div>
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
        <div className="allowance-card">
          <div className="card-header">
            <div className="allowance-text">
              <p className="allowance-title">나의 용돈</p>
              <p className="allowance-amount">{allowanceAmount}</p>
            </div>
          </div>
          <div className="button-group">
            <a href="/card/usehistory">
              <button type="button" className="sendmoney-button">
                카드사용내역
              </button>
            </a>
            <a href="/contract/contractWriteChild">
              <button type="button" className="sendmoney-button">
                용돈 계약서
              </button>
            </a>
          </div>
        </div>

        {/* 기능 카드 버튼 */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-full">
          <a href="/card/pattern" className="feature-card card-skyblue">
            <div>
              <img src={pattern} alt="소비 패턴 분석" />
              <p>소비 패턴 분석</p>
            </div>
          </a>
          <a href="/moneyplan/main" className="feature-card card-blue">
            <div>
              <img src={moneyplan} alt="용돈 계획 세우기" />
              <p>용돈 계획 세우기</p>
            </div>
          </a>
          <a href="/quiz/main" className="feature-card card-yellow">
            <div>
              <img src={quiz} alt="금융퀴즈" />
              <p>금융 퀴즈</p>
            </div>
          </a>
          <a href="/daily/main" className="feature-card card-pink">
            <div>
              <img src={daily} alt="출석체크" />
              <p>출석체크</p>
            </div>
          </a>
        </div>
        {/* 하단 네비게이션 바 */}
      </div>
      <Footer />
    </div>
  );
};
export default Main;
