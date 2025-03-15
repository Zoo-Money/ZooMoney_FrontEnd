import React from 'react';
import Header from '../common/Header';
import deer1 from "../images/deer1.png";
import SelectChart from '../moneyPlan/SelectChart';
import Footer from '../common/Footer';

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
          <img src={deer1} alt="deer1" className="img-deer" />
        </div>
        <div className="planmain-box">
          <div className="planmain-chart-box">
            <SelectChart></SelectChart>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MoneyPlanConfirm;