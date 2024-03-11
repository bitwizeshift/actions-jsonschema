import * as filter from './filter'
import * as schema from './schema'
import * as objects from './objects'
import * as workspace from './workspace'
import * as core from '@actions/core'
import Ajv from 'ajv'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  let success = true
  try {
    const loader = schema.load()

    core.startGroup(`Loading schema`)
    const ajv = new Ajv({ allErrors: true })
    const schemaText = await loader.load()
    const validate = ajv.compile(JSON.parse(schemaText))
    core.endGroup()

    const test = await filter.load()

    core.startGroup('Validating inputs')
    let count = 0
    for await (const [file, obj] of objects.load()) {
      core.startGroup(`${workspace.relative(file)}`)
      count++
      if (test(file)) {
        const valid = validate(obj)
        if (!valid) {
          for (const error of validate.errors || []) {
            const property = error.instancePath.substring(1).replace(/\//g, '.')
            core.error(`${error.message}`, {
              title: `Property '${property}' failed validation`,
              file
            })
          }
          core.setFailed(
            `Validation failed: ${ajv.errorsText(validate.errors)}`
          )
          success = false
        } else {
          core.info('Validated without errors')
        }
      } else {
        core.info(`Validation skipped (file not included in diff)`)
      }
      core.endGroup()
    }
    core.endGroup()

    if (count === 0) {
      core.notice('No files were validated')
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
    success = false
  } finally {
    core.setOutput('status', success ? 'success' : 'failure')
  }
}
