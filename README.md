# Variables Editor

[![translation-status](https://hosted.weblate.org/widget/axonivy/variable-editor/svg-badge.svg)](https://hosted.weblate.org/engage/axonivy/)

This repo contains the web-based Variables Editor client.

### Available Scripts

`pnpm install`: Install all packages

`pnpm package`: Build the lib output

`pnpm dev`: Start the dev server

#### Run tests

`pnpm test`: Run unit tests

`pnpm webtest`: Run Playwright tests

### VSCode dev environment

#### Debug

Simply start the `Launch Standalone` or `Launch Standalone Mock` launch config to get debug and breakpoint support.

> [!NOTE]
> The `Launch Standalone` launch config connects to a real designer and therefore requires a running designer engine on port 8081 with a project called `variables-test-project`. These attributes can be changed via URL parameters.

> [!NOTE]
> The `Launch Standalone Mock` launch config only receives mock data and therefore does not work with features for which a real engine is needed (e.g. data validation).

#### Run tests

To run tests you can either start a script above or start Playwright or Vitest with the recommended workspace extensions.
