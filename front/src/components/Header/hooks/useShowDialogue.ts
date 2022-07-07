import { useState } from 'react'

export function useShowDialgue() {
  const [showDialogue, setShowDialogue] = useState(false)

  return {
    showDialogue,
    setShowDialogue
  }
}
