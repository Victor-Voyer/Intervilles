
import './App.css'
import { ChallengesList } from './components/ChallengesList'

function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo-text">Intervilles</h1>
          <nav className="nav">
            <a href="#home" className="nav-link">Accueil</a>
            <a href="#challenges" className="nav-link">Défis</a>
            <a href="#about" className="nav-link">À propos</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <section className="hero">
          <h2>Bienvenue sur Intervilles</h2>
          <p>Participez à des défis passionnants et connectez-vous avec d'autres participants</p>
          <button className="cta-button">Commencer</button>
        </section>

        <ChallengesList />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Intervilles</h4>
            <p>&copy; 2025 Tous droits réservés</p>
          </div>
          <div className="footer-section">
            <h4>Liens</h4>
            <ul>
              <li><a href="#privacy">Confidentialité</a></li>
              <li><a href="#terms">Conditions</a></li>
              <li><a href="#help">Aide</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Réseaux sociaux</h4>
            <ul>
              <li><a href="#facebook">Facebook</a></li>
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#instagram">Instagram</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
