import axios from "axios";
import { API_PATH } from "../common/config.js";
import React, { useEffect, useState } from "react";
import StockBegin from "./StockBegin";
import StockMain from "./StockMain";

function StockStart(props) {
  const [hasMemberNum, setHasMemberNum] = useState(2);
  const memberNum = sessionStorage.getItem("member_num");

  useEffect(() => {
    axios
      .post(`${API_PATH}/zoomoney/stock/userStatus`, { memberNum })
      .then((response) => {
        setHasMemberNum(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock info:", error);
      });
  });

  if (hasMemberNum === 2) return null;

  return <div>{hasMemberNum === 1 ? <StockMain /> : <StockBegin />}</div>;
}

export default StockStart;
