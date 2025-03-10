import React from "react";
import AccountRouter from "./AccountRouter";
import NotifyRouter from "./NotifyRouter";
import StockRouter from "./StockRouter";

function Routers() {
  return (
    <div>
      <StockRouter />
      <AccountRouter />
      <NotifyRouter />
    </div>
  );
}

export default Routers;
