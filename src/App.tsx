import { DataTable } from './components/DataTable'
import { LinkStatus } from './components/LinkStatus'
import { NarrativePanel } from './components/NarrativePanel'
import { cityColumns, cityData } from './data/cities'
import { narrative } from './data/narrative'
import type { CellId } from './data/types'
import { getMentionMap } from './domain/contentIntegrity'
import { useLinkedSelection } from './hooks/useLinkedSelection'

const mentionMap = getMentionMap(narrative)

const moveTo = (id: string) => {
  const target = document.getElementById(id)
  if (!(target instanceof HTMLElement)) return

  window.history.replaceState(null, '', `#${id}`)
  target.focus({ preventScroll: true })
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'center',
    inline: 'nearest',
  })
}

function App() {
  const { activeCellId, pinnedCellId, setPinnedCellId, setTransientCellId, clearSelection } =
    useLinkedSelection()

  const activateFromNarrative = (cellId: CellId) => {
    setPinnedCellId(cellId)
    moveTo(`cell-${cellId}`)
  }

  const activateFromTable = (cellId: CellId) => {
    setPinnedCellId(cellId)
    const firstMention = mentionMap.get(cellId)?.[0]
    if (firstMention) moveTo(firstMention)
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Urban Resilience Atlas</h1>
        <p>
          This project compares twenty fictional cities using information about tree cover,
          public transportation, rainfall, extreme heat, and resilience.
        </p>
        <p className="instructions">
          Underlined values connect the text and table. Select one to move to its match, or hover
          over it to highlight the related information. Press Escape to clear a selection.
          {pinnedCellId && (
            <button type="button" className="clear-button" onClick={clearSelection}>
              Clear selection
            </button>
          )}
        </p>
        <LinkStatus
          pinnedCellId={pinnedCellId}
          mentionCount={pinnedCellId ? (mentionMap.get(pinnedCellId)?.length ?? 0) : 0}
        />
      </header>

      <main className="content-layout">
        <NarrativePanel
          paragraphs={narrative}
          activeCellId={activeCellId}
          pinnedCellId={pinnedCellId}
          onActivate={activateFromNarrative}
          onTransientChange={setTransientCellId}
        />
        <DataTable
          rows={cityData}
          columns={cityColumns}
          mentionMap={mentionMap}
          activeCellId={activeCellId}
          pinnedCellId={pinnedCellId}
          onActivate={activateFromTable}
          onTransientChange={setTransientCellId}
        />
      </main>

      <footer>
        <p>
          The cities and values in this project are fictional and are used only for this
          comparison.
        </p>
      </footer>
    </div>
  )
}

export default App
