const defaultCounters = { total: 0, pending: 0 }

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('fr-FR', { dateStyle: 'short' })
}

function Users({ users = [], onBackClick, onValidateAccounts, onViewUser, onEditUser }) {
  const counters = users.reduce(
    (acc, user) => {
      const isValidated = Boolean(user?.validated_at)
      if (!isValidated) acc.pending += 1
      acc.total += 1
      return acc
    },
    { ...defaultCounters }
  )

  const renderBackButton = () => {
    if (onBackClick) {
      return (
        <button type="button" className="btn btn-secondary" onClick={onBackClick}>
          <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to Dashboard
        </button>
      )
    }
    return (
      <a href="/admin" className="btn btn-secondary">
        <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to Dashboard
      </a>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Gestion des utilisateurs</h1>
        <p className="admin-subtitle">Suivre et gérer les comptes de l&apos;application</p>
        {renderBackButton()}
      </div>

      <div className="admin-content">
        {counters.pending > 0 ? (
          <div
            className="alert alert-warning"
            style={{ background: '#fff3cd', border: '1px solid #ffc107', padding: 20, borderRadius: 8, marginBottom: 30 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <i className="fas fa-exclamation-circle" style={{ fontSize: 24, color: '#856404' }} aria-hidden="true"></i>
                <div>
                  <h3 style={{ margin: 0, color: '#856404' }}>
                    <strong>{counters.pending}</strong> compte(s) en attente de validation
                  </h3>
                  <p style={{ margin: '5px 0 0', color: '#856404' }}>Des nouveaux comptes nécessitent votre attention</p>
                </div>
              </div>
              {onValidateAccounts ? (
                <button
                  type="button"
                  onClick={onValidateAccounts}
                  style={{ background: '#ffc107', color: '#000', padding: '12px 24px', borderRadius: 6, border: 'none', fontWeight: 600 }}
                >
                  <i className="fas fa-check-circle" aria-hidden="true"></i> Valider les comptes
                </button>
              ) : (
                <a
                  href="/admin/validate-account"
                  style={{ background: '#ffc107', color: '#000', padding: '12px 24px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}
                >
                  <i className="fas fa-check-circle" aria-hidden="true"></i> Valider les comptes
                </a>
              )}
            </div>
          </div>
        ) : null}

        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-users" aria-hidden="true"></i>
            </div>
            <h3>Aucun utilisateur</h3>
            <p>Il n&apos;y a actuellement aucun utilisateur.</p>
          </div>
        ) : (
          <>
            <div className="users-stats">
              <div className="stat-card">
                <div className="stat-number">{counters.total}</div>
                <div className="stat-label">Utilisateurs</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{counters.pending}</div>
                <div className="stat-label">En attente</div>
              </div>
            </div>

            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Nom complet</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Promo</th>
                    <th>Validation compte</th>
                    <th>Email vérifié</th>
                    <th>Créé le</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const roleName = user?.role?.name ?? ''
                    const promoName = user?.promo?.name ?? ''
                    const isValidated = Boolean(user?.validated_at)
                    const isVerified = Boolean(user?.verified_at)
                    const createdAt = formatDate(user?.created_at || user?.createdAt)

                    return (
                      <tr className="user-row" key={user?.id ?? `user-${index}`}>
                        <td>
                          <img
                            src={user?.avatar_url || '/default-avatar.png'}
                            alt="avatar"
                            className="avatar-circle"
                          />
                        </td>
                        <td className="user-id">#{user?.id ?? '—'}</td>
                        <td className="user-username">{user?.username ?? ''}</td>
                        <td className="user-info">
                          <div className="user-details">
                            <div className="user-name">
                              {user?.first_name ?? ''} {user?.last_name ?? ''}
                            </div>
                          </div>
                        </td>
                        <td className="user-contact">
                          <div className="contact-info">
                            <div className="user-email">{user?.email ?? ''}</div>
                          </div>
                        </td>
                        <td className="user-role">
                          <span className={`role-badge role-${(roleName || 'pending').toLowerCase()}`}>
                            {roleName || '—'}
                          </span>
                        </td>
                        <td className="user-promo">
                          <span className="stack-badge">{promoName || '—'}</span>
                        </td>
                        <td className="user-status">
                          {isValidated ? (
                            <span className="status-badge" style={{ background: '#d4edda', color: '#155724', padding: '6px 12px', borderRadius: 20, fontSize: 12 }}>
                              <i className="fas fa-check-circle" aria-hidden="true"></i> Validé
                            </span>
                          ) : (
                            <span className="status-badge" style={{ background: '#fff3cd', color: '#856404', padding: '6px 12px', borderRadius: 20, fontSize: 12 }}>
                              <i className="fas fa-clock" aria-hidden="true"></i> En attente
                            </span>
                          )}
                        </td>
                        <td className="user-verified">
                          {isVerified ? (
                            <span className="status-badge" style={{ background: '#d1fae5', color: '#065f46', padding: '6px 12px', borderRadius: 20, fontSize: 12 }}>
                              <i className="fas fa-envelope-open" aria-hidden="true"></i> Vérifié
                            </span>
                          ) : (
                            <span className="status-badge" style={{ background: '#fee2e2', color: '#991b1b', padding: '6px 12px', borderRadius: 20, fontSize: 12 }}>
                              <i className="fas fa-envelope" aria-hidden="true"></i> Non vérifié
                            </span>
                          )}
                        </td>
                        <td className="user-created">{createdAt || '—'}</td>
                        <td className="user-actions">
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="btn-admin btn-sm btn-info"
                              title="Voir l'utilisateur"
                              onClick={() => onViewUser?.(user)}
                            >
                              <i className="fas fa-eye" aria-hidden="true"></i> Voir
                            </button>
                            <button
                              type="button"
                              className="btn-admin btn-sm btn-warning"
                              title="Éditer l'utilisateur"
                              onClick={() => onEditUser?.(user)}
                            >
                              <i className="fas fa-edit" aria-hidden="true"></i> Éditer
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

export default Users
