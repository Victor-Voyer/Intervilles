import { useState } from 'react'
import '../styles/Login.css'

function Login({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email et mot de passe requis')
      return
    }
    setError('')
    onSubmit?.({ email, password, remember })
    // Remplace par ton appel API
    console.log('login', { email, password, remember })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Connexion</h1>
        <p>Connecte-toi pour accéder au tableau de bord.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="auth-input"
              required
            />
          </label>
          <label className="auth-label">
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-input"
              required
            />
          </label>
          <label className="auth-remember">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Se souvenir de moi
          </label>
          {error ? <div className="auth-error">{error}</div> : null}
          <button type="submit" className="auth-submit">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
