
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
   apiKey: "AIzaSyCIgR7dEos95gwCOO5HrIq5sm8vMM7MLLI",
  authDomain: "testlogin-23786.firebaseapp.com",
  projectId: "testlogin-23786",
  storageBucket: "testlogin-23786.firebasestorage.app",
  messagingSenderId: "207617437040",
  appId: "1:207617437040:web:ac86938d436ab7a68bb3b5",
  measurementId: "G-SG09VHG9WQ"
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig)

// Auth
export const auth = getAuth(app)

// Proveedor de Google — configura el idioma y los permisos que necesitas
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
googleProvider.addScope('profile')
googleProvider.addScope('email')

export const db = getFirestore(app)

export default app

// ─────────────────────────────────────────────────────────────────
// Variables de entorno (.env en la raíz del proyecto)
// ─────────────────────────────────────────────────────────────────
// VITE_FIREBASE_API_KEY=AIzaSy...
// VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
// VITE_FIREBASE_PROJECT_ID=tu-proyecto
// VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
// VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
// VITE_FIREBASE_APP_ID=1:123456789:web:abc123
