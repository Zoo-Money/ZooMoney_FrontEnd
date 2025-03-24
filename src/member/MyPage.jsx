import axios from "axios";
import { API_PATH } from "../common/config.js";
import React, { useEffect, useState } from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import bear02 from "../images/bear/bear02.png";
import "./Mypage.css";

function MyPage() {
  const [memberInfo, setMemberInfo] = useState(null);
  const memberNum = sessionStorage.getItem("member_num");
  const member_type = sessionStorage.getItem("member_type");

  useEffect(() => {
    axios
      .get(`${API_PATH}/zoomoney/member/select`, {
        params: { memberNum },
      })
      .then((response) => {
        if (response.data.length > 0) {
          setMemberInfo(response.data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching member info:", error);
      });
  }, [memberNum]);

  const masking = (num) => {
    return num.replace(num.substring(9), "****");
  };

  if (!memberInfo) return null;

  return (
    <div className="mock-container">
      <Header title="마이페이지" />

      <div className="mypageInfo">
        <div className="myDetail">
          <p className="mytitle">내 정보</p>
          <div className="info-card">
            <img src={bear02} alt="bear02" className="bear-img" />
            <div className="info-row">
              <span className="label">아이디</span>
              <span className="InfoTitle">{memberInfo.memberId}</span>
            </div>
            <div className="password-section">
              <span className="label">비밀번호</span>
              <button className="edit-btn">변경</button>
            </div>
            <div className="info-row">
              <span className="label">이름</span>
              <span className="InfoTitle">{memberInfo.memberName}</span>
            </div>
            <div className="info-row">
              <span className="label">전화번호</span>
              <span className="InfoTitle">
                {masking(memberInfo.memberPhone)}
              </span>
            </div>
            {member_type === "parent" ? null : (
              <div className="info-row">
                <span className="label">포인트</span>
                <span className="InfoTitle bold point-text">
                  {memberInfo.memberPoint.toLocaleString()} P
                </span>
              </div>
            )}
          </div>
          {member_type === "parent" ? null : (
            <>
              <Link to="/card/modify" className="link-no-underline">
                <div className="card-box">
                  <div className="info-row2">
                    <span className="label">카드 관리</span>
                    <IoArrowForwardCircleOutline
                      size={22}
                      style={{ color: "black" }}
                    />
                  </div>
                  <p className="card-subtext">
                    나만의 카드 꾸미기 (10,000P 필요)
                  </p>
                </div>
              </Link>
              <Link to="/stock/stockHistory" className="link-no-underline">
                <div className="card-box">
                  <div className="info-row2">
                    <span className="label">모의투자 기록</span>
                    <IoArrowForwardCircleOutline
                      size={22}
                      style={{ color: "black" }}
                    />
                  </div>
                  <p className="card-subtext">
                    모의투자 거래 내역과 랭킹 확인하기
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
