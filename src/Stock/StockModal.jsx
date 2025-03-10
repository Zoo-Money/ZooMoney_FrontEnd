
import axios from 'axios';
import React, { useEffect, useState } from 'react';
function StockModal({news, closeModal, clearText}) {
    const modalBodyStyle = {
      maxHeight: "calc(100vh - 200px)", // 화면의 70% 높이
      overflowY: "auto", // 스크롤 가능
    };

    const [newsContent, setNewsContent] = useState({content: '', images: []});

    //크롤링시작
    useEffect(()=>{
      console.log("뉴스는 잘 가져오니?", news);
      if (news && news.link){
        axios({
          url: `http://localhost:7777/zoomoney/stock/getnews/fulldata?url=${encodeURIComponent(
            news.link
          )}`,
          method: "get",
        })
          .then((response)=>{
            console.log("응답이 오나요~~~~", response.data);
            setNewsContent({
              content: response.data.content,
              images: response.data.images
            })
          })
          .catch((error)=>{
            console.log(error);
          });
      }
    }, [news]);

    return (
      <div
        className="modal show"
        style={{ display: "block" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="example-custom-modal-styling-title"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="example-custom-modal-styling-title"
              >
                {clearText(news.title)}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" style={modalBodyStyle}>
              <p>{news.pubDate}</p>
              {/* {newsContent.images.map((img, index)=>(
                <img key={index} src={img} alt={`News Image ${index}`}></img>
              ))} */}
              {/* <p>{clearText(news.description)}</p> */}
              <p>{newsContent.content}</p>
              {/* <embed src="https://www.kbanker.co.kr/news/articleView.html?idxno=218832"></embed> */}
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