import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { fetchMetadata } from "../card/resources/CardService";
import Header from "../common/Header";
import "./css/CardHistory.css";
import { Dropdown } from "react-bootstrap";

function CardHistory() {
  const [historyList, setHistoryList] = useState([]);
  const [, setMetadata] = useState(null);
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

  const handleSelect = (eventKey) => {
    setSelectedPeriod(eventKey);
  };

  return (
    <div className="mock-container">
      <Header title="" />
      <div className="cardhist-period">
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
    </div>
  );
}

export default CardHistory;
