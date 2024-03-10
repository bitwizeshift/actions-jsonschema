import * as github from '@actions/github'
import * as core from '@actions/core'
import * as path from 'path'

export async function load(): Promise<(v: string) => boolean> {
  const scope = core.getInput('scope')
  switch (scope) {
    case 'all':
      return await all()
    case 'diff':
      return await diff()
    default:
      throw new Error(`Unknown scope: ${scope}`)
  }
}

export async function all(): Promise<(v: string) => boolean> {
  return () => true
}

export async function diff(): Promise<(v: string) => boolean> {
  const token = core.getInput('github-token')
  const octokit = github.getOctokit(token)

  let files: string[]
  if (github.context.issue.number) {
    core.info('Getting diff from pull-request')
    const { data: pull } = await octokit.rest.pulls.get({
      owner: github.context.issue.owner,
      repo: github.context.issue.repo,
      pull_number: github.context.issue.number,
      mediaType: {
        format: 'diff'
      }
    })
    const { data: prDiff } =
      await octokit.rest.repos.compareCommitsWithBasehead({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        basehead: `${pull.base.label}..${pull.head.label}`
      })
    files = (prDiff.files || []).map(file => path.resolve(file.filename))
    core.startGroup('files changed')
    for (const file of files) {
      core.info(file)
    }
    core.endGroup()
  } else {
    const { data: commit } = await octokit.rest.repos.getCommit({
      owner: github.context.issue.owner,
      repo: github.context.issue.repo,
      ref: github.context.sha
    })
    files = (commit.files || []).map(file => path.resolve(file.filename))
    core.startGroup('files changed')
    for (const file of files) {
      core.info(file)
    }
    core.endGroup()
  }

  return (file: string) => files.includes(file)
}
