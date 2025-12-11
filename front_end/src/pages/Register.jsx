import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register({ onSubmit }) {
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [promoId, setPromoId] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

  const isPasswordStrong = (value) => {
    const hasLength = value.length >= 8
    const hasLetter = /[A-Za-z]/.test(value)
    const hasDigit = /[0-9]/.test(value)
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
    return hasLength && hasLetter && hasDigit && hasSpecial
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !firstName || !lastName || !email || !password || !confirmPassword || !promoId) {
      setError('Tous les champs sont requis')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (!isPasswordStrong(password)) {
      setError('Mot de passe trop faible (8+ caractères avec lettre, chiffre et caractère spécial)')
      return
    }

    const parsedPromo = Number(promoId)
    if (Number.isNaN(parsedPromo)) {
      setError('Promo invalide')
      return
    }

    setError('')

    const payload = {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      promo_id: parsedPromo,
    }

    try {
      const response = await fetch(`${API_BASE}/intervilles/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.message || "Impossible de créer le compte")
        return
      }

      const data = await response.json()
      onSubmit?.(data)
      navigate('/login')
    } catch (err) {
      console.error('Register error', err)
      setError('Erreur réseau, réessaie plus tard')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Inscription</h1>
        <p>Crée ton compte pour rejoindre l'aventure.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Nom d'utilisateur
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="camille.d"
              className="auth-input"
              required
            />
          </label>
          <label className="auth-label">
            Prénom
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Camille"
              className="auth-input"
              required
            />
          </label>
          <label className="auth-label">
            Nom
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Dupont"
              className="auth-input"
              required
            />
          </label>
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
          <label className="auth-label">
            Confirmer le mot de passe
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-input"
              required
            />
          </label>
          <label className="auth-label">
            Promo
            <input
              type="number"
              value={promoId}
              onChange={(e) => setPromoId(e.target.value)}
              placeholder="1"
              className="auth-input"
              required
              min="1"
            />
          </label>
          {error ? <div className="auth-error">{error}</div> : null}
          <button type="submit" className="auth-submit">
            Créer mon compte
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
