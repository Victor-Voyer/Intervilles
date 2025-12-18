
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import ChallengeDetail from './pages/ChallengeDetail'
import CreateChallenge from './pages/CreateChallenge'
import Dashboard from './pages/Dashboard'
import AdminChallenges from './pages/AdminChallenges'
import AdminUsers from './pages/AdminUsers'
import UsersAdmin from './components/admin/Users'
import ValidateAccount from './components/admin/ValidateAccount'
import './styles/admin.css'
import UpdateChallenge from './pages/UpdateChallenge'
import Chat from './pages/Chat'

function App() {
  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
          <Route path="/challenges/create" element={<CreateChallenge />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/challenges" element={<AdminChallenges />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/validate-account" element={<ValidateAccount />} />
          <Route path="/challenges/:id/edit" element={<UpdateChallenge />} />
          <Route path="/chat" element={<Chat />} />

        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
