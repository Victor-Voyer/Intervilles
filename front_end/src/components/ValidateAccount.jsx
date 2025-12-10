function ValidateAccount({ pendingUsers = [], onBackClick, onApproveUser, onRejectUser, onViewUser }) {
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

  const handleApprove = (user) => {
    if (!onApproveUser) return
    const confirmed = window.confirm('Are you sure you want to approve this account?')
    if (confirmed) onApproveUser(user)
  }

  const handleReject = (user) => {
    if (!onRejectUser) return
    const confirmed = window.confirm('Are you sure you want to reject and delete this account?')
    if (confirmed) onRejectUser(user)
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Account validation</h1>
        <p className="admin-subtitle">Approve or reject new user accounts</p>
        {renderBackButton()}
      </div>

      <div className="admin-content">
        {pendingUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-check-circle" aria-hidden="true"></i>
            </div>
            <h3>No pending accounts</h3>
            <p>All accounts have been processed.</p>
          </div>
        ) : (
          <>
            <div className="validation-stats">
              <div className="stat-card stat-warning">
                <div className="stat-number">{pendingUsers.length}</div>
                <div className="stat-label">Pending accounts</div>
              </div>
            </div>

            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Avatar</th>
                    <th>Information</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user, index) => {
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
                      <tr className="user-row" key={user?.id ?? `pending-user-${index}`}>
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
                        <td className="user-actions">
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="btn-admin btn-success"
                              title="Approve account"
                              onClick={() => handleApprove(user)}
                            >
                              <i className="fas fa-check" aria-hidden="true"></i> Approve
                            </button>
                            <button
                              type="button"
                              className="btn-admin btn-danger"
                              title="Reject account"
                              onClick={() => handleReject(user)}
                            >
                              <i className="fas fa-times" aria-hidden="true"></i> Reject
                            </button>
                            <button
                              type="button"
                              className="btn-admin btn-info"
                              title="View details"
                              onClick={() => onViewUser?.(user)}
                            >
                              <i className="fas fa-eye" aria-hidden="true"></i> Details
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

export default ValidateAccount
