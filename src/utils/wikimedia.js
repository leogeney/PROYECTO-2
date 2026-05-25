import { useState, useEffect, useRef } from 'react'

const API = 'https://commons.wikimedia.org/w/api.php'

/* ── Persistent cache with 24h TTL ── */
const CACHE_KEY = 'wikimedia_img_cache'
const CACHE_TTL = 24 * 60 * 60 * 1000

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw)
    const now = Date.now()
    const valid = {}
    for (const [k, v] of Object.entries(data)) {
      if (now - v.ts < CACHE_TTL) valid[k] = v.url
    }
    return valid
  } catch { return {} }
}

function writeToCache(filename, url) {
  try {
    const data = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
    data[filename] = { url, ts: Date.now() }
    // Keep under ~500KB
    const entries = Object.entries(data)
    if (entries.length > 500) {
      const sorted = entries.sort((a, b) => (a[1].ts || 0) - (b[1].ts || 0))
      delete data[sorted[0][0]]
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch { /* storage full — silently ignore */ }
}

const memCache = readCache()

/* ── Throttled queue — max 2 concurrent ── */
const queue = []
let inFlight = 0
const MAX_CONCURRENT = 2

function enqueue(fn) {
  return new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject })
    processQueue()
  })
}

function processQueue() {
  while (inFlight < MAX_CONCURRENT && queue.length) {
    const { fn, resolve, reject } = queue.shift()
    inFlight++
    fn().then(resolve, reject).finally(() => { inFlight--; processQueue() })
  }
}

/* ── Direct URL strategies (no API call) ── */
function directSvgUrl(filename) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`
}

function directThumbUrl(filename, px = 400) {
  return `https://commons.wikimedia.org/w/index.php?title=Special:FilePath/${encodeURIComponent(filename)}&width=${px}`
}

/* ── API call with retry ── */
async function fetchFromApi(filename, retries = 2) {
  const url = `${API}?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json&origin=*`
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const pages = data.query?.pages
      if (!pages) return null
      const pageId = Object.keys(pages)[0]
      return pages[pageId]?.imageinfo?.[0]?.url || null
    } catch (err) {
      if (attempt < retries) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
      else throw err
    }
  }
  return null
}

/* ── Main resolver: API → direct thumb → direct SVG ── */
export async function getWikimediaUrl(filename) {
  if (!filename) return null
  if (memCache[filename]) return memCache[filename]

  return enqueue(async () => {
    try {
      const apiUrl = await fetchFromApi(filename)
      if (apiUrl) {
        memCache[filename] = apiUrl
        writeToCache(filename, apiUrl)
        return apiUrl
      }
    } catch { /* fall through */ }

    const thumb = directThumbUrl(filename)
    memCache[filename] = thumb
    writeToCache(filename, thumb)
    return thumb
  })
}

/* ── Preload: resolve many files at once ── */
export async function preloadImages(files) {
  const results = {}
  const batches = []
  for (let i = 0; i < files.length; i += MAX_CONCURRENT) {
    batches.push(files.slice(i, i + MAX_CONCURRENT))
  }
  for (const batch of batches) {
    const urls = await Promise.all(batch.map(f => getWikimediaUrl(f)))
    batch.forEach((f, i) => { results[f] = urls[i] })
  }
  return results
}

/* ── Hook with per-image status ── */
export function useSignImages(files) {
  const [state, setState] = useState(() => ({
    urls: {},
    loading: {},
    errors: {},
    done: false,
  }))
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    const list = (files || []).filter(Boolean)
    if (!list.length) {
      setState({ urls: {}, loading: {}, errors: {}, done: true })
      return
    }

    // Check cache immediately for instant results
    const cached = {}
    const toFetch = []
    for (const f of list) {
      if (memCache[f]) cached[f] = memCache[f]
      else toFetch.push(f)
    }

    setState({
      urls: cached,
      loading: Object.fromEntries(toFetch.map(f => [f, true])),
      errors: {},
      done: toFetch.length === 0,
    })

    if (!toFetch.length) return

    let cancelled = false
    preloadImages(toFetch).then(allUrls => {
      if (!mounted.current || cancelled) return
      const merged = { ...cached, ...allUrls }
      const errs = {}
      for (const f of toFetch) {
        if (!allUrls[f]) errs[f] = true
      }
      setState({ urls: merged, loading: {}, errors: errs, done: true })
    })

    return () => { cancelled = true; mounted.current = false }
  }, [files?.join(',')])

  return state
}
