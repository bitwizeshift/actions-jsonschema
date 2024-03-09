import * as schema from './schema'
import * as objects from './objects'
import * as core from '@actions/core'
import Ajv from 'ajv'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const loader = schema.load()

    core.startGroup(`Loading schema`)
    const ajv = new Ajv({ allErrors: true })
    const schemaText = await loader.load()
    const validate = ajv.compile(JSON.parse(schemaText))
    core.endGroup()

    let count = 0
    for await (const [file, obj] of objects.load()) {
      core.startGroup(`Validating ${file}`)
      count++
      const valid = validate(obj)
      if (!valid) {
        for (const error of validate.errors || []) {
          const property = error.instancePath.substring(1).replace(/\//g, '.')
          core.error(`${error.message}`, {
            title: `Property '${property}' failed validation`,
            file
          })
        }
        core.setFailed(`Validation failed: ${ajv.errorsText(validate.errors)}`)
      }
      core.endGroup()
    }
    if (count == 0) {
      core.warning('No files were validated')
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}
