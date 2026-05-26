import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { Firestore } from '../services/firestore'

const ForumContext = createContext(null)

const OLD_KEY = 'transi_forum'

function storageKey(userId) {
  return userId ? `transi_forum_${userId}` : 'transi_forum_guest'
}

function loadLocal(userId) {
  try {
    const key = storageKey(userId)
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
    if (userId) {
      const old = localStorage.getItem(OLD_KEY)
      if (old) {
        const data = JSON.parse(old)
        localStorage.setItem(key, old)
        localStorage.removeItem(OLD_KEY)
        return data
      }
    }
  } catch {}
  return null
}

export function ForumProvider({ children, user }) {
  const [posts, setPosts] = useState([])
  const [userId, setUserId] = useState(null)
  const initRef = useRef(true)
  const prevUserIdRef = useRef(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fb) => {
      setUserId(fb?.uid || null)
    })
    return unsub
  }, [])

  // Trigger reload on every userId change
  useEffect(() => {
    if (prevUserIdRef.current !== userId) {
      initRef.current = false
    }
    prevUserIdRef.current = userId
  }, [userId])

  useEffect(() => {
    if (initRef.current) return
    if (!userId) { initRef.current = true; return }
    ;(async () => {
      let loaded = false
      try {
        const data = await Firestore.list('forum_posts')
        if (data && data.length > 0) {
          setPosts(data)
          loaded = true
        }
      } catch {}
      if (!loaded) {
        const local = loadLocal(userId)
        if (local) setPosts(local)
      }
      initRef.current = true
    })()
  }, [userId])

  useEffect(() => {
    if (!initRef.current) return
    localStorage.setItem(storageKey(userId), JSON.stringify(posts))
  }, [posts, userId])

  const addPost = useCallback(async (title, content, img, category) => {
    const post = {
      title: title.trim(),
      content: content.trim(),
      img: img || '',
      author: user?.name || 'Anónimo',
      authorEmail: user?.email || '',
      authorId: userId || '',
      date: Date.now(),
      comments: [],
      category: category || '💬 Charla',
      reactions: { love: 0, like: 0, star: 0, party: 0, idea: 0 },
    }
    if (userId) {
      try {
        const id = await Firestore.add('forum_posts', post)
        setPosts(prev => [{ id, ...post }, ...prev])
        return
      } catch {}
    }
    const localPost = { id: Date.now().toString(36), ...post }
    setPosts(prev => [localPost, ...prev])
  }, [user, userId])

  const addComment = useCallback(async (postId, text) => {
    const comment = {
      id: Date.now().toString(36),
      text: text.trim(),
      author: user?.name || 'Anónimo',
      authorId: userId || '',
      date: Date.now(),
    }
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const updated = { ...p, comments: [...p.comments, comment] }
      if (userId) {
        Firestore.update('forum_posts', postId, { comments: updated.comments }).catch(() => {})
      }
      return updated
    }))
  }, [user, userId])

  const deletePost = useCallback(async (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
    if (userId) {
      Firestore.del('forum_posts', postId).catch(() => {})
    }
  }, [userId])

  const reactToPost = useCallback(async (postId, reactionType) => {
    const uid = userId || 'guest'
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      
      const rx = p.reactions || { love: 0, like: 0, star: 0, party: 0, idea: 0 }
      const userRx = p.userReactions || {}
      
      const prevReaction = userRx[uid]
      const updatedUserReactions = { ...userRx }
      const updatedReactions = { ...rx }
      
      if (prevReaction === reactionType) {
        // Si el usuario vuelve a dar click a la misma reacción, se la quitamos (Toggle off)
        delete updatedUserReactions[uid]
        updatedReactions[reactionType] = Math.max(0, (rx[reactionType] || 0) - 1)
      } else {
        // Si tenía otra reacción diferente, primero decrementamos la anterior
        if (prevReaction) {
          updatedReactions[prevReaction] = Math.max(0, (rx[prevReaction] || 0) - 1)
        }
        // Asignamos la nueva reacción e incrementamos su contador
        updatedUserReactions[uid] = reactionType
        updatedReactions[reactionType] = (rx[reactionType] || 0) + 1
      }
      
      const updated = { ...p, reactions: updatedReactions, userReactions: updatedUserReactions }
      if (userId) {
        Firestore.update('forum_posts', postId, { 
          reactions: updatedReactions, 
          userReactions: updatedUserReactions 
        }).catch(() => {})
      }
      return updated
    }))
  }, [userId])

  const value = useMemo(() => ({ posts, addPost, addComment, deletePost, reactToPost, userId }), [posts, addPost, addComment, deletePost, reactToPost, userId])

  return (
    <ForumContext.Provider value={value}>
      {children}
    </ForumContext.Provider>
  )
}

export function useForum() {
  const ctx = useContext(ForumContext)
  if (!ctx) throw new Error('useForum must be used within ForumProvider')
  return ctx
}
