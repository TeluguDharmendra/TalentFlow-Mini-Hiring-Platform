import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import JobsPage from "./pages/Jobs/JobsPage.jsx";
import JobDetailPage from "./pages/Jobs/JobDetailPage.jsx";
import JobDetails from "./pages/Jobs/JobDetails.jsx";
import CandidatesPage from "./pages/Candidates/CandidatesPage.jsx";
import CandidateDetailPage from "./pages/Candidates/CandidateDetailPage.jsx";
import AssessmentsPage from "./pages/Assessments/AssessmentsPage.jsx";
import AssessmentDetailPage from "./pages/Assessments/AssessmentDetailPage.jsx";
import AssessmentPage from "./pages/Assessments/AssessmentPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import HiringAnalysis from "./pages/Analysis/HiringAnalysis.jsx";

// Fallback page for unmatched routes
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-white/90">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/assessments" element={<AssessmentsPage />} />
      <Route path="/assessment/:id" element={<AssessmentPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/job/:id" element={<JobDetails />} />
      <Route path="/candidates" element={<CandidatesPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/analysis" element={<HiringAnalysis />} />
      <Route path="/app" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<JobsPage />} />
        <Route path="jobs/:jobId" element={<JobDetailPage />} />
        <Route path="candidates" element={<CandidatesPage />} />
        <Route path="candidates/:candidateId" element={<CandidateDetailPage />} />
        <Route path="assessments" element={<AssessmentsPage />} />
        <Route path="assessments/:jobId" element={<AssessmentDetailPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all fallback route */}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
