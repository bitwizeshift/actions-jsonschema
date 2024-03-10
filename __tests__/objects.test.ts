import { isYAML, isJSON } from '../src/objects'

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
})
