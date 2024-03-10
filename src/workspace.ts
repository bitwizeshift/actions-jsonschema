import * as path from 'path'

/**
 * Computes the relative path of the file, relative to the github workspace.
 *
 * @param file the file to make relative
 * @returns the relative path of the file
 */
export function relative(file: string): string {
  return path.relative(process.env.GITHUB_WORKSPACE || process.cwd(), file)
}
