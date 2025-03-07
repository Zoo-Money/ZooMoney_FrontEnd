import { useState } from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import "./Account.css";
import { mintTokens } from "./AccountService";

const AccountMint = () => {
  const [amount, setAmount] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // 토큰 발행 핸들러s
  const handleMintTokens = async () => {
    try {
      setIsLoading(true);
      const mintedAmount = await mintTokens(amount);
      alert(`${mintedAmount}원 저금 완료`);
    } catch (error) {
      alert("저금 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="저금통 저금" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="content">
        <div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="저금할 금액"
            disabled={isLoading}
          />
        </div>

        <button onClick={handleMintTokens} disabled={isLoading}>
          {isLoading ? "처리 중..." : "저금하기"}
        </button>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default AccountMint;
