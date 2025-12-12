import { useEffect, useState } from 'react'
import UsersAdmin from '../components/admin/Users'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      if (!token) {
        setError('Authentification requise pour voir les utilisateurs')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const resp = await fetch('http://localhost:3000/intervilles/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}))
          throw new Error(data?.message || 'Impossible de charger les utilisateurs')
        }

        const data = await resp.json()
        setUsers(data?.data || [])
        setError(null)
      } catch (e) {
        console.error(e)
        setError(e.message || 'Erreur de chargement')
        setUsers([])
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
          <h1 className="admin-title">Utilisateurs</h1>
          <p className="admin-subtitle">Chargement des utilisateurs…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Utilisateurs</h1>
          <p className="admin-subtitle">Erreur de chargement</p>
        </div>
        <div className="admin-content">
          <p style={{ color: '#b00020' }}>{error}</p>
        </div>
      </div>
    )
  }

  return <UsersAdmin users={users} />
}

export default AdminUsers

