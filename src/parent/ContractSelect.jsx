import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf"; //  react-pdf에서 Document와 Page 추가
//import "react-pdf/dist/esm/Page/AnnotationLayer.css"; //  주석 레이어 스타일 추가
//import "react-pdf/dist/esm/Page/TextLayer.css"; //  텍스트 레이어 스타일 추가
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Header from "../common/Header";
import Footer from "../common/Footer";
import "./contractSelect.css"; // CSS 파일 import
import { FaChevronRight } from "react-icons/fa"; // 아이콘 사용
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { pdfjs } from "react-pdf";
// import * as pdfjs from "pdfjs-dist/build/pdf";
import * as pdfjs from "pdfjs-dist/webpack";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;
// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
// Worker 버전과 pdfjs-dist 버전을 일치시키는 설정
// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// // 🚨 최신 버전에 맞는 worker 경로 설정 (pdfjs-dist@4.8.69 대응)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.js`;

//pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"; // ✅ public 폴더 기준 경로
// pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;
//  npm 방식으로 자동 로드 설정
// pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.min.mjs");

//npm install pdf-viewer-reactjs
//  pdf.worker 파일을 public 폴더에서 로드하도록 설정
// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const ContractSelect = () => {
  const [latestPdfPath, setLatestPdfPath] = useState([]);
  const navigate = useNavigate(); // useNavigate 사용

  // 최신 계약서 경로 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/contract/latest", {
        params: { childNum: 1 }, // 🔹 선택한 자녀의 memberNum 전달 (예시)
      })
      .then((response) => {
        console.log("API 응답 데이터:", response.data);
        // const filePath = response.data.replace(
        //   "C:/shinhan4/work/zoomoney_front_new/ZooMoney_FrontEnd/public",
        //   ""
        // );
        const fileName = response.data.split("/").pop(); // 파일명만 추출
        const filePath = `/contract/pdf/${fileName}`; // ✅ URL 경로 설정
        setLatestPdfPath(fileName); // 여기가 중요
        console.log("최신 계약서 경로:", filePath);
        console.log("최신 계약서 경로2:", fileName);
        // setLatestPdfPath(response.data);
      })
      .catch((error) => {
        console.error("최신 계약서 로드 실패:", error);
      });
  }, []);

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
          {/* <div className="contract-box">
            <Document
              file="/ex_contract2.pdf" //  PDF 파일 경로 (public 폴더 기준)
              onLoadError={(error) => console.error("PDF 로드 오류:", error)}
            >
              <Page pageNumber={1} width={350} />
            </Document>
          </div> */}

          <div className="contract-box">
            <embed
              src={`http://localhost:7777/zoomoney/contract_pdf/${latestPdfPath}`}
              type="application/pdf"
              width="100%"
              height="800px"
            ></embed>
            {/* {latestPdfPath ? (
              <Document
                // file={latestPdfPath}
                // file={`http://localhost:7777${latestPdfPath}`
                file={`http://localhost:7777${latestPdfPath}`}
                onLoadError={(error) => console.error("PDF 로드 오류:", error)}
              >
                <Page pageNumber={1} width={350} />
              </Document>
            ) : (
              <p>PDF 파일을 찾을 수 없습니다.</p>
            )} */}
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
