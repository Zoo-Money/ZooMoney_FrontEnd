import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import deer1 from "../images/deer1.png";
import "./moneyPlan.css"
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
          <img src={deer1} alt="deer1" className="img-deer" />
          <div className="planmain-box">
            <p className="planmain-description">
              짜임새 있는 용돈 계획을 세우고,
              <br />
              알뜰한 <span>소비 습관</span>을 길러봐요!
            </p>
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