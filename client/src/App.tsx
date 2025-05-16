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
import EditorAddSubtopic from "./_components/Editor/Subtopic/AddSubtopic";
import Topics from "./_components/Admin/Topics/FetchTopics";
import Subjects from "./_components/Admin/Subjects/FetchSubjects";
import Sections from "./_components/Admin/Sections/FetchSections";
import AdminDashboard from "./_components/Admin/AdminDashboard";
import EditorDashboard from "./_components/Editor/EditorDashboard";
import EditorSections from "./_components/Editor/Sections/FetchAllSections";
import EditorTopics from "./_components/Editor/Topics/FetchAllTopics";
import EditorSubtopics from "./_components/Editor/Subtopic/FetchAllSubtopic";
import SubtopicViewer from "./_components/Admin/Subtopics/ViewEdit";
import EditorSingleSubtopics from "./_components/Editor/Subtopic/FetchSingleSubtopic";
import ChangeLogs from "./_components/Admin/ChangeLogs/FetchAllChangeLogs";
import QuestionPaper from "./_components/Admin/Question-Paper/FetchAllQuestionPaper";
import ReviewerSubtopicReview from "./_components/Reviewer/Subtopic/ReviewSubtopic";
import ReviewerDashboard from "./_components/Reviewer/ReviewerDashboard";
import FetchAllSubtopicsReview from "./_components/Reviewer/Subtopic/FetchAllSubtopicsReview";

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
          <Route path="topics" element={<Topics />} />
          <Route path="subtopics" element={<Subtopics />} />
          <Route path="subtopics/add" element={<AddSubtopics />} />
          <Route path="subtopics/view-edit/:id" element={<SubtopicViewer />} />
          <Route path="question-paper" element={<QuestionPaper />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="change-logs" element={<ChangeLogs />} />
        </Route>
        <Route path="/editor" element={<EditorDashboard />}>
          <Route path="sections" element={<EditorSections />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="topics" element={<EditorTopics />} />
          <Route path="subtopics" element={<EditorSubtopics />} />
          <Route path="subtopics/add" element={<EditorAddSubtopic />} />
          <Route
            path="subtopics/view/:id"
            element={<EditorSingleSubtopics />}
          />
        </Route>
        <Route path="/reviewer" element={<ReviewerDashboard />}>
          <Route path="subtopics" element={<FetchAllSubtopicsReview />} />
          <Route
            path="subtopics/review/:id"
            element={<ReviewerSubtopicReview />}
          />
        </Route>
        Review
      </Routes>
    </Router>
  );
}

export default App;
