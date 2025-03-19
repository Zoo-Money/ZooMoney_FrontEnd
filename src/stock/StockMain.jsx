import React, { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import rabbit01 from "../images/rabbit/rabbit01.png";
import "./css/stockMain.css";
import axios from "axios";

function StockMain(props) {
  const memberNum = sessionStorage.getItem("member_num");
  const [myStockData, setMyStockData] = useState([]);

  const navi = useNavigate();
  const goStockList = () => {
    navi("/stock/list");
  };
  const goToProfit = () => {
    navi("/stock/myStockProfit");
  };
  const goToSell = () => {
    navi("/stock/stockSell");
  };

  useEffect(() => {
    axios
      .get("http://localhost:7777/zoomoney/stock/owned", {
        params: { memberNum },
      })
      .then((response) => {
        setMyStockData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock detail:", error);
      });
  }, [memberNum]);

  console.log("myStockData:", myStockData);

  const totalInvestment = myStockData.reduce(
    (sum, stock) => sum + stock.totalValue,
    0
  );
  console.log(totalInvestment);
  return (
    <div className="mock-container">
      <Header title="모의투자" />
      <div className="stock-main-header">
        <Link to="/stock/info">
          <div className="stock-main-info">
            <FaQuestionCircle className="questionmark" />
            <span>주식에 대해 궁금해요!</span>
          </div>
        </Link>
        <img src={rabbit01} alt="rabbit01" />
      </div>
      <div className="stock-main-box" onClick={goToProfit}>
        <h2>내 투자</h2>
        <div className="stock-main-box-amount">
          {totalInvestment.toLocaleString()} 원
        </div>
        <div className="stock-main-box-text">예상 수수료 * 세금 포함</div>
        <div className="stock-main-box-detail">
          <div>
            <span>원금</span>
            <span>7,194원</span>
          </div>
          <div>
            <span>총 수익</span>
            <span class="loss">- 3,724원 ( 51.8% )</span>
          </div>
          <div>
            <span>일간 수익</span>
            <span class="loss">- 61원 ( 0.8% )</span>
          </div>
        </div>
      </div>

      <div className="stock-main-mystock-list-box">
        <p>보유 주식</p>
        <table className="stock-table">
          <thead>
            <tr>
              <th>종목명</th>
              <th>1주평균금액</th>
              <th>총 금액</th>
              <th>매도</th>
            </tr>
          </thead>
          <tbody>
            {myStockData.length > 0 ? (
              myStockData.map((stock, index) => {
                const profitRate =
                  ((stock.stockPrice - stock.averagePrice) /
                    stock.averagePrice) *
                  100;
                return (
                  <tr key={index}>
                    <td>{stock.stockName}</td>
                    <td>
                      <span className={profitRate >= 0 ? "profit" : "loss"}>
                        {profitRate.toFixed(1)}%
                      </span>
                      <br />
                      {stock.averagePrice.toLocaleString()}원
                    </td>
                    <td>
                      {stock.totalValue.toLocaleString()}원
                      <br />
                      <span className="current-price">
                        현재가 {stock.stockPrice.toLocaleString()}원
                      </span>
                    </td>
                    <td>
                      <button className="sell-button" onClick={{ goToSell }}>
                        매도하기
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">보유한 주식이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className="stock-main-button" onClick={goStockList}>
        투자하러 가기
      </button>
      <Footer />
    </div>
  );
}

export default StockMain;
