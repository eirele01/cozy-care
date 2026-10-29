import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

/**
 * Hydration-safe "is mounted on the client" flag.
 * Returns false on the server & first client render, true afterwards —
 * without triggering setState-in-effect lint errors.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}
