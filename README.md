# JSON Schema Validation Action

[![GitHub Super-Linter](https://github.com/bitwizeshift/actions-jsonschema/actions/workflows/linter.yaml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/bitwizeshift/actions-jsonschema/actions/workflows/ci.yaml/badge.svg)
[![Check dist/](https://github.com/bitwizeshift/actions-jsonschema/actions/workflows/check-dist.yaml/badge.svg)](https://github.com/bitwizeshift/actions-jsonschema/actions/workflows/check-dist.yaml)
[![CodeQL](https://github.com/bitwizeshift/actions-jsonschema/actions/workflows/codeql-analysis.yaml/badge.svg)](https://github.com/bitwizeshift/actions-jsonschema/actions/workflows/codeql-analysis.yaml)

A GitHub action for validating [JSON], [TOML], and [YAML] formatted
configuration files against a [JSON Schema] definition.

[JSON]: https://www.json.org/json-en.html
[YAML]: https://yaml.org/
[TOML]: https://toml.io/en/
[JSON Schema]: https://json-schema.org/

> Convenience [composite actions] are available in addition to the primary
> `jsonschema` action, such as:
>
> - `github-workflow`: which leverages [schemastore]'s [`github-workflow.json`]
> - `github-action`: which leverages [schemastore]'s [`github-action.json`]
> - `cargo`: which leverages [schemastore]'s [`cargo.json`]

[`github-workflow.json`]: https://json.schemastore.org/github-workflow.json
[`github-action.json`]: https://json.schemastore.org/github-action.json
[`cargo.json`]: https://json.schemastore.org/cargo.json
[composite actions]:
  https://docs.github.com/en/actions/creating-actions/creating-a-composite-action

## Features

- [x] Supports [JSON], [YAML], and [TOML] resource validation.
- [x] Validates schemas from both remote or local definitions.
- [x] Support for [caching] downloaded schemas to reduce network traffic.
- [x] Convenience actions which leverage [schemastore] schems.

[schemastore]: https://www.schemastore.org/json/

## Documentation

## Usage

### Pre-requisites

Create a workflow `.yaml` file in your repository's `.github/workflows`
directory. Some [example workflow](#example-workflows) are available below. For
more information, see the GitHub Help Documentation for [Creating a workflow
file].

[Creating a workflow file]:
  https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file

### Inputs

- `paths` - a set of path globs to run this validation against.
- `schema` - either a path to a local file, or to a URL of a [JSON Schema].
- `cache-key` - (optional) key to use for caching downloaded schemas. Only
  relevant when `schema` refers to a URL.
- `github-token` - (optional) the GitHub API token to use for internal API
  calls. Default: `${{ github.token }}`
- `scope` - (optional) whether to validate `'all'` globbed files, or only ones
  that have been modified (`'diff'`). Default: `'all'`

### Outputs

- `status` - whether validation succeeded. Will be one of `'success'` or
  `'failure'`.

## Example Workflows

### Validating by local schema

```yaml
name: Validate against Schema

on: push

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Validate local custom schema
        uses: bitwizeshift/actions-jsonschema@v1
        with:
          schema: ./some-schema.json
          paths: |
            testdata/**/*.json
            resources/**/*.json
```

### Validating GitHub workflows on change (with caching)

```yaml
name: Validate GitHub workflows Schema

on:
  push:
    paths:
      - '.github/workflows/*.yaml'
  pull_request:
    paths:
      - '.github/workflows/*.yaml'

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Validate Workflow Schema
        uses: bitwizeshift/actions-jsonschema/github-workflow@v1
        with:
          paths: ./.github/workflows/*.yaml
          cache-key: github-workflow
          scope: diff
```
