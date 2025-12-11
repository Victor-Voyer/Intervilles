import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')
  const [status, setStatus] = useState('pending')
  const navigate = useNavigate()

  const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
  const token = searchParams.get('token')

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('Token manquant')
        setStatus('error')
        return
      }

      try {
        const res = await fetch(`${API_BASE}/intervilles/auth/verify-email?token=${token}`)
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data.message || 'Vérification impossible')
          setStatus('error')
          return
        }
        setStatus('success')

        const storedToken = localStorage.getItem('token')
        const destination = storedToken ? '/profile' : '/login'
        navigate(destination, { replace: true })
      } catch (err) {
        console.error('Verify email error', err)
        setError('Erreur réseau, réessaie plus tard')
        setStatus('error')
      }
    }

    verify()
  }, [API_BASE, navigate, token])

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Vérification de l'email</h1>
        {status === 'pending' && <p>Vérification en cours...</p>}
        {status === 'success' && <p>Email vérifié, redirection...</p>}
        {status === 'error' && <div className="auth-error">{error}</div>}
      </div>
    </div>
  )
}

export default VerifyEmail
