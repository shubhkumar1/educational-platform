import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './pages/StudentDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/Login';
import BlogListPage from './pages/BlogListPage';
import BlogReaderPage from './pages/BlogReaderPage';
import VideoListPage from './pages/VideoListPage';
import QuizListPage from './pages/QuizListPage';
import QuizTakingPage from './pages/QuizTakingPage';
import QuizResultPage from './pages/QuizResultPage';
import CreateBlogPage from './pages/CreateBlogPage';
import CreateQuizPage from './pages/CreateQuizPage';
import ScheduleStreamPage from './pages/ScheduleStreamPage'; // <-- ADD THIS
import LiveClassPage from './pages/LiveClassPage';
import PricingPage from './pages/PricingPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AiAssistantPage from './pages/AiAssistantPage';
import JobsPage from './pages/JobsPage';
import CreateAdCampaignPage from './pages/CreateAdCampaignPage';
import OnboardingPage from './pages/OnboardingPage';
import EditBlogPage from './pages/EditBlogPage';
import EditQuizPage from './pages/EditQuizPage';
import EditStreamPage from './pages/EditStreamPage';
import './app.css'; // <-- ADD THIS IMPORT

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        {/* Content Routes */}
        <Route path="/blogs" element={<ProtectedRoute requiredRole={null}><BlogListPage /></ProtectedRoute>} />
        <Route path="/blogs/:slug" element={<ProtectedRoute requiredRole={null}><BlogReaderPage /></ProtectedRoute>} />
        <Route path="/videos" element={<ProtectedRoute requiredRole={null}><VideoListPage /></ProtectedRoute>} />
        <Route path="/quizzes" element={<ProtectedRoute requiredRole={null}><QuizListPage /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute requiredRole={null}><QuizTakingPage /></ProtectedRoute>} />
        <Route path="/quiz/:id/result" element={<ProtectedRoute requiredRole={null}><QuizResultPage /></ProtectedRoute>} />


        {/* Protected Dashboard Routes */}
        <Route path="/onboarding" element={
          // We use the base ProtectedRoute because a user must exist to be onboarded
          <ProtectedRoute requiredRole={null}>
            <OnboardingPage />
          </ProtectedRoute>
        } />
        <Route path="/student/dashboard" element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/creator/dashboard" element={
          <ProtectedRoute requiredRole="creator">
            <CreatorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        {/* <Route path="/student/dashboard" element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/creator/dashboard" element={
          <ProtectedRoute requiredRole="creator">
            <CreatorDashboard />
          </ProtectedRoute>
        } /> */}
        {/* ADD THE NEW CREATOR ROUTE BELOW */}
        <Route path="/creator/blogs/create" element={
          <ProtectedRoute requiredRole="creator">
            <CreateBlogPage />
          </ProtectedRoute>
        } />
        <Route path="/creator/quizzes/create" element={
          <ProtectedRoute requiredRole="creator">
            <CreateQuizPage />
          </ProtectedRoute>
        } />
        <Route path="/creator/streams/schedule" element={
          <ProtectedRoute requiredRole="creator">
            <ScheduleStreamPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/ads/create" element={
          <ProtectedRoute requiredRole="admin">
            <CreateAdCampaignPage />
          </ProtectedRoute>
        } />
        {/* Live Class Route for Students */}

        <Route path="/creator/pricing" element={
          <ProtectedRoute requiredRole="creator">
            <PricingPage />
          </ProtectedRoute>
        } />

        {/* Creator Routes */}
        <Route path="/creator/streams/edit/:id" element={
          <ProtectedRoute requiredRole="creator">
            <EditStreamPage />
          </ProtectedRoute>
        } />

        <Route path="/creator/blogs/edit/:id" element={<ProtectedRoute requiredRole="creator"><EditBlogPage /></ProtectedRoute>} />
        <Route path="/creator/quizzes/edit/:id" element={<ProtectedRoute requiredRole="creator"><EditQuizPage /></ProtectedRoute>} />


        <Route path="/jobs" element={<ProtectedRoute requiredRole={null}><JobsPage /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute requiredRole={null}><AiAssistantPage /></ProtectedRoute>} />
        <Route path="/subscribe" element={<ProtectedRoute requiredRole={null}><SubscriptionPage /></ProtectedRoute>} />
        <Route path="/live/:videoId" element={<ProtectedRoute requiredRole={null}><LiveClassPage /></ProtectedRoute>} />

      </Routes>
    </div>
  );
}

export default App;