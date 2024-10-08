import { useState } from 'react'

export const useMutex = () => {
  const [mutex, setMutex] = useState(false)
  const lock = () => setMutex(true)
  const unlock = () => setMutex(false)
  return { mutex, lock, unlock }
}
