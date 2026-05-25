import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const ForumContext = createContext(null)

export function ForumProvider({ children, user }) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('transi_forum')
      if (saved) setPosts(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('transi_forum', JSON.stringify(posts))
  }, [posts])

  const addPost = useCallback((title, content, img) => {
    const post = {
      id: Date.now().toString(36),
      title: title.trim(),
      content: content.trim(),
      img: img || '',
      author: user?.name || 'Anónimo',
      authorEmail: user?.email || '',
      date: Date.now(),
      comments: [],
    }
    setPosts(prev => [post, ...prev])
  }, [user])

  const addComment = useCallback((postId, text) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return {
        ...p,
        comments: [...p.comments, {
          id: Date.now().toString(36),
          text: text.trim(),
          author: user?.name || 'Anónimo',
          date: Date.now(),
        }]
      }
    }))
  }, [user])

  const deletePost = useCallback((postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }, [])

  const value = useMemo(() => ({ posts, addPost, addComment, deletePost }), [posts, addPost, addComment, deletePost])

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
