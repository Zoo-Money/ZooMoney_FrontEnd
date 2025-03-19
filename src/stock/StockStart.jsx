import axios from "axios";
import React, { useEffect, useState } from "react";
import StockMain from "./StockMain";
import StockBegin from "./StockBegin";

function StockStart(props) {
  const [hasMemberNum, setHasMemberNum] = useState(2);
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

  if (hasMemberNum === 2) {
    return <div>Loading...</div>; // 로딩 중일 때 보여줄 컴포넌트
  }

  return <div>{hasMemberNum === 1 ? <StockMain /> : <StockBegin />}</div>;
}

export default StockStart;
