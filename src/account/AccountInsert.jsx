import axios from "axios";
import { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import "./css/AccountInsert.css";
import { mintTokens } from "./resources/AccountService";
import { toast } from "react-toastify";

const AccountInsert = () => {
  // 세션 값 불러오기
  const memberNum = sessionStorage.getItem("member_num");
  const location = useLocation(); // 상태를 받아오기 위해 useLocation 사용
  const navigate = useNavigate();

  const [amount, setAmount] = useState();
  const [cardmoneyleft, setCardMoneyLeft] = useState();
  const [accountmoneyleft, setAccountMoneyLeft] = useState();
  const [loading, setLoading] = useState(true);
  const [isready, setIsReady] = useState(false);

  // state에서 추출
  const accountNum = location.state?.accountNum;
  const accountName = location.state?.accountName;
  const accountGoal = location.state?.accountGoal;
  const accountNow = location.state?.accountNow;

  useEffect(() => {
    const get = async () => {
      try {
        // 카드 잔액 조회
        const response = await axios.get(
          `http://localhost:7777/zoomoney/card/get`, {
            params: {
              member_num: memberNum,
            }
          }
        );
        setCardMoneyLeft(response.data.cardMoney);
        setAccountMoneyLeft(accountGoal - accountNow);
      } catch (error) {
        console.error("조회 실패");
      } finally {
        setLoading(false);
      }
    };

    get();
  });

  // 데이터 로드 후 렌더링
  if (loading) return null;

  const insertAccount = async () => {
    try {
      setIsReady(true);

      let status = 3;

      // 저금할 금액 확인
      if (!amount || Number(amount) <= 0) {
        toast.error("저금할 금액을 입력하세요.");
        return;
      }

      // 저금 가능 금액 확인
      if (cardmoneyleft < amount || accountmoneyleft < amount) {
        toast.error("저금 가능 금액보다 큽니다.");
        return;
      }

      if (Number(amount) === Number(accountmoneyleft)) {
        status = 4;
      }

      // 저금통 저금
      await mintTokens(amount);

      // 카드 금액 변경
      await axios.put(
        `http://localhost:7777/zoomoney/card/change/${memberNum}`,
        null,
        {
          params: { amount: -amount }, // 쿼리 파라미터로 amount 전달
        }
      );

      // 저금통 금액 변경
      await axios.put(
        `http://localhost:7777/zoomoney/account/insert/${accountNum}`,
        null,
        {
          params: { amount: amount }, // 쿼리 파라미터로 amount 전달
        }
      );

      navigate("/account/end", {
        state: { accountName, status },
      });
    } catch (error) {
      console.error("저금 실패");
    } finally {
      setIsReady(false);
    }
  };

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="저금하기" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="AccountInsertContent">
        <div>
          <span style={{ fontSize: "1.5rem" }}>
            얼마 <span style={{ color: "#ff9500" }}>저금</span>하시겠어요?
          </span>
        </div>
        <div className="AccountInsertView">
          <div>
            <span>목표 달성까지 남은 금액</span>
            <span>{accountmoneyleft.toLocaleString()} 원</span>
          </div>
          <div>
            <span>내 카드 잔액</span>
            <span>{cardmoneyleft.toLocaleString()} 원</span>
          </div>
          <hr />
          <div>
            <span>저금 가능 금액</span>
            <span>
              {accountmoneyleft < cardmoneyleft
                ? accountmoneyleft.toLocaleString()
                : cardmoneyleft.toLocaleString()}{" "}
              원
            </span>
          </div>
        </div>
        <div style={{ width: "90%" }}>
          <InputGroup className="AccountInsertInput">
            <Form.Control
              type="number"
              placeholder="저금할 금액"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isready}
            />
            <InputGroup.Text>원</InputGroup.Text>
          </InputGroup>
        </div>

        <button onClick={insertAccount} disabled={isready}>
          {isready ? "처리 중..." : "다음"}
        </button>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default AccountInsert;
