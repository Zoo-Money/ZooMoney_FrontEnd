import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import defaultCardImage01 from "../images/caramelcard.png";
import defaultCardImage from "../images/defaultcard.png";
import defaultCardImage03 from "../images/pinkcard.png";
import defaultCardImage04 from "../images/skybluecard.png";
import defaultCardImage02 from "../images/yellowcard.png";
import "./CardCreate.css";
import { mintNFT } from "./CardService";

const CardCreate = () => {
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [minting, setMinting] = useState(false);
  const [, setTransactionHash] = useState("");
  const navigate = useNavigate();

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
      <div className="card-header">
        <Header title="카드발급" />
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
            onClick={() => handleImageSelect(item.image)} // 기존 setSelectedImage에서 변경
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
