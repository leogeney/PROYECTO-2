// utils/firebaseErrors.js

/**
 * Traduce los códigos de error de Firebase Auth a mensajes amigables en español.
 * Cubre los errores más comunes de autenticación.
 */
export function firebaseErrorMessage(code) {
  const messages = {
    // ── Correo / contraseña ───────────────────────────────────────
    'auth/invalid-email':              'El correo electrónico no tiene un formato válido.',
    'auth/user-disabled':              'Esta cuenta ha sido deshabilitada. Contacta al soporte.',
    'auth/user-not-found':             'No existe una cuenta con ese correo electrónico.',
    'auth/wrong-password':             'La contraseña es incorrecta. Inténtalo de nuevo.',
    'auth/invalid-credential':         'Correo o contraseña incorrectos. Verifica tus datos.',
    'auth/email-already-in-use':       'Ya existe una cuenta con ese correo electrónico.',
    'auth/weak-password':              'La contraseña es demasiado débil. Usa al menos 8 caracteres.',
    'auth/operation-not-allowed':      'Este método de inicio de sesión no está habilitado.',

    // ── Google / proveedores externos ─────────────────────────────
    'auth/popup-closed-by-user':       'Cerraste la ventana de Google antes de completar el inicio de sesión.',
    'auth/popup-blocked':              'El navegador bloqueó la ventana emergente. Permite popups e inténtalo de nuevo.',
    'auth/cancelled-popup-request':    'Se canceló la solicitud de inicio de sesión.',
    'auth/account-exists-with-different-credential':
      'Ya existe una cuenta con ese correo usando otro método de inicio de sesión.',
    'auth/credential-already-in-use':  'Esta cuenta de Google ya está vinculada a otro usuario.',
    'auth/google-sign-in-failed':      'No se pudo iniciar sesión con Google. Inténtalo de nuevo.',

    // ── Red / servidor ────────────────────────────────────────────
    'auth/network-request-failed':     'Sin conexión a internet. Verifica tu red e inténtalo de nuevo.',
    'auth/too-many-requests':          'Demasiados intentos fallidos. Espera unos minutos o restablece tu contraseña.',
    'auth/internal-error':             'Ocurrió un error interno. Inténtalo de nuevo más tarde.',

    // ── Tokens / sesión ───────────────────────────────────────────
    'auth/expired-action-code':        'El enlace ha expirado. Solicita uno nuevo.',
    'auth/invalid-action-code':        'El enlace no es válido o ya fue utilizado.',
    'auth/user-token-expired':         'Tu sesión ha expirado. Inicia sesión de nuevo.',
    'auth/requires-recent-login':      'Por seguridad, vuelve a iniciar sesión para realizar esta acción.',

    // ── Reset de contraseña ───────────────────────────────────────
    'auth/missing-email':              'Ingresa tu correo electrónico para continuar.',
  }

  return messages[code] ?? 'Ocurrió un error inesperado. Inténtalo de nuevo.'
}