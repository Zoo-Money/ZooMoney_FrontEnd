import axios from "axios";
import { API_PATH } from "../common/config.js";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StockModal from "./StockModal";
import "./css/stockNews.css";

function StockNews(props) {
  //초기값 가져오기기
  const { stockName } = useParams(); // URL에서 infoNum 가져오기
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    axios({
      url: `${API_PATH}/zoomoney/stock/getnews/${stockName}`,
      method: "get",
    })
      .then((responseData) => {
        setNewsList(responseData.data.items);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [stockName]);

  //날짜 가공 함수
  const formatDate = (pubDate) => {
    const date = new Date(pubDate);
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getFullYear()}
        .${(date.getMonth() + 1).toString().padStart(2, "0")}
        .${date.getDate().toString().padStart(2, "0")}
        . ${weekdays[date.getDay()]}`;
  };

  //뉴스 제목 클릭 시 모달에 데이터 전달
  const openModal = (news) => {
    setSelectedNews(news);
  };

  //html태그 제거 후 가져오기 (html구조→DOM구조)
  const clearText = (html) => {
    const text = new DOMParser().parseFromString(html, "text/html");
    return text.body.textContent || "";
  };

  return (
    <div>
      <ul className="newsList">
        {newsList.map((item, index) => (
          <li key={index} className="newsItem">
            <p className="news-item-title" onClick={() => openModal(item)}>
              {clearText(item.title)}
            </p>
            <small className="news-item-date">{formatDate(item.pubDate)}</small>
          </li>
        ))}
      </ul>
      {/* 모달 */}
      {selectedNews && (
        <StockModal
          news={selectedNews}
          formatDate={formatDate}
          closeModal={() => setSelectedNews(null)}
          clearText={clearText}
        />
      )}
    </div>
  );
}

export default StockNews;
