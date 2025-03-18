import React from 'react';
import Header from '../common/Header';
import rabbit04 from "../images/rabbit04.png";
import { useNavigate } from 'react-router-dom';
import "../stock/css/stockBuy.css"

function StockBuyDone(props) {
    const navi = useNavigate();
    const goStockMain = () => {
        navi("/stock/stockMain");
    };
    return (
        <div className='mock-container'>
            <Header title="구매하기"></Header>
            <div className="buy-done-box">
                <img src={rabbit04} alt="rabbit04" className='done-rabbit04'/>
                <div className="buy-done-message">
                    {/* 데이터 값 넣기 */}
                    삼성전자<br/>
                    <span>10주</span>를 구매했어요!
                </div>
                <div className="buy-done-total">
                    총 <span>566,600원</span> 사용했어요
                </div>
            </div>
            <button className='buy-done-button' onClick={goStockMain}>내 자산 보러가기</button>
        </div>
    );
}

export default StockBuyDone;