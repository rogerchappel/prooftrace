# Changelog

All notable changes to this project will be documented in this file.

This project follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
format and uses semantic versioning when versioned releases are published.

## [Unreleased]

### Added

- Initial project setup.
- Release-candidate README and full release verification path.

### Fixed

- `prooftrace --version` now prints the CLI version instead of help text.
- The npm publish tarball no longer ships compiled test artifacts
  (`dist/*.test.js`, `*.test.d.ts`, `*.test.js.map`) or `scripts/*.test.mjs`
  suites; `npm run package:smoke` now fails when they reappear.

## Release Links

- Unreleased:
  `https://github.com/rogerchappel/prooftrace/compare/...HEAD`
- Latest release:
  `https://github.com/rogerchappel/prooftrace/releases/latest`

Replace placeholder links once the first release tag exists.
