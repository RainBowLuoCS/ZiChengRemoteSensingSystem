import { useState } from 'react'

export const useShowInput = () => {
  const [showInput, setShowInput] = useState(false)

  function closeInput() {
    if (!showInput) return
    setShowInput(false)
  }

  document.addEventListener('click', closeInput)

  return {
    showInput,
    setShowInput
  }
}
