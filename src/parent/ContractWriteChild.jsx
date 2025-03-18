import axios from "axios"; // Axios 추가
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ 추가
import React, { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import Footer from "../common/Footer";
import Header from "../common/Header";
import "./css/contractWriteChild.css"; // CSS 파일 import

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

const ContractWriteChild = () => {
  const [selectedDate, setSelectedDate] = useState(getFormattedDate());
  const [amount, setAmount] = useState("");
  const signatureRef = useRef(null); // 서명 캔버스 참조
  const [childName, setChildName] = useState("");

  // 세션에 저장된 childNum 가져오기
  useEffect(() => {
    const storedChildNum = sessionStorage.getItem("childNum");
    // console.log("$$$$storedChildNum:", storedChildNum);

    if (!storedChildNum) {
      toast.error("아이 정보 관련 세션값이 없습니다.");
      // sessionStorage.setItem("childNum", "1"); // 기본값 설정 (테스트용)
    }
  }, []);

  // 세션에서 childNum 가져와서 API 요청에 사용
  const childNum = sessionStorage.getItem("childNum");
  const memberNum = childNum;

  useEffect(() => {
    // console.log("📢 API 요청 전 childNum 값:", childNum);
    axios
      .get("http://localhost:7777/zoomoney/contract/childInfo", {
        // params: { childId: 1 },
        params: { childId: childNum },
      })
      .then((response) => {
        setChildName(response.data.childName); // 아이이름 상태 저장
      })
      .catch((error) => {
        console.log("아이이름 불러오기 실패:" + error);
        setChildName("아이이름 불러오기 실패"); // 실패시 기본값
      });
  }, []);
  // 오늘 날짜를 'YYYY-MM-DD' 형식으로 설정
  const today = new Date().toISOString().split("T")[0];

  // 부모가 작성한 계약 내용
  const [contractDetails, setContractDetails] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/contract/getDetails", {
        params: { childId: childNum }, // 세션값 childNum 사용
      })
      .then((response) => {
        //console.log("API 응답 데이터:", response.data); // API 응답 데이터 확인

        if (response.data && response.data.contractMoney) {
          setAmount(response.data.contractMoney.toLocaleString()); // 지급금액을 콤마 포함 형식으로 설정
        } else {
          setAmount("금액 정보를 찾을 수 없습니다.");
        }
        if (response.data && response.data.contractContent) {
          //  부모가 작성한 계약 내용을 세부사항에 표시
          // 계약 상세내용 줄바꿈 적용
          setContractDetails(
            response.data.contractContent.replace(/\n/g, "<br>")
          );
        } else {
          setContractDetails("계약서 내용을 찾을 수 없습니다.");
        }
      })
      .catch((error) => {
        console.error("계약서 불러오기 실패:", error);
        toast.error("예외: 계약서 내용을 불러오지 못했습니다.(용돈계약서 작성필요)");
      });
    // }, []);
  }, [childNum]);

  // 서명 지우기
  const clearSignature = () => {
    signatureRef.current.clear();
  };

  //  **서명 후 보내기 버튼 클릭 시**
  const handleSubmit = async () => {
    //  서명 이미지를 Base64 데이터로 변환
    const signatureData = signatureRef.current.toDataURL("image/png");

    // 계약서 ID 가져오기 (예: 부모가 작성한 계약서 조회 결과에서 가져옴)------ 하드코딩 추후수정필요
    // const contractNum = 48; // 🔹 실제 계약 번호를 여기에 전달해야 함
    // const childNum = 35; // 🔹 실제 계약 번호를 여기에 전달해야 함

    //  전송할 데이터 구성
    const contractData = {
      // contract_money: parseInt(amount.replace(/,/g, ""), 10), // 금액에서 ',' 제거 후 정수 변환
      // contract_status: false, // 초안 상태
      // contract_excelpath: signatureData, // Base64 서명 이미지 전송
      // contractNum: contractNum, // ✅ 계약 번호 (서버에서 해당 계약을 식별하는 값)
      childSignature: signatureData, // ✅ 자녀의 서명 이미지 (Base64)
      childNum: Number(childNum), // ✅ childNum 추가
    };

    try {
      //  Axios POST 요청으로 데이터 전송
      await axios.post(
        "http://localhost:7777/zoomoney/contract/complete",
        contractData
      );

      const response = await axios.get(
        `http://localhost:7777/zoomoney/member/${memberNum}/select`
      );

      await axios.post("http://localhost:7777/zoomoney/notify/send", {
        memberNum: response.data[0].memberParent.memberNum,
        notifyContent: "📜 용돈계약서의 확인이 완료되어 잘 보관되었어요",
        notifyUrl: "/contract/contractSelect",
      });

      toast.error("서명 저장 성공");
    } catch (error) {
      console.error("서명 저장 실패:", error);
      toast.error("서명 저장에 실패했습니다." + childNum);
    }
  };

  return (
    <div className="mock-container">
      <div className="contractWrtieChild-container">
        <Header title="용돈계약서 작성" />

        <div className="contractWrtieChild-contract-form">
          <p className="contractWrtieChild-info-text">
            용돈 지급에 관한 세부사항을 확인하세요.
          </p>

          {/* 세부사항 입력 */}
          <div className="contractWrtieChild-info-box">
            <div className="contractWriteChild-details-container">
              {/* 부모가 작성한 계약 내용 표시 (details가 있을 경우만) */}
              <div
                dangerouslySetInnerHTML={{ __html: contractDetails }} // HTML 형태로 표시
              />
            </div>
          </div>

          {/* 지급 금액 */}
          <div className="contractWrtieChild-amount-input-containerTop">
            <label>지급금액</label>
            <div className="contractWrtieChild-amount-input-container">
              {/* <span>{amount} 원</span> */}
              <span className="contractWrtieChild-amount-number">
                {amount}
              </span>{" "}
              <span>원</span>
            </div>
          </div>

          {/* 계약일자 */}
          <div className="contractWrtieChild-input-box">
            <label>계약일자</label>
            <input type="text" value={selectedDate} readOnly />
          </div>

          {/* 지급 요일 선택 */}
          <div className="contractWrtieChild-input-box">
            <label>최초지급일</label>
            <input type="text" value={selectedDate} readOnly />
          </div>

          {/* 용돈 수취인 (서명) */}
          <div className="contractWrtieChild-signature-box">
            <label>용돈 수취인</label>
            <div className="contractWrtieChild-signature">
              {/* <span>신짱구</span> <span>(서명)</span> */}
              <span>{childName}</span> <span>(서명)</span>
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
          <button
            className="contractWrtieChild-submit-button"
            onClick={handleSubmit}
          >
            서명 완료
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ContractWriteChild;
