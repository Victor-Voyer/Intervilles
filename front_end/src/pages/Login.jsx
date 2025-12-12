import { useState } from 'react'

function Login({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email et mot de passe requis')
      return
    }
    setError('')

    try {
      const response = await fetch(`${API_BASE}/intervilles/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.message || 'Identifiants invalides')
        return
      }

      const data = await response.json()
      localStorage.setItem('token', data.token)
      onSubmit?.({ email, password, remember, user: data.user, token: data.token })
      navigate('/profile')
    } catch (err) {
      console.error('Login error', err)
      setError('Erreur réseau, réessaie plus tard')
    }
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
