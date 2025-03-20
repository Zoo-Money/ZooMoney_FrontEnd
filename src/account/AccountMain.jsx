import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import pig00 from "../images/pig/pig00.png";
import plus from "../images/plus.png";
import stamp from "../images/stamp.png";
import "./css/AccountMain.css";

const AccountMain = () => {
  // 세션 값 불러오기
  const memberNum = sessionStorage.getItem("member_num");
  const navigate = useNavigate();

  const [accountList, setAccountList] = useState([]);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const colorList = ["#FFCB9A", "#C2F1FF", "#FFF4C2", "#FEC7C0", "#CAFFC2"];

  useEffect(() => {
    // 사용자의 저금통 목록 조회
    const list = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7777/zoomoney/account/list/${memberNum}`
        );
        setAccountList(response.data);

        // 현재 금액 계산
        const amount = response.data.reduce(
          (acc, account) => acc + account.accountNow,
          0
        );
        setAmount(amount);
      } catch (error) {
        console.error("조회 실패");
      } finally {
        setLoading(false);
      }
    };

    list();
  }, [memberNum]);

  // 데이터 로드 후 렌더링
  if (loading) return null;

  const selectAccount = (accountNum, index) => {
    navigate("/account/detail", { state: { accountNum, index } }); // state로 전달
  };

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="AccountMainHeader">
        <div className="AccountMainHeaderText">
          <span>나의 저금통</span>
          <span>{accountList.length} 개</span>
        </div>
        <img src={pig00} alt="pig00" />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="AccountMainCount">
        {amount !== 0 ? (
          <span>현재 {amount.toLocaleString()}원 저금중 😎</span>
        ) : null}
      </div>
      <div className="AccountMainContent">
        <div className="AccountMainResult">
          {accountList.length > 0 ? (
            accountList.map((account, index) => {
              return (
                <form
                  key={index}
                  className="AccountMainForm"
                  style={{
                    backgroundColor:
                      new Date().setHours(0, 0, 0, 0) >
                      new Date(account.accountEnd)
                        ? "#c4c0ba" // 만기된 저금통 색상
                        : colorList[index % colorList.length],
                  }}
                  onClick={() => selectAccount(account.accountNum, index)}
                >
                  {account.accountGoal - account.accountNow <= 0 ? (
                    <img
                      className="AccountMainImage"
                      src={stamp}
                      alt="stamp"
                    ></img>
                  ) : null}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "0.9rem" }}>
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
                    <span style={{ fontSize: "0.9rem" }}>
                      {Math.floor(
                        (account.accountNow / account.accountGoal) * 100
                      ) + "% 달성"}
                    </span>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <span>{account.accountNow.toLocaleString()} 원</span>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
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
                      fontSize: "0.9rem",
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <label>목표 금액</label>
                    <span>{account.accountGoal.toLocaleString()} 원</span>
                  </div>
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

      {/* 저금통 만들기 버튼 */}
      <div className="AccountMainCreate">
        <Link to={"/account/create"}>
          <button>
            <img src={plus} alt="plus" style={{ maxWidth: "15%" }} />
            <span>저금통 만들기</span>
          </button>
        </Link>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};
export default AccountMain;
