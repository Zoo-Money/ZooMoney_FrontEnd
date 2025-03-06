import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import profile1 from "../images/profile1.png";
import allowanceContract from "../images/allowanceContract.png";
import allowancePlan from "../images/allowancePlan.png";
import consumpPattern from "../images/consumpPattern.png";
import piggyBank from "../images/piggyBank.png";
import "./parentMain.css";

const ParentMain = () => {
  return (
    <div className="mock-container">
      {/* 메인로고ZooMoney */}
      <div className="zoo-money flex justify-start items-center">
        <span className="zoo">Zoo</span>
        <span className="money">Money</span>
      </div>

      {/* 프로필 영역 */}
      <div className="flex items-center mt-2">
        <div className="flex items-center">
          <div className="flex -space-x-1">
            <img className="profile-image" src={profile1} alt="User1" />
            <img className="profile-image" src={profile1} alt="User2" />
          </div>
          <span className="profile-more ml-2">+1</span> {/* 오른쪽으로 이동 */}
        </div>
        <span className="ml-3 text-lg font-semibold">전운종 정재윤</span>
      </div>

      {/* 용돈 정보 카드 */}
      <div className="allowance-card">
        <div className="card-header">
          <div className="allowance-text">
            <p className="allowance-title">운종이의 용돈</p>
            <p className="allowance-amount">43,000 원</p>
          </div>
          <button className="consumptionhistory-button">소비내역 확인</button>
        </div>
        <button className="sendmoney-button">송금하기</button>
      </div>

      {/* 기능 카드 버튼 */}
      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        <div className="feature-card card-yellow">
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
