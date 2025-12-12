import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChallengesAdmin from '../components/admin/Challenges'

function AdminChallenges() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const resp = await fetch('http://localhost:3000/intervilles/challenges')
        if (!resp.ok) throw new Error('Impossible de charger les challenges')
        const data = await resp.json()
        setChallenges(data?.data || [])
        setError(null)
      } catch (e) {
        console.error(e)
        setError(e.message || 'Erreur de chargement')
        setChallenges([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Challenges</h1>
          <p className="admin-subtitle">Chargement des challenges…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Challenges</h1>
          <p className="admin-subtitle">Erreur de chargement</p>
        </div>
        <div className="admin-content">
          <p style={{ color: '#b00020' }}>{error}</p>
        </div>
      </div>
    )
  }

  const handleViewChallenge = (challenge) => {
    const id = challenge?.id
    if (!id) return
    navigate(`/challenges/${id}`)
  }

  return <ChallengesAdmin challenges={challenges} onViewChallenge={handleViewChallenge} />
}

export default AdminChallenges

