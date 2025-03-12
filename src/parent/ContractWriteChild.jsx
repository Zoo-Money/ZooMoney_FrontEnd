import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // Axios 추가
import Header from "../common/Header";
import Footer from "../common/Footer";
import "./contractWriteChild.css"; // CSS 파일 import
import SignatureCanvas from "react-signature-canvas";

const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

const ContractWriteChild = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getFormattedDate());
  const [amount, setAmount] = useState("");
  const signatureRef = useRef(null); // 서명 캔버스 참조
  const [details, setDetails] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // 부모가 작성한 계약 내용을 저장할 state
  const [contractDetails, setContractDetails] = useState("");
  useEffect(() => {
    // 부모 컴포넌트에서 전달된 계약 내용을 가져옴
    const fetchContractDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7777/zoomoney/contract/getDetails",
          { params: { contractNum: 123 } } //  계약서 번호는 상황에 맞게 변경
        );
        setContractDetails(response.data.contract_content); // 불러온 세부사항 저장
      } catch (error) {
        console.error("세부사항 불러오기 실패:", error);
        alert("계약 세부사항을 불러오지 못했습니다.");
      }
    };

    fetchContractDetails();
  }, []);

  // 요일 선택
  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  // 서명 지우기
  const clearSignature = () => {
    signatureRef.current.clear();
  };

  // 세부사항 입력 핸들러
  const handleDetailChange = (e) => {
    setInputValue(e.target.value);
  };

  // Enter 키 입력 시 자동 번호 추가
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setDetails([...details, inputValue]);
      setInputValue("");
      e.preventDefault();
    }
  };

  // 지급 금액 입력 핸들러
  const handleAmountChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    const formattedValue = Number(numericValue).toLocaleString();
    setAmount(formattedValue);
  };

  //  **서명 후 보내기 버튼 클릭 시**
  const handleSubmit = async () => {
    //  서명 이미지를 Base64 데이터로 변환
    const signatureData = signatureRef.current.toDataURL("image/png");

    //  전송할 데이터 구성
    const contractData = {
      contract_money: parseInt(amount.replace(/,/g, ""), 10), // 금액에서 ',' 제거 후 정수 변환
      contract_status: false, // 초안 상태
      contract_excelpath: signatureData, // Base64 서명 이미지 전송
    };

    try {
      //  Axios POST 요청으로 데이터 전송
      const response = await axios.post(
        "http://localhost:7777/zoomoney/contract/saveDraft",
        contractData
      );

      alert("서명 저장 성공: " + response.data);
    } catch (error) {
      console.error("서명 저장 실패:", error);
      alert("서명 저장에 실패했습니다.");
    }
  };

  return (
    <div className="mock-container">
      <div className="contractWrtieChild-container">
        <Header title="용돈계약서 작성" />

        <div className="contractWrtieChild-contract-form">
          <p className="info-text">용돈 지급에 관한 세부사항을 확인하세요.</p>

          {/* 세부사항 입력 */}
          <div className="info-box">
            <div className="contractWrtieChild-details-container">
              {details.length > 0 && (
                <ol>
                  {details.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ol>
              )}
              {/* <textarea
                className="contractWrtieChild-custom-textarea"
                placeholder="계약 세부사항을 입력하세요..."
                value={inputValue}
                onChange={handleDetailChange}
                onKeyDown={handleKeyPress}
              /> */}
              <div className="info-box">
                <div className="contractWrtieChild-details-container">
                  <textarea
                    className="contractWrtieChild-custom-textarea"
                    value={contractDetails}
                    readOnly // ✅ 읽기 전용 설정
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 지급 금액 */}
          <label>지급 금액</label>
          <div className="contractWrtieChild-amount-input-container">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="금액 입력"
              inputMode="numeric"
            />
            <span>원</span>
          </div>

          {/* 용돈 지급인 (서명) */}
          <div className="contractWrtieChild-signature-box">
            <label>용돈 수취인</label>
            <div className="contractWrtieChild-signature">
              <span>신짱구</span> <span>(서명)</span>
            </div>

            {/* 서명 캔버스 */}
            <div className="contractWrtieChild-signature-canvas">
              <SignatureCanvas
                ref={signatureRef}
                penColor="black"
                canvasProps={{
                  className: "sigCanvas",
                  width: 300,
                  height: 100,
                }}
              />
            </div>

            <button
              className="contractWrtieChild-clear-button"
              onClick={clearSignature}
            >
              서명 지우기
            </button>
          </div>

          {/* 제출 버튼 */}
          <button className="submit-button" onClick={handleSubmit}>
            보내기
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ContractWriteChild;
