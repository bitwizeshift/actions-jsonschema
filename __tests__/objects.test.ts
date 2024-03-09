import { load, isYAML, isJSON, readFiles, getInputFiles } from '../src/objects'

describe('objects', () => {
  describe('load', () => {
    it('should load all objects from input files', async () => {})
  })

  describe('isYAML', () => {
    it('should return true if the file is a YAML file', () => {
      const yamlFile = 'example.yaml'
      const jsonFile = 'example.json'

      expect(isYAML(yamlFile)).toBe(true)
      expect(isYAML(jsonFile)).toBe(false)
    })
  })

  describe('isJSON', () => {
    it('should return true if the file is a JSON file', () => {
      const yamlFile = 'example.yaml'
      const jsonFile = 'example.json'

      expect(isJSON(yamlFile)).toBe(false)
      expect(isJSON(jsonFile)).toBe(true)
    })
  })

  describe('readFiles', () => {
    it('should read all files from the input paths', async () => {
      // TODO: Properly test
    })
  })

  describe('getInputFiles', () => {
    it('should return an async iterable of input files', async () => {
      // TODO: Properly test
    })
  })
})
