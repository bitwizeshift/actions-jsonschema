import { isYAML, isJSON, isTOML } from '../src/objects'

describe('objects', () => {
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

  describe('isTOML', () => {
    it('should return true if the file is a TOML file', () => {
      const yamlFile = 'example.yaml'
      const tomlFile = 'example.toml'

      expect(isTOML(yamlFile)).toBe(false)
      expect(isTOML(tomlFile)).toBe(true)
    })
  })
})
