import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {isAuthenticated && <Route path="/dashboard" element={<Dashboard />} />}
      </Routes>
    </Router>
  );
}

export default App;
