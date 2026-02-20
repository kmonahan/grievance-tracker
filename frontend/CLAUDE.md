# Grievance Tracker Front-End

## Tech Stack
- Next.js 16
- Tailwinds v4

No UI library is used.

## Unit Testing
- **Test runner**: Jest v30 with `jsdom` environment
- **Libraries**: `@testing-library/react`, `@testing-library/jest-dom`
- **Run tests**: `npm test`
- **Config**: `jest.config.ts` (uses `next/jest`), setup in `jest.setup.ts`
- The `~/` path alias is mapped in Jest config, so imports work the same as in app code
- Test files use `.test.ts` / `.test.tsx` extensions

## Code Conventions
### Path Aliases
`"~/*"`: `"./*"`