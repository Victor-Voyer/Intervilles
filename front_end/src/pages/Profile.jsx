import { useEffect, useMemo, useState } from 'react'
import '../styles/Profile.css'

// Normalise l’URL API (préfixe /intervilles) sans slash final
const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000/intervilles').replace(/\/$/, '')

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setError(' Connecte-toi pour accéder à ton profil.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`${API_BASE}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Impossible de récupérer le profil. Vérifie ta connexion ou tes droits.')
        }

        const payload = await response.json()
        setProfile(payload.data || null)
        setError('')
      } catch (err) {
        console.error('Profile fetch error:', err)
        setError(err.message)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const participationChallenges = useMemo(() => {
    if (!profile?.participations) return []
    return profile.participations
      .map((p) => p?.challenge)
      .filter(Boolean)
  }, [profile])

  const createdChallenges = useMemo(() => {
    if (!profile) return []
    return profile.created_challenges || profile.challenges || []
  }, [profile])

  const formatDate = (value) => {
    if (!value) return '—'
    return new Date(value).toLocaleDateString('fr-FR')
  }

  if (loading) {
    return <p className="loading">Chargement du profil...</p>
  }

  if (error) {
    return <div className="error-state">{error}</div>
  }

  if (!profile) {
    return <div className="empty-state">Profil introuvable pour le moment.</div>
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2 className="profile-title">Mon profil</h2>
        <p className="profile-subtitle">Retrouve tes informations et tes défis.</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>Informations personnelles</h3>
          <div className="profile-meta">
            <span><strong>Pseudo:</strong> {profile.username}</span>
            <span><strong>Email:</strong> {profile.email}</span>
            <span><strong>Nom:</strong> {profile.last_name} {profile.first_name}</span>
            <span><strong>Promo:</strong> {profile.promo?.name ?? '—'} ({profile.promo?.year ?? '—'})</span>
            <span><strong>Rôle:</strong> {profile.role?.name ?? '—'}</span>
          </div>
        </div>
      </div>

      <div className="profile-card">
        <h3>Défis créés</h3>
        {createdChallenges.length === 0 ? (
          <div className="empty-state">Tu n'as pas encore créé de défi.</div>
        ) : (
          <div className="list-cards">
            {createdChallenges.map((challenge) => (
              <div key={challenge.id} className="item-card">
                <div className="item-card-title">
                  <h4>{challenge.title}</h4>
                  <span className={`badge badge-${challenge.status || 'open'}`}>
                    {challenge.status}
                  </span>
                </div>
                <p>{challenge.description}</p>
                <div className="item-card-footer">
                  <span>Catégorie: {challenge.category?.name ?? '—'}</span>
                  <span>Début: {formatDate(challenge.start_date)}</span>
                  <span>Fin: {formatDate(challenge.end_date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="profile-card">
        <h3>Défis auxquels je participe</h3>
        {participationChallenges.length === 0 ? (
          <div className="empty-state">Tu ne participes à aucun défi pour le moment.</div>
        ) : (
          <div className="list-cards">
            {participationChallenges.map((challenge) => (
              <div key={challenge.id} className="item-card">
                <div className="item-card-title">
                  <h4>{challenge.title}</h4>
                  <span className={`badge badge-${challenge.status || 'open'}`}>
                    {challenge.status}
                  </span>
                </div>
                <p>{challenge.description}</p>
                <div className="item-card-footer">
                  <span>Catégorie: {challenge.category?.name ?? '—'}</span>
                  <span>Début: {formatDate(challenge.start_date)}</span>
                  <span>Fin: {formatDate(challenge.end_date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
