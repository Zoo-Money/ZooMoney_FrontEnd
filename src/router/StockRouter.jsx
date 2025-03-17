import React from "react";
import { Route, Routes } from "react-router-dom";
import StockBegin from "../stock/StockBegin";
import StockInfo from "../stock/StockInfo";
import StockRankResult from "../stock/StockRankResult";
import StockRankDetail from "../stock/StockRankDetail";
import StockHistory from "../stock/StockHistory";
import StockHistoryDetail from "../stock/StockHistoryDetail";
import StockMain from "../stock/StockMain";
import StockList from "../stock/StockList";
import StockDetail from "../stock/StockDetail";
import StockInfoDetail from "../stock/StockInfoDetail";
import MyStockProfit from "../stock/MyStockProfit";
function StockRouter() {
  return (
    <div>
      <Routes>
        <Route path="/stock/start" element={<StockBegin />}></Route>
        <Route path="/stock/info" element={<StockInfo />}></Route>
        <Route
          path="/stock/info/:infoNum"
          element={<StockInfoDetail />}
        ></Route>

        <Route
          path="/stock/list/:stockId/:stockName"
          element={<StockDetail />}
        ></Route>

        <Route path="/stock/myStockProfit" element={<MyStockProfit />}></Route>
        {/* <Route path="/stock/stockBuy" element={<StockBuy />}></Route>
        <Route path="/stock/stockSell" element={<StockSell />}></Route>
        <Route path="/stock/tradeDone" element={<TradeDone />}></Route> */}

        <Route path="/stock/stockHistory" element={<StockHistory />}></Route>
        <Route
          path="/stock/stockHistoryDetail"
          element={<StockHistoryDetail />}
        ></Route>
        <Route path="/stock/rankResult" element={<StockRankResult />}></Route>
        <Route path="/stock/rankDetail" element={<StockRankDetail />}></Route>
        <Route path="/stock/stockMain" element={<StockMain />}></Route>
        <Route path="/stock/list" element={<StockList />}></Route>
      </Routes>
    </div>
  );
}

export default StockRouter;
