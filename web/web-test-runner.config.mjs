// See https://modern-web.dev/docs/test-runner/cli-and-configuration/.

// TODO: Enable tests against all browsers.
// import { playwrightLauncher } from '@web/test-runner-playwright';

import { fromRollup } from '@web/dev-server-rollup';
import rollupReplace from '@rollup/plugin-replace';

const replace = fromRollup(rollupReplace);

const filteredLogs = ['Running in dev mode', 'lit-html is in dev mode'];

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files: 'out-tsc/test/**/*.test.js',

  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },

  /** Filter out lit dev mode logs */
  filterBrowserLogs(log) {
    for (const arg of log.args) {
      if (typeof arg === 'string' && filteredLogs.some(l => arg.includes(l))) {
        return false;
      }
    }
    return true;
  },

  /** configure test timeout */
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '10000',
    },
  },

  plugins: [
    replace({
      'process.env.API_URL': '"http://localhost:3000"',
    }),
  ],

  /** Amount of browsers to run concurrently */
  concurrentBrowsers: 2,

  /** Amount of test files per browser to test concurrently */
  concurrency: 10,

  /** Browsers to run tests on */
  // browsers: [
    // playwrightLauncher({ product: 'chromium' }),
    // playwrightLauncher({ product: 'firefox' }),
    // playwrightLauncher({ product: 'webkit' }),
  // ],

  coverageConfig: {
    report: true,
    include: ['**'],
    exclude: [
      '**/node_modules/**',
      '**/src/gen/**'
    ],
    threshold: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
});
