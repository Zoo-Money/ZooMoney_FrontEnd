import React from "react";
import { Document, Page, pdfjs } from "react-pdf"; //  react-pdf에서 Document와 Page 추가
//import "react-pdf/dist/esm/Page/AnnotationLayer.css"; //  주석 레이어 스타일 추가
//import "react-pdf/dist/esm/Page/TextLayer.css"; //  텍스트 레이어 스타일 추가
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Header from "../common/Header";
import Footer from "../common/Footer";
import "./contractSelect.css"; // CSS 파일 import
import { FaChevronRight } from "react-icons/fa"; // 아이콘 사용
import { useNavigate } from "react-router-dom";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

//pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"; // ✅ public 폴더 기준 경로
// pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;
//  npm 방식으로 자동 로드 설정
// pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.min.mjs");

//npm install pdf-viewer-reactjs
//  pdf.worker 파일을 public 폴더에서 로드하도록 설정
// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const ContractSelect = () => {
  const navigate = useNavigate(); // useNavigate 사용
  const handleContractDetail1Click = () => {
    navigate("/contract/contractDetail1");
  };

  return (
    <div className="mock-container">
      <div className="contract-container">
        <Header title="용돈계약서 조회" />

        <div className="content">
          <h2 className="subtitle">현재 유효한 용돈계약서</h2>

          {/* 계약서 내용 PDF 표시*/}
          {/* npm install react-pdf 라이브러리 설치해야함 */}
          <div className="contract-box">
            <Document
              file="/ex_contract2.pdf" // ✅ PDF 파일 경로 (public 폴더 기준)
              onLoadError={(error) => console.error("PDF 로드 오류:", error)}
            >
              <Page pageNumber={1} width={350} />
            </Document>
          </div>

          {/* 과거 계약서 확인 버튼 */}
          <div className="past-contracts" onClick={handleContractDetail1Click}>
            <p> 과거 계약서 확인하러 가기 </p>
            <FaChevronRight className="arrow-icon" />
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <Footer />
      </div>
    </div>
  );
};

export default ContractSelect;
