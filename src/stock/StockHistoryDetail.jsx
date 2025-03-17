import React from 'react';
import Header from '../common/Header';
import rabbit05 from "../images/rabbit05.png";
import { useLocation } from 'react-router-dom';
import "./stockHistoryDetail.css";

function StockHistoryDetail(props) {
    const location = useLocation();
    const {item} = location.state || {};
    
    return (
        <div className='mock-container'>
            <Header title="나의 투자 내역" />
            <div className='history-detail-container'>
                <div className="history-detail-box">
                    <img src={rabbit05} alt="rabbit05" />
                    <p>
                        지난 시즌 나의 등수는<br/>
                        <span>{item.result_rank}등</span> 이에요.
                    </p>
                </div>
                
                <div className="history-detail-list-box">
                    <div className="history-detail-list">
                        {/* map으로 돌리세요. */}
                        <span className='history-detail-list-title'>삼성전자</span>
                        <span className='history-detail-list-date'>2024.03.01. 11:17</span>
                        <span className='history-detail-list-count'>1주</span>
                        <span className='history-detail-list-price'>56,700</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StockHistoryDetail;