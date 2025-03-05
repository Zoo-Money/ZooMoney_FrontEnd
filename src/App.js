import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockBegin from "./stock/StockBegin";
import "bootstrap/dist/css/bootstrap.min.css";
import ParentMain from "./parent/ParentMain";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<StockBegin />} /> */}
        <Route path="/" element={<ParentMain />} />
      </Routes>
    </Router>
  );
}

export default App;
