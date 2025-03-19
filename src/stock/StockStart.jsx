import axios from "axios";
import React, { useEffect, useState } from "react";
import StockMain from "./StockMain";
import StockBegin from "./StockBegin";

function StockStart(props) {
  const [hasMemberNum, setHasMemberNum] = useState(null);
  const memberNum = sessionStorage.getItem("member_num");

  useEffect(() => {
    axios
      .post("http://localhost:7777/zoomoney/stock/userStatus", { memberNum })
      .then((response) => {
        setHasMemberNum(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock info:", error);
      });
  }, []);
  console.log(hasMemberNum);
  return <div>{hasMemberNum ? <StockMain /> : <StockBegin />}</div>;
}

export default StockStart;
