import React from 'react';
import deer2 from "../images/deer2.png";
import Header from '../common/Header';
import "./moneyPlan.css";
import { useNavigate } from 'react-router-dom';


function PlanComplete(props) {
  const navi = useNavigate();
  const handleMain = () => {
    navi("/card/main")
  };
    return (
      <div className="mock-container">
        <Header title="용돈 계획 세우기기"></Header>
        <div className="plancomplete-content">
          <img src={deer2} alt="deer2" className="img-deer2" />
          <p className="plancomplete-description">
            용돈 계획을 <span>저장</span>했어요
            <br />
            이제 <span>계획</span>대로 실천해봐요!
          </p>
        </div>
        <button className="planwrite-button" onClick={handleMain}>완료</button>
      </div>
    );
}

export default PlanComplete;