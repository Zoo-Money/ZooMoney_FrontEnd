import { useState } from "react";
import { burnTokens } from "./AccountService";

const AccountBurn = () => {
  const [amount, setAmount] = useState(10000);
  const [isLoading, setIsLoading] = useState(false);

  // 토큰 소각 핸들러
  const handleBurnTokens = async () => {
    try {
      setIsLoading(true);
      const burnedAmount = await burnTokens(amount);
      alert(`${burnedAmount} 토큰 소각 완료`);
    } catch (error) {
      alert("토큰 소각 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>ZooToken 소각</h2>

      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="소각할 토큰 수량 입력"
          disabled={isLoading}
        />
      </div>

      <button onClick={handleBurnTokens} disabled={isLoading}>
        {isLoading ? "처리 중..." : "토큰 소각"}
      </button>
    </div>
  );
};

export default AccountBurn;
