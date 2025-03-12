import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import CardABI from "./CardABI.json"; // 스마트 컨트랙트 ABI
import defaultCardImage from "../images/defaultcard.png";

const contractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;
const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;

// 파일을 IPFS에 업로드
export const uploadToIPFS = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const formData = new FormData();
  formData.append("file", file);

  const headers = {
    pinata_api_key: pinataApiKey,
    pinata_secret_api_key: pinataSecretApiKey,
  };

  try {
    const response = await axios.post(url, formData, { headers });
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    return null;
  }
};

// 메타데이터를 IPFS에 업로드
export const uploadMetadataToIPFS = async (imageUrl) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const metadata = {
    name: "ZooTest NFT",
    description: "This is a test NFT from the ZooTest contract.",
    image: imageUrl.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/"),
  };

  const headers = {
    "Content-Type": "application/json",
    pinata_api_key: pinataApiKey,
    pinata_secret_api_key: pinataSecretApiKey,
  };

  try {
    const response = await axios.post(url, metadata, { headers });
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    return null;
  }
};

// NFT 발행
export const mintNFT = async (file, setMinting, setTransactionHash) => {
  if (!file) {
    // 기본 이미지 URL을 File 객체로 변환
    const response = await fetch(defaultCardImage);
    const blob = await response.blob();
    file = new File([blob], "default-image.png", { type: "image/png" });
  }

  if (!window.ethereum) {
    alert("MetaMask를 설치하세요!");
    return;
  }

  setMinting(true);

  const imageUrl = await uploadToIPFS(file);
  if (!imageUrl) {
    setMinting(false);
    return;
  }

  const metadataUrl = await uploadMetadataToIPFS(imageUrl);
  if (!metadataUrl) {
    setMinting(false);
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, CardABI, signer);

  try {
    const address = await signer.getAddress();

    // 클라이언트 측에서 tokenId를 증가시킴
    let tokenId = localStorage.getItem("lastTokenId");
    tokenId = tokenId ? parseInt(tokenId) + 1 : 202503010; // 기본값은 20250300
    localStorage.setItem("lastTokenId", tokenId);

    // 새로운 tokenId로 NFT 발행
    const transaction = await contract.safeMint(address, tokenId, metadataUrl);
    await transaction.wait();

    setMinting(false);
    setTransactionHash(transaction.hash);

    // 임의의 카드 번호 생성 (예: 카드 번호는 16자리 숫자로)
    const cardNum = generateCardNumber();
    const cardMetadata = tokenId;
    const cardMoney = 0;
    const memberNum = sessionStorage.getItem("member_num"); // 세션에서 member_num 가져오기

    // 카드 정보 백엔드로 전송
    await saveCardToDB(cardNum, cardMetadata, cardMoney, memberNum);
    return true;
  } catch (error) {
    setMinting(false);
  }
};

// 카드 소각
export const burnNFT = async (tokenId, setBurning, setBurnTransactionHash) => {
  if (!tokenId) {
    return;
  }

  if (!window.ethereum) {
    alert("MetaMask를 설치하세요!");
    return;
  }

  setBurning(true);

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, CardABI, signer);

    const transaction = await contract.burn(tokenId);
    await transaction.wait();

    setBurnTransactionHash(transaction.hash);
    alert(`NFT 소각 성공! Tx: ${transaction.hash}`);
  } catch (error) {
    console.error("NFT 소각 오류:", error);
    alert("NFT 소각 실패");
  } finally {
    setBurning(false);
  }
};

// NFT 조회
export const fetchMetadata = async (
  tokenId,
  setMetadata,
  setMetadataUrl,
  setLoading
) => {
  if (!tokenId) {
    return;
  }

  if (!window.ethereum) {
    return;
  }

  setLoading(true);

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, CardABI, signer);

    const uri = await contract.tokenURI(tokenId);

    if (!uri || uri === "0x") {
      alert("유효한 tokenURI가 아닙니다.");
      setLoading(false);
      return;
    }

    const ipfsUrl = uri.startsWith("ipfs://")
      ? `https://gateway.pinata.cloud/ipfs/${uri.split("ipfs://")[1]}`
      : uri;

    const response = await fetch(ipfsUrl);
    const metadata = await response.json();

    setMetadata(metadata);
    setMetadataUrl(ipfsUrl);
  } catch (error) {
  } finally {
    setLoading(false);
  }
};
// 카드 번호 생성 함수 (임의로 16자리 숫자 생성, '-' 구분 추가)
const generateCardNumber = () => {
  const randomCardNumber = Math.floor(Math.random() * 10000000000000000);
  const cardNumberStr = randomCardNumber.toString().padStart(16, "0");

  // 카드 번호를 4자리씩 구분하여 '-' 추가
  const formattedCardNumber = cardNumberStr.replace(/(\d{4})(?=\d)/g, "$1-");

  return formattedCardNumber;
};

// 백엔드로 카드 정보를 전송하는 함수 (axios 사용 예시)
export const saveCardToDB = async (
  cardNum,
  cardMetadata,
  cardMoney,
  memberNum
) => {
  try {
    const response = await axios.post(
      "http://localhost:7777/zoomoney/card/create",
      {
        card_num: cardNum,
        card_metadata: cardMetadata,
        card_money: cardMoney,
        member_num: memberNum,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("카드 정보 저장 성공:", response.data);
  } catch (error) {
    console.error("카드 정보 저장 실패:", error);
  }
};
