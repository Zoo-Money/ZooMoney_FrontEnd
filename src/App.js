import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import StockBegin from "./stock/StockBegin";

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
