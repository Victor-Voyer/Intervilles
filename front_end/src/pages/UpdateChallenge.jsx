import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function formatDateForInput(date) {
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default function UpdateChallenge() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('open')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [categories, setCategories] = useState([])
  const [fetchingCats, setFetchingCats] = useState(true)

  const [originalChallenge, setOriginalChallenge] = useState(null)

  // Fetch categories
  useEffect(() => {
    const load = async () => {
      try {
        setFetchingCats(true)
        const resp = await fetch('http://localhost:3000/intervilles/challenges/categories')
        if (!resp.ok) throw new Error('Impossible de charger les catégories')
        const data = await resp.json()
        const cats = (data?.data || [])
        setCategories(cats)
      } catch (e) {
        console.error(e)
      } finally {
        setFetchingCats(false)
      }
    }
    load()
  }, [])

  // Fetch challenge to edit
  useEffect(() => {
    const loadChallenge = async () => {
      if (!id) {
        setError('ID du challenge manquant')
        setFetching(false)
        return
      }

      try {
        setFetching(true)
        const resp = await fetch(`http://localhost:3000/intervilles/challenges/${id}`)
        if (!resp.ok) throw new Error('Challenge introuvable')
        const data = await resp.json()
        const challenge = data?.data
        
        if (!challenge) throw new Error('Challenge introuvable')

        setOriginalChallenge(challenge)
        setTitle(challenge.title || '')
        setDescription(challenge.description || '')
        setCategoryId(String(challenge.category_id || challenge.category?.id || ''))
        setStatus(challenge.status || 'open')
        setStartDate(challenge.start_date ? formatDateForInput(challenge.start_date) : '')
        setEndDate(challenge.end_date ? formatDateForInput(challenge.end_date) : '')
      } catch (e) {
        console.error(e)
        setError(e.message)
      } finally {
        setFetching(false)
      }
    }
    loadChallenge()
  }, [id])

  const isValid = useMemo(() => {
    if (!title.trim() || !description.trim()) return false
    if (!categoryId) return false
    const sd = new Date(startDate)
    const ed = new Date(endDate)
    return !Number.isNaN(sd) && !Number.isNaN(ed) && ed > sd
  }, [title, description, categoryId, startDate, endDate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!isValid) {
      setError('Veuillez remplir tous les champs correctement.')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setError("Vous devez être connecté pour modifier un défi.")
      return
    }

    try {
      setLoading(true)
      const resp = await fetch(`http://localhost:3000/intervilles/challenges/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category_id: Number(categoryId),
          status,
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
        })
      })

      const data = await resp.json().catch(() => ({}))

      if (!resp.ok) {
        if (resp.status === 403) {
          throw new Error('Vous n\'êtes pas autorisé à modifier ce défi')
        }
        throw new Error(data?.message || 'Échec de la mise à jour du défi')
      }

      setSuccess('Défi mis à jour avec succès !')
      setTimeout(() => navigate(`/challenges/${id}`), 600)
    } catch (e) {
      console.error(e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching || fetchingCats) {
    return (
      <section className="challenge-update-section">
        <h2>Modification du défi</h2>
        <p>Chargement...</p>
      </section>
    )
  }

  if (error && !originalChallenge) {
    return (
      <section className="challenge-update-section">
        <h2>Modification du défi</h2>
        <p className="error">{error}</p>
        <button onClick={() => navigate(-1)}>Retour</button>
      </section>
    )
  }

  return (
    <section className="challenge-update-section">
      <h2>Modifier le défi</h2>

      <form className="challenge-update-form" onSubmit={handleSubmit}>
        <label>
          Titre
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nom du défi"
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explique le défi"
            rows={5}
            required
          />
        </label>

        {categories.length > 0 ? (
          <label>
            Catégorie
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
        ) : (
          <p className="error">Aucune catégorie disponible.</p>
        )}

        <label>
          Statut
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="closed">Fermé</option>
          </select>
        </label>

        <div className="dates-row">
          <label>
            Date de début
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>

          <label>
            Date de fin
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="button-row">
          <button type="button" onClick={() => navigate(-1)} className="cancel-button">
            Annuler
          </button>
          <button type="submit" disabled={!isValid || loading}>
            {loading ? 'Mise à jour…' : 'Mettre à jour'}
          </button>
        </div>
      </form>

      <style>{`
        .challenge-update-section { max-width: 720px; margin: 0 auto; padding: 24px; }
        .challenge-update-form { display: grid; gap: 16px; }
        .challenge-update-form label { display: grid; gap: 8px; }
        .challenge-update-form input, .challenge-update-form textarea, .challenge-update-form select { padding: 10px; border: 1px solid #ccc; border-radius: 6px; }
        .dates-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .button-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .error { color: #b00020; }
        .success { color: #0a8; }
        button { padding: 10px 14px; border-radius: 6px; border: none; background: #1f7aec; color: white; cursor: pointer; }
        button[disabled] { opacity: 0.7; cursor: not-allowed; }
        .cancel-button { background: #666; }
      `}</style>
    </section>
  )
}
