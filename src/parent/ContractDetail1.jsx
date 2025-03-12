import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Header from "../common/Header";
import Footer from "../common/Footer";
import "./contractDetail1.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // ▼▲ 화살표 추가

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const ContractDetail1 = () => {
  // 🔹 계약서 열림/닫힘 상태 관리
  const [openContract, setOpenContract] = useState(null);

  // 🔹 계약서 더보기 기능
  const toggleContract = (index) => {
    setOpenContract(openContract === index ? null : index); // 동일한 항목 클릭 시 닫힘
  };

  // 🔹 계약서 데이터 (임시 데이터)
  const contracts = [
    { date: "2023. 01. 06", file: "/contract1.pdf" },
    { date: "2023. 01. 15", file: "/contract2.pdf" },
    { date: "2023. 02. 10", file: "/contract3.pdf" },
    { date: "2023. 03. 10", file: "/contract4.pdf" },
    { date: "2023. 05. 15", file: "/contract4.pdf" },
  ];

  return (
    <div className="mock-container">
      <div className="header">
        <Header title="용돈계약서 조회" />
      </div>
      <div className="contractDetail1-container">
        <div className="contractDetail1-list">
          {contracts.map((contract, index) => (
            <div key={index} className="contractDetail1-item">
              <div
                className="contractDetail1-header"
                onClick={() => toggleContract(index)}
              >
                <p>{contract.date} 계약 확인 </p>
                <div className="contractDetail-toggle-icon">
                  {openContract === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {openContract === index && (
                <div className="pdf-viewer">
                  <Document
                    file={contract.file}
                    onLoadError={(error) =>
                      console.error("PDF 로드 오류:", error)
                    }
                  >
                    <Page pageNumber={1} width={300} />
                  </Document>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 하단 네비게이션 */}
        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ContractDetail1;
