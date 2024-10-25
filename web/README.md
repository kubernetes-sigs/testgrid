## TestGrid UI

[![Built with open-wc recommendations](https://img.shields.io/badge/built%20with-open--wc-blue.svg)](https://github.com/open-wc)

Testgrid frontend code uses Lit elements and is written in Typescript. `tsconfig.json` specifies where and how the Typescript will be compiled to Javascript.
More info about Lit and Typescript can be found in [Lit docs](https://lit.dev/) and [TS docs](https://www.typescriptlang.org/) respectively.

## Development
Local development is done with the help of [Web Dev Server](https://modern-web.dev/docs/dev-server/overview/). Web dev server configurations are defined in `web-dev-server-{env}.config.mjs` file. Depending on the config, frontend will render from the data from either fake or prod API.

To develop locally:
- Run `npm install`, then:
  - To see fake data, run `npm run start:local`
  - To see prod data, run `npm run start:k8s`

More info in the [Scripts](#scripts) section below.

TIP: If you hit unexpected errors, try running `rm -rf node_modules/`, then `npm install` to refresh dependencies.

## Testing

To run the tests, run `npm run test`. More info in the [Scripts](#scripts) section below.

## Scripts

Most scripts are in `npm run` commands.

- `start:k8s` runs your app for development, reloading on file changes. Fetches the data from external k8s Testgrid API instance - actual data.
- `start:local` runs your app for development, reloading on file changes. Spins up a local `json-server` which serves the data from `src/fake-api/data.json` file, which is then rendered in frontend.
- `start:build` runs your app after it has been built using the build command
- `build` builds your app and outputs it in your `dist` directory
- `test` runs your test suite with Web Test Runner. Relies on the fake data provided by `json-server`.
- `lint` runs the linter for your project

## Pulling from upstream

To generate or update the proto definitions:

- Checkout a local copy of https://github.com/GoogleCloudPlatform/testgrid, ex. `gh repo clone GoogleCloudPlatform/testgrid $HOME/gcp-testgrid`
- Run
  ```
  # Path to local GCP/testgrid repo, `$HOME/gcp-testgrid`
  TGREPO={{local GCP/testgrid repo}}
  bump-protos.sh "$TGREPO"
  ```

## Configs and files
- Frontend code is located in `src` dir.
- Stories for demoing are located in `stories` dir.
- Tests are located in `test` dir.
- `package.json` defines all the `npm run ...` commands as well as libraries, dependencies and their versions.
- `tsconfig.json` defines how and where will the .ts files compile.
- `web-dev-server-*.config.mjs` defines configuration parameters for the web dev server.
- `web-test-runner.config.mjs` defined configuration parameters for the web test runner.
- `rollup.config.js` defines how the code will be built and bundled.
