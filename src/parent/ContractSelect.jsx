import axios from "axios";
import * as pdfjs from "pdfjs-dist/webpack";
import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa"; // 아이콘 사용
import { Document, Page } from "react-pdf"; //  react-pdf에서 Document와 Page 추가
import "react-pdf/dist/esm/Page/AnnotationLayer.css"; //  주석 레이어 스타일 추가
import "react-pdf/dist/esm/Page/TextLayer.css"; //  텍스트 레이어 스타일 추가
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import "./css/contractSelect.css"; // CSS 파일 import

// 🚨 최신 버전에 맞는 worker 경로 설정 (pdfjs-dist@4.8.69 대응)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.js`;

const ContractSelect = () => {
  const childNum = sessionStorage.getItem("childNum");
  const navigate = useNavigate(); // useNavigate 사용

  const [latestPdfPath, setLatestPdfPath] = useState("");
  const [loading, setLoading] = useState(true);

  // 최신 계약서 경로 가져오기
  useEffect(() => {
    if (!childNum) {
      console.error("세션에 값이 없습니다.");
      return;
    }

    const draw = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7777/zoomoney/contract/latest`,
          { params: { childNum: childNum } }
        );
        console.log(response.data);

        setLatestPdfPath(response.data.split("/").pop());
      } catch (error) {
        console.error("최신 계약서 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    console.log(latestPdfPath);

    draw();
  });

  // 데이터 로드 후 렌더링
  if (loading) return null;

  const handleContractDetail1Click = () => {
    navigate("/contract/contractDetail1");
  };

  return (
    <div className="mock-container">
      <div className="ContractSelect-contract-container">
        <Header title="용돈계약서 조회" />
        <div className="ContractSelect-content">
          <h2 className="ContractSelect-subtitle">현재 유효한 용돈계약서</h2>

          {/* 계약서 내용 PDF 표시*/}
          {/* npm install react-pdf 라이브러리 설치해야함 */}
          {/* <div className="contract-box">
            <Document
              file="/ex_contract2.pdf" //  PDF 파일 경로 (public 폴더 기준)
              onLoadError={(error) => console.error("PDF 로드 오류:", error)}
            >
              <Page pageNumber={1} width={350} />
            </Document>
          </div> */}

          <div className="ContractSelect-contract-box">
            {latestPdfPath && (
              <Document
                file={`http://localhost:7777/zoomoney/contract_pdf/${latestPdfPath}`}
                onLoadError={(error) => console.log("PDF 로드 오류:", error)}
              >
                <Page pageNumber={1} width={350} /> 
              </Document>
            )}
          </div>
          {/* 과거 계약서 확인 버튼 */}
          <div
            className="ContractSelect-past-contracts"
            onClick={handleContractDetail1Click}
          >
            <p> 과거 계약서 확인하러 가기 </p>
            <FaChevronRight className="ContractSelect-arrow-icon" />
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <Footer />
      </div>
    </div>
  );
};

export default ContractSelect;
