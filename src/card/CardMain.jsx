import React from "react";
import Header from "../card/CardMainHeader";
import Footer from "../common/Footer";
import daily from "../images/daily.png";
import quiz from "../images/quiz.png";
import moneyplan from "../images/moneyplan.png";
import pattern from "../images/pattern.png";
import { ReactComponent as BellIcon } from "../images/bell.svg"; // SVG를 React 컴포넌트로 import
import { useState, useEffect } from "react";
import defaultCardImage from "../images/bear01.png"; // 기본 이미지 경로
import { fetchMetadata } from "./CardService";
import "./CardMain.css";
const CardMain = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tokenId, setTokenId] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [metadataUrl, setMetadataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [allowanceAmount, setAllowanceAmount] = useState("0원");

  useEffect(() => {
    // 세션에서 tokenId 불러오기
    const savedTokenId = sessionStorage.getItem("nftTokenId");
    const savedAllowance = sessionStorage.getItem("allowanceAmount");

    if (savedTokenId) {
      setTokenId(savedTokenId);

      // NFT 메타데이터 조회 후 previewUrl 업데이트
      fetchMetadata(savedTokenId, (metadata) => {
        setPreviewUrl(metadata?.image || "");
      });
    }
    // 세션에서 allowanceAmount 값이 있으면 설정
    if (savedAllowance) {
      setAllowanceAmount(`${Number(savedAllowance).toLocaleString()} 원`);
    }
  }, []);

  return (
    <div className="mock-container">
      {/* 메인로고ZooMoney */}
      <Header />
      {/* 카드 이미지 미리보기 */}
      <div>
        <div className="card-preview">
          <img
            src={previewUrl || defaultCardImage} // 이미지가 없으면 기본 이미지 표시
            alt="카드 미리보기"
            className="card-image"
          />
        </div>
      </div>
      {/* 용돈 정보 카드 */}
      <div className="allowance-card">
        <div className="card-header">
          <div className="allowance-text">
            <p className="allowance-title">나의 용돈</p>
            <p className="allowance-amount">{allowanceAmount}</p>
          </div>
          <button className="consumptionhistory-button">소비내역 확인</button>
        </div>
        <div className="button-group">
          <button type="button" className="sendmoney-button">
            카드사용내역
          </button>
          <button type="button" className="sendmoney-button">
            충전하기
          </button>
        </div>
      </div>
      {/* 기능 카드 버튼 */}
      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        <a
          href="https://example.com/moneyplan"
          className="feature-card card-yellow"
        >
          <div>
            <img src={pattern} alt="소비 패턴 분석" />
            <p>소비 패턴 분석</p>
          </div>
        </a>
        <a
          href="https://example.com/moneyplan"
          className="feature-card card-blue"
        >
          <div>
            <img src={moneyplan} alt="용돈 계획 세우기" />
            <p>용돈 계획 세우기</p>
          </div>
        </a>
        <a
          href="https://example.com/moneyplan"
          className="feature-card card-purple"
        >
          <div>
            <img src={quiz} alt="금융퀴즈" />
            <p>금융 퀴즈</p>
          </div>
        </a>
        <a
          href="https://example.com/moneyplan"
          className="feature-card card-pink"
        >
          <div>
            <img src={daily} alt="출석체크" />
            <p>출석체크</p>
          </div>
        </a>
      </div>
      {/* 하단 네비게이션 바 */}
      <Footer />
    </div>
  );
};
export default CardMain;
