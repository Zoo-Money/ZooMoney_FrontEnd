import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../common/Footer";
import Header from "../common/Header";
import "./css/childEventSend.css";

const ChildEventSend = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  // const [message, setMessage] = useState(""); // 송금시 메세지 작성
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isCustomInput, setIsCustomInput] = useState(false); // 송금 금액 직접입력 여부
  const [accountInfo, setAccountInfo] = useState(""); // 부모 계좌 정보 상태 추가
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(
    Number(sessionStorage.getItem("childNum")) || null
  ); // 선택한 자녀의 memberNum
  const selectedChildInfo = children.find(
    (child) => Number(child.memberNum) === selectedChild
  );
  const [cardMoney, setCardMoney] = useState(0); //카드 잔액상태

  // DB에서 계좌 정보 가져오는 비동기 함수
  useEffect(() => {
    const fetchAccountInfo = async () => {
      const memberId = "user002"; // 현재 로그인한 사용자의 아이디(세션값변경)
      try {
        const response = await axios.get(
          `http://localhost:7777/zoomoney/contract/account/${memberId}`
        );
        const accountData = response.data["member_account"];
        setAccountInfo(accountData); // 응답 데이터에서 계좌 정보 저장
      } catch (error) {
        console.error("F_CES)계좌 정보를 불러오지 못했습니다:", error);
        setAccountInfo("계좌 정보를 불러올 수 없습니다.");
      }
    };

    fetchAccountInfo(); // 데이터 불러오기
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/contract/getChildByParent", {
        params: { parentId: 2 }, // 임시 부모 ID (로그인 로직에서 받아오도록 변경 필요)
        // params: { parentId: parentId },
        //withCredentials: true, // 세션 정보 전송(로그인 기능 연동 시 필요)
      })
      .then((response) => {
        console.log("자녀 데이터:", response.data); // 🔍 데이터 확인
        setChildren(response.data);

        // 세션에 저장된 childNum 값이 있으면 그 값으로 selectedChild 설정
        const storedChildNum = Number(sessionStorage.getItem("childNum"));
        if (storedChildNum) {
          setSelectedChild(storedChildNum); // 세션 값 기준으로 설정
        } else {
          // 🚨 세션 값이 없고 자녀 데이터도 없을 경우 경고 메시지 표시
          toast.error("자녀 정보가 없습니다. 자녀 선택 후 다시 시도해 주세요.");
        }
      })
      .catch((error) => {
        console.error("자녀 목록 불러오기 실패:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedChild) {
      console.log("!!!!!!바뀐 선택한 자녀의 memberNum:", selectedChild); // 확인용 로그 추가
      axios
        .get("http://localhost:7777/zoomoney/contract/child/money", {
          params: { memberNum: selectedChild }, // 🔹 선택한 자녀의 memberNum 전달
        })
        .then((response) => {
          console.log("카드 데이터:", response.data);
          setCardMoney(response.data.cardMoney); // 카드 잔액 설정
        })
        .catch((error) => {
          console.error("카드 정보 불러오기 실패:", error);
          setCardMoney(0); // 카드 데이터가 없을 경우 기본 값 0 설정
        });
    }
  }, [selectedChild]);

  // 금액 버튼 클릭 시
  const handleAmountClick = (value) => {
    setAmount(amount + value);
    setSelectedAmount(value);
    setIsCustomInput(false); //직접입력 종료
  };

  // 송금 금액 직접입력버튼 클릭시
  const handleDirectinputClick = () => {
    setIsCustomInput(true);
    setSelectedAmount(null);
    setAmount(0);
  };

  // 직접입력시 금액 입력 핸들러
  const handleAmountChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, ""); // 숫자만 입력
    setAmount(numericValue);
  };

  // 메시지 입력 제한
  // const handleMessageChange = (e) => {
  //   const inputText = e.target.value;
  //   if (inputText.length <= 11) {
  //     setMessage(inputText);
  //   }
  // };
  const handleSendAllowance = async () => {
    const storedChildNum = Number(sessionStorage.getItem("childNum")); // 세션에서 자녀 ID 가져오기
    if (!storedChildNum) {
      toast.error("자녀 정보가 없습니다. 자녀 선택 후 다시 시도해 주세요.");
      return;
    }

    if (amount <= 0) {
      toast.error("송금할 금액을 입력하세요.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:7777/zoomoney/contract/sendAllowance/${storedChildNum}`,
        { amount: Number(amount) } //숫자변환
      );
      toast.error("용돈 송금에 성공했습니다.");
      // navigate("/contract/parentMain"); // 성공 시 ParentMain 페이지로 이동
      navigate(`/contract/parentMain?childNum=${storedChildNum}`); // childNum 전달
    } catch (error) {
      console.error("송금 실패:", error);
      toast.error("송금에 실패했습니다. 다시시도해주세요");
    }
  };

  return (
    <div className="mock-container">
      <div className="Child-Event-Send-container">
        <Header title="송금하기" />
        <div className="Child-Event-Send-contract-form">
          {/* 금액 선택 */}
          <div className="Child-Event-Send-section">
            <h3>
              <span className="Child-Event-Send-highlight">얼마</span>를
              보낼까요?
            </h3>
            <p className="Child-Event-Send-balance">
              {" "}
              {selectedChildInfo
                ? selectedChildInfo.memberName
                : "자녀 없음"}{" "}
              의 주머니 잔액 : {cardMoney.toLocaleString()}원
            </p>
            <div className="Child-Event-Send-amount-buttons">
              <button
                className={`Child-Event-Send-amount-btn ${
                  isCustomInput ? "selected" : ""
                }`}
                onClick={handleDirectinputClick}
              >
                직접입력
              </button>
              {[5000, 10000, 30000, 50000].map((value) => (
                <button
                  key={value}
                  className={`Child-Event-Send-amount-btn ${
                    selectedAmount === value ? "selected" : ""
                  }`}
                  onClick={() => handleAmountClick(value)}
                >
                  +{value / 10000} 만원
                </button>
              ))}
            </div>

            <div className="Child-Event-Send-amount-input-containerTop">
              <label>지급금액</label>
              <div className="Child-Event-Send-amount-input-container">
                <input
                  type="text"
                  value={amount.toLocaleString()}
                  onChange={handleAmountChange}
                  placeholder="금액 입력"
                  inputMode="numeric"
                  readOnly={!isCustomInput}
                />
                <span>원</span>
              </div>
            </div>
            {/* <p className="info-text">
            부족한 금액은 1만 원 단위로 자동 충전 됩니다.
          </p> */}
          </div>
          {/* 메시지 입력 */}
          {/* <div className="section">
          <h3>
            <span className="Child-Event-Send-highlight">메시지</span>를
            남길까요?
          </h3>
          <input
            type="text"
            className="Child-Event-Send-message-input"
            value={message}
            onChange={handleMessageChange}
            placeholder="하고 싶은 말을 적어보세요."
          />
          <p className="char-count">{message.length}/11</p>
        </div> */}
          {/* 충전 계좌 정보 */}

          <div className="Child-Event-Send-amount-account-containerTop">
            <label>충전계좌 정보</label>
            <div className="Child-Event-Send-amount-account-container">
              {/* <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/69/Shinhan_Bank.svg"
                alt="신한은행 로고"
                className="bank-logo"
              /> */}
              <p>{accountInfo || "계좌 정보를 불러오는 중..."}</p>
            </div>
          </div>

          {/* 송금하기 버튼 */}
          <div className="Child-Event-Send-submit-button-container">
            <button
              className="Child-Event-Send-submit-button"
              onClick={handleSendAllowance}
              // disabled={!isFormValid}
            >
              용돈 보내기
            </button>
          </div>
          {/* 하단 네비게이션 */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ChildEventSend;
