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
import AdminDashboard from "./_components/Admin/AdminDashboard";
import EditorDashboard from "./_components/Editor/EditorDashboard";
import EditorSections from "./_components/Editor/Sections/FetchAllSections";
import EditorTopics from "./_components/Editor/Topics/FetchAllTopics";

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

        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="boards" element={<Boards />} />
          <Route path="standards" element={<Standards />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="sections" element={<Sections />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="topics" element={<Topics />} />
          <Route path="subtopics" element={<Subtopics />} />
          <Route path="subtopics/add" element={<AddSubtopics />} />
        </Route>

        <Route path="/editor" element={<EditorDashboard />}>
          <Route path="sections" element={<EditorSections />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="topics" element={<EditorTopics />} />
          <Route path="subtopics" element={<Subtopics />} />
          <Route path="subtopics/add" element={<AddSubtopics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
