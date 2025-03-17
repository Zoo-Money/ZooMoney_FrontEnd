import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Routers from "./router/Routers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routers />
      <ToastContainer autoClose={1000} />
    </BrowserRouter>
  );
}

export default App;
