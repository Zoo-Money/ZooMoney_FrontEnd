import React from "react";
import AccountRouter from "./AccountRouter";
import CardRouter from "./CardRouter";
import ContractRouter from "./ContractRouter";
import DailyRouter from "./DailyRouter";
import MemberRouter from "./MemberRouter";
import MoneyPlanRouter from "./MoneyPlanRouter";
import ParentRouter from "./ParentRouter";
import QuizRouter from "./QuizRouter";
import StockRouter from "./StockRouter";

function Routers() {
  return (
    <div>
      <AccountRouter />
      <CardRouter />
      <ContractRouter />
      <DailyRouter />
      <MemberRouter />
      <MoneyPlanRouter />
      <ParentRouter />
      <QuizRouter />
      <StockRouter />
    </div>
  );
}

export default Routers;
