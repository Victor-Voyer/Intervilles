import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CkEditor from '../components/CkEditor'
import Comments from '../components/Comments'
import '../styles/ChallengeDetail.css'

export default function ChallengeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [participationContent, setParticipationContent] = useState('')

  useEffect(() => {
    fetchChallenge()
  }, [id])

  useEffect(() => {
    setParticipationContent('')
  }, [id])

  const fetchChallenge = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3000/intervilles/challenges/${id}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du défi')
      }
      
      const data = await response.json()
      setChallenge(data.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching challenge:', err)
      setError(err.message)
      setChallenge(null)
    } finally {
      setLoading(false)
    }
  }

  const handleParticipate = () => {
    // Logique de participation à implémenter plus tard
    console.log('Participer au défi:', challenge.id, participationContent)
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="challenge-detail-container">
        <div className="loading-message">
          <p>Chargement du défi...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="challenge-detail-container">
        <div className="error-message">
          <p>Erreur : {error}</p>
          <button onClick={handleBack} className="back-button">Retour</button>
        </div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="challenge-detail-container">
        <div className="error-message">
          <p>Défi non trouvé</p>
          <button onClick={handleBack} className="back-button">Retour</button>
        </div>
      </div>
    )
  }

  const canEdit = () => {
    const userId = localStorage.getItem('userId')
    const role = localStorage.getItem('role')?.toUpperCase()
    return (
      userId && challenge?.user_id && 
      (String(userId) === String(challenge.user_id) || role === 'ADMIN' || role === 'MODERATOR')
    )
  }

  return (
    <div className="challenge-detail-container">
      <div className="header-actions">
        <button onClick={handleBack} className="back-button">← Retour</button>
        {canEdit() && (
          <button onClick={() => navigate(`/challenges/${id}/edit`)} className="edit-button">
            ✏️ Modifier
          </button>
        )}
      </div>
      
      <div className="challenge-detail-card">
        <div className="challenge-detail-header">
          <h1 className="challenge-detail-title">{challenge.title}</h1>
          <span className={`challenge-status status-${challenge.status}`}>
            {challenge.status === 'open' && 'Ouvert'}
            {challenge.status === 'in_progress' && 'En cours'}
            {challenge.status === 'closed' && 'Fermé'}
          </span>
        </div>

        <div className="challenge-detail-content">
          <div className="challenge-info-section">
            <h2>Description</h2>
            <p className="challenge-description">{challenge.description}</p>
          </div>

          <div className="challenge-info-section">
            <h2>Informations</h2>
            <div className="challenge-meta">
              {challenge.category && (
                <div className="meta-item">
                  <span className="meta-label">Catégorie:</span>
                  <span className="meta-value">{challenge.category.name}</span>
                </div>
              )}
              {challenge.user && (
                <div className="meta-item">
                  <span className="meta-label">Créé par:</span>
                  <span className="meta-value">{challenge.user.username}</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">Date de début:</span>
                <span className="meta-value">
                  {new Date(challenge.start_date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Date de fin:</span>
                <span className="meta-value">
                  {new Date(challenge.end_date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Créé le:</span>
                <span className="meta-value">
                  {new Date(challenge.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {challenge.status === 'open' && (
            <div className="challenge-actions">
              <div className="participation-editor">
                <h3>Rédigez votre proposition</h3>
                <p className="participation-note">
                  Utilisez l’éditeur pour préparer votre participation avant de l’envoyer.
                </p>
                <CkEditor
                  value={participationContent}
                  placeholder="Décrivez votre approche, vos idées ou vos livrables..."
                  onChange={setParticipationContent}
                />
              </div>
              <button onClick={handleParticipate} className="participate-button">
                Participer au défi
              </button>
            </div>
          )}

          {/* Section des commentaires */}
          <Comments challengeId={id} />
        </div>
      </div>
    </div>
  )
}
