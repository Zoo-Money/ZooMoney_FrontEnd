import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import giraffe01 from "../images/giraffe/giraffe01.png";
import "./dailyMain.css";

const DailyMain = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(null); // 출석 여부 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const memberNum = sessionStorage.getItem("member_num");

  // ✅ 출석 여부 확인 (DB 수정 X)
  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/daily/status", {
        params: { memberNum: memberNum },
      })
      .then((response) => {
        setIsChecked(response.data.isChecked);
        setIsLoading(false); // 데이터 로딩 완료
      })
      .catch((error) => {
        console.error("출석 체크 여부 확인 실패", error);
        setIsLoading(false);
      });
  });

  // ✅ 출석 체크 (버튼 눌렀을 때만 실행)
  const handleAttendance = () => {
    axios
      .post(`http://localhost:7777/zoomoney/daily/check?memberNum=${memberNum}`)
      .then((response) => {
        setIsChecked(true); // 출석 완료 상태 업데이트
        navigate("/daily/end"); // 출석 성공 시 이동
      })
      .catch((error) => console.error("출석 체크 실패", error));
  };

  const handleGoToMain = () => {
    navigate("/main");
  };

  return (
    <div className="mock-container">
      <Header title="출석체크" />

      <div className="daily-content">
        <img src={giraffe01} alt="giraffe01" className="daily-image" />
        <p className="daily-check">매일매일 출석체크</p>

        {isLoading ? ( // 데이터 로딩 중
          <p className="daily-description">출석 체크 정보를 불러오는 중...</p>
        ) : isChecked ? (
          <>
            <p className="daily-description">
              이미 오늘의 포인트를 받았어요!
              <br />
              내일 또 만나요~ 😊
            </p>
            <button className="daily-button" onClick={handleGoToMain}>
              메인으로 돌아가기
            </button>
          </>
        ) : (
          <>
            <p className="daily-description">
              하루 한 번 <strong>10 포인트</strong>를 지급해드려요!
            </p>
            <button className="daily-button" onClick={handleAttendance}>
              출석체크 하기
            </button>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DailyMain;
