import * as workspace from './workspace'
import * as promises from 'fs/promises'
import * as core from '@actions/core'
import * as glob from '@actions/glob'
import yaml from 'js-yaml'
import toml from 'toml'

/**
 * Loads all objects from input files
 *
 * @returns an iterable of objects
 */
export async function* load(): AsyncIterable<[string, unknown]> {
  for await (const path of getInputFiles()) {
    const content = await promises.readFile(path, 'utf-8')

    if (isYAML(path)) {
      yield [path, yaml.load(content)]
    } else if (isJSON(path)) {
      yield [path, JSON.parse(content)]
    } else if (isTOML(path)) {
      yield [path, toml.parse(content)]
    } else {
      throw new Error(`Unsupported file type: ${path}`)
    }
  }
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
 * @param file the file to check
 * @returns true if the file is a TOML file
 */
export function isTOML(file: string): boolean {
  return file.toLocaleLowerCase().endsWith('.toml')
}

/**
 * @returns an async iterable of input files
 */
export async function* getInputFiles(): AsyncIterable<string> {
  const input = core.getInput('paths', { required: true })
  core.startGroup('Globbing inputs')
  for (const line of input.trim().split('\n')) {
    core.info(`${line.trim()}`)
  }
  core.endGroup()
  const globber = await glob.create(input)

  for await (const filePath of globber.globGenerator()) {
    core.debug(`Globbed ${workspace.relative(filePath)}`)
    yield filePath
  }
}
