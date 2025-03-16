import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { IoIosArrowForward } from "react-icons/io";
import "./stockHistory.css";
function StockHistory(props) {
    const navi = useNavigate();
    const goHistoryDetail = ()=>{
        navi("/stock/stockHistoryDetail");
    };
    return (
      <div className="mock-container">
        <Header title="나의 랭킹 히스토리"></Header>
        <button className="history-button">내 투자 내역 보러가기</button>
        <div className="history-list-box">
          <div className="history-list">
            <span className='history-list-title'>시즌 1</span>
            <span className='history-list-date'>2024.03.01. ~ 2024.03.31.</span>
            <span className='history-list-rank'>28위</span>
            <span>
              <IoIosArrowForward className="forwardIcon" onClick={goHistoryDetail} />
            </span>
          </div>
        </div>
      </div>
    );
}

export default StockHistory;