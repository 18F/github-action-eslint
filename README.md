# GitHub ESLint runner

This action executes ESLint linter on specified javascript files without any previous action/build step or Docker required.

## Prerequisites

### ESLint
You must have the ESLint running locally for the action to execute. It will use the same rules as you do locally.
More info [on the ESLint getting started guide](https://eslint.org/docs/user-guide/getting-started#installation-and-usage)

## Usage

### main.workflow

Add or create a file named `.github/workflow/lint.yml` and copy over one of the examples below to your new workflow file

This is the simplest example to get it running:
```hcl
name: Lint

on: [push]

jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      name: ESLint
        - uses: stefanoeb/eslint-action@1.0.2
```

By default it will run ESLint through all the files in the project. But you can also specify a glob of files to lint using the `with:` argument on your YAML file. The example below shows ESLint running only on the files under the `src/` folder:

```hcl
name: Lint

on: [push]

jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      name: ESLint
        - uses: stefanoeb/eslint-action@1.0.2
        with:
          files: src/
```

If there is no previous step installing the necessary modules, this action will execute a `yarn install` or `npm install` automatically.

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).
