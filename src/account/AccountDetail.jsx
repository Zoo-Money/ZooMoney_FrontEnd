import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import ether from "../images/ether.png";
import "./css/AccountDetail.css";
import { burnTokens } from "./resources/AccountService";

const AccountDetail = () => {
  // 세션 값 불러오기
  const memberNum = sessionStorage.getItem("member_num");
  const location = useLocation(); // 상태를 받아오기 위해 useLocation 사용
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const colorList = ["#FFCB9A", "#C2F1FF", "#FFF4C2", "#FEC7C0", "#CAFFC2"];

  // state에서 추출
  const accountNum = location.state?.accountNum;
  const index = location.state?.index;

  useEffect(() => {
    const select = async () => {
      if (accountNum) {
        try {
          // 저금통 상세 조회
          const response = await axios.post(
            `http://localhost:7777/zoomoney/account/select/${accountNum}`
          );
          setAccount(response.data);
          setLoading(false);
        } catch (error) {
          console.error("조회 실패");
          setLoading(false);
        }
      }
    };

    select();
  }, [accountNum]);

  // 데이터 로드 후 렌더링
  if (loading) return null;

  const insertAccount = (accountNum) => {
    navigate("/account/insert", { state: { accountNum } }); // state로 전달
  };

  const closeAccount = async (accountNum) => {
    try {
      setIsLoading(true);

      setTimeout(() => {
        alert("저금통 해지 완료");
        setIsLoading(false);
      }, 1000);

      // 저금통 해지
      await burnTokens(account.accountNow);

      // 카드 금액 변경
      await axios.put(
        `http://localhost:7777/zoomoney/card/change/${memberNum}`,
        null,
        {
          params: { amount: account.accountNow }, // 쿼리 파라미터로 amount 전달
        }
      );
      // 저금통 상태 변경
      await axios.put(
        `http://localhost:7777/zoomoney/account/close/${accountNum}`
      );

      navigate("/account/close", {
        state: { accountName: account.accountName },
      });
    } catch (error) {
      console.error("해지 실패");
    }
  };

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="나의 저금통" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="AccountDetailContent">
        {account ? (
          <div className="AccountDetailResult">
            <form
              className="AccountDetailForm"
              style={{
                backgroundColor:
                  new Date().setHours(0, 0, 0, 0) > new Date(account.accountEnd)
                    ? "#c4c0ba" // 만기된 저금통 색상
                    : colorList[index % colorList.length],
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "0.75rem" }}>
                  {(() => {
                    const daysLeft = Math.ceil(
                      (new Date(account.accountEnd) - new Date()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return new Date().setHours(0, 0, 0, 0) >
                      new Date(account.accountEnd)
                      ? "만기일 지남" // 만기일이 지났을 때
                      : daysLeft === 0
                      ? "1일 미만 남음" // 남은 일수가 1일 미만일 때
                      : `${daysLeft}일 남음`; // 남은 일수가 1일 이상일 때
                  })()}
                </span>
                <span style={{ fontSize: "0.75rem" }}>
                  {Math.floor((account.accountNow / account.accountGoal) * 100)}
                  % 달성
                </span>
              </div>
              <div style={{ marginTop: "20px" }}>
                <span>{account.accountNow.toLocaleString()} 원</span>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <span>{account.accountName}</span>
              </div>
              <div>
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
            </form>

            <div className="AccountDetailView">
              <div>
                <span>시작 날짜</span>
                <span>{account.accountStart}</span>
              </div>
              <div>
                <span>만기 날짜</span>
                <span>{account.accountEnd}</span>
              </div>
              <div>
                <img src={ether} alt="ether" />
              </div>
            </div>

            <button
              style={{
                backgroundColor: "#f9a825",
              }}
              onClick={() => {
                new Date().setHours(0, 0, 0, 0) > new Date(account.accountEnd)
                  ? closeAccount(accountNum)
                  : insertAccount(accountNum);
              }}
              disabled={isLoading}
            >
              <span>
                {new Date().setHours(0, 0, 0, 0) > new Date(account.accountEnd)
                  ? isLoading ? "처리 중..." : "해지하기"
                  : "저금하기"}
              </span>
            </button>
            {new Date().setHours(0, 0, 0, 0) >
            new Date(account.accountEnd) ? null : (
              <button
                style={{
                  backgroundColor: "#c4c0ba",
                }}
              >
                <span>해지 요청하기</span>
              </button>
            )}
          </div>
        ) : null}
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default AccountDetail;
