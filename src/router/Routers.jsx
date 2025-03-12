import React from "react";
import AccountRouter from "./AccountRouter";
import NotifyRouter from "./NotifyRouter";
import StockRouter from "./StockRouter";
import CardRouter from "./CardRouter";
import ContractRouter from "./ContractRouter";
import QuizRouter from "./QuizRouter";
import MoneyPlanRouter from "./MoneyPlanRouter";

function Routers() {
  return (
    <div>
      <StockRouter />
      <AccountRouter />
      <NotifyRouter />
      <CardRouter />
      <ContractRouter />
      <QuizRouter />
      <MoneyPlanRouter></MoneyPlanRouter>
    </div>
  );
}

export default Routers;
