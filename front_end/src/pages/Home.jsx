import { ChallengesList } from '../components/ChallengesList'

function Home() {
  return (
    <>
      <section className="hero">
        <h2>Bienvenue sur Intervilles</h2>
        <p>Participez à des défis passionnants et connectez-vous avec d'autres participants</p>
        <button className="cta-button">Commencer</button>
      </section>

      <ChallengesList />
    </>
  )
}

export default Home
