import { useState } from 'react'

export function useShowLogin() {
  const [showLogin, setShowLogin] = useState(true)

  return {
    showLogin,
    setShowLogin
  }
}
