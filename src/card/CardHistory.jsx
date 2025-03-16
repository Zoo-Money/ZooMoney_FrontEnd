import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../common/Header";
import Footer from "../common/Footer";
import "./CardHistory.css";
import bear1 from "../images/bear01.png";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { fetchMetadata, mintNFT } from "./CardService";
function CardHistory() {
  const [historyList, setHistoryList] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [, setMetadataUrl] = useState("");
  const [setNewLoading, setLoading] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const memberNum = sessionStorage.getItem("member_num");
  console.log("보내는 member_num:", memberNum);

  useEffect(() => {
    loadOrders(selectedPeriod);
    const tokenId = sessionStorage.getItem("cardMetadata");

    console.log(tokenId);

    // 세션에 카드 정보가 없으면 백엔드에서 메타데이터 가져오기
    fetchMetadata(tokenId, setMetadata, setMetadataUrl, setLoading);
    setLoading(false); // 바로 로딩 상태를 false로 변경하여 UI 업데이트
  }, [selectedPeriod]);

  const loadOrders = (period) => {
    axios
      .get("http://localhost:7777/zoomoney/card/select", {
        params: { period },
        headers: {
          member_num: memberNum,
        },
      })
      .then((response) => {
        setHistoryList(response.data);
      })
      .catch((error) => {
        console.error("데이터 요청 오류:", error);
      });
  };

  return (
    <div className="mock-container">
      <div className="cardHistory-header">
        <Header title="" />
        <img
          className="cardHist-image"
          src={metadata?.image}
          alt="카드 이미지"
        />
        <br />
        <div>
          <button className="cardHist-gotoAccount">
            <Link
              to="/account"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              저금하기
            </Link>
          </button>
        </div>
      </div>

      <div className="cardhist-period">
        <select
          id="periodSelect"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="all">전체 기간</option>
          <option value="1">최근 1개월</option>
          <option value="2">최근 2개월</option>
          <option value="3">최근 3개월</option>
        </select>
      </div>
      <div className="cardHist-content">
        <div className="card-history">
          {historyList.length > 0 ? (
            historyList.map((item, index) => (
              <div key={index}>
                <div className="cardHistoryInfo">
                  <span className="usehist-shop">{item.usehistShop}</span>
                  <span className="usehist-money">{item.usehistMoney}원</span>
                </div>
                <div>
                  <p>{dayjs(item.usehistDate).format("YYYY-MM-DD HH:mm")}</p>
                </div>
              </div>
            ))
          ) : (
            <p>거래 내역이 없습니다.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CardHistory;
