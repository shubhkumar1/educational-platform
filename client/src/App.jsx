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

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        {/* Content Routes */}
        <Route path="/blogs" element={<BlogListPage />} />
        <Route path="/blogs/:id" element={<BlogReaderPage />} />
        <Route path="/videos" element={<VideoListPage />} />
        <Route path="/quizzes" element={<QuizListPage />} />
        <Route path="/quiz/:id" element={<QuizTakingPage />} />
        <Route path="/quiz/:id/result" element={<QuizResultPage />} />

        {/* Protected Dashboard Routes */}
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
        {/* ADD THE NEW CREATOR ROUTE BELOW */}
        <Route path="/creator/blogs/create" element={
          <ProtectedRoute requiredRole="creator">
            <CreateBlogPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;