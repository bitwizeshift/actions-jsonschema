import * as promises from 'fs/promises'
import * as core from '@actions/core'
import * as glob from '@actions/glob'
import yaml from 'js-yaml'

/**
 * Loads all objects from input files
 *
 * @returns an iterable of objects
 */
export async function* load(): AsyncIterable<[string, any]> {
  core.info('Loading input files')
  return readFiles(getInputFiles())
}

/**
 * @param file the file to check
 * @returns true if the file is a YAML file
 */
export function isYAML(file: string): boolean {
  const path = file.toLocaleLowerCase()
  return path.endsWith('.yaml') || path.endsWith('.yml')
}

/**
 * @param file the file to check
 * @returns true if the file is a JSON file
 */
export function isJSON(file: string): boolean {
  return file.toLocaleLowerCase().endsWith('.json')
}

/**
 * Reads all files from the input paths
 *
 * @param paths the paths to read
 */
export async function* readFiles(
  paths: AsyncIterable<string>
): AsyncIterable<[string, any]> {
  core.info('Reading input files')
  for await (const path of paths) {
    core.info(`Reading file: ${path}`)
    const content = await promises.readFile(path, 'utf-8')

    if (isYAML(path)) {
      core.info(`Parsing YAML file: ${path}`)
      yield [path, yaml.load(content)]
    } else if (isJSON(path)) {
      core.info(`Parsing JSON file: ${path}`)
      yield [path, JSON.parse(content)]
    } else {
      throw new Error(`Unsupported file type: ${path}`)
    }
  }
}

/**
 * @returns an async iterable of input files
 */
export async function* getInputFiles(): AsyncIterable<string> {
  const input = core.getInput('paths', { required: true })
  core.info(`Globbing input: ${input}`)
  const globber = await glob.create(input)

  for await (const filePath of globber.globGenerator()) {
    core.info(`Found file: ${filePath}`)
    yield filePath
  }
}
