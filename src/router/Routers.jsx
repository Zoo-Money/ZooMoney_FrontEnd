import React from "react";
import AccountRouter from "./AccountRouter";
import NotifyRouter from "./NotifyRouter";
import StockRouter from "./StockRouter";
import CardRouter from "./CardRouter";
import ContractRouter from "./ContractRouter";
import QuizRouter from "./QuizRouter";

function Routers() {
  return (
    <div>
      <StockRouter />
      <AccountRouter />
      <NotifyRouter />
      <CardRouter />
      <ContractRouter />
      <QuizRouter />
    </div>
  );
}

export default Routers;
