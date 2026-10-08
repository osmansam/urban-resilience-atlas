import { cityColumns, cityData } from '../../src/data/cities'
import { narrative } from '../../src/data/narrative'
import { analyzeContent, validateContent } from '../../src/domain/contentIntegrity'

export const metrics = analyzeContent(cityData, cityColumns, narrative)
export const errors = validateContent(cityData, cityColumns, narrative)
