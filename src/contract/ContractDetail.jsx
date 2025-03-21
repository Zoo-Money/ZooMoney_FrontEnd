import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // ▼▲ 화살표 아이콘
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Header from "../common/Header";
import "./css/contractDetail.css";

// PDF Worker 설정 (PDF 파일을 백그라운드에서 처리)
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const ContractDetail = () => {
  const [openContract, setOpenContract] = useState(null);
  const [contracts, setContracts] = useState([]);
  const loadingTasksRef = useRef({}); // PDFWorker 로드 작업 추적

  const toggleContract = async (index) => {
    // 이미 열린 PDF 작업이 있으면 강제 종료
    if (
      openContract !== null &&
      loadingTasksRef.current[contracts[openContract]?.contractFilepath]
    ) {
      await loadingTasksRef.current[contracts[openContract].contractFilepath]
        .destroy()
        .catch((error) => {
          console.warn("PDFWorker 종료 중 오류 발생:", error);
        });
      delete loadingTasksRef.current[contracts[openContract]?.contractFilepath]; // 기존 PDFWorker 참조 제거
    }

    // 새 계약서 열기/닫기
    setOpenContract(openContract === index ? null : index);
  };

  // 계약서 목록 조회
  useEffect(() => {
    const childNum = sessionStorage.getItem("childNum");
    axios
      .get(`http://localhost:7777/zoomoney/contract/pastContracts/${childNum}`)
      .then((response) => {
        setContracts(response.data);
      })
      .catch((error) => {
        console.error("과거 계약서 로드 오류:", error);
      });

    // 컴포넌트 언마운트 시 모든 PDFWorker 종료
    return () => {
      Object.values(loadingTasksRef.current).forEach(async (task) => {
        if (task) {
          await task.destroy().catch((error) => {
            console.warn("PDFWorker 종료 중 오류 발생:", error);
          });
        }
      });
      loadingTasksRef.current = {}; // 모든 참조 제거 (메모리 누수 방지)
    };
  }, []);

  return (
    <div className="mock-container">
      <Header title="용돈계약서 조회" />
      <div className="contractDetail1-container">
        <div className="contractDetail1-list">
          {/* 계약서 목록 렌더링 */}
          {contracts.map((contract, index) => (
            <div key={index} className="contractDetail1-item">
              {/* 계약서 헤더 (계약서 제목 + 열기/닫기 화살표) */}
              <div
                className="contractDetail1-header"
                onClick={() => toggleContract(index)}
              >
                <p>{contract.contractDate} 계약 확인 </p>
                <div className="contractDetail1-toggle-icon">
                  {openContract === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {/* PDF 파일 표시 (클릭 시 열림) */}
              {openContract === index && (
                <div className="pdf-viewer">
                  <Document
                    file={`http://localhost:7777/zoomoney${contract.contractFilepath}`} // PDF 파일 경로
                    onLoadSuccess={(pdf) => {
                      // 기존 PDFWorker가 있으면 종료
                      if (loadingTasksRef.current[contract.contractFilepath]) {
                        loadingTasksRef.current[contract.contractFilepath]
                          .destroy()
                          .catch((error) => {
                            console.warn(
                              "이전 PDFWorker 종료 중 오류 발생:",
                              error
                            );
                          });
                      }

                      // 새 PDFWorker 저장
                      loadingTasksRef.current[contract.contractFilepath] =
                        pdf.loadingTask;
                    }}
                    onLoadError={(error) =>
                      console.error("PDF 로드 오류:", error)
                    }
                  >
                    {/* PDF 첫 페이지만 표시 */}
                    <Page pageNumber={1} width={window.innerWidth * 0.9} />
                  </Document>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
