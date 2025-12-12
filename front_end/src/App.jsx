
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
import UpdateChallenge from './pages/UpdateChallenge'

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
          <Route path="/challenges/:id/edit" element={<UpdateChallenge />} />

        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
