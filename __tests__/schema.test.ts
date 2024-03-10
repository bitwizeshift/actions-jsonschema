import * as schema from '../src/schema'
import * as core from '@actions/core'
import * as cache from '@actions/cache'
import fs from 'fs'
import fetchmock from 'jest-fetch-mock'

describe('schema', () => {
  describe('isValidURL', () => {
    it('should return true if the input is a valid URL', () => {
      // Arrange
      const url = 'https://example.com'

      // Act
      const result = schema.isValidURL(url)

      // Assert
      expect(result).toBe(true)
    })

    it('should return false if the input is not a valid URL', () => {
      // Arrange
      const url = 'invalid-url'

      // Act
      const result = schema.isValidURL(url)

      // Assert
      expect(result).toBe(false)
    })

    it('should return false for relative paths', () => {
      // Arrange
      const url = './relative-file.txt'

      // Act
      const result = schema.isValidURL(url)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('hasCache', () => {
    it('should return true if the cache key is set', () => {
      // Arrange
      jest.spyOn(core, 'getInput').mockReturnValue('cache-key')

      // Act
      const result = schema.hasCache()

      // Assert
      expect(result).toBe(true)
    })

    it('should return false if the cache key is not set', () => {
      // Arrange
      jest.spyOn(core, 'getInput').mockReturnValue('')

      // Act
      const result = schema.hasCache()

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('from', () => {
    it('should create a loader from the input', () => {
      // Arrange
      const input = 'input schema'

      // Act
      const loader = schema.from(input)

      // Assert
      expect(loader).toBeDefined()
    })
  })

  describe('cacheLoader', () => {
    it('should return cached contents when cache is found', async () => {
      // Arrange
      const want = 'contents'
      const loader = {
        load: jest.fn().mockResolvedValue('schema')
      }
      jest.spyOn(cache, 'restoreCache').mockResolvedValue('file-path')
      jest.spyOn(fs, 'readFileSync').mockReturnValue(want)

      // Act
      const cachedLoader = schema.cacheLoader(loader)
      const got = await cachedLoader.load()

      // Assert
      expect(got).toBe(want)
      expect(loader.load).toHaveBeenCalledTimes(0)
      expect(fs.readFileSync).toHaveBeenCalledTimes(1)

      jest.restoreAllMocks()
    })
  })

  describe('fromURL', () => {
    it('should create a loader that fetches the schema from a URL', async () => {
      // Arrange
      const url = 'https://example.com/schema'
      const want = 'hello world'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.fetch = fetchmock as any
      fetchmock.mockResponse(want)

      // Act
      const loader = schema.fromURL(url)
      const got = await loader.load()

      // Assert
      expect(got).toBe(want)
    })
  })

  describe('fromFile', () => {
    it('should create a loader that fetches the schema from a file on disk', async () => {
      // Arrange
      const filePath = '/path/to/schema.json'
      const want = 'hello world'
      jest.spyOn(fs.promises, 'readFile').mockReturnValue(Promise.resolve(want))

      // Act
      const loader = schema.fromFile(filePath)
      const got = await loader.load()

      // Assert
      expect(got).toBe(want)
      jest.restoreAllMocks()
    })
  })
})
