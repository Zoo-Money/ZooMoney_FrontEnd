import { BrowserProvider, Contract, parseUnits } from "ethers";
import AccountABI from "./AccountABI.json";

// 지갑 주소
const walletAddress = process.env.REACT_APP_FT_WALLET_ADDRESS;

// 스마트 컨트랙트 주소
const contractAddress = process.env.REACT_APP_FT_CONTRACT_ADDRESS;

// 컨트랙트 불러오기
const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask가 설치되어 있지 않습니다.");
  }
  
  const providerInstance = new BrowserProvider(window.ethereum);
  const signerInstance = await providerInstance.getSigner();
  return new Contract(contractAddress, AccountABI, signerInstance);
};

// 토큰 발행 함수
export const mintTokens = async (amount) => {
  if (amount <= 0) {
    throw new Error("올바른 토큰 발행 개수를 입력해주세요.");
  }

  const contract = await getContract();
  const tx = await contract.mint(walletAddress, parseUnits(amount.toString(), 18));
  await tx.wait();
  return amount;
};

// 토큰 소각 함수
export const burnTokens = async (amount) => {
  if (amount <= 0) {
    throw new Error("올바른 토큰 소각 개수를 입력해주세요.");
  }

  const contract = await getContract();
  const tx = await contract.burn(parseUnits(amount.toString(), 18));
  await tx.wait();
  return amount;
};