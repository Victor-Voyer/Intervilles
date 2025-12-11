const formatDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

const toSlug = (value) => (value ? value.toLowerCase().replace(/\s+/g, '-') : '')

const defaultCounters = { total: 0, open: 0, inProgress: 0, resolved: 0 }

function Challenges({ challenges = [], onBackClick, onViewChallenge }) {
  const counters = challenges.reduce(
    (acc, ticket) => {
      const status = ticket?.status?.status?.value
      if (status === 'Open') acc.open += 1
      if (status === 'In Progress') acc.inProgress += 1
      if (status === 'Resolved') acc.resolved += 1
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
                <div className="stat-number">{counters.resolved}</div>
                <div className="stat-label">Terminés</div>
              </div>
            </div>

            <div className="tickets-table-container">
              <table className="tickets-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Auteur</th>
                    <th>Statut</th>
                    <th>Type</th>
                    <th>Stack</th>
                    <th>Créé le</th>
                    <th>Commentaires</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {challenges.map((challenge, index) => {
                    const statusValue = challenge?.status?.status?.value ?? ''
                    const typeValue = challenge?.type?.value ?? ''
                    const stackValue = challenge?.stack?.value ?? ''
                    const createdAt = formatDateTime(challenge?.createdAt)
                    const commentsCount = challenge?.comments?.length ?? 0
                    const user = challenge?.user ?? {}

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
                            <div className="user-name">
                              {user.firstName ?? ''} {user.lastName ?? ''}
                            </div>
                            <div className="user-email">{user.email ?? ''}</div>
                            {user.nickname ? <div className="user-nickname">@{user.nickname}</div> : null}
                          </div>
                        </td>
                        <td className="ticket-status">
                          <span className={`status-badge status-${toSlug(statusValue)}`}>{statusValue || '—'}</span>
                        </td>
                        <td className="ticket-type">
                          <span className={`type-badge type-${toSlug(typeValue)}`}>{typeValue || '—'}</span>
                        </td>
                        <td className="ticket-stack">
                          <span className="stack-badge">{stackValue || '—'}</span>
                        </td>
                        <td className="ticket-created">{createdAt || '—'}</td>
                        <td className="ticket-comments">
                          <span className="comments-count">
                            <i className="fas fa-comments" aria-hidden="true"></i>
                            {commentsCount}
                          </span>
                        </td>
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
