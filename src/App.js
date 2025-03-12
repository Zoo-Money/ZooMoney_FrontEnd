import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Routers from "./router/Routers";

function App() {
  return (
    <BrowserRouter>
      <Routers />
    </BrowserRouter>

  );
}

export default App;
