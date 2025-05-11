import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Boards from "./_components/Admin/Boards/FetchAllBoards";
import Standards from "./_components/Admin/Standards/FetchAllStandards";
import AuditLogs from "./_components/Admin/AuditTrail/FetchAllLogs";
import Subtopics from "./_components/Admin/Subtopics/FetchSubtopics";
import AddSubtopics from "./_components/Admin/Subtopics/AddSubtopics";
import Topics from "./_components/Admin/Topics/FetchTopics";
import Subjects from "./_components/Admin/Subjects/FetchSubjects";
import Sections from "./_components/Admin/Sections/FetchSections";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
          }
        />
        <Route path="/admin/boards" element={<Boards />} />
        <Route path="/admin/standards" element={<Standards />} />
        <Route path="/admin/subjects" element={<Subjects />} />
        <Route path="/admin/sections" element={<Sections />} />
        <Route path="/admin/audit-logs" element={<AuditLogs />} />
        <Route path="/admin/topics" element={<Topics />} />
        <Route path="/admin/subtopics" element={<Subtopics />} />
        <Route path="/admin/subtopics/add" element={<AddSubtopics />} />
      </Routes>
    </Router>
  );
}

export default App;
