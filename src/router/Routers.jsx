import React from "react";
import AccountRouter from "./AccountRouter";
import NotifyRouter from "./NotifyRouter";
import StockRouter from "./StockRouter";
import CardRouter from "./CardRouter";
import ContractRouter from "./ContractRouter";
import QuizRouter from "./QuizRouter";
import MoneyPlanRouter from "./MoneyPlanRouter";
import DailyRouter from "./DailyRouter";

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
      <DailyRouter />
    </div>
  );
}

export default Routers;
