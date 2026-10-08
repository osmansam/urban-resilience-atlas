export type ColumnKey =
  | 'name'
  | 'region'
  | 'canopy'
  | 'transit'
  | 'rainfall'
  | 'heatDays'
  | 'resilience'

export type CellId = `${string}:${ColumnKey}`

export interface CityRecord {
  id: string
  name: string
  region: string
  canopy: number
  transit: number
  rainfall: number
  heatDays: number
  resilience: number
}

export interface ColumnDefinition {
  key: ColumnKey
  label: string
  shortLabel: string
  format: (value: CityRecord[ColumnKey]) => string
  speak: (value: CityRecord[ColumnKey]) => string
}

export interface NarrativeSegment {
  text: string
  cellId?: CellId
}

export interface NarrativeParagraph {
  id: string
  segments: NarrativeSegment[]
}

export interface ContentMetrics {
  rowCount: number
  columnCount: number
  paragraphCount: number
  wordCount: number
  mentionCount: number
  uniqueLinkedCellCount: number
  brokenReferences: CellId[]
}
