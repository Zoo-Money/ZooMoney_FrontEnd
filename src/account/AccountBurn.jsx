import { Button } from "bootstrap";
import { useState } from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import "./Account.css";
import { burnTokens } from "./AccountService";

const AccountBurn = () => {
  const [amount, setAmount] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // 토큰 소각 핸들러
  const handleBurnTokens = async () => {
    try {
      setIsLoading(true);
      const burnedAmount = await burnTokens(amount);
      alert(`${burnedAmount}원 출금 완료`);
    } catch (error) {
      alert("출금 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="저금통 출금" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="content">
        <div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="출금할 금액"
            disabled={isLoading}
          />
        </div>

        <Button onClick={handleBurnTokens} disabled={isLoading}>
          {isLoading ? "처리 중..." : "출금하기"}
        </Button>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default AccountBurn;
