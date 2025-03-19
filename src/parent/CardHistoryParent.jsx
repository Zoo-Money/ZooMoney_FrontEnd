import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { fetchMetadata } from "../card/CardService";
import "./css/CardHistory.css";

function CardHistory() {
  const [historyList, setHistoryList] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [, setMetadataUrl] = useState("");
  const [, setLoading] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const memberNum = sessionStorage.getItem("childNum"); //세션에서 chlidNum 가져오기(부모가 자녀소비내역 확인)

  useEffect(() => {
    const loadOrders = (period) => {
      axios
        .get("http://localhost:7777/zoomoney/card/select", {
          params: { period, member_num: memberNum },
        })

        .then((response) => {
          console.log("@@:" + response.data);
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
  }, [selectedPeriod, memberNum]);

  return (
    <div className="mock-container">
      <div className="cardHistory-header">
        <Header title="" />
        {/* <img
          className="cardHist-image"
          src={metadata?.image}
          alt="카드 이미지"
        /> */}
        <br />
        <div>
          {/* <button className="cardHist-gotoAccount">
            <Link
              to="/account"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              저금하기
            </Link>
          </button> */}
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
