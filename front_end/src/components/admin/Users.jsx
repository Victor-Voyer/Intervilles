const defaultCounters = { total: 0, pending: 0 }

function Users({ users = [], onBackClick, onValidateAccounts, onViewUser, onEditUser }) {
  const counters = users.reduce(
    (acc, user) => {
      if (!user?.isValidated) acc.pending += 1
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
        <h1 className="admin-title">User Management</h1>
        <p className="admin-subtitle">Manage and monitor all application users</p>
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
            <h3>No users found</h3>
            <p>There are currently no users in the system.</p>
          </div>
        ) : (
          <>
            <div className="users-stats">
              <div className="stat-card">
                <div className="stat-number">{counters.total}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>

            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Avatar</th>
                    <th>User Info</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Tickets</th>
                    <th>Comments</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const roleTitle = user?.role?.title ?? ''
                    const ticketsCount = user?.tickets?.length ?? 0
                    const commentsCount = user?.comments?.length ?? 0
                    const isValidated = Boolean(user?.isValidated)

                    const renderAvatar = () => {
                      if (user?.avatar) {
                        return <img src={user.avatar} alt={user.nickname ?? ''} className="avatar-img" />
                      }
                      return (
                        <div className="avatar-placeholder">
                          <i className="fas fa-user" aria-hidden="true"></i>
                        </div>
                      )
                    }

                    return (
                      <tr className="user-row" key={user?.id ?? `user-${index}`}>
                        <td className="user-id">#{user?.id ?? '—'}</td>
                        <td className="user-avatar">{renderAvatar()}</td>
                        <td className="user-info">
                          <div className="user-details">
                            <div className="user-name">
                              {user?.firstName ?? ''} {user?.lastName ?? ''}
                            </div>
                            {user?.nickname ? <div className="user-nickname">@{user.nickname}</div> : null}
                          </div>
                        </td>
                        <td className="user-contact">
                          <div className="contact-info">
                            <div className="user-email">{user?.email ?? ''}</div>
                          </div>
                        </td>
                        <td className="user-role">
                          {roleTitle ? (
                            <span className={`role-badge role-${roleTitle.toLowerCase()}`}>{roleTitle}</span>
                          ) : (
                            <span className="role-badge role-pending" style={{ background: '#ffc107', color: '#000' }}>
                              <i className="fas fa-clock" aria-hidden="true"></i> Non validé
                            </span>
                          )}
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
                        <td className="user-tickets">
                          <span className="tickets-count">
                            <i className="fas fa-ticket-alt" aria-hidden="true"></i>
                            {ticketsCount}
                          </span>
                        </td>
                        <td className="user-comments">
                          <span className="comments-count">
                            <i className="fas fa-comments" aria-hidden="true"></i>
                            {commentsCount}
                          </span>
                        </td>
                        <td className="user-actions">
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="btn-admin btn-sm btn-info"
                              title="View User"
                              onClick={() => onViewUser?.(user)}
                            >
                              <i className="fas fa-eye" aria-hidden="true"></i> View
                            </button>
                            <button
                              type="button"
                              className="btn-admin btn-sm btn-warning"
                              title="Edit User"
                              onClick={() => onEditUser?.(user)}
                            >
                              <i className="fas fa-edit" aria-hidden="true"></i> Edit
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
