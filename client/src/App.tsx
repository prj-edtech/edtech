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
import EditorQuestionPaper from "./_components/Editor/Question-Paper/FetchAllQuestionPapers";
import Questions from "./_components/Admin/Question/FetchAllQuestions";
import EditorFetchAllQuestions from "./_components/Editor/Question/FetchAllQuestions";
import ReviewerFetchAllQuestions from "./_components/Reviewer/Question/FetchAllQuestions";
import AdminLayout from "./_components/Admin/AdminLayout";
import EditorLayout from "./_components/Editor/EditorLayout";
import ReviewerLayout from "./_components/Reviewer/ReviewerLayout";
import EditSubtopic from "./_components/Admin/Subtopics/EditSubtopic";
import AddQuestions from "./_components/Admin/Question/AddQuestions";
import EditorAddQuestions from "./_components/Editor/Question/AddQuestion";

function App() {
  const { isAuthenticated } = useAuth0();

  // if (isLoading)
  //   return (
  //     <div className="flex justify-center items-center w-full min-h-screen">
  //       <Loader2 className="w-6 h-6 animate-spin" />
  //     </div>
  //   );

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
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="boards" element={<Boards />} />
          <Route path="standards" element={<Standards />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="sections" element={<Sections />} />
          <Route path="topics" element={<Topics />} />
          <Route path="subtopics" element={<Subtopics />} />
          <Route path="subtopics/add" element={<AddSubtopics />} />
          <Route path="subtopics/edit/:subtopicId" element={<EditSubtopic />} />
          <Route path="subtopics/view-edit/:id" element={<SubtopicViewer />} />
          <Route path="question-papers" element={<QuestionPaper />} />
          <Route path="questions" element={<Questions />} />
          <Route path="questions/add" element={<AddQuestions />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="change-logs" element={<ChangeLogs />} />
        </Route>
        {/* Editor Routes */}
        <Route path="/editor" element={<EditorLayout />}>
          <Route index element={<EditorDashboard />} />
          <Route path="sections" element={<EditorSections />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="topics" element={<EditorTopics />} />
          <Route path="subtopics" element={<EditorSubtopics />} />
          <Route path="subtopics/add" element={<EditorAddSubtopic />} />
          <Route path="subtopics/edit/:subtopicId" element={<EditSubtopic />} />
          <Route
            path="subtopics/view/:id"
            element={<EditorSingleSubtopics />}
          />
          <Route path="question-papers" element={<EditorQuestionPaper />} />
          <Route path="questions" element={<EditorFetchAllQuestions />} />
          <Route path="questions/add" element={<EditorAddQuestions />} />
        </Route>
        {/* Reviewer Layout */}
        <Route path="/reviewer" element={<ReviewerLayout />}>
          <Route index element={<ReviewerDashboard />} />
          <Route path="subtopics" element={<FetchAllSubtopicsReview />} />
          <Route
            path="subtopics/review/:id"
            element={<ReviewerSubtopicReview />}
          />
          <Route path="questions" element={<ReviewerFetchAllQuestions />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
