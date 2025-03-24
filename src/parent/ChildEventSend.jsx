import axios from "axios";
import { API_PATH } from "../common/config.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../common/Header";
import "./css/childEventSend.css";

const ChildEventSend = () => {
  const navigate = useNavigate();

  const parentNum = sessionStorage.getItem("member_num");
  const parentId = sessionStorage.getItem("member_id");

  const [amount, setAmount] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isCustomInput, setIsCustomInput] = useState(false); // 송금 금액 직접입력 여부
  const [accountInfo, setAccountInfo] = useState(""); // 부모 계좌번호
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(
    Number(sessionStorage.getItem("childNum")) || null
  );
  // 선택한 자녀의 memberNum
  const selectedChildInfo = children.find(
    (child) => Number(child.memberNum) === selectedChild
  );
  const [cardMoney, setCardMoney] = useState(0); //카드 잔액상태

  // DB에서 계좌 정보 가져오기
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await axios.get(
          `${API_PATH}/zoomoney/contract/account/${parentId}`
        );
        const accountData = response.data["member_account"];
        setAccountInfo(accountData);
      } catch (error) {
        setAccountInfo("계좌 정보를 불러올 수 없습니다.");
      }
    };

    fetchAccountInfo();
  });

  useEffect(() => {
    axios
      .get(`${API_PATH}/zoomoney/contract/getChildByParent`, {
        params: { parentId: parentNum },
      })
      .then((response) => {
        setChildren(response.data);

        // 세션에 저장된 childNum 값이 있으면 그 값으로 selectedChild 설정
        const storedChildNum = Number(sessionStorage.getItem("childNum"));
        if (storedChildNum) {
          setSelectedChild(storedChildNum);
        } else {
          toast.error("자녀 정보가 없습니다. 자녀 선택 후 다시 시도해 주세요.");
        }
      })
      .catch((error) => {
        console.error("자녀 목록 불러오기 실패:", error);
      });
  });

  useEffect(() => {
    if (selectedChild) {
      axios
        .get(`${API_PATH}/zoomoney/contract/child/money`, {
          params: { memberNum: selectedChild }, // 선택한 자녀의 memberNum 전달
        })
        .then((response) => {
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
    // setAmount(amount + value);
    // setSelectedAmount(value);
    // setIsCustomInput(false); //직접입력 종료
    const numericAmount = Number(amount); // 🔥 숫자 변환 추가
    setAmount(numericAmount + value);
    setSelectedAmount(value);
    setIsCustomInput(false); // 직접입력 종료
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
    // setAmount(numericValue);
    setAmount(Number(numericValue)); // 🔥 숫자 변환 추가
  };

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
        `${API_PATH}/zoomoney/contract/sendAllowance/${storedChildNum}`,
        { amount: Number(amount) }
      );
      const response = await axios.get(
        "http://localhost:7777/zoomoney/member/select",
        {
          params: { memberNum: storedChildNum },
        }
      );

      await axios.post("http://localhost:7777/zoomoney/notify/send", {
        memberNum: selectedChild,
        notifyContent: `💸 ${amount.toLocaleString()} 원만큼 용돈을 받았어요.`,
        notifyUrl: "/main",
      });
      toast.success("용돈 송금에 성공했습니다.");
      navigate(`/parent/main`); // childNum 전달
    } catch (error) {
      console.error("송금 실패:", error);
      toast.error("송금에 실패했습니다. 다시 시도해주세요.");
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
          </div>

          {/* 충전 계좌 정보 */}

          <div className="Child-Event-Send-amount-account-containerTop">
            <label>충전계좌 정보</label>
            <div className="Child-Event-Send-amount-account-container">
              <p>{accountInfo || "계좌 정보를 불러오는 중..."}</p>
            </div>
          </div>

          {/* 송금하기 버튼 */}
          <div className="Child-Event-Send-submit-button-container">
            <button
              className="Child-Event-Send-submit-button"
              onClick={handleSendAllowance}
            >
              용돈 보내기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildEventSend;
