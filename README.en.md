# opendesign-components

A Vue 3 enterprise component library, consisting of the component package, build CLI, and documentation site.

## Quick Start

```bash
# Clone the repository
git clone https://atomgit.com/openeuler/opendesign-components.git
cd opendesign-components

# Install dependencies + compile components + generate API docs (one-step setup)
pnpm docs:install

# Start the documentation dev server
pnpm docs:dev
```

Visit http://localhost:3300 in your browser.

## Project Architecture

A pnpm workspace monorepo:

| Package                 | Path                  | Description                            |
| ----------------------- | --------------------- | -------------------------------------- |
| `@opensig/opendesign`   | `packages/opendesign` | Published Vue 3 component library      |
| `@opensig/open-scripts` | `packages/scripts`    | Build CLI for the component library    |
| docs                    | `packages/docs`       | Documentation site + component testing |

## Changelog

- [opendesign changelog](./packages/docs/ReleaseNote.opendesign.md)
- [open-scripts changelog](./packages/docs/ReleaseNote.scripts.md)

## Contributing

1. Fork this repository
2. Create a feat/xxx branch from the release/xxx branch
3. Commit your changes to your fork
4. Create a PR to merge into the upstream release/xxx branch
