import axios from "axios";
import { API_PATH } from "../common/config.js";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../card/css/CardHistory.css";
import Header from "../common/Header";
import cardimage from "../images/card/card00.png";
import { fetchMetadata } from "./resources/CardService";

function CardHistory() {
  const [historyList, setHistoryList] = useState([]);
  const [, setMetadata] = useState(null);
  const [, setMetadataUrl] = useState("");
  const [, setLoading] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const member_num = sessionStorage.getItem("member_num");

  useEffect(() => {
    const loadOrders = (period) => {
      axios
        .get(`${API_PATH}/zoomoney/card/select`, {
          params: { period, member_num },
        })
        .then((response) => {
          setHistoryList(response.data);
        })
        .catch((error) => {
          console.error("데이터 요청 오류:", error);
        });
    };

    loadOrders(selectedPeriod);
    const tokenId = sessionStorage.getItem("cardMetadata");

    // 세션에 카드 정보가 없으면 백엔드에서 메타데이터 가져오기
    fetchMetadata(tokenId, setMetadata, setMetadataUrl, setLoading);
  }, [selectedPeriod, member_num]);

  const handleSelect = (eventKey) => {
    setSelectedPeriod(eventKey);
  };

  return (
    <div className="mock-container">
      <Header title="카드 사용내역" />
      <div className="card-history-box">
        <img className="card-history-img" src={cardimage} alt="카드 이미지" />
        <div className="card-history-period-box">
          <Dropdown onSelect={handleSelect}>
            <Dropdown.Toggle variant="transparent" id="periodSelect">
              {selectedPeriod === "all"
                ? "전체 기간"
                : `최근 ${selectedPeriod}개월`}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="all" active={selectedPeriod === "all"}>
                전체 기간
              </Dropdown.Item>
              <Dropdown.Item eventKey="1" active={selectedPeriod === "1"}>
                최근 1개월
              </Dropdown.Item>
              <Dropdown.Item eventKey="2" active={selectedPeriod === "2"}>
                최근 2개월
              </Dropdown.Item>
              <Dropdown.Item eventKey="3" active={selectedPeriod === "3"}>
                최근 3개월
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Link to="/account">
            <button className="card-hist-go-to-account">저금하기</button>
          </Link>
        </div>
      </div>

      <div className="card-history-content">
        <div className="card-history-list">
          {historyList.length > 0 ? (
            historyList.map((item, index) => (
              <div key={index} className="card-history-list-box">
                <div className="card-history-info">
                  <span className="info-shop">{item.usehistShop}</span>
                  <span className="info-money">
                    {item.usehistMoney.toLocaleString()}원
                  </span>
                </div>
                <p className="info-time">
                  {dayjs(item.usehistDate).format("YYYY-MM-DD HH:mm")}
                </p>
              </div>
            ))
          ) : (
            <p>거래 내역이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardHistory;
