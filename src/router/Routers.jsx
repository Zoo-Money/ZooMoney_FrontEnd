import React from "react";
import AccountRouter from "./AccountRouter";
import CardRouter from "./CardRouter";
import ContractRouter from "./ContractRouter";
import DailyRouter from "./DailyRouter";
import MemberRouter from "./MemberRouter";
import MoneyPlanRouter from "./MoneyPlanRouter";
import QuizRouter from "./QuizRouter";
import StockRouter from "./StockRouter";

function Routers() {
  return (
    <div>
      <StockRouter />
      <AccountRouter />
      <CardRouter />
      <ContractRouter />
      <QuizRouter />
      <MoneyPlanRouter />
      <DailyRouter />
      <MemberRouter />
    </div>
  );
}

export default Routers;
