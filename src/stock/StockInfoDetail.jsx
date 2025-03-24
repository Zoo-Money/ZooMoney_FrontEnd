import axios from "axios";
import { API_PATH } from "../common/config.js";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Header from "../common/Header";
import rabbit2 from "../images/rabbit/rabbit02.png";
import "./css/StockInfoDetail.css";

function StockInfoDetail() {
  const { infoNum } = useParams();
  const location = useLocation();
  const [infoDetail, InfoDetailList] = useState(null);
  const { infoTitle } = location.state || {};

  useEffect(() => {
    axios
      .get(`${API_PATH}/zoomoney/stock/detail/${infoNum}`)
      .then((response) => {
        InfoDetailList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock detail:", error);
      });
  }, [infoNum]);

  return (
    <div className="mock-container">
      <div className="stockinfo-header">
        <Header title={infoTitle} />
        <img className="stockinfo-image" src={rabbit2} alt="토끼 이미지" />
      </div>
      <div className="stockinfo_content">
        {!infoDetail ? (
          <p>로딩 중...</p>
        ) : (
          infoDetail.infoContent.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export default StockInfoDetail;
