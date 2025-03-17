import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../common/Footer";
import defaultCardImage from "../images/bear01.png"; // 기본 이미지 경로
import { ReactComponent as BellIcon } from "../images/bell.svg"; // SVG를 React 컴포넌트로 import
import daily from "../images/daily.png";
import moneyplan from "../images/moneyplan.png";
import pattern from "../images/pattern.png";
import quiz from "../images/quiz.png";
import "./CardMain.css";
import { fetchCardInfo, fetchMetadata } from "./CardService";
const CardMain = () => {
  const [metadata, setMetadata] = useState(null);
  const [, setMetadataUrl] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [, setLoading] = useState(true);
  const [loading, setNewLoading] = useState(true);
  const [allowanceAmount, setAllowanceAmount] = useState("0원");

  useEffect(() => {
    const memberNum = sessionStorage.getItem("member_num"); // 세션에서 member_num 가져오기

    const fetchData = async () => {
      // 카드 정보 가져오기
      await fetchCardInfo(memberNum, setTokenId, setNewLoading);
      const savedAllowance = sessionStorage.getItem("card_money");
      const tokenId = sessionStorage.getItem("cardMetadata");
      // memberNum이나 tokenId가 없으면 데이터를 가져오지 않음
      if (!tokenId || !memberNum) {
        console.log("세션에 필요한 정보가 없습니다.");
        setLoading(false); // 바로 로딩 상태를 false로 변경하여 UI 업데이트
        return;
      }

      try {
        // 메타데이터 가져오기
        await fetchMetadata(tokenId, setMetadata, setMetadataUrl, setLoading);

        // allowanceAmount 값이 있으면 설정
        if (savedAllowance) {
          setAllowanceAmount(`${Number(savedAllowance).toLocaleString()} 원`);
        }
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      } finally {
        setLoading(false); // 모든 작업이 끝난 후 로딩 상태 변경
      }
    };

    fetchData();
  }, []);

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

      <div className="cardMain-container">
        {/* 카드 이미지 미리보기 */}
        <div>
          <div className="mycard-preview">
            {loading ? (
              <div className="loading-overlay">로딩 중...</div> // 로딩 중 UI (예: 텍스트나 애니메이션)
            ) : (
              <>
                <img
                  src={
                    metadata && metadata.image
                      ? metadata.image
                      : defaultCardImage // metadata가 있을 때만 이미지 사용, 없으면 기본 이미지
                  }
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
              </>
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
      </div>
      <Footer />
    </div>
  );
};
export default CardMain;
