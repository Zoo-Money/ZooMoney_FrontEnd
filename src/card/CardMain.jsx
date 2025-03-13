import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../common/Footer";
import defaultCardImage from "../images/bear01.png"; // 기본 이미지 경로
import daily from "../images/daily.png";
import moneyplan from "../images/moneyplan.png";
import pattern from "../images/pattern.png";
import quiz from "../images/quiz.png";
import { ReactComponent as BellIcon } from "../images/bell.svg"; // SVG를 React 컴포넌트로 import
import "./CardMain.css";
import { fetchMetadata } from "./CardService";
const CardMain = () => {
  const [metadata, setMetadata] = useState(null);
  const [, setMetadataUrl] = useState("");
  const [, setLoading] = useState(false);
  const [allowanceAmount, setAllowanceAmount] = useState("0원");

  useEffect(() => {
    const savedAllowance = sessionStorage.getItem("card_money");
    const tokenId = sessionStorage.getItem("cardMetadata");

    console.log(tokenId);

    // 세션에 카드 정보가 없으면 백엔드에서 메타데이터 가져오기
    fetchMetadata(tokenId, setMetadata, setMetadataUrl, setLoading);

    // allowanceAmount 값이 있으면 설정
    if (savedAllowance) {
      setAllowanceAmount(`${Number(savedAllowance).toLocaleString()} 원`);
    }
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  return (
    <div className="mock-container">
      {/* 메인로고ZooMoney */}
      <div className="zoo-money">
        <div>
          <span className="zoo">Zoo</span>
          <span className="money">Money</span>
        </div>
        <div>
          <BellIcon className="cardmainbell-icon" />
        </div>
      </div>

      {/* 카드 이미지 미리보기 */}
      <div>
        <div className="mycard-preview">
          <img
            src={metadata && metadata.image ? metadata.image : defaultCardImage} // metadata가 있을 때만 이미지 사용, 없으면 기본 이미지
            alt="카드 미리보기"
            className={
              metadata && metadata.image
                ? "mycard-image custom-image"
                : "mycard-image default-image"
            }
          />
          {!metadata?.image && (
            <Link to="/card/create">
              <img
                src={defaultCardImage} // 기본 이미지를 사용
                alt="기본 카드 이미지"
                className="mycard-image default-image"
              />
            </Link>
          )}
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
          className="feature-card card-skyblue"
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
          className="feature-card card-yellow"
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
