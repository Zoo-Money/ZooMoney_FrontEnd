import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import allowanceContract from "../images/allowanceContract.png";
import allowanceContractCheck from "../images/allowanceContractCheck.png";
import "./moneyContractManage.css";
import { useNavigate } from "react-router-dom";

const MoneyContractManage = () => {
  const navigate = useNavigate(); // useNavigate 사용

  const handleContractWrtieClick = () => {
    navigate("/contract/contractWrite"); // 계약서 작성 페이지로 이동
  };
  const handleContractSelectClick = () => {
    navigate("/contract/contractSelect"); // 계약서 작성 페이지로 이동
  };

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <Header title="용돈 계약서 관리" />

      {/* 메인 콘텐츠 */}
      <div className="content">
        <div className="card-container">
          {/* 용돈 계약서 작성 */}
          <div className="card" onClick={handleContractWrtieClick}>
            <p className="card-title">용돈계약서 작성</p>
            <img
              src={allowanceContract}
              alt="용돈 계약서 작성"
              className="card-image"
            />
          </div>

          {/* 용돈 계약서 조회 */}
          <div className="card" onClick={handleContractSelectClick}>
            <p className="card-title">용돈계약서 조회</p>
            <img
              src={allowanceContractCheck}
              alt="용돈 계약서 조회"
              className="card-image"
            />
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default MoneyContractManage;
