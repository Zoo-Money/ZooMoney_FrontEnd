import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import allowanceContract from "../images/allowanceContract.png";
import allowanceContractCheck from "../images/allowanceContractCheck.png";
import "./css/moneyContractManage.css";

const MoneyContractManage = () => {
  const navigate = useNavigate();

  const handleContractWrtieClick = () => {
    navigate("/contract/contractWrite"); // 계약서 작성 페이지로 이동
  };
  const handleContractSelectClick = () => {
    navigate("/contract/contractSelect"); // 계약서 조회 페이지로 이동
  };

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <Header title="용돈 계약서 관리" />

      {/* 메인 콘텐츠 */}
      <div className="MoneyContractManage-content">
        <div className="MoneyContractManage-card-container">
          {/* 용돈 계약서 작성 */}
          <div
            className="MoneyContractManage-card"
            onClick={handleContractWrtieClick}
          >
            <p className="MoneyContractManage-card-title">용돈계약서 작성</p>
            <img
              src={allowanceContract}
              alt="용돈 계약서 작성"
              className="MoneyContractManage-card-image"
            />
          </div>

          {/* 용돈 계약서 조회 */}
          <div
            className="MoneyContractManage-card"
            onClick={handleContractSelectClick}
          >
            <p className="MoneyContractManage-card-title">용돈계약서 조회</p>
            <img
              src={allowanceContractCheck}
              alt="용돈 계약서 조회"
              className="MoneyContractManage-card-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyContractManage;
