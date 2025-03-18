import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import "./Mypage.css";
import axios from "axios";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import bear02 from "../images/bear/bear02.png";
import { Link } from "react-router-dom";

function MyPage() {
  const [memberInfo, setMemberInfo] = useState(null);
  const memberNum = sessionStorage.getItem("member_num");

  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/member/select", {
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
  if (!memberInfo) {
    return <div>Loading...</div>; // 데이터가 로딩되지 않았을 때 화면에 로딩 메시지를 보여줍니다.
  }

  return (
    <div className="mock-container">
      <Header title="마이페이지" />

      <div className="mypageInfo">
        <div className="myDetail">
          <p className="mytitle">내정보</p>
          <div className="info-card">
            <img src={bear02} alt="bear02" className="bear-img" />
            <div className="info-row">
              <span className="label">아이디</span>
              <span className="InfoTitle">{memberInfo.memberId}</span>
            </div>
            <div className="password-section">
              <span className="label">비밀번호</span>
              <button className="edit-btn">수정</button>
            </div>
            <div className="info-row">
              <span className="label">이름</span>
              <span className="InfoTitle">{memberInfo.memberName}</span>
            </div>
            <div className="info-row">
              <span className="label">전화번호</span>
              <span className="InfoTitle">{memberInfo.memberPhone}</span>
            </div>
            <div className="info-row">
              <span className="label">포인트</span>
              <span className="InfoTitle bold point-text">
                {memberInfo.memberPoint}P
              </span>
            </div>
          </div>

          <div className="card-box">
            <div className="info-row2">
              <span className="label">카드관리</span>
              <Link to="/card/modify">
                <IoArrowForwardCircleOutline
                  size={22}
                  style={{ color: "black" }}
                />
              </Link>
            </div>
            <p className="card-subtext">
              5,000P / 10,000P 포인트를 사용하여 나만의 카드 꾸미기
            </p>
          </div>
          <div className="card-box">
            <div className="info-row2">
              <span className="label">모의주식</span>
              <Link to="/stock/stockHistory">
                <IoArrowForwardCircleOutline
                  size={22}
                  style={{ color: "black" }}
                />
              </Link>
            </div>
            <p className="card-subtext">
              나의 모의투자거래 내역과 모의투자 결과를 확인하세요
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MyPage;
