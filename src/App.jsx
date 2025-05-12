import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import "./App.css";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import Records from "./components/Records";
import Chatbot from "./components/Chatbot";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/records" element={<Records />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/chatbot" element={<Chatbot/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;