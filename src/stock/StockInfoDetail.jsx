import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../common/Header";
import rabbit2 from "../images/rabbit02.png";
import "./css/StockInfoDetail.css";

function StockInfoDetail() {
  const { infoNum } = useParams();
  const [infoDetail, InfoDetailList] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:7777/zoomoney/stock/detail/${infoNum}`)
      .then((response) => {
        InfoDetailList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock detail:", error);
      });
  }, [infoNum]);

  if (!infoDetail) return <div>Loading...</div>;

  return (
    <div className="mock-container">
      <div className="stockinfo-header">
        <Header title="주식에 대해 궁금해요" />
        <img className="stockinfo-image" src={rabbit2} alt="토끼 이미지" />
      </div>
      <div className="stockinfo_content">
        {infoDetail.infoContent.split("\n").map((line, index) => {
          return (
            <span key={index}>
              {line}
              <br />
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default StockInfoDetail;
