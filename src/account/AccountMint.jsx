import { useState } from "react";
import { mintTokens } from "./AccountService";

const AccountMint = () => {
  const [amount, setAmount] = useState(10000);
  const [isLoading, setIsLoading] = useState(false);

  // 토큰 발행 핸들러
  const handleMintTokens = async () => {
    try {
      setIsLoading(true);
      const mintedAmount = await mintTokens(amount);
      alert(`${mintedAmount} 토큰 발행 완료`);
    } catch (error) {
      alert("토큰 발행 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>ZooToken 발행</h2>

      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="발행할 토큰 수량 입력"
          disabled={isLoading}
        />
      </div>

      <button onClick={handleMintTokens} disabled={isLoading}>
        {isLoading ? "처리 중..." : "토큰 발행"}
      </button>
    </div>
  );
};

export default AccountMint;