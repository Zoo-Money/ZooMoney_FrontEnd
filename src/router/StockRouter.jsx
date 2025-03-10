import React from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import StockBegin from '../stock/StockBegin';
import StockInfoDetail from '../stock/StockInfoDetail';
import StockInfo from '../stock/StockInfo';
import StockRank from '../stock/StockRank';
import StockDetail from '../stock/StockDetail';
import MyStockDetail from '../stock/MyStockDetail';
import MyStock from "../stock/MyStock";
import StockBuy from "../stock/StockBuy";
import StockSell from "../stock/StockSell";
import TradeDone from "../stock/TradeDone";
import StockRankResult from "../stock/StockRankResult";
import StockRankDetail from "../stock/StockRankDetail";
import StockHistory from "../stock/StockHistory";
import StockHistoryDetail from "../stock/StockHistoryDetail";

function StockRouter(props) {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path='/stock/start' element={<StockBegin></StockBegin>}></Route>
                    <Route path='/stock/info' element={<StockInfo></StockInfo>}></Route>
                    <Route path='/stock/info/:infoNum' element={<StockInfoDetail></StockInfoDetail>}></Route>
                    <Route path='/stock/list' element={<StockRank></StockRank>}></Route>
                    <Route path='/stock/list/:stockId/:stockName' element={<StockDetail></StockDetail>}></Route>
                    <Route path='/stock/myStock' element={<MyStock></MyStock>}></Route>
                    <Route path='/stock/myStockDetail' element={<MyStockDetail></MyStockDetail>}></Route>
                    <Route path='/stock/stockBuy' element={<StockBuy></StockBuy>}></Route>
                    <Route path='/stock/stockSell' element={<StockSell></StockSell>}></Route>
                    <Route path='/stock/tradeDone' element={<TradeDone></TradeDone>}></Route>
                    <Route path='/stock/rankResult' element={<StockRankResult></StockRankResult>}></Route>
                    <Route path='/stock/rankDetail' element={<StockRankDetail></StockRankDetail>}></Route>
                    <Route path='/stock/stockHistory' element={<StockHistory></StockHistory>}></Route>
                    <Route path='/stock/stockHistoryDetail' element={<StockHistoryDetail></StockHistoryDetail>}></Route>
                    
                </Routes>
            </Router>
        </div>
    );
}

export default StockRouter;