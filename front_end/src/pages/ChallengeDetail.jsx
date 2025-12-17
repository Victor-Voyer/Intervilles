import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CkEditor from '../components/CkEditor';
import '../styles/ChallengeDetail.css';
import '../styles/Comments.css';

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participationContent, setParticipationContent] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role')?.toUpperCase();

  useEffect(() => {
    fetchChallenge();
  }, [id]);

  useEffect(() => {
    setParticipationContent('');
    setCommentContent('');
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [id]);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/intervilles/challenges/${id}`
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du défi');
      }

      const data = await response.json();
      setChallenge(data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching challenge:', err);
      setError(err.message);
      setChallenge(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await fetch(
        `http://localhost:3000/intervilles/challenges/${id}/comments`
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commentaires');
      }

      const data = await response.json();
      setComments(data.data || []);
      setCommentsError(null);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setCommentsError(err.message);
    } finally {
      setCommentsLoading(false);
    }
  };

  const extractPlainText = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const hasCommentContent = () =>
    extractPlainText(commentContent).trim().length > 0;

  const handleAddComment = async () => {
    if (!token) {
      alert('Vous devez être connecté pour commenter');
      return;
    }

    if (!hasCommentContent()) {
      alert('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      setCommentSubmitting(true);
      const response = await fetch(
        `http://localhost:3000/intervilles/challenges/${id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: commentContent }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de l'ajout du commentaire"
        );
      }

      setCommentContent('');
      await fetchComments();
      setCommentsError(null);
    } catch (err) {
      console.error('Error adding comment:', err);
      setCommentsError(err.message);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) {
      alert('Vous devez être connecté pour supprimer un commentaire');
      return;
    }

    if (
      !window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/intervilles/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Erreur lors de la suppression du commentaire'
        );
      }

      await fetchComments();
      setCommentsError(null);
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(err.message);
    }
  };

  const canDeleteComment = (comment) => {
    if (!userId) return false;
    const isAuthor = String(comment.user_id) === String(userId);
    const isModerator = userRole === 'MODERATOR';
    const isAdmin = userRole === 'ADMIN';
    return isAuthor || isModerator || isAdmin;
  };

  const handleParticipate = () => {
    // Logique de participation à implémenter plus tard
    console.log('Participer au défi:', challenge.id, participationContent);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="challenge-detail-container">
        <div className="loading-message">
          <p>Chargement du défi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="challenge-detail-container">
        <div className="error-message">
          <p>Erreur : {error}</p>
          <button onClick={handleBack} className="back-button">
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="challenge-detail-container">
        <div className="error-message">
          <p>Défi non trouvé</p>
          <button onClick={handleBack} className="back-button">
            Retour
          </button>
        </div>
      </div>
    );
  }

  const canEdit = () => {
    return (
      userId &&
      challenge?.user_id &&
      (String(userId) === String(challenge.user_id) ||
        userRole === 'ADMIN' ||
        userRole === 'MODERATOR')
    );
  };

  return (
    <div className="challenge-detail-container">
      <div className="header-actions">
        <button onClick={handleBack} className="back-button">
          ← Retour
        </button>
        {canEdit() && (
          <button
            onClick={() => navigate(`/challenges/${id}/edit`)}
            className="edit-button"
          >
            ✏️ Modifier
          </button>
        )}
      </div>

      <div className="challenge-detail-card">
        <div className="challenge-detail-header">
          <h1 className="challenge-detail-title">{challenge.title}</h1>
          <span className={`challenge-status status-${challenge.status}`}>
            {challenge.status === 'open' && 'Ouvert'}
            {challenge.status === 'in_progress' && 'En cours'}
            {challenge.status === 'closed' && 'Fermé'}
          </span>
        </div>

        <div className="challenge-detail-content">
          <div className="challenge-info-section">
            <h2>Description</h2>
            <p className="challenge-description">{challenge.description}</p>
          </div>

          <div className="challenge-info-section">
            <h2>Informations</h2>
            <div className="challenge-meta">
              {challenge.category && (
                <div className="meta-item">
                  <span className="meta-label">Catégorie:</span>
                  <span className="meta-value">{challenge.category.name}</span>
                </div>
              )}
              {challenge.user && (
                <div className="meta-item">
                  <span className="meta-label">Créé par:</span>
                  <span className="meta-value">{challenge.user.username}</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">Date de début:</span>
                <span className="meta-value">
                  {new Date(challenge.start_date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Date de fin:</span>
                <span className="meta-value">
                  {new Date(challenge.end_date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Créé le:</span>
                <span className="meta-value">
                  {new Date(challenge.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {challenge.status === 'open' && (
            <div className="challenge-actions">
              <div className="participation-editor">
                <h2 className="comments-title">
                  Commentaires ({comments.length})
                </h2>

                {commentsError && (
                  <div className="comments-error">
                    <p>{commentsError}</p>
                  </div>
                )}

                {token ? (
                  <div className="comment-form">
                    <CkEditor
                      value={commentContent}
                      placeholder="Écrivez votre commentaire..."
                      onChange={setCommentContent}
                      onSubmit={handleAddComment}
                      submitLabel={commentSubmitting ? 'Envoi...' : 'Envoyer'}
                      submitDisabled={commentSubmitting || !hasCommentContent()}
                    />
                  </div>
                ) : (
                  <div className="comment-login-prompt">
                    <p>Vous devez être connecté pour commenter</p>
                  </div>
                )}

                <div className="comments-list">
                  {commentsLoading ? (
                    <p className="comments-loading">
                      Chargement des commentaires...
                    </p>
                  ) : comments.length === 0 ? (
                    <p className="no-comments">
                      Aucun commentaire pour le moment
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                          <span className="comment-author">
                            {comment.user?.username || 'Utilisateur inconnu'}
                          </span>
                          <span className="comment-date">
                            {comment.created_at
                              ? new Date(comment.created_at).toLocaleDateString(
                                  'fr-FR',
                                  {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )
                              : ''}
                          </span>
                        </div>
                        <div
                          className="comment-content"
                          dangerouslySetInnerHTML={{ __html: comment.content }}
                        />
                        {canDeleteComment(comment) && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="comment-delete-button"
                            title="Supprimer le commentaire"
                          >
                            🗑️ Supprimer
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <button
                onClick={handleParticipate}
                className="participate-button"
              >
                Participer au défi
              </button>
            </div>
          )}

          {/* Section des commentaires */}
          <div className="comments-section"></div>
        </div>
      </div>
    </div>
  );
}
