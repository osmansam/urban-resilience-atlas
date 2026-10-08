import type { CellId, NarrativeParagraph } from '../data/types'

interface NarrativePanelProps {
  paragraphs: NarrativeParagraph[]
  activeCellId: CellId | null
  pinnedCellId: CellId | null
  onActivate: (cellId: CellId) => void
  onTransientChange: (cellId: CellId | null) => void
}

export function NarrativePanel({
  paragraphs,
  activeCellId,
  pinnedCellId,
  onActivate,
  onTransientChange,
}: NarrativePanelProps) {
  return (
    <section className="narrative" aria-labelledby="about-heading">
      <h2 id="about-heading">About the data</h2>

      {paragraphs.map((paragraph) => (
        <p key={paragraph.id}>
          {paragraph.segments.map((segment, index) => {
            if (!segment.cellId) {
              return <span key={`${paragraph.id}-${index}`}>{segment.text}</span>
            }

            const mentionId = `mention-${paragraph.id}-${index}`
            const highlighted = activeCellId === segment.cellId
            const selected = pinnedCellId === segment.cellId

            return (
              <a
                key={mentionId}
                id={mentionId}
                href={`#cell-${segment.cellId}`}
                data-link-source="text"
                className={`mention-link${highlighted ? ' is-highlighted' : ''}${selected ? ' is-selected' : ''}`}
                onClick={(event) => {
                  event.preventDefault()
                  onActivate(segment.cellId!)
                }}
                onMouseEnter={() => onTransientChange(segment.cellId!)}
                onMouseLeave={() => onTransientChange(null)}
                onFocus={() => onTransientChange(segment.cellId!)}
                onBlur={() => onTransientChange(null)}
              >
                {segment.text}
              </a>
            )
          })}
        </p>
      ))}
    </section>
  )
}
