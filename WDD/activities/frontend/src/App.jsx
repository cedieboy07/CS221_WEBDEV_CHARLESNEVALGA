import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login.jsx";
import Inventory from "./pages/Inventory.jsx";
import Landing from "./pages/Landing.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
