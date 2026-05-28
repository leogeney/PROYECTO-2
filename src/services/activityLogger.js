import { Firestore } from './firestore'
import { auth } from '../config/firebase'

export const ActivityLogger = {
  async log(action, detail = {}) {
    const user = auth.currentUser
    if (!user) return
    const entry = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email,
      action,
      detail,
      timestamp: Date.now(),
    }
    try {
      await Firestore.add('activity_log', entry)
    } catch {}
  },
}
