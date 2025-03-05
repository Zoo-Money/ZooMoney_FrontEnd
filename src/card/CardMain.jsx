import React from "react";
import { Button } from "react-bootstrap";
import Footer from "../common/Footer";
import cardmain from "../images/cardmain1.png";

const CardMain = () => {
  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="flex justify-between items-center py-2">
        <h1 className="font-bold text-gray-500">Zoomoney</h1>
      </div>

      {/* 카드 발급 박스 */}
      <div className="relative w-20 h-20 mx-auto">
        <img
          src={cardmain}
          alt="카드발급을 해주세요"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 버튼 그룹 */}
      <div className="btn-group mb-8">
        <Button variant="outline-secondary">카드 사용내역</Button>
        <Button variant="outline-secondary">용돈 사용내역</Button>
      </div>

      {/* 나의 응돈 */}
      <div className="card rounded shadow-sm mb-4">
        <h2 className="card-title h5 mb-3">나의 용돈</h2>
        <p className="text-muted">---</p>
        <a href="#" className="btn btn-link p-0 text-primary mb-2">
          응돈계획 세우기
        </a>
        나의 소비패턴 분석
        <a href="#" className="btn btn-link p-0 text-primary">
          이동
        </a>
      </div>

      {/* Zoo 포인트 */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Zoo 포인트</h5>
          <p className="card-text">오늘의 금융 퀴즈</p>
          <p className="text-muted">퀴즈를 맞추면 100 포인트 지급</p>

          <p className="card-text">오늘의 금융 퀴즈</p>
          <p className="text-muted">퀴즈를 맞추면 100 포인트 지급1</p>
        </div>
      </div>

      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default CardMain;
