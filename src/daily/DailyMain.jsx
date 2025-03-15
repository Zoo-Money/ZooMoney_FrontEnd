import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import giraffe1 from "../images/daily/giraffe_daily.png";
import "./dailyMain.css";

const DailyMain = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(null); // 출석 여부 상태

  // 출석 여부 확인
  useEffect(() => {
    axios
      .post("http://localhost:7777/zoomoney/daily/check")
      .then((response) => {
        setIsChecked(response.data.isChecked); // 출석 여부 저장
      })
      .catch((error) => console.log("출석 체크 실패", error));
  }, []);

  const handleButtonClick = () => {
    if (isChecked) {
      navigate("/daily/end"); // 출석 성공 시 이동
    } else {
      navigate("/card/main"); // 이미 출석했으면 메인으로 이동
    }
  };

  return (
    <div className="mock-container">
      <Header title="출석체크" />

      {/* 메인 콘텐츠 */}
      <div className="daily-content">
        <img src={giraffe1} alt="출석체크 캐릭터" className="daily-image" />
        <p className="daily-check">매일매일 출석체크</p>

        {isChecked === null ? ( // 로딩 상태
          <p className="daily-description">출석 체크 정보를 불러오는 중...</p>
        ) : isChecked ? (
          <>
            <p className="daily-description">
              하루 한 번 <strong>10 포인트</strong>를 지급해드려요!
            </p>
            <button className="daily-button" onClick={handleButtonClick}>
              출석체크 하기
            </button>
          </>
        ) : (
          <>
            <p className="daily-description">
              이미 오늘의 포인트를 받았어요!
              <br />
              내일 또 만나요~ 😊
            </p>
            <button className="daily-button" onClick={handleButtonClick}>
              메인으로 돌아가기
            </button>
          </>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default DailyMain;
