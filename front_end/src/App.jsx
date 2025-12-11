
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { ChallengesList } from './components/ChallengesList'

function App() {
  return (
    <div className="app">
      <Header />

      {/* Main Content */}
      <main className="main-content">
        <section className="hero">
          <h2>Bienvenue sur Intervilles</h2>
          <p>Participez à des défis passionnants et connectez-vous avec d'autres participants</p>
          <button className="cta-button">Commencer</button>
        </section>

        <ChallengesList />
      </main>

      <Footer />
    </div>
  )
}

export default App
