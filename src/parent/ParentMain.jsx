import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import profile1 from "../images/profile1.png";
import profile2 from "../images/profile2.png";
import allowanceContract from "../images/allowanceContract.png";
import allowancePlan from "../images/allowancePlan.png";
import consumpPattern from "../images/consumpPattern.png";
import piggyBank from "../images/piggyBank.png";
import "./parentMain.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ParentMain = () => {
  const navigate = useNavigate();
  const handleMoneyContractManageClick = () => {
    navigate("/contract/moneyContractManage");
  };
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null); // 선택한 자녀의 memberNum
  const selectedChildInfo = children.find(
    (child) => child.memberNum === selectedChild
  );

  // 🔹 부모 ID 기반으로 자녀 목록 불러오기
  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/contract/getChildByParent", {
        params: { parentId: 2 }, // 임시 부모 ID (로그인 로직에서 받아오도록 변경 필요)
        //withCredentials: true, // 🔹 세션 정보 전송
      })
      .then((response) => {
        console.log("자녀 데이터:", response.data); // 🔍 데이터 확인
        setChildren(response.data);
        if (response.data.length > 0) {
          setSelectedChild(response.data[0].memberNum || null); // 첫 번째 자녀 선택 (기본값)
        }
      })
      .catch((error) => {
        console.error("자녀 목록 불러오기 실패:", error);
      });
  }, []);

  // 자녀 선택 시 상태 업데이트
  const handleChildSelect = (childNum) => {
    setSelectedChild(childNum);
  };

  return (
    <div className="mock-container">
      {/* 메인로고ZooMoney */}
      {/* <div className="zoo-money flex justify-start items-center"> */}
      <div className="zoo-money">
        <span className="zoo">Zoo</span>
        <span className="money">Money</span>
      </div>

      {/* 프로필 영역 */}
      <div className="profile-container">
        {" "}
        {/* 🔹 가로로 정렬을 위한 추가 */}
        {children.map((child) => (
          <div
            key={child.memberNum}
            className={`profile-wrapper ${
              selectedChild === child.memberNum ? "selected" : ""
            }`}
            onClick={() => handleChildSelect(child.memberNum)}
          >
            <img
              className="profile-image"
              src={child.memberNum % 2 === 0 ? profile1 : profile2}
              alt={child.memberName}
            />
            <div className="profile-name">
              {" "}
              {/* 🔹 이름을 프로필 아래에 위치 */}
              <span>{child.memberName}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 용돈 정보 카드 */}

      <div className="allowance-card">
        <div className="card-header">
          <div className="allowance-text">
            <p className="allowance-title">
              {selectedChildInfo ? selectedChildInfo.memberName : "자녀 없음"}{" "}
              의 용돈
            </p>
            <p className="allowance-amount">43,000 원</p>
          </div>
          <button className="consumptionhistory-button">소비내역 확인</button>
        </div>
        <button className="sendmoney-button">송금하기</button>
      </div>

      {/* 기능 카드 버튼 */}
      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        <div
          className="feature-card card-yellow"
          onClick={handleMoneyContractManageClick}
        >
          <img src={allowanceContract} alt="용돈 계약서" />
          <p>용돈 계약서</p>
        </div>
        <div className="feature-card card-blue">
          <img src={allowancePlan} alt="용돈 계획확인" />
          <p>용돈 계획확인</p>
        </div>
        <div className="feature-card card-purple">
          <img src={consumpPattern} alt="소비패턴 분석" />
          <p>소비패턴 분석</p>
        </div>
        <div className="feature-card card-pink">
          <img src={piggyBank} alt="저금통 확인" />
          <p>저금통 확인</p>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <Footer />
    </div>
  );
};

export default ParentMain;
