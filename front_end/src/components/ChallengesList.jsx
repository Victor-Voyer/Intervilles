import { useState, useEffect } from 'react'
import '../styles/ChallengesList.css'

export function ChallengesList() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/intervilles/challenges')
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des défis')
      }
      
      const data = await response.json()
      setChallenges(data.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching challenges:', err)
      setError(err.message)
      setChallenges([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="challenges-section">
        <h2 className="challenges-title">Défis disponibles</h2>
        <div className="challenges-container">
          <p className="loading">Chargement des défis...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="challenges-section">
        <h2 className="challenges-title">Défis disponibles</h2>
        <div className="challenges-container">
          <p className="error">Les défis ne sont pas encore disponibles</p>
        </div>
      </section>
    )
  }

  if (challenges.length === 0) {
    return (
      <section className="challenges-section">
        <h2 className="challenges-title">Défis disponibles</h2>
        <div className="challenges-container">
          <p className="no-challenges">Aucun défi disponible pour le moment</p>
        </div>
      </section>
    )
  }

  return (
    <section className="challenges-section">
      <h2 className="challenges-title">Défis disponibles</h2>
      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="challenge-card">
            <div className="challenge-header">
              <h3 className="challenge-title">{challenge.title}</h3>
              <span className={`challenge-status status-${challenge.status}`}>
                {challenge.status === 'open' && 'Ouvert'}
                {challenge.status === 'in_progress' && 'En cours'}
                {challenge.status === 'closed' && 'Fermé'}
              </span>
            </div>
            <p className="challenge-description">{challenge.description}</p>
            <div className="challenge-dates">
              <span className="date-label">Début:</span>
              <span className="date-value">{new Date(challenge.start_date).toLocaleDateString('fr-FR')}</span>
              <span className="date-label">Fin:</span>
              <span className="date-value">{new Date(challenge.end_date).toLocaleDateString('fr-FR')}</span>
            </div>
            <button className="challenge-button">Participer</button>
          </div>
        ))}
      </div>
    </section>
  )
}
