import React from 'react';
import Header from '../common/Header';
import gold from "../images/gold.png";
import rabbit06 from "../images/rabbit06.png";
import "./stockRankDetail.css";
function StockRankDetail(props) {
    return (
      <div className="mock-container">
        <Header title="모의투자 결과"></Header>
        <div className="rank-detail-container">
          <div className="rank-detail-box">
            <img className='rabbit06' src={rabbit06} alt="rabbit06" />
            <p>
              지난 시즌 모의 투자는
              <br />
              <span>김은정</span>
              회원이 우승했어요!
            </p>
          </div>
          <div className="rank-detail-list">
            {/* 컴포넌트로 돌리세요
            일단 예시로 밖으로 빼놓음. 컴포넌트 만들어 놓았음 */}
            {/* <RankList gold={gold}></RankList> */}
            <div className="list-box">
              <img src={gold} alt="gold" />
              <div className="list-box-info">
                <div className="list-box-info-name">
                  김은정<span>(kej01*****)</span>
                </div>
                <div className="list-box-info-rank">
                  수익률 <span>+178.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className='rank-detail-button'>내 등수 확인하러 가기</button>
      </div>
    );
}

export default StockRankDetail;