const formatDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('fr-FR', { dateStyle: 'short' })
}

const statusLabels = {
  open: 'Ouvert',
  in_progress: 'En cours',
  closed: 'Fermé',
}

const defaultCounters = { total: 0, open: 0, inProgress: 0, closed: 0 }

function Challenges({ challenges = [], onBackClick, onViewChallenge }) {
  const counters = challenges.reduce(
    (acc, challenge) => {
      const status = challenge?.status
      if (status === 'open') acc.open += 1
      if (status === 'in_progress') acc.inProgress += 1
      if (status === 'closed') acc.closed += 1
      acc.total += 1
      return acc
    },
    { ...defaultCounters }
  )

  const renderBackButton = () => {
    if (onBackClick) {
      return (
        <button type="button" className="btn btn-secondary" onClick={onBackClick}>
          <i className="fas fa-arrow-left" aria-hidden="true"></i> Retour au dashboard
        </button>
      )
    }
    return (
      <a href="/admin" className="btn btn-secondary">
        <i className="fas fa-arrow-left" aria-hidden="true"></i> Retour au dashboard
      </a>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Challenge Management</h1>
        <p className="admin-subtitle">Gérer et suivre tous les challenges</p>
        {renderBackButton()}
      </div>

      <div className="admin-content">
        {challenges.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-ticket-alt" aria-hidden="true"></i>
            </div>
            <h3>Aucun challenge trouvé</h3>
            <p>Il n&apos;y a actuellement aucun challenge.</p>
          </div>
        ) : (
          <>
            <div className="tickets-stats">
              <div className="stat-card">
                <div className="stat-number">{counters.total}</div>
                <div className="stat-label">Challenges totaux</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{counters.open}</div>
                <div className="stat-label">Ouverts</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{counters.inProgress}</div>
                <div className="stat-label">En cours</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{counters.closed}</div>
                <div className="stat-label">Fermés</div>
              </div>
            </div>

            <div className="tickets-table-container">
              <table className="tickets-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Auteur</th>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th>Début</th>
                    <th>Fin</th>
                    <th>Créé le</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {challenges.map((challenge, index) => {
                    const statusValue = challenge?.status ?? ''
                    const createdAt = formatDateTime(challenge?.created_at || challenge?.createdAt)
                    const startDate = formatDateTime(challenge?.start_date)
                    const endDate = formatDateTime(challenge?.end_date)
                    const user = challenge?.user ?? {}
                    const category = challenge?.category ?? {}

                    return (
                      <tr className="ticket-row" key={challenge?.id ?? `challenge-${index}`}>
                        <td className="ticket-id">#{challenge?.id ?? '—'}</td>
                        <td className="ticket-title">
                          <div className="title-content">
                            <strong>{challenge?.title ?? 'Sans titre'}</strong>
                          </div>
                        </td>
                        <td className="ticket-user">
                          <div className="user-info">
                            <div className="user-name">{user.username ?? ''}</div>
                          </div>
                        </td>
                        <td className="ticket-category">
                          <span className="stack-badge">{category?.name ?? '—'}</span>
                        </td>
                        <td className="ticket-status">
                          <span className={`status-badge status-${statusValue || 'unknown'}`}>
                            {statusLabels[statusValue] ?? statusValue ?? '—'}
                          </span>
                        </td>
                        <td className="ticket-start">{startDate || '—'}</td>
                        <td className="ticket-end">{endDate || '—'}</td>
                        <td className="ticket-created">{createdAt || '—'}</td>
                        <td className="ticket-actions">
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="btn-admin btn-info"
                              title="Voir le challenge"
                              onClick={() => onViewChallenge?.(challenge)}
                            >
                              <i className="fas fa-eye" aria-hidden="true"></i> Voir
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Challenges
