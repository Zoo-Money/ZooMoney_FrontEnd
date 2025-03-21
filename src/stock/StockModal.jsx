import React from "react";
import "./css/stockModal.css";

function StockModal({ news, closeModal, clearText, formatDate }) {
  return (
    <div
      className="modal-background"
      style={{ display: "block" }}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="example-custom-modal-styling-title"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="example-custom-modal-styling-title">
              {clearText(news.title)}
            </h5>
          </div>
          <div className="modal-body">
            <p>{formatDate(news.pubDate)}</p>
            <p>{clearText(news.description)}</p>
            {/* 원문 그대로 보여주는 태그
              <embed src="https://www.kbanker.co.kr/news/articleView.html?idxno=218832"></embed> */}
            <a href={news.link}>🔗더 궁금하다면, 원본 기사 보러가기</a>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockModal;
