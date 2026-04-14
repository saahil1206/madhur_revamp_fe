import { Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import HomeLayout from './components/layout/HomeLayout'
import SubpageLayout from './components/layout/SubpageLayout'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'
import ProfilePage from './pages/ProfilePage'
import ResultsPage from './pages/ResultsPage'
import AboutPage from './pages/AboutPage'
import GamesPage from './pages/GamesPage'
import DetailsPage from './pages/DetailsPage'
import CalendarPage from './pages/CalendarPage'
import TermsConditionPage from './pages/TermsConditionPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import Login from './admin/login'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import EnterResult from './admin/EnterResult'
import ResultRecord from './admin/ResultRecord'
import FloatingSetting from './admin/FloatingSetting'
import GameSeoList from './admin/GameSeoList'
import BazarCategory from './admin/BazarCategory'
import LuckyNumberRequests from './admin/LuckyNumberRequests'
import LuckyNumberSetting from './admin/LuckyNumberSetting'
import EditProfile from './admin/EditProfile'
import ChangePassword from './admin/ChangePassword'

function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem('admin_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function AdminPublicRoute({ children }) {
  const token = localStorage.getItem('admin_token')
  if (token) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route element={<SubpageLayout />}>
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms-condition" element={<TermsConditionPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/:gameSlug" element={<DetailsPage />} />
        <Route path="/games/:gameSlug/calendar" element={<CalendarPage />} />
      </Route>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<AdminPublicRoute><Login /></AdminPublicRoute>} />
      <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/enter-result" element={<EnterResult />} />
        <Route path="/result-record" element={<ResultRecord />} />
        <Route path="/lucky-number-setting" element={<LuckyNumberSetting />} />
        <Route path="/bazar-category" element={<BazarCategory />} />
        <Route path="/floating-setting" element={<FloatingSetting />} />
        <Route path="/game-seo-list" element={<GameSeoList />} />
        <Route path="/lucky-number-requests" element={<LuckyNumberRequests />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
    </Routes>
  )
}

export default App
