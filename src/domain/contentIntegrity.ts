import { createCellId } from '../data/cities'
import type {
  CellId,
  CityRecord,
  ColumnDefinition,
  ContentMetrics,
  NarrativeParagraph,
} from '../data/types'

const countWords = (value: string) => value.match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)?/g)?.length ?? 0

export const getNarrativeText = (paragraphs: NarrativeParagraph[]) =>
  paragraphs.map((paragraph) => paragraph.segments.map((segment) => segment.text).join('')).join('\n\n')

export const getMentionMap = (paragraphs: NarrativeParagraph[]) => {
  const mentions = new Map<CellId, string[]>()
  for (const paragraph of paragraphs) {
    paragraph.segments.forEach((segment, index) => {
      if (!segment.cellId) return
      const ids = mentions.get(segment.cellId) ?? []
      ids.push(`mention-${paragraph.id}-${index}`)
      mentions.set(segment.cellId, ids)
    })
  }
  return mentions
}

export const analyzeContent = (
  rows: CityRecord[],
  columns: ColumnDefinition[],
  paragraphs: NarrativeParagraph[],
): ContentMetrics => {
  const validCells = new Set(rows.flatMap((row) => columns.map((column) => createCellId(row.id, column.key))))
  const linkedCells = paragraphs.flatMap((paragraph) =>
    paragraph.segments.flatMap((segment) => (segment.cellId ? [segment.cellId] : [])),
  )
  const brokenReferences = [...new Set(linkedCells.filter((cellId) => !validCells.has(cellId)))]

  return {
    rowCount: rows.length,
    columnCount: columns.length,
    paragraphCount: paragraphs.length,
    wordCount: countWords(getNarrativeText(paragraphs)),
    mentionCount: linkedCells.length,
    uniqueLinkedCellCount: new Set(linkedCells).size,
    brokenReferences,
  }
}

export const validateContent = (
  rows: CityRecord[],
  columns: ColumnDefinition[],
  paragraphs: NarrativeParagraph[],
) => {
  const metrics = analyzeContent(rows, columns, paragraphs)
  const errors: string[] = []
  const rowIds = rows.map((row) => row.id)
  const columnKeys = columns.map((column) => column.key)

  if (new Set(rowIds).size !== rowIds.length) errors.push('City row IDs must be unique.')
  if (new Set(columnKeys).size !== columnKeys.length) errors.push('Column keys must be unique.')
  if (metrics.rowCount < 20) errors.push('The table must contain at least 20 data rows.')
  if (metrics.columnCount < 6) errors.push('The table must contain at least 6 columns.')
  if (metrics.paragraphCount < 6 || metrics.paragraphCount > 8) {
    errors.push('The narrative must contain 6 to 8 paragraphs.')
  }
  if (metrics.wordCount < 1000) errors.push('The narrative must contain at least 1,000 words.')
  if (metrics.uniqueLinkedCellCount < 30) errors.push('At least 30 distinct cells must be linked from the narrative.')
  if (metrics.brokenReferences.length > 0) errors.push('Every narrative reference must identify an existing table cell.')

  return errors
}
