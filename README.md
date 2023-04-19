# YourUni
[![Build Status](https://github.com/vasilionjea/webpack-frontend-template/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/vasilionjea/webpack-frontend-template/actions/workflows/unit-tests.yml)

## Environments
You must have NodeJS already installed on your machine, then run `npm install` before running any other commands.

### Dev
* `npm start` to start the dev server with live reload. Opens your default browser and points it at http://localhost:3000
* `npm run lint` to lint code with ESLint.
* `npm run format` to format code with Prettier.
* `npm run test` to run tests in watch mode, or `npm run test:ci` to run tests once.

### Prod
There are only _devDependencies_ listed in _package.json_. Run `npm run deploy` to deploy project.

## Build pipeline
* **Typescript:** webpack's `ts-loader` uses `tsc`, the TypeScript compiler, and relies on the project's `tsconfig.json` configuration to compile _.ts_ files to s2017.
* **Sass:** transforms Sass to CSS.
* **ESLint & Prettier:** ESLint relies on `.eslintrc.cjs` to lint _.ts_ files, and uses the recommended rules. Prettier formats code and relies on its defaults and the `.prettierrc` file.
* **Jest:** tests live under the `test` directory (_TODO_).
