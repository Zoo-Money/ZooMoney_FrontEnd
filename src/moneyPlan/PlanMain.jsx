import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import deer01 from "../images/deer/deer01.png";
import "../moneyPlan/css/moneyPlan.css"
import { useNavigate } from 'react-router-dom';
import SelectChart from './SelectChart';

function PlanMain(props) {

    const navi = useNavigate();
    const handelClick = ()=>{
      navi("/moneyPlan/write");
    };

    return (
      <div className="mock-container">
        <Header title="용돈 계획 세우기" />
        <div className="planmain-content">
          <div className="planmain-description">
            <p>
              짜임새 있는 용돈 계획을 세우고,<br/>
              
              알뜰한 <span>소비 습관</span>을 길러봐요!
            </p>
          <img src={deer01} alt="deer01" className="planmain-deer" />
          </div>
          <div className="planmain-box">
            <div className="planmain-chart-box">
              <SelectChart></SelectChart>
            </div>
          </div>
        </div>
        <button className="planmain-button" onClick={handelClick}>
          용돈 계획 세우기
        </button>
        <Footer />
      </div>
    );
}

export default PlanMain;