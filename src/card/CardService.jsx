import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import CardABI from "./CardABI.json"; // 스마트 컨트랙트 ABI

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
    console.error("Pinata 업로드 오류:", error);
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
    console.error("Metadata 업로드 오류:", error);
    return null;
  }
};

// NFT 발행
export const mintNFT = async (file, setMinting, setTransactionHash) => {
  if (!file) {
    alert("파일을 선택해주세요!");
    return;
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
    alert(`NFT 발행 성공! Tx: ${transaction.hash}`);
  } catch (error) {
    console.error("NFT 발행 오류:", error);
    setMinting(false);
    alert("NFT 발행 실패");
  }
};

// NFT 소각
export const burnNFT = async (tokenId, setBurning, setBurnTransactionHash) => {
  if (!tokenId) {
    alert("소각할 NFT의 Token ID를 입력하세요!");
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
    alert("토큰 ID를 입력하세요!");
    return;
  }

  if (!window.ethereum) {
    alert("MetaMask를 설치하세요!");
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
    console.error("NFT 메타데이터 조회 오류:", error);
    alert("메타데이터 조회 실패");
  } finally {
    setLoading(false);
  }
};
