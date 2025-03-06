import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockBegin from "./stock/StockBegin";
import "bootstrap/dist/css/bootstrap.min.css";
import ParentMain from "./parent/ParentMain";
import MoneyContractManage from "./parent/MoneyContractManage";
import ContractWrtie from "./parent/ContractWrite";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<StockBegin />} /> */}
        {/* <Route path="/" element={<ParentMain />} /> */}
        {/* <Route path="/" element={<MoneyContractManage /> */}
        <Route path="/" element={<ContractWrtie />} />
      </Routes>
    </Router>
  );
}

export default App;
