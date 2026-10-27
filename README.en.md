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

## Versioning

The component library follows semantic versioning `MAJOR.MINOR.PATCH-SUFFIX` with a fixed release and maintenance cadence:

- **Release cadence**: A new MAJOR.MINOR is released every 2 months on the last working day of the month. If a release window has no features, the release is cancelled and the version number is reused by the next actual release.
- **Maintenance window**: Each MAJOR.MINOR is maintained for 6 months; maintenance ends on the EOL date, and a version released the same day takes over immediately.
- **Patch cadence**: A patch release node is set at the middle of each month (a soft rule, skipped when there is no patch demand). Regular patches increment PATCH (e.g. `1.3.0 → 1.3.1`), and release plans are rolled forward one month at a time.
- **Emergency patches**: Patches for security vulnerabilities or blocking bugs are not bound to the mid-month node.
- **Concurrency**: At most 3 MAJOR.MINOR versions are maintained in parallel.
- **MAJOR releases**: Breaking changes (e.g. 2.0.0) occupy the nearest regular release window; the cadence then continues with 2.1.0, 2.2.0, and so on.
- **SUFFIX slot**: The `-SUFFIX` slot is reserved for exceptional cases only.

Transition: 1.2.5 (EOL 2026/12/31) and 1.2.7 (EOL 2027/02/28) are the currently maintained versions; 1.2.6 is discontinued with users guided to 1.2.7-x; 1.3.0 (GEO optimization, released mid-Nov 2026) anchors the new cadence.

For the full visualization (Gantt chart, concurrent-version water level, and monthly patch nodes), see [versioning.html](./packages/docs/public/versioning.html) or the "Versioning" entry in the documentation site header.

## Changelog

- [opendesign changelog](./packages/docs/ReleaseNote.opendesign.md)
- [open-scripts changelog](./packages/docs/ReleaseNote.scripts.md)

## Contributing

1. Fork this repository
2. Create a feat/xxx branch from the release/xxx branch
3. Commit your changes to your fork
4. Create a PR to merge into the upstream release/xxx branch
