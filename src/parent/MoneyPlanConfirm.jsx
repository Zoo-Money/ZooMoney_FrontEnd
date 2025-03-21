import React from "react";
import FooterParent from "../common/FooterParent";
import Header from "../common/Header";
import SelectChartParent from "./SelectChartParent";
import "../parent/css/moneyPlanConfirm.css";
function MoneyPlanConfirm(props) {
  return (
    <div className="mock-container">
      <Header title="용돈 계획 세우기" />
      <div className="parent-planmain-content">
        <div className="parent-planmain-description">
            아이의 <span>용돈 계획</span>을 함께 살펴보세요.
            <br />
            올바른 소비 습관을 응원해주세요
        </div>
        <div className="parent-planmain-box">
          <div className="parent-planmain-chart-box">
            <SelectChartParent />
          </div>
        </div>
      </div>
      <FooterParent />
    </div>
  );
}

export default MoneyPlanConfirm;
