import React from 'react';
import deer2 from "../images/deer2.png";
import Header from '../common/Header';
import "./moneyPlan.css";

function PlanComplete(props) {
    return (
      <div className="mock-container">
        <Header title="용돈 계획 세우기기"></Header>
        <div className="plan-content">
          <img src={deer2} alt="deer2" className="img-deer2" />
          <p className="plan-description">
            용돈 계획을 저장했어요<br/>
            이제 계획대로 실천해봐요!
          </p>
          <button className='plan-button'>
            완료
          </button>
        </div>
      </div>
    );
}

export default PlanComplete;