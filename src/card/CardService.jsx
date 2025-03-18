import axios from "axios";
import { ethers } from "ethers";
import card00 from "../images/card/card00.png";
import CardABI from "./resources/CardABI.json"; // 스마트 컨트랙트 ABI
import { toast } from "react-toastify";
const contractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;
const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;

// 파일을 IPFS에 업로드
export const uploadToIPFS = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const formData = new FormData();
  formData.append("file", file);
  if (!file) {
    console.error("No file selected.");
    return null;
  }
  const headers = {
    pinata_api_key: pinataApiKey,
    pinata_secret_api_key: pinataSecretApiKey,
  };

  try {
    const response = await axios.post(url, formData, { headers });
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error(
      "Error uploading to IPFS:",
      error.response ? error.response.data : error.message
    );

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
    const response = await fetch(card00);
    const blob = await response.blob();
    file = new File([blob], "default-image.png", { type: "image/png" });
  }

  if (!window.ethereum) {
    toast.error("MetaMask를 설치하세요!");
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
    tokenId = tokenId ? parseInt(tokenId) + 1 : 202503010; // 기본값은 202503010
    localStorage.setItem("lastTokenId", tokenId);

    // 세션에서 카드 정보 확인
    let cardNum = sessionStorage.getItem("card_num");
    let cardMetadata = sessionStorage.getItem("tokenId"); // tokenId로 사용 중
    let cardMoney = sessionStorage.getItem("card_money");

    const memberNum = sessionStorage.getItem("member_num"); // 세션에서 member_num 가져오기
    if (!memberNum) throw new Error("세션에 member_num이 없습니다.");

    if (cardNum && cardMetadata && cardMoney) {
      // 새 이미지 업로드
      const newImageUrl = await uploadToIPFS(file); // 새 이미지를 업로드하는 함수

      if (!newImageUrl) {
        setMinting(false);
        return;
      }

      // 새로운 메타데이터 URL 생성 (새로운 이미지 URL을 기반으로)
      const newMetadataUrl = await uploadMetadataToIPFS(newImageUrl);

      if (!newMetadataUrl) {
        setMinting(false);
        return;
      }

      try {
        // 기존 토큰의 메타데이터 URL을 업데이트하는 함수 호출
        const transaction = await contract.setTokenURI(
          cardMetadata, // 기존 tokenId
          newMetadataUrl // 새로운 metadataUrl
        );
        await transaction.wait();

        // 카드 날짜 최신화
        await updateCardDate();
      } catch (error) {
        console.error("메타데이터 업데이트 중 오류 발생:", error);
      }
    } else {
      // 세션에 카드 정보가 없을 경우 새로운 카드 발급
      cardNum = generateCardNumber();
      cardMetadata = tokenId;
      cardMoney = 0;

      // 신규 tokenId로 NFT 발행
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

      const transaction = await contract.safeMint(
        address,
        cardMetadata,
        metadataUrl
      );
      await transaction.wait();

      // 신규 카드 정보 DB에 저장
      await saveCardToDB(cardNum, cardMetadata, cardMoney, memberNum);
    }

    setMinting(false);

    return true;
  } catch (error) {
    setMinting(false);
    console.error("NFT 발급 중 오류 발생:", error);
  }
};

// 카드 소각
export const burnNFT = async (tokenId, setBurning, setBurnTransactionHash) => {
  if (!tokenId) {
    return;
  }

  if (!window.ethereum) {
    toast.error("MetaMask를 설치하세요!");
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
  } catch (error) {
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
      toast.error("유효한 tokenURI가 아닙니다.");
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
const axiosHeader = {
  headers: {
    "Content-Type": "application/json",
  },
};
// 백엔드로 카드 정보를 전송하는 함수 (axios 사용 예시)
export const saveCardToDB = async (
  cardNum,
  cardMetadata,
  cardMoney,
  memberNum
) => {
  //카드 데이터
  const cardData = {
    card_num: cardNum,
    card_metadata: cardMetadata,
    card_money: cardMoney,
    member_num: memberNum,
  };
  try {
    await axios.post(
      "http://localhost:7777/zoomoney/card/create",
      cardData,
      axiosHeader
    );
  } catch (error) {
    console.error("카드 정보 저장 실패:", error);
  }
};
//카드 이미지 변경시 날짜 최신날짜로 변경
export const updateCardDate = async () => {
  try {
    // 예시: sessionStorage에서 memberNum을 가져오는 경우
    const memberNum = sessionStorage.getItem("member_num");
    const cardNum = sessionStorage.getItem("card_num");
    if (!memberNum) {
      throw new Error("세션에 memberNum이 없습니다.");
    }
    await axios.put(
      "http://localhost:7777/zoomoney/card/update",
      {
        card_num: cardNum,
        member_num: memberNum,
      },
      axiosHeader
    );
  } catch (error) {
    console.error("날짜/포인트 업데이트 실패:", error);
  }
};
export const fetchCardInfo = async (memberNum, setTokenId, setNewLoading) => {
  try {
    const response = await axios.get(
      "http://localhost:7777/zoomoney/card/get",
      {
        params: {
          member_num: memberNum, // 쿼리 파라미터로 전달
        },
      }
    );

    if (response.data) {
      sessionStorage.setItem("tokenId", response.data.cardMetadata);
      sessionStorage.setItem("card_num", response.data.cardNum);
      sessionStorage.setItem("card_money", response.data.cardMoney);
      sessionStorage.setItem("cardMetadata", response.data.cardMetadata);

      setTokenId(response.data.cardMetadata);
    }

    setNewLoading(false);
  } catch (error) {
    console.error("데이터 가져오기 오류:", error);
    setNewLoading(false);
  }
};
