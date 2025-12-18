import { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import '../styles/chat.css'

const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000/intervilles').replace(/\/$/, '')
const SOCKET_ORIGIN = API_BASE.replace(/\/intervilles$/, '')

function safeDate(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function ChatBox() {
  const [scope, setScope] = useState('global')
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [typingUsers, setTypingUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const socketRef = useRef(null)
  const endRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const token = useMemo(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token') || localStorage.getItem('authToken')
  }, [])

  const canUsePromo = useMemo(() => Boolean(token), [token])

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadHistory = async (nextScope) => {
    if (!token) {
      setError('Connecte-toi pour accéder au chat.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${API_BASE}/chat/messages?scope=${encodeURIComponent(nextScope)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(payload?.message || 'Impossible de charger les messages')
      }

      setMessages(payload?.data || [])
      setTypingUsers([])
    } catch (e) {
      setError(e.message || 'Erreur de chargement')
      setMessages([])
    } finally {
      setLoading(false)
      setTimeout(scrollToBottom, 50)
    }
  }

  useEffect(() => {
    if (!token) return

    const socket = io(SOCKET_ORIGIN, {
      transports: ['websocket'],
      auth: { token },
    })

    socketRef.current = socket

    socket.on('connect_error', (err) => {
      setError(err?.message || 'Socket error')
    })

    socket.on('chat:message', (msg) => {
      if (!msg || msg.scope !== scope) return
      setMessages((prev) => [...prev, msg])
      setTimeout(scrollToBottom, 10)
    })

    socket.on('chat:typing', (payload) => {
      if (!payload || payload.scope !== scope) return
      const username = payload.username
      if (!username) return

      setTypingUsers((prev) => {
        if (prev.includes(username)) return prev
        return [...prev, username]
      })

      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u !== username))
      }, 1200)
    })

    socket.on('chat:user-joined', (payload) => {
      if (!payload || payload.scope !== scope) return
    })

    socket.on('chat:user-left', (payload) => {
      if (!payload || payload.scope !== scope) return
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [token, scope])

  useEffect(() => {
    loadHistory(scope)
  }, [scope])

  const handleScopeChange = (nextScope) => {
    if (nextScope === 'promo' && !canUsePromo) return
    setScope(nextScope)
  }

  const emitTyping = () => {
    const socket = socketRef.current
    if (!socket) return
    socket.emit('chat:typing', { scope })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {}, 250)
  }

  const handleSend = (e) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Connecte-toi pour envoyer un message.')
      return
    }

    const clean = text.trim()
    if (!clean) return

    const socket = socketRef.current
    if (!socket) {
      setError('Socket non connecté.')
      return
    }

    socket.emit('chat:send', { scope, content: clean })
    setText('')
  }

  const typingLine = useMemo(() => {
    if (typingUsers.length === 0) return ''
    if (typingUsers.length === 1) return `${typingUsers[0]} écrit...`
    return `${typingUsers.slice(0, 2).join(', ')} écrivent...`
  }, [typingUsers])

  return (
    <section className="chat-wrap">
      <header className="chat-header">
        <div>
          <h1 className="chat-title">Chat</h1>
        </div>

        <div className="chat-tabs">
          <button
            type="button"
            className={`chat-tab ${scope === 'global' ? 'is-active' : ''}`}
            onClick={() => handleScopeChange('global')}
          >
            Général
          </button>

          <button
            type="button"
            className={`chat-tab ${scope === 'promo' ? 'is-active' : ''}`}
            onClick={() => handleScopeChange('promo')}
            disabled={!canUsePromo}
            title={!canUsePromo ? 'Connexion requise' : ''}
          >
            Promo
          </button>
        </div>
      </header>

      <div className="chat-body">
        {loading ? (
          <div className="chat-state">Chargement…</div>
        ) : error ? (
          <div className="chat-state chat-error">{error}</div>
        ) : (
          <>
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="chat-empty">Aucun message pour l’instant.</div>
              ) : (
                messages.map((m, idx) => {
                  const user = m?.user ?? {}
                  const username = user?.username ?? m?.username ?? 'User'
                  const date = safeDate(m?.date || m?.created_at || m?.createdAt)

                  return (
                    <div className="chat-message" key={m?.id ?? `msg-${idx}`}>
                      <div className="chat-message-meta">
                        <span className="chat-message-user">{username}</span>
                        <span className="chat-message-date">{date}</span>
                      </div>
                      <div className="chat-message-content">{m?.content ?? ''}</div>
                    </div>
                  )
                })
              )}
              <div ref={endRef} />
            </div>

            <div className="chat-typing">{typingLine}</div>

            <form className="chat-form" onSubmit={handleSend}>
              <input
                className="chat-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onInput={emitTyping}
                placeholder="Écris ton message..."
                maxLength={1000}
              />
              <button className="chat-send" type="submit">
                Envoyer
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
