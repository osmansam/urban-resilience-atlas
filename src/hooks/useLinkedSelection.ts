import { useCallback, useEffect, useState } from 'react'
import type { CellId } from '../data/types'

export const useLinkedSelection = () => {
  const [pinnedCellId, setPinnedCellId] = useState<CellId | null>(null)
  const [transientCellId, setTransientCellId] = useState<CellId | null>(null)

  const clearSelection = useCallback(() => {
    setPinnedCellId(null)
    setTransientCellId(null)
    if (window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    }
  }, [])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') clearSelection()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [clearSelection])

  return {
    activeCellId: transientCellId ?? pinnedCellId,
    pinnedCellId,
    setPinnedCellId,
    setTransientCellId,
    clearSelection,
  }
}
