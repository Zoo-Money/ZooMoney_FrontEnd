// import React, { useState, useRef } from "react";
// import Header from "../common/Header";
// import Footer from "../common/Footer";
// import "./contractWrite.css"; // CSS 파일 import
// import SignatureCanvas from "react-signature-canvas";

// const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

// // 오늘 날짜를 "YYYY년 M월 D일" 형식으로 변환하는 함수
// const getFormattedDate = () => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = today.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
//   const day = today.getDate();
//   return `${year}년 ${month}월 ${day}일`;
// };

// const ContractWrite = () => {
//   const [selectedDay, setSelectedDay] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(getFormattedDate()); // 현재 날짜 자동 설정
//   const [amount, setAmount] = useState(""); // 사용자 입력 가능
//   const signatureRef = useRef(null); // 서명 캔버스 참조
//   const [details, setDetails] = useState([]); // 세부사항 목록
//   const [inputValue, setInputValue] = useState(""); // 세부사항 입력값

//   // 요일 선택
//   const handleDaySelect = (day) => {
//     setSelectedDay(day);
//   };

//   // 서명 지우기
//   const clearSignature = () => {
//     signatureRef.current.clear();
//   };

//   // 세부사항 입력 핸들러
//   const handleDetailChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   // Enter 키 입력 시 자동 번호 추가 및 리스트 저장
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && inputValue.trim() !== "") {
//       setDetails([...details, inputValue]); // 기존 목록에 추가
//       setInputValue(""); // 입력 필드 초기화
//       e.preventDefault(); // 줄바꿈 방지
//     }
//   };

//   // 지급 금액 입력 핸들러 (숫자만 입력)
//   const handleAmountChange = (e) => {
//     const numericValue = e.target.value.replace(/\D/g, ""); // 숫자만 입력 가능
//     // setAmount(numericValue);

//     // 천 단위 콤마 추가
//     const formattedValue = Number(numericValue).toLocaleString();

//     // 상태 업데이트
//     setAmount(formattedValue);
//   };

//   return (
//     <div className="mock-container">
//       <div className="container">
//         <Header title="용돈계약서 작성" />

//         <div className="contract-form">
//           {/* 계약서 안내 사항 */}
//           <p className="info-text">용돈 지급에 관한 세부사항을 작성하세요.</p>
//           <div className="info-box">
//             <div className="details-container">
//               {details.length > 0 && (
//                 <ol>
//                   {details.map((line, index) => (
//                     <li key={index}>{line}</li>
//                   ))}
//                 </ol>
//               )}
//               <textarea
//                 className="custom-textarea"
//                 placeholder="계약 세부사항을 입력하세요..."
//                 value={inputValue}
//                 onChange={handleDetailChange}
//                 onKeyDown={handleKeyPress}
//               />
//             </div>
//           </div>

//           {/* 용돈 지급 금액 */}
//           <label>지급 금액</label>
//           <div className="amount-input-container">
//             <input
//               type="text"
//               value={amount}
//               onChange={handleAmountChange}
//               placeholder="금액 입력"
//               inputMode="numeric" // 모바일 키보드 숫자 전용
//             />
//             <span>원</span>
//           </div>

//           {/* 계약일자 */}
//           <div className="input-box">
//             <label>계약일자</label>
//             <input type="text" value={selectedDate} readOnly />
//           </div>

//           {/* 지급 요일 선택 */}
//           <div className="day-select">
//             <label>지급 요일 선택</label>
//             <div className="day-buttons">
//               {daysOfWeek.map((day) => (
//                 <button
//                   key={day}
//                   className={`day-button ${
//                     selectedDay === day ? "selected" : ""
//                   }`}
//                   onClick={() => handleDaySelect(day)}
//                 >
//                   {day}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* 용돈 지급인 (서명) */}
//           <div className="signature-box">
//             <label>용돈 지급인</label>
//             <div className="signature">
//               <span>신형만</span> <span>(서명)</span>
//             </div>
//             {/* 서명 입력 캔버스 */}
//             {/* npm install react-signature-canvas 라이브러리 설치해야함*/}
//             <div className="signature-canvas">
//               <SignatureCanvas
//                 ref={signatureRef}
//                 penColor="black"
//                 canvasProps={{
//                   className: "sigCanvas",
//                   width: 300, // 캔버스 너비 제한
//                   height: 100, // 캔버스 높이 제한
//                 }}
//               />
//             </div>
//             <button className="clear-button" onClick={clearSignature}>
//               서명 지우기
//             </button>
//           </div>

//           {/* 제출 버튼 */}
//           <button className="submit-button">보내기</button>
//         </div>

//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default ContractWrite;

//아래는 테스트코드 250311 16:05
import React, { useState, useRef } from "react";
import axios from "axios"; // Axios 추가
import Header from "../common/Header";
import Footer from "../common/Footer";
import "./contractWrite.css"; // CSS 파일 import
import SignatureCanvas from "react-signature-canvas";

// 날짜 데이터를 DATETIME 형식으로 변환하는 함수 추가
// const formatDateToDatetime = (dateString) => {
//   const today = new Date(dateString);
//   today.setHours(today.getHours() + 9); // ✅ 한국 시간 (UTC+9) 보정
//   return today.toISOString().slice(0, 19).replace("T", " ");
// };

const formatDateToDatetime = (dateString) => {
  // 날짜 값이 "2025년 3월 11일" 형태일 경우 변환
  const formattedDate = dateString
    .replace(/년|월/g, "-")
    .replace(/일/g, "")
    .trim();

  const today = new Date(formattedDate);

  // 유효한 날짜인지 검증
  if (isNaN(today.getTime())) {
    console.error("❗️ 유효하지 않은 날짜 형식:", dateString);
    return ""; // 날짜가 잘못되었을 경우 빈 문자열 반환
  }

  today.setHours(today.getHours() + 9); // ✅ 한국 시간 (UTC+9) 보정
  return today.toISOString().slice(0, 19).replace("T", " ");
};
// 날짜 데이터를 `YYYY-MM-DD` 형식으로 변환하는 함수 추가
const formatDateToDateOnly = (dateString) => {
  const formattedDate = dateString
    .replace(/년|월/g, "-")
    .replace(/일/g, "")
    .trim();
  return formattedDate; // ✅ "2025-03-11" 형식만 반환
};

const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 2자리 형식
  const day = String(today.getDate()).padStart(2, "0"); // 2자리 형식
  return `${year}-${month}-${day}`; // ✅ "YYYY-MM-DD" 형식으로 변경
  //return `${year}년 ${month}월 ${day}일`;
};

