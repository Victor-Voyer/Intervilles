import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function formatDateForInput(date) {
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default function CreateChallenge() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [startDate, setStartDate] = useState(formatDateForInput(new Date()))
  const [endDate, setEndDate] = useState(formatDateForInput(new Date(Date.now() + 24*3600*1000)))

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [categories, setCategories] = useState([])
  const [fetchingCats, setFetchingCats] = useState(true)

  useEffect(() => {
    // Fetch categories from the dedicated endpoint
    const load = async () => {
      try {
        setFetchingCats(true)
        const resp = await fetch('http://localhost:3000/intervilles/challenges/categories')
        if (!resp.ok) throw new Error('Impossible de charger les catégories')
        const data = await resp.json()
        const cats = (data?.data || [])
        setCategories(cats)
        if (cats.length > 0) setCategoryId(String(cats[0].id))
      } catch (e) {
        console.error(e)
      } finally {
        setFetchingCats(false)
      }
    }
    load()
  }, [])

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

    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    if (!token) {
      setError("Vous devez être connecté pour créer un défi.")
      return
    }

    try {
      setLoading(true)
      const resp = await fetch('http://localhost:3000/intervilles/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category_id: Number(categoryId),
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
        })
      })

      const data = await resp.json().catch(() => ({}))

      if (!resp.ok) {
        throw new Error(data?.message || 'Échec de la création du défi')
      }

      setSuccess('Défi créé avec succès !')
      // Rediriger vers la page du défi créé si l'ID est renvoyé
      const newId = data?.data?.id
      if (newId) {
        setTimeout(() => navigate(`/challenges/${newId}`), 600)
      } else {
        setTimeout(() => navigate('/'), 600)
      }
    } catch (e) {
      console.error(e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="challenge-create-section">
      <h2>Créer un défi</h2>

      <form className="challenge-create-form" onSubmit={handleSubmit}>
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

        {fetchingCats ? (
          <div>Chargement des catégories…</div>
        ) : categories.length > 0 ? (
          <label>
            Catégorie
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
        ) : (
          <p className="error">Aucune catégorie disponible. Vérifiez votre base de données.</p>
        )}

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

        <button type="submit" disabled={!isValid || loading}>
          {loading ? 'Création…' : 'Créer le défi'}
        </button>
      </form>

      <style>{`
        .challenge-create-section { max-width: 720px; margin: 0 auto; padding: 24px; }
        .challenge-create-form { display: grid; gap: 16px; }
        .challenge-create-form label { display: grid; gap: 8px; }
        .challenge-create-form input, .challenge-create-form textarea, .challenge-create-form select { padding: 10px; border: 1px solid #ccc; border-radius: 6px; }
        .dates-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .error { color: #b00020; }
        .success { color: #0a8; }
        button { padding: 10px 14px; border-radius: 6px; border: none; background: #1f7aec; color: white; cursor: pointer; }
        button[disabled] { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </section>
  )
}
