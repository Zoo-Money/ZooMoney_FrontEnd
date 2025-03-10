import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockBegin from "./stock/StockBegin";
import "bootstrap/dist/css/bootstrap.min.css";
import StockInfo from "./stock/StockInfo";
import StockNews from "./stock/StockNews";


function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<StockBegin />} /> */}
        {/* <Route path="/" element={<StockInfo />} /> */}
        <Route path="/" element={<StockNews />} />
      </Routes>
    </Router>
  );
}

export default App;