const ContractWrite = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getFormattedDate()); // 현재 날짜 자동 설정
  const [amount, setAmount] = useState("");
  const signatureRef = useRef(null); // 서명 캔버스 참조
  const [details, setDetails] = useState([]);
  const [inputValue, setInputValue] = useState("");

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

  //  서명 후 보내기 버튼 클릭 시
  const handleSubmit = async () => {
    //  서명 이미지를 Base64 데이터로 변환
    const signatureData = signatureRef.current.toDataURL("image/png");

    //  전송할 데이터 구성
    const contractData = {
      contract_money: parseInt(amount.replace(/,/g, ""), 10), // 금액에서 ',' 제거 후 정수 변환
      contract_status: false, // 초안 상태
      contract_excelpath: signatureData, // Base64 서명 이미지 전송
      contract_content: details.join("/n"), //세부사항 추가
      contract_date: formatDateToDateOnly(selectedDate), // selectedDate, 계약일자
      contract_filepath: "/path/to/file",
    };

    console.log("🔍 전송할 JSON 데이터:", contractData); // 👀 JSON 확인용 로그 추가

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
      <div className="container">
        <Header title="용돈계약서 작성" />

        <div className="contract-form">
          <p className="info-text">용돈 지급에 관한 세부사항을 작성하세요.</p>

          {/* 세부사항 입력 */}
          <div className="info-box">
            <div className="details-container">
              {details.length > 0 && (
                <ol>
                  {details.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ol>
              )}
              <textarea
                className="custom-textarea"
                placeholder="계약 세부사항을 입력하세요..."
                value={inputValue}
                onChange={handleDetailChange}
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>

          {/* 지급 금액 */}
          <div className="amount-input-containerTop">
            <label>지급금액</label>
            <div className="amount-input-container">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="금액 입력"
                inputMode="numeric"
              />
              <span>원</span>
            </div>
          </div>
          {/* 계약일자 */}
          <div className="input-box">
            <label>계약일자</label>
            <input type="text" value={selectedDate} readOnly />
          </div>

          {/* 지급 요일 선택 */}
          <div className="day-select">
            <label>지급 요일 선택</label>
            <div className="day-buttons">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  className={`day-button ${
                    selectedDay === day ? "selected" : ""
                  }`}
                  onClick={() => handleDaySelect(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* 용돈 지급인 (서명) */}
          <div className="signature-box">
            <label>용돈 지급인</label>
            <div className="signature">
              <span>신형만</span> <span>(서명)</span>
            </div>

            {/* 서명 캔버스 */}
            <div className="signature-canvas">
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

            <button className="clear-button" onClick={clearSignature}>
              서명 지우기
            </button>
          </div>

          {/* 제출 버튼 */}
          <div className="submit-button-container">
            <button className="submit-button" onClick={handleSubmit}>
              아이에게 보내기
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ContractWrite;
