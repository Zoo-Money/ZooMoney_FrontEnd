import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { Button } from "react-bootstrap";

const ParentAccount = () => {
  const location = useLocation(); // 상태를 받아오기 위해 useLocation 사용
  const navigate = useNavigate();

  const [accountList, setAccountList] = useState([]);
  const [loading, setLoading] = useState(true);

  const colorList = ["#FFCB9A", "#C2F1FF", "#FFF4C2", "#FEC7C0", "#CAFFC2"];

  // state에서 추출
  const target = location.state?.target;

  useEffect(() => {
    // 사용자의 저금통 목록 조회
    const list = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7777/zoomoney/account/list/${target}`
        );
        setAccountList(response.data);
      } catch (error) {
        console.error("조회 실패");
      } finally {
        setLoading(false);
      }
    };

    list();
  }, [target]);

  // 데이터 로드 후 렌더링
  if (loading) return null;

  const selectApply = async (accountNum, accountName) => {
    try {
      // 저금통 상태 변경
      await axios.put(
        `http://localhost:7777/zoomoney/account/close/${accountNum}`
      );

      // 해지 알림 전송
      await axios.post("http://localhost:7777/zoomoney/notify/send", {
        memberNum: target,
        notifyContent: `🐷 ${accountName}<br>저금통 해지 요청이 승인되었어요`,
        notifyUrl: "/account",
      });
    } catch (error) {
      console.error("오류 발생", error);
    }

    navigate(0);
  };

  const selectReject = async (accountNum, accountName) => {
    try {
      // 저금통 해지 요청 거절
      await axios.put(
        `http://localhost:7777/zoomoney/account/request/${accountNum}`,
        null,
        {
          params: { request: false }, // 쿼리 파라미터로 request 전달
        }
      );

      // 해지 요청 거절 알림 전송
      await axios.post("http://localhost:7777/zoomoney/notify/send", {
        memberNum: target,
        notifyContent: `🐷 ${accountName}<br>저금통 해지 요청이 거절되었어요`,
        notifyUrl: "/account",
      });
    } catch (error) {
      console.error("오류 발생", error);
    }

    navigate(0);
  };

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="저금통 확인" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="AccountMainContent">
        <div
          className="AccountMainResult"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {accountList.length > 0 ? (
            accountList.map((account, index) => {
              return (
                <form
                  key={index}
                  className="AccountMainForm"
                  style={{
                    backgroundColor:
                      account.accountGoal - account.accountNow <= 0
                        ? "#f9a825" // 목표 금액 달성 시 색상
                        : new Date().setHours(0, 0, 0, 0) >
                          new Date(account.accountEnd)
                        ? "#c4c0ba" // 만기된 저금통 색상
                        : colorList[index % colorList.length],
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "0.75rem" }}>
                      {/* 남은 일수 계산 */}
                      {(() => {
                        const daysLeft = Math.ceil(
                          (new Date(account.accountEnd) - new Date()) /
                            (1000 * 60 * 60 * 24)
                        );
                        return new Date().setHours(0, 0, 0, 0) >
                          new Date(account.accountEnd)
                          ? "만기일 지남" // 만기일이 지났을 때
                          : daysLeft < 1
                          ? "1일 미만 남음" // 남은 일수가 1일 미만일 때
                          : `${daysLeft}일 남음`; // 남은 일수가 1일 이상일 때
                      })()}
                    </span>
                    <span style={{ fontSize: "0.75rem" }}>
                      {account.accountGoal - account.accountNow <= 0
                        ? "목표 달성 완료 💘" // 목표 달성 시 표시
                        : Math.floor(
                            (account.accountNow / account.accountGoal) * 100
                          ) + "% 달성"}
                    </span>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <span>{account.accountNow.toLocaleString()} 원</span>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <span>{account.accountName}</span>
                  </div>
                  <div>
                    <div
                      className="progress bg-secondary bg-opacity-50"
                      style={{ height: "0.5rem" }}
                    >
                      <div
                        className="progress bg-light"
                        role="progressbar"
                        style={{
                          width:
                            (account.accountNow / account.accountGoal) * 100 +
                            "%",
                          height: "0.5rem",
                        }}
                        aria-valuenow={
                          (account.accountNow / account.accountGoal) * 100
                        }
                      ></div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <label>목표 금액</label>
                    <span>{account.accountGoal.toLocaleString()} 원</span>
                  </div>
                  {account.accountRequest === true && (
                    <div>
                      <hr />
                      <span style={{ fontSize: "1rem" }}>해지 요청</span>
                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Button
                          variant="success"
                          style={{ minWidth: "100px" }}
                          onClick={() => selectApply(account.accountNum, account.accountName)}
                        >
                          승인
                        </Button>
                        &emsp;
                        <Button
                          variant="danger"
                          style={{ minWidth: "100px" }}
                          onClick={() => selectReject(account.accountNum, account.accountName)}
                        >
                          거절
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              );
            })
          ) : (
            <div className="AccountMainEmpty">
              <span>현재 저금통이 없어요 🥲</span>
            </div>
          )}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};
export default ParentAccount;
