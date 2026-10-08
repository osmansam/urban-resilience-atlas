import { getCellDetails } from '../data/cities'
import type { CellId } from '../data/types'

interface LinkStatusProps {
  pinnedCellId: CellId | null
  mentionCount: number
}

export function LinkStatus({ pinnedCellId, mentionCount }: LinkStatusProps) {
  const details = pinnedCellId ? getCellDetails(pinnedCellId) : null

  let message = 'No value is selected.'
  if (details) {
    const mentionLabel = mentionCount === 1 ? 'mention' : 'mentions'
    message = `${details.city.name}, ${details.column.shortLabel}: ${details.spoken}. ${mentionCount} ${mentionLabel} in the text.`
  }

  return (
    <p className="selection-status" role="status" aria-live="polite">
      {message}
    </p>
  )
}
