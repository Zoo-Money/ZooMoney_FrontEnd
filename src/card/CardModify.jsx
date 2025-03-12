import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import defaultCardImage01 from "../images/caramelcard.png";
import defaultCardImage from "../images/defaultcard.png";
import defaultCardImage03 from "../images/pinkcard.png";
import defaultCardImage04 from "../images/skybluecard.png";
import defaultCardImage02 from "../images/yellowcard.png";
import { fetchMetadata } from "./CardService";
import "./CardModify.css";
import { burnNFT, mintNFT, saveCardToDB, updateCardDate } from "./CardService";
const CardModify = () => {
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [minting, setMinting] = useState(false);
  const [burning, setBurning] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardMoney, setCardMoney] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metadataUrl, setMetadataUrl] = useState("");
  const [, setTransactionHash] = useState("");
  const [, setBurnTransactionHash] = useState("");
  const navigate = useNavigate();

  // ✅ 1. 백엔드에서 카드 정보를 가져와서 세션에 저장
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        // ✅ 세션에서 memberNum 가져오기
        const memberNum = sessionStorage.getItem("member_num");
        if (!memberNum) {
          console.error("세션에 memberNum이 없습니다.");
          return; // memberNum이 없으면 요청 중단
        }

        const response = await axios.get(
          "http://localhost:7777/zoomoney/card/get",
          {
            params: { member_num: memberNum }, // ✅ 세션 값을 백엔드에 전달
          }
        );
        const cardMetadata = sessionStorage.getItem("tokenId");
        const cardNum = sessionStorage.getItem("card_num");
        const cardMoney = sessionStorage.getItem("card_money");
        // 상태 업데이트
        setTokenId(cardMetadata);
        const tokenId = cardMetadata;

        console.log("메타데이터" + tokenId);
        setCardNum(cardNum);
        console.log("카드번호" + cardNum);
        setCardMoney(cardMoney);
        // 세션에 카드 정보가 없으면 백엔드에서 메타데이터 가져오기
        fetchMetadata(tokenId, setMetadata, setMetadataUrl, setLoading);
      } catch (error) {
        console.error("카드 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchCardData();
  }, []);

  const handleMintNFT = async () => {
    let fileToUpload = file;

    // 파일이 없을 경우, 선택한 이미지(selectedImage)를 사용하여 변환
    if (!fileToUpload) {
      const imageToUse = selectedImage || defaultCardImage;
      const response = await fetch(imageToUse);
      const blob = await response.blob();
      fileToUpload = new File([blob], "selected-card.png", {
        type: "image/png",
      });

      setFile(fileToUpload);
    }

    // NFT 발급 실행
    const success = await mintNFT(fileToUpload, setMinting, setTransactionHash);
    console.log("Mint Success:", success); // 성공 여부 확인

    if (success) {
      navigate("/card/success"); // 발급 완료 페이지로 이동
    } else {
      alert("NFT 발급 실패");
    }
  };

  // 파일 선택 시 실행되는 함수
  const handleFileChange = (e) => {
    let selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // 카드 이미지 클릭 시 실행되는 함수
  const handleImageSelect = async (image) => {
    setSelectedImage(image);
    setPreviewUrl(image);

    // 선택한 이미지를 File 객체로 변환
    const response = await fetch(image);
    const blob = await response.blob();
    const file = new File([blob], "selected-card.png", { type: "image/png" });

    setFile(file);
  };

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        <Header title="카드 이미지 변경" />
      </div>

      <div className="content">
        {/* 카드 이미지 미리보기 */}
        <div className="modifycard-preview">
          <img
            src={
              selectedImage // ✅ 1순위: 선택한 이미지
                ? selectedImage
                : metadata?.image // ✅ 2순위: metadata.image
                ? metadata.image
                : previewUrl || defaultCardImage // ✅ 3순위: 미리보기(previewUrl) 또는 기본 이미지
            }
            alt="카드 미리보기"
            className={
              metadata?.image || previewUrl || selectedImage
                ? "modifycard-image"
                : "modifycard-image"
            }
          />
        </div>
      </div>
      <br />
      {/* 카드 기본 이미지 선택 */}
      <div className="image-container">
        {[
          defaultCardImage01,
          defaultCardImage02,
          defaultCardImage03,
          defaultCardImage04,
          defaultCardImage,
        ].map((item, index) => (
          <div
            key={index}
            className={`image-item ${
              selectedImage === item ? "ring-4 ring-purple-500" : ""
            }`}
            onClick={() => setSelectedImage(item)}
          >
            <img src={item} alt={`카드 ${index + 1}`} className="image-img" />
          </div>
        ))}
      </div>

      {/* 파일 업로드 버튼 */}
      <div className="flex justify-between w-full">
        <label className="cursor-pointer">
          <div className="upload-button flex items-center gap-2">
            <span className="plus-icon bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold">
              +
            </span>
            <div className="text-container">
              <span className="text-lg font-semibold">
                원하는 이미지 추가하기
                <br />
                <span className="text-sm text-gray-500">(이후, 10,000P)</span>
              </span>
            </div>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </div>
        </label>
      </div>

      {/* NFT 발행 및 소각 버튼 */}

      <button
        onClick={handleMintNFT}
        disabled={minting || burning}
        className="modibutton-style"
      >
        {minting || burning ? "" : "카드 변경"}
      </button>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default CardModify;
