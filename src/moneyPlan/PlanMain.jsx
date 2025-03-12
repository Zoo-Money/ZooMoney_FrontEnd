import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import deer1 from "../images/deer1.png";
import "./planMain.css"

function planMain(props) {
    return (
        <div className="mock-container">
          <div className="header">
            <Header title="용돈 계획 세우기" /> {/* 원하는 제목을 props로 전달 */}
          </div>

          {/* 메인 콘텐츠 */}
          <div className="content">
            <img src={deer1} alt="deer1" className="main-image" />
            <p className="description">
                진행중인 계획이 없어요
              <br />짜임새 있는 용돈 계획을 세우고,
              <br />
              부모님께 정기 용돈을 요청해 보세요!
            </p>
            <br></br>
            <button className="plan-button">용돈 계획 세우기</button>
          </div>

          {/* 하단 네비게이션 */}
          <Footer />
        </div>
    );
}

export default planMain;