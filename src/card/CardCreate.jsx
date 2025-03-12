import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mintNFT, burnNFT } from "./CardService";
import { PlusCircle } from "lucide-react"; // 아이콘 추가
import Footer from "../common/Footer";
import "./CardCreate.css";
import Header from "../common/Header";
import defaultCardImage from "../images/defaultcard.png";
import defaultCardImage01 from "../images/caramelcard.png";
import defaultCardImage02 from "../images/yellowcard.png";
import defaultCardImage03 from "../images/pinkcard.png";
import defaultCardImage04 from "../images/skybluecard.png";

const CardCreate = () => {
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [minting, setMinting] = useState(false);
  const [burning, setBurning] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [, setTransactionHash] = useState("");
  const [, setBurnTransactionHash] = useState("");
  const navigate = useNavigate();

  const handleMintNFT = async () => {
    const success = await mintNFT(file, setMinting, setTransactionHash);
    console.log("Mint Success:", success); // 성공 여부 확인
    if (success) {
      navigate("/card/success"); // 발급 완료 페이지로 이동
    } else {
      alert("NFT 발급 실패");
    }
  };

  // 파일 선택 시 미리보기 생성
  const handleFileChange = async (e) => {
    let selectedFile = e.target.files[0];

    if (selectedFile) {
      // 사용자가 파일을 선택한 경우
      setFile(selectedFile);

      // 파일 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(previewUrl);
    } else {
      // 파일을 선택하지 않은 경우, 선택한 카드 이미지 또는 기본 이미지 사용
      const imageToUse = selectedImage || defaultCardImage;

      // 이미지 URL을 Blob으로 변환 후 File 객체 생성
      const response = await fetch(imageToUse);
      const blob = await response.blob();
      const defaultFile = new File([blob], "defaultcard.png", {
        type: "image/png",
      });

      setFile(defaultFile);

      // 기본 이미지 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(defaultFile);
      setPreviewUrl(previewUrl);
    }
  };

  return (
    <div className="mock-container">
      {/* 헤더 */}
      <div className="header">
        {/* <button className="back-button">←</button> */}
        <Header title="카드발급" /> {/* 원하는 제목을 props로 전달 */}
      </div>

      <div className="content">
        {/* 카드 이미지 미리보기 */}
        <div className="card-preview">
          <img
            src={previewUrl ? previewUrl : selectedImage || defaultCardImage} // previewUrl이 있으면 미리보기, 없으면 선택한 이미지 또는 기본 이미지 사용
            alt="미리보기"
            className="card-image"
          />
        </div>
      </div>
      <br />
      {/* 카드 기본 이미지 선택 */}
      <div className="image-container">
        {[
          { image: defaultCardImage01, bgColor: "bg-orange-500" },
          { image: defaultCardImage02, bgColor: "bg-yellow-400" },
          { image: defaultCardImage03, bgColor: "bg-pink-400" },
          { image: defaultCardImage04, bgColor: "bg-gray-700" },
          { image: defaultCardImage, bgColor: "bg-gray-700" },
        ].map((item, index) => (
          <div
            key={index}
            className={`image-item ${
              selectedImage === item.image ? "ring-4 ring-purple-500" : ""
            }`}
            onClick={() => setSelectedImage(item.image)}
          >
            <img
              src={item.image}
              alt={`카드 ${index + 1}`}
              className="image-img"
            />
          </div>
        ))}
      </div>

      {/* 파일 업로드 버튼 */}
      <div className="flex justify-between w-full">
        {/* 파일 업로드 버튼 */}
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
        &nbsp;
      </div>
      {/* NFT 발행 버튼 */}
      <button
        onClick={handleMintNFT}
        disabled={minting}
        className="button-style"
      >
        {minting ? "" : "카드 발급"}
      </button>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default CardCreate;
