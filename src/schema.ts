import fs from 'fs'
import path from 'path'
import * as core from '@actions/core'
import * as cache from '@actions/cache'

/**
 * A loader that fetches a schema from a source.
 */
export interface Loader {
  /**
   * Loads a schema from a source asynchronously.
   */
  load(): Promise<string>
}

/**
 * Creates loader that will load the schema from action input.
 *
 * @returns a loader that fetches the schema from the input
 */
export function load(): Loader {
  let schema = core.getInput('schema', { required: true })
  return from(schema)
}

/**
 * @param url the URL to check
 * @returns true if the input is a valid URL
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (_) {
    return false
  }
}

/**
 * @returns true if the cache key is set
 */
export function hasCache(): boolean {
  return core.getInput('cache-key') != ''
}

/**
 * @param input the input to create a loader from
 * @returns a loader that fetches the schema from the input
 */
export function from(input: string): Loader {
  if (isValidURL(input)) {
    if (hasCache()) {
      return cacheLoader(fromURL(input))
    }
    return fromURL(input)
  } else {
    if (hasCache()) {
      core.warning('Cache is not supported for local schema files')
    }
    return fromFile(input)
  }
}

/**
 * @param loader The loader to cache the contents from
 * @returns the loader
 */
export function cacheLoader(loader: Loader): Loader {
  const key = core.getInput('cache-key')
  const filePath = path.join(process.cwd(), `${key}.cache`)

  return {
    async load(): Promise<string> {
      let cacheId = await cache.restoreCache([filePath], key)

      if (!cacheId) {
        core.info(`Cache entry not found for ${key}; creating a new one`)
        core.info(`Fetching schema content from source`)
        let result = await loader.load()
        fs.writeFileSync(filePath, result)
        await cache.saveCache([filePath], key)
        return result
      }

      return fs.readFileSync(filePath, 'utf8')
    }
  }
}

/**
 * @param url the URL to fetch the schema from
 * @returns a loader that fetches the schema from a URL
 */
export function fromURL(url: string): Loader {
  return {
    async load(): Promise<string> {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.text()
    }
  }
}

/**
 * @param url the URL to fetch the schema from
 * @returns a loader that fetches the schema from a file on disk
 */
export function fromFile(path: string): Loader {
  return {
    async load(): Promise<string> {
      const data = await fs.promises.readFile(path, 'utf-8')
      return data
    }
  }
}
