import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import Footer from "../common/Footer";
import Header from "../common/Header";
import "./css/contractWrite.css";

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 2자리 형식
  const day = String(today.getDate()).padStart(2, "0"); // 2자리 형식
  return `${year}-${month}-${day}`; //  "YYYY-MM-DD" 형식으로 변경
};

const ContractWrite = () => {
  const selectedDate = getFormattedDate();
  const [amount, setAmount] = useState("");
  const signatureRef = useRef(null); // 서명 캔버스 참조
  const [details, setDetails] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [date, setDate] = useState("");
  const [parentName, setParentName] = useState("");
  const parentId = sessionStorage.getItem("member_num");
  const navigate = useNavigate(); // ✅ useNavigate 훅 선언

  // 계약 세부사항에 '수정 중인 인덱스' 추가
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/contract/parentInfo", {
        params: { parentId: parentId },
      })
      .then((response) => {
        setParentName(response.data.parentName); // 부모이름 상태 저장
      })
      .catch((error) => {
        // console.error("부모이름 불러오기 실패:" + error);
        setParentName("부모이름 불러오기 실패"); // 실패시 기본값
      });
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // 오늘 날짜를 'YYYY-MM-DD' 형식으로 설정
  const today = new Date().toISOString().split("T")[0];

  //유효성 검사 로직 추가
  useEffect(() => {
    const hasDetails = details.length > 0; // 세부사항이 비어있지 않은지 확인
    const hasAmount = !!amount; // 금액이 입력되었는지 확인
    const hasDate = !!date; // 최초 지급일이 선택되었는지 확인
    const hasSignature =
      signatureRef.current && !signatureRef.current.isEmpty();

    // 모든 조건 충족 시 true 설정
    setIsFormValid(hasDetails && hasAmount && hasDate && hasSignature);
  }, [details, amount, date]); // 의존성 배열 추가

  // 서명 완료시 유효성 검사 다시 실행(서명시 강제 onEnd 트리거)
  const handleSignatureEnd = () => {
    const hasDetails = details.length > 0;
    const hasAmount = !!amount;
    const hasDate = !!date;
    const hasSignature =
      signatureRef.current && !signatureRef.current.isEmpty();

    setIsFormValid(hasDetails && hasAmount && hasDate && hasSignature);
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
      e.preventDefault();

      if (editingIndex !== null) {
        // 수정 모드일 경우
        const updatedDetails = [...details];
        updatedDetails[editingIndex] = inputValue; // 선택한 항목을 수정
        setDetails(updatedDetails); // 수정된 리스트로 업데이트
        setEditingIndex(null); // 수정 완료 후 초기화
      } else {
        // 새 항목 추가 모드
        setDetails([...details, inputValue]);
      }
      setInputValue(""); // 입력 필드 초기화
    }
  };

  // 세부사항 수정 버튼 클릭 시 로직 추가
  const handleEditClick = (index) => {
    setInputValue(details[index]); // 선택한 항목의 내용을 input에 표시
    setEditingIndex(index); // 해당 항목을 '수정 모드'로 설정
  };

  // 세부사항 삭제 기능 추가
  const handleDeleteClick = (index) => {
    const updatedDetails = details.filter((_, i) => i !== index);
    setDetails(updatedDetails);
  };

  // 지급 금액 입력 핸들러
  const handleAmountChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    const formattedValue = Number(numericValue).toLocaleString();
    setAmount(formattedValue);
  };

  //  서명 후 보내기 버튼 클릭 시
  const handleSubmit = async () => {
    // 유효성검사
    if (!isFormValid) {
      toast.error("모든 항목을 입력하세요.");
      return;
    }
    const signatureData = signatureRef.current.toDataURL("image/png");

    // 부모가 작성한 세부사항에 번호 추가 및 줄바꿈 수정
    const formattedDetails = details
      .map((item, index) => `${index + 1}. ${item}`) // 번호 추가
      .join("\n"); // ✅ 실제 줄바꿈 추가

    // 전송할 데이터 구성
    const contractData = {
      contract_money: parseInt(amount.replace(/,/g, ""), 10),
      contract_status: false,
      contract_excelpath: signatureData,
      contract_content: formattedDetails,
      contract_date: selectedDate,
      contract_provide: date,
      contract_filepath: "/path/to/file",
      child_num: sessionStorage.getItem("childNum"),
    };

    try {
      const response = await axios.post(
        "http://localhost:7777/zoomoney/contract/saveDraft",
        contractData,
        {
          params: { parentId: sessionStorage.getItem("member_num") }, // params로 parentId 전달
        }
      );

      await axios.post("http://localhost:7777/zoomoney/notify/send", {
        memberNum: sessionStorage.getItem("childNum"),
        notifyContent: "📜 용돈계약서가 작성되었어요<br>확인하고 서명해주세요",
        notifyUrl: "/contract/contractWriteChild",
      });

      toast.error("서명 저장 성공: " + response.data);
      navigate("/parent/main"); // ✅ useNavigate()를 통한 페이지 이동
    } catch (error) {
      console.error("서명 저장 실패:", error);
      toast.error("서명 저장에 실패했습니다.");
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
                    <li key={index}>
                      {line}

                      <div className="edit-delete-buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleEditClick(index)}
                        >
                          ✏️ 수정
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDeleteClick(index)}
                        >
                          ❌ 삭제
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
              <textarea
                className="custom-textarea"
                placeholder={
                  editingIndex !== null
                    ? "수정할 내용을 입력 후 엔터를 꼭 눌러주세요."
                    : "계약 세부사항을 입력 후 엔터를 꼭 눌러주세요."
                }
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
          <div className="parent-contract-input-box">
            <label>계약일자</label>
            <input type="text" value={selectedDate} readOnly />
          </div>
          {/* 지급 요일 선택 */}
          <div className="day-select">
            <label>최초지급일</label>
          </div>
          <div>
            <InputGroup className="payment-date-input">
              <Form.Control
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* 용돈 지급인 (서명) */}
          <div className="signature-box">
            <label>용돈 지급인</label>
            <div className="signature">
              <span>{parentName}</span> <span>(서명)</span>
            </div>

            {/* 서명 캔버스 */}
            <div className="parent-signature-canvas">
              <SignatureCanvas
                ref={signatureRef}
                penColor="black"
                onEnd={handleSignatureEnd} // ✅ 서명 후 유효성 검사 강제 트리거
                canvasProps={{
                  className: "parent-signCanvas",
                  width: 300,
                  height: 100,
                  style: {
                    maxWidth: "300px",
                    maxHeight: "100px",
                  },
                }}
              />
            </div>

            <button className="clear-button" onClick={clearSignature}>
              서명 지우기
            </button>
          </div>
          {/* 제출 버튼 */}
          {/* 모든 조건 충족 시에만 활성화 아이에게 보내기 */}
          <div className="submit-button-container">
            <button
              className="submit-button"
              onClick={handleSubmit}
              // disabled={!isFormValid}
            >
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
