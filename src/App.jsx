import { Routes, Route } from 'react-router-dom'
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
import Login from './admin/login'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import EnterResult from './admin/EnterResult'
import ResultRecord from './admin/ResultRecord'
import FloatingSetting from './admin/FloatingSetting'
import GameSeoList from './admin/GameSeoList'

function App() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route element={<SubpageLayout />}>
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/:gameSlug" element={<DetailsPage />} />
        <Route path="/games/:gameSlug/calendar" element={<CalendarPage />} />
      </Route>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<Login />} />
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/enter-result" element={<EnterResult />} />
        <Route path="/result-record" element={<ResultRecord />} />
        <Route path="/floating-setting" element={<FloatingSetting />} />
        <Route path="/game-seo-list" element={<GameSeoList />} />
      </Route>
    </Routes>
  )
}

export default App