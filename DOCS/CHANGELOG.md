# CHANGELOG.md

## 2024-06-09
- Created DOCS folder and initialized PROGRESS.md, CHANGELOG.md, and INPUTS.md.
- Ran `npm install` to ensure all dependencies are present.
- Ran `npx tsc --noEmit` to verify type safety (no errors found).
- Noted recurring issue: 'next' not recognized as a command; resolved by using `npx next dev`.
- Directory structure:
  - DOCS/
    - PROGRESS.md
    - CHANGELOG.md
    - INPUTS.md
  - src/
  - public/
  - package.json
  - ...
- Added public/_redirects for Netlify SPA fallback.
- Added MIT LICENSE file.
- Updated README.md with Netlify deployment instructions and badge placeholder. 