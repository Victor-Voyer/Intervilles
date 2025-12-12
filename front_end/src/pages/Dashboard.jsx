import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Dashboard admin</h1>
        <p className="admin-subtitle">Accès rapide aux écrans de gestion</p>
      </div>

      <div className="admin-content">
        <div className="admin-cards">
          <Link to="/admin/challenges" className="admin-card">
            <h3>Challenges</h3>
            <p>Suivre et gérer les challenges</p>
          </Link>

          <Link to="/admin/users" className="admin-card">
            <h3>Utilisateurs</h3>
            <p>Voir et gérer les comptes</p>
          </Link>

          <Link to="/admin/validate-account" className="admin-card">
            <h3>Validation des comptes</h3>
            <p>Approuver ou refuser les nouveaux comptes</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
