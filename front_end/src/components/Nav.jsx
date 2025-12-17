import {  useNavigate } from 'react-router-dom'

function Nav() {
  const navigate = useNavigate()

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const roleRaw = typeof window !== 'undefined' ? localStorage.getItem('role') : null
  const avatarUrl = typeof window !== 'undefined' ? localStorage.getItem('avatar_url') : null

  const role = roleRaw ? roleRaw.toUpperCase() : null
  const isLogged = Boolean(token)
  const isAdminOrMod = role === 'ADMIN' || role === 'MODERATOR'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    localStorage.removeItem('avatar_url')
    navigate('/')
  }

  const linkClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`

  return (
    <nav className="nav">
      <button type="button" className="nav-link" onClick={() => navigate('/')}>Accueil</button>
      {isLogged && (
        <button type="button" className="nav-link" onClick={() => navigate('/challenges/create')}>Créer</button>
      )}

      <button type="button" className="nav-link nav-profile-btn" onClick={() => navigate('/profile')}>
        <img
          src={avatarUrl || '/default-avatar.png'}
          alt="avatar"
          className="nav-avatar"
        />
        Profil
      </button>

      {isAdminOrMod ? <button type="button" className="nav-link" onClick={() => navigate('/admin')}>Dashboard</button> : null}
      {!isLogged ? (
        <>
          <button type="button" className="nav-link" onClick={() => navigate('/login')}>Connexion</button>
          <button type="button" className="nav-link" onClick={() => navigate('/register')}>Inscription</button>
        </>
      ) : (
        <button type="button" className="nav-link" onClick={handleLogout}>
          Déconnexion
        </button>
      )}
    </nav>
  )
}

export default Nav
