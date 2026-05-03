// components/Login/useLogin.js
import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth, googleProvider } from '../../config/firebase'
import { firebaseErrorMessage } from '../../utils/firebaseErrors'

export function useLogin(onLoginSuccess) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors]           = useState({})
  const [serverError, setServerError] = useState('')

  const [loading, setLoading]                   = useState(false)
  const [registerLoading, setRegisterLoading]   = useState(false)
  const [googleLoading, setGoogleLoading]       = useState(false)
  const [resetLoading, setResetLoading]         = useState(false)

  const [registerSuccess, setRegisterSuccess]   = useState(false)
  const [resetSent, setResetSent]               = useState(false)



  // ── Helpers ────────────────────────────────────────────────────
  const clearServerError = () => { if (serverError) setServerError('') }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    clearServerError()
  }

  // ── Validaciones ───────────────────────────────────────────────
  const validateEmail = (email) => {
    if (!email) return 'El correo es obligatorio'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresa un correo válido'
    return null
  }

  const validatePassword = (password, minLength = 6) => {
    if (!password) return 'La contraseña es obligatoria'
    if (password.length < minLength) return `Mínimo ${minLength} caracteres`
    return null
  }

  const validateLoginForm = () => {
    const newErrors = {}
    const emailErr    = validateEmail(form.email)
    const passwordErr = validatePassword(form.password)
    if (emailErr)    newErrors.email    = emailErr
    if (passwordErr) newErrors.password = passwordErr
    return newErrors
  }

  const validateRegisterForm = () => {
    const newErrors = {}
    if (!form.name?.trim()) newErrors.name = 'El nombre es obligatorio'
    const emailErr    = validateEmail(form.email)
    const passwordErr = validatePassword(form.password, 8)
    if (emailErr)    newErrors.email    = emailErr
    if (passwordErr) newErrors.password = passwordErr
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    return newErrors
  }

  const validateResetForm = () => {
    const newErrors = {}
    const emailErr = validateEmail(form.email)
    if (emailErr) newErrors.email = emailErr
    return newErrors
  }

  // ── Login con email/contraseña ─────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateLoginForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    setServerError('')
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
      // onAuthStateChanged en App.jsx se dispara automáticamente y redirige
    } catch (error) {
      setServerError(firebaseErrorMessage(error.code))
    } finally {
      setLoading(false)
    }
  }

  // ── Registro con email/contraseña ──────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    const validationErrors = validateRegisterForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setRegisterLoading(true)
    setServerError('')
    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await updateProfile(user, { displayName: form.name.trim() })
      // Firebase auto-dispara onAuthStateChanged → App.jsx redirige al dashboard
    } catch (error) {
      setServerError(firebaseErrorMessage(error.code))
    } finally {
      setRegisterLoading(false)
    }
  }

  // ── Login con Google (popup) ──────────────────────────────────
  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setServerError('')
    try {
      await signInWithPopup(auth, googleProvider)
      // onAuthStateChanged en App.jsx detecta el usuario y redirige
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        setServerError(firebaseErrorMessage(error.code))
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  // ── Recuperar contraseña ───────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault()
    const validationErrors = validateResetForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setResetLoading(true)
    setServerError('')
    try {
      await sendPasswordResetEmail(auth, form.email)
      setResetSent(true)
    } catch (error) {
      setServerError(firebaseErrorMessage(error.code))
    } finally {
      setResetLoading(false)
    }
  }

  return {
    form,
    errors,
    serverError,
    loading,
    handleChange,
    handleSubmit,
    registerLoading,
    registerSuccess,
    handleRegister,
    googleLoading,
    handleGoogleLogin,
    resetLoading,
    resetSent,
    handleReset,
  }
}