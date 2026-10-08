import { createCellId } from '../data/cities'
import type { CellId, CityRecord, ColumnDefinition } from '../data/types'

interface DataTableProps {
  rows: CityRecord[]
  columns: ColumnDefinition[]
  mentionMap: Map<CellId, string[]>
  activeCellId: CellId | null
  pinnedCellId: CellId | null
  onActivate: (cellId: CellId) => void
  onTransientChange: (cellId: CellId | null) => void
}

export function DataTable({
  rows,
  columns,
  mentionMap,
  activeCellId,
  pinnedCellId,
  onActivate,
  onTransientChange,
}: DataTableProps) {
  return (
    <section className="table-section" aria-labelledby="table-heading">
      <h2 id="table-heading">City comparison</h2>
      <p>The underlined table values are discussed in the text.</p>

      <div className="table-wrapper">
        <table>
          <caption>Resilience indicators for twenty fictional cities</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((city) => (
              <tr key={city.id}>
                {columns.map((column, columnIndex) => {
                  const cellId = createCellId(city.id, column.key)
                  const value = column.format(city[column.key])
                  const mentions = mentionMap.get(cellId)
                  const highlighted = activeCellId === cellId
                  const selected = pinnedCellId === cellId
                  const Tag = columnIndex === 0 ? 'th' : 'td'

                  return (
                    <Tag
                      key={column.key}
                      id={`cell-${cellId}`}
                      {...(columnIndex === 0 ? { scope: 'row' as const } : {})}
                      tabIndex={mentions?.length ? -1 : undefined}
                      className={`table-cell${highlighted ? ' is-highlighted' : ''}${selected ? ' is-selected' : ''}`}
                    >
                      {mentions?.[0] ? (
                        <a
                          href={`#${mentions[0]}`}
                          data-link-source="table"
                          className="table-link"
                          onClick={(event) => {
                            event.preventDefault()
                            onActivate(cellId)
                          }}
                          onMouseEnter={() => onTransientChange(cellId)}
                          onMouseLeave={() => onTransientChange(null)}
                          onFocus={() => onTransientChange(cellId)}
                          onBlur={() => onTransientChange(null)}
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </Tag>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
