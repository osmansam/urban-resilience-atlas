import type { CellId, CityRecord, ColumnDefinition, ColumnKey } from './types'

const plain = (value: CityRecord[ColumnKey]) => String(value)
const percent = (value: CityRecord[ColumnKey]) => `${value}%`
const speakPercent = (value: CityRecord[ColumnKey]) => `${value} percent`
const millimeters = (value: CityRecord[ColumnKey]) => `${Number(value).toLocaleString('en-US')} mm`
const speakMillimeters = (value: CityRecord[ColumnKey]) =>
  `${Number(value).toLocaleString('en-US')} millimeters`
const days = (value: CityRecord[ColumnKey]) => `${value} days`
const points = (value: CityRecord[ColumnKey]) => `${value} / 100`
const speakPoints = (value: CityRecord[ColumnKey]) => `${value} out of 100`

export const cityColumns: ColumnDefinition[] = [
  { key: 'name', label: 'City', shortLabel: 'city', format: plain, speak: plain },
  { key: 'region', label: 'Region', shortLabel: 'region', format: plain, speak: plain },
  {
    key: 'canopy',
    label: 'Tree canopy',
    shortLabel: 'tree canopy',
    format: percent,
    speak: speakPercent,
  },
  {
    key: 'transit',
    label: 'Public transit',
    shortLabel: 'public transit',
    format: percent,
    speak: speakPercent,
  },
  {
    key: 'rainfall',
    label: 'Annual rainfall',
    shortLabel: 'annual rainfall',
    format: millimeters,
    speak: speakMillimeters,
  },
  {
    key: 'heatDays',
    label: 'Extreme heat days',
    shortLabel: 'extreme heat days',
    format: days,
    speak: days,
  },
  {
    key: 'resilience',
    label: 'Resilience score',
    shortLabel: 'resilience score',
    format: points,
    speak: speakPoints,
  },
]

export const cityData: CityRecord[] = [
  { id: 'pinehaven', name: 'Pinehaven', region: 'Northern Forest', canopy: 42, transit: 38, rainfall: 980, heatDays: 12, resilience: 84 },
  { id: 'brineport', name: 'Brineport', region: 'Atlantic Coast', canopy: 19, transit: 61, rainfall: 1180, heatDays: 34, resilience: 76 },
  { id: 'aurora-reach', name: 'Aurora Reach', region: 'Northern Forest', canopy: 35, transit: 47, rainfall: 1240, heatDays: 9, resilience: 82 },
  { id: 'emberfield', name: 'Emberfield', region: 'Southern Plain', canopy: 16, transit: 24, rainfall: 620, heatDays: 67, resilience: 58 },
  { id: 'mossgate', name: 'Mossgate', region: 'Rain Coast', canopy: 48, transit: 33, rainfall: 1760, heatDays: 11, resilience: 88 },
  { id: 'solmere', name: 'Solmere', region: 'High Desert', canopy: 14, transit: 52, rainfall: 310, heatDays: 71, resilience: 69 },
  { id: 'willowbend', name: 'Willowbend', region: 'River Basin', canopy: 39, transit: 44, rainfall: 1090, heatDays: 28, resilience: 81 },
  { id: 'ridgecrest', name: 'Ridgecrest', region: 'Mountain West', canopy: 31, transit: 29, rainfall: 540, heatDays: 22, resilience: 79 },
  { id: 'harborlight', name: 'Harborlight', region: 'Atlantic Coast', canopy: 23, transit: 68, rainfall: 1320, heatDays: 31, resilience: 86 },
  { id: 'redcliff', name: 'Redcliff', region: 'Southern Plain', canopy: 21, transit: 35, rainfall: 710, heatDays: 59, resilience: 64 },
  { id: 'larkspur', name: 'Larkspur', region: 'River Basin', canopy: 37, transit: 57, rainfall: 960, heatDays: 26, resilience: 83 },
  { id: 'sunford', name: 'Sunford', region: 'High Desert', canopy: 18, transit: 41, rainfall: 280, heatDays: 76, resilience: 62 },
  { id: 'frostmere', name: 'Frostmere', region: 'Northern Forest', canopy: 44, transit: 31, rainfall: 1120, heatDays: 6, resilience: 87 },
  { id: 'delta-crossing', name: 'Delta Crossing', region: 'River Basin', canopy: 27, transit: 63, rainfall: 1430, heatDays: 39, resilience: 78 },
  { id: 'cedar-point', name: 'Cedar Point', region: 'Rain Coast', canopy: 46, transit: 49, rainfall: 1890, heatDays: 14, resilience: 91 },
  { id: 'glassbay', name: 'Glassbay', region: 'Atlantic Coast', canopy: 25, transit: 72, rainfall: 1270, heatDays: 36, resilience: 85 },
  { id: 'meadowrun', name: 'Meadowrun', region: 'Southern Plain', canopy: 33, transit: 22, rainfall: 840, heatDays: 48, resilience: 67 },
  { id: 'cobalt-ridge', name: 'Cobalt Ridge', region: 'Mountain West', canopy: 29, transit: 46, rainfall: 470, heatDays: 19, resilience: 80 },
  { id: 'rainshadow', name: 'Rainshadow', region: 'Mountain West', canopy: 24, transit: 39, rainfall: 390, heatDays: 25, resilience: 73 },
  { id: 'stonewater', name: 'Stonewater', region: 'Rain Coast', canopy: 41, transit: 55, rainfall: 1540, heatDays: 17, resilience: 89 },
]

export const createCellId = (cityId: string, key: ColumnKey): CellId => `${cityId}:${key}`

export const getCityById = (cityId: string) => cityData.find((city) => city.id === cityId)

export const getColumnByKey = (key: ColumnKey) =>
  cityColumns.find((column) => column.key === key)

export const splitCellId = (cellId: CellId): [string, ColumnKey] => {
  const separator = cellId.lastIndexOf(':')
  return [cellId.slice(0, separator), cellId.slice(separator + 1) as ColumnKey]
}

export const getCellDetails = (cellId: CellId) => {
  const [cityId, key] = splitCellId(cellId)
  const city = getCityById(cityId)
  const column = getColumnByKey(key)
  if (!city || !column) return null
  const value = city[key]
  return { city, column, value, formatted: column.format(value), spoken: column.speak(value) }
}
