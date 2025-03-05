import { BrowserProvider, Contract, parseUnits } from "ethers";
import { useState } from "react";
import AccountABI from "./AccountABI.json";

const AccountBurn = () => {
  const [amount, setAmount] = useState(10000);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [, setSigner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 스마트 컨트랙트 주소
  const contractAddress = "0xc78432c4C97D16283d520A2626C03f13C0431c12"; // 배포된 컨트랙트 주소

  // 지갑 연결 함수
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true); // 로딩 시작
        const providerInstance = new BrowserProvider(window.ethereum);
        const accounts = await providerInstance.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        const signerInstance = await providerInstance.getSigner();
        setSigner(signerInstance);

        const tokenContract = new Contract(contractAddress, AccountABI, signerInstance);
        setContract(tokenContract);

        return { account: accounts[0], contract: tokenContract }; // 필요한 데이터를 반환
      } catch (error) {
        alert("지갑 연결 실패");
        throw error; // 에러를 호출한 곳에서 처리
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    } else {
      alert("MetaMask가 설치되어 있지 않습니다. 지갑을 연결하려면 MetaMask를 설치해주세요.");
    }
  };

  // 토큰 발행 함수
  const mintTokens = async () => {
    try {
      setIsLoading(true); // 로딩 시작
      let currentContract = contract;
      let currentAccount = account;

      // 지갑 연결이 되어 있지 않으면 연결 시도
      if (!currentContract || !currentAccount) {
        const walletData = await connectWallet();
        currentContract = walletData.contract;
        currentAccount = walletData.account;
      }

      // amount가 0 이하일 때 경고 메시지
      if (amount <= 0) {
        alert("올바른 토큰 발행 개수를 입력해주세요.");
        return;
      }

      if (currentAccount && currentContract && amount > 0) {
        const tx = await currentContract.mint(currentAccount, parseUnits(amount.toString(), 18));
        await tx.wait();
        alert(`${amount} 토큰 발행 완료`);
      } else {
        alert("모든 값을 입력해주세요.");
      }
    } catch (error) {
      alert("토큰 발행 실패");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 토큰 소각 함수
  const burnTokens = async () => {
    try {
      setIsLoading(true); // 로딩 시작
      let currentContract = contract;
      let currentAccount = account;

      // 지갑 연결이 되어 있지 않으면 연결 시도
      if (!currentContract || !currentAccount) {
        const walletData = await connectWallet();
        currentContract = walletData.contract;
        currentAccount = walletData.account;
      }

      // amount가 0 이하일 때 경고 메시지
      if (amount <= 0) {
        alert("올바른 토큰 소각 개수를 입력해주세요.");
        return;
      }

      if (currentAccount && currentContract && amount > 0) {
        const tx = await currentContract.burn(parseUnits(amount.toString(), 18));
        await tx.wait();
        alert(`${amount} 토큰 소각 완료`);
      } else {
        alert("모든 값을 입력해주세요.");
      }
    } catch (error) {
      alert("토큰 소각 실패");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div>
      <h2>ZooToken 관리자</h2>

      <p>연결된 계정: {account || "없음"}</p>

      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="토큰 수량 입력"
          disabled={isLoading} // 로딩 중에는 입력 비활성화
        />
      </div>

      <button onClick={mintTokens} disabled={isLoading}>
        {isLoading ? "처리 중..." : "토큰 발행"}
      </button>
      <button onClick={burnTokens} disabled={isLoading}>
        {isLoading ? "처리 중..." : "토큰 소각"}
      </button>
    </div>
  );
};

export default AccountBurn;