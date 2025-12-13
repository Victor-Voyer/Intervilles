import { Link } from 'react-router-dom';
import challengeIcon from '../assets/icone/icone-challenge.png'
import usersIcon from '../assets/icone/icon-users.png'
import activeUserIcon from '../assets/icone/active-user.png'

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
            <div>
              <img src={challengeIcon} alt="challenges" className="admin-icon" />
            </div>
            <h3>Challenges</h3>
            <p>Suivre et gérer les challenges</p>
          </Link>

          <Link to="/admin/users" className="admin-card">
          <div>
              <img src={usersIcon} alt="users" className="admin-icon" />
            </div>
            <h3>Utilisateurs</h3>
            <p>Voir et gérer les comptes</p>
          </Link>

          <Link to="/admin/validate-account" className="admin-card">
            <div>
              <img src={activeUserIcon} alt="active user" className="admin-icon" />
            </div>
            <h3>Validation des comptes</h3>
            <p>Approuver ou refuser les nouveaux comptes</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
