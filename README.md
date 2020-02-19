# eslint action with diff annotations

This action will run eslint on your project, annotating the diff with any
warnings or errors it encounters. Combined and modified from
[stefanoeb/eslint-action](https://github.com/stefanoeb/eslint-action) for
the smart conditional dependency install and 
[hallee/eslint-action](https://github.com/hallee/eslint-action) to get the nice annotations.

If your build has already run `npm install`, this action won't, but if your
dependencies haven't yet been installed, then it will. That might speed things
up for you! Otherwise, it'll run `npm install` or `yarn install`.

## Prerequisites

### esLint

You must have eslint and any configured plugins specified in your
`package.json` (or Yarn or npm lockfiles). This action will use your project's
install along with its eslint configuration.

See the [eslint getting started guide](https://eslint.org/docs/user-guide/getting-started#installation-and-usage)
for more information on getting setup.

## Usage

You can add a new job to your existing workflow or create a new one. In any
case, your GitHub action token is required in order to get annotations. That
is added with the `repo_token` input.

An example of a simple Yaml file for getting going:

```yml
name: Lint

on: [push]

jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: 18F/github-action-eslint@1.0.0
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

The `secrets.GITHUB_TOKEN` is provided for you, so there's no need to configure
that part yourself.

By default, this action will run eslint on all the files in your project. If
that's not what you want, you can specify a file glob with the `files` input.
You can also set a path to your project's `package.json` in case it's not in
the repo root (for example, if you have a monorepo with both frontend and
backend in the same repo) with the `path` input.

For example:

```yml
name: Lint

on: [push]

jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: 18F/github-action-eslint@1.0.0
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          files: src/
          path: web/
```

## License

This project incorporates code originally released under the MIT License with
modifications released into the worldwide public domain. See the
[license information](LICENSE).
