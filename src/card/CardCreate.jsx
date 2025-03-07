import { useState } from "react";
import { mintNFT, burnNFT } from "./CardService";
import { PlusCircle } from "lucide-react"; // 아이콘 추가
import Footer from "../common/Footer";
import "./CardCreate.css";
import Header from "../common/Header";

const CardCreate = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [minting, setMinting] = useState(false);
  const [burning, setBurning] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [, setTransactionHash] = useState("");
  const [, setBurnTransactionHash] = useState("");

  // 파일 선택 시 미리보기 생성
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
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
          {previewUrl ? (
            <img src={previewUrl} alt="미리보기" className="card-image" />
          ) : (
            <span className="text-gray-500">카드 없음</span>
          )}
        </div>
      </div>
      {/* 카드 색상 선택 */}
      <div className="flex justify-center gap-4 mb-4">
        {["bg-amber-600", "bg-yellow-400", "bg-pink-400", "bg-gray-700"].map(
          (color, index) => (
            <div
              key={index}
              className={`w-16 h-24 ${color} rounded-lg shadow-md cursor-pointer`}
            />
          )
        )}
      </div>

      {/* 파일 업로드 버튼 */}
      <label className="flex items-center justify-center cursor-pointer mb-4">
        <PlusCircle className="text-2xl mr-2" />
        <span type="file" className="text-lg">
          원하는 이미지 추가하기
        </span>
        <input type="file" className="hidden" onChange={handleFileChange} />
      </label>

      {/* NFT 발행 버튼 */}
      <button
        onClick={() => mintNFT(file, setMinting, setTransactionHash)}
        disabled={minting}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md disabled:bg-gray-400 w-full sm:w-auto mx-auto"
      >
        {minting ? "발급 중..." : "NFT 발급"}
      </button>

      {/* NFT 소각 */}
      <div className="mt-6 text-center">
        <h3 className="text-md font-medium mb-2">소각할 Token ID 입력</h3>
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full sm:w-48 mx-auto text-center mb-4"
          placeholder="Token ID 입력"
        />
        <button
          onClick={() => burnNFT(tokenId, setBurning, setBurnTransactionHash)}
          disabled={burning}
          className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md disabled:bg-gray-400 w-full sm:w-auto mx-auto"
        >
          {burning ? "소각 중..." : "NFT 소각"}
        </button>
      </div>

      {/* 하단 네비게이션 */}
      <Footer />
    </div>
  );
};

export default CardCreate;
