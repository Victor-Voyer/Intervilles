import { useState, useEffect } from 'react';
import '../styles/Comments.css';

export default function Comments({ challengeId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role')?.toUpperCase();

  useEffect(() => {
    fetchComments();
  }, [challengeId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/intervilles/challenges/${challengeId}/comments`
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commentaires');
      }

      const data = await response.json();
      setComments(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Vous devez être connecté pour commenter');
      return;
    }

    if (!newComment.trim()) {
      alert('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(
        `http://localhost:3000/intervilles/challenges/${challengeId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout du commentaire');
      }

      const data = await response.json();
      
      // Recharger les commentaires pour avoir les données complètes
      await fetchComments();
      setNewComment('');
      setError(null);
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
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
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      // Recharger les commentaires
      await fetchComments();
      setError(null);
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

  if (loading) {
    return (
      <div className="comments-section">
        <p className="comments-loading">Chargement des commentaires...</p>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <h2 className="comments-title">
        Commentaires ({comments.length})
      </h2>

      {error && (
        <div className="comments-error">
          <p>{error}</p>
        </div>
      )}

      {/* Formulaire d'ajout de commentaire */}
      {token ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Écrivez votre commentaire..."
            className="comment-textarea"
            rows="4"
            disabled={submitting}
          />
          <button
            type="submit"
            className="comment-submit-button"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? 'Envoi...' : 'Envoyer'}
          </button>
        </form>
      ) : (
        <div className="comment-login-prompt">
          <p>Vous devez être connecté pour commenter</p>
        </div>
      )}

      {/* Liste des commentaires */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">Aucun commentaire pour le moment</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">
                  {comment.user?.username || 'Utilisateur inconnu'}
                </span>
                <span className="comment-date">
                  {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="comment-content">
                <p>{comment.content}</p>
              </div>
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
  );
}
