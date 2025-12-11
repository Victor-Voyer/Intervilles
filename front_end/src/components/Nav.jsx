import { NavLink } from 'react-router-dom'

function Nav() {
  const linkClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`

  return (
    <nav className="nav">
      <NavLink to="/" className={linkClass} end>Accueil</NavLink>
      <NavLink to="/profile" className={linkClass}>Profil</NavLink>
      <NavLink to="/login" className={linkClass}>Connexion</NavLink>
      <NavLink to="/register" className={linkClass}>Inscription</NavLink>
    </nav>
  )
}

export default Nav
