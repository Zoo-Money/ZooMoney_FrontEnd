import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../common/Footer";
import pig01 from "../images/pig01.png";
import plus from "../images/plus.png";
import "./AccountMain.css";

const AccountMain = () => {
  // 세션 값 불러오기
  const memberNum = sessionStorage.getItem("member_num");

  const [accountList, setAccountList] = useState([]);
  const [accountCount, setAccountCount] = useState(0);
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
        setAccountCount(response.data.length);

        // 현재 금액 계산
        const amount = response.data.reduce(
          (acc, account) => acc + account.accountNow,
          0
        );
        setAmount(amount);
        setLoading(false);
      } catch (error) {
        console.error("조회 실패");
        setLoading(false);
      }
    };

    list();
  }, [memberNum]);

  // 데이터 로드 후 렌더링
  if (loading) return null;

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="AccountHeader">
        <div className="AccountHeaderText">
          <span>저금중인 금액</span>
          <span>{amount.toLocaleString()} 원</span>
        </div>
        <img src={pig01} alt="pig01" />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="AccountCount">
        {accountCount !== 0 ? (
          <span>현재 {accountCount}개의 저금통이 있어요 😎</span>
        ) : null}
      </div>
      <div className="AccountContent">
        <div className="AccountResult">
          {accountCount > 0 ? (
            accountList.map((account, index) => (
              <form
                key={index}
                className="AccountForm"
                style={{
                  backgroundColor: colorList[index % colorList.length],
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
                        (new Date(account.accountEnd) -
                          new Date(account.accountStart)) /
                          (1000 * 60 * 60 * 24)
                      );
                      return daysLeft === 0
                        ? "1일 미만 남음"
                        : `${daysLeft}일 남음`;
                    })()}
                  </span>
                  <span style={{ fontSize: "0.75rem" }}>
                    {Math.round(
                      (account.accountNow / account.accountGoal) * 100
                    )}
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
            ))
          ) : (
            <div className="AccountEmpty">
              <span>현재 저금통이 없어요 🥲</span>
            </div>
          )}
        </div>
      </div>

      {/* 저금통 만들기 버튼 */}
      <div className="AccountCreate">
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
