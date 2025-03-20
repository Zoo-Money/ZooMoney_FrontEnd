import React from "react";
import FooterParent from "../common/FooterParent";
import Header from "../common/Header";
import deer01 from "../images/deer/deer01.png";

import SelectChartParent from "./SelectChartParent";

function MoneyPlanConfirm(props) {
  return (
    <div className="mock-container">
      <Header title="용돈 계획 세우기" />
      <div className="planmain-content">
        <div className="planmain-description">
          <p>
            우리 아이가 작성한
            <br />
            <span>용돈 계획</span>이에요!
          </p>
          <img src={deer01} alt="deer01" className="img-deer" />
        </div>
        <div className="planmain-box">
          <div className="planmain-chart-box">
            <SelectChartParent />
          </div>
        </div>
      </div>
      <FooterParent />
    </div>
  );
}

export default MoneyPlanConfirm;
