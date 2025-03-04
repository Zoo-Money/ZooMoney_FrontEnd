import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockBegin from "./stock/StockBegin";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StockBegin />} />
      </Routes>
    </Router>
  );
}

export default App;
