import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { build } from 'vite'

const buildServerEntry = async (entry, outputDirectory) => {
  await build({
    logLevel: 'silent',
    build: {
      ssr: entry,
      outDir: outputDirectory,
      emptyOutDir: true,
      rollupOptions: {
        output: { entryFileNames: 'entry.mjs' },
      },
    },
  })

  return import(pathToFileURL(path.join(outputDirectory, 'entry.mjs')).href)
}

test('meets every dataset minimum in the assignment', async () => {
  const outputDirectory = await mkdtemp(path.join(process.cwd(), '.urban-resilience-test-'))

  try {
    const { errors, metrics } = await buildServerEntry(
      'tests/fixtures/assignment-content.ts',
      outputDirectory,
    )

    assert.deepEqual(errors, [])
    assert.ok(metrics.rowCount >= 20)
    assert.ok(metrics.columnCount >= 6)
    assert.ok(metrics.paragraphCount >= 6 && metrics.paragraphCount <= 8)
    assert.ok(metrics.wordCount >= 1000)
    assert.ok(metrics.uniqueLinkedCellCount >= 30)
  } finally {
    await rm(outputDirectory, { recursive: true, force: true })
  }
})

test('renders two-way links between narrative mentions and table cells', async () => {
  const outputDirectory = await mkdtemp(path.join(process.cwd(), '.urban-resilience-test-'))

  try {
    const { default: App } = await buildServerEntry('src/App.tsx', outputDirectory)
    const html = renderToStaticMarkup(createElement(App))
    const textLinks = html.match(/data-link-source="text"/g) ?? []
    const tableLinks = html.match(/data-link-source="table"/g) ?? []
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]))
    const linkedTags = [...html.matchAll(/<a [^>]*data-link-source="(text|table)"[^>]*>/g)]
    const targetsFor = (source) =>
      linkedTags
        .filter((match) => match[1] === source)
        .map((match) => match[0].match(/href="#([^"]+)"/)?.[1])

    assert.match(html, /<h1[^>]*>Urban Resilience Atlas<\/h1>/)
    assert.match(html, /<table/)
    assert.ok(textLinks.length >= 30)
    assert.ok(tableLinks.length >= 30)
    assert.match(html, /href="#cell-[^"]+"/)
    assert.match(html, /href="#mention-[^"]+"/)
    assert.ok(targetsFor('text').every((target) => target && ids.has(target)))
    assert.ok(targetsFor('table').every((target) => target && ids.has(target)))
    assert.match(html, /role="status"/)
    assert.match(html, /tabindex="-1"/)
    assert.doesNotMatch(html, /interactive evidence reader/i)
  } finally {
    await rm(outputDirectory, { recursive: true, force: true })
  }
})
