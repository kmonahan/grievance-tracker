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

## Auth States
Authentication is cookie-based. The presence of a `access_token` cookie indicates the
user is logged in.

Helper functions in `lib/auth.ts` are used to determine user's auth state.

## Code Conventions
### Path Aliases
`"~/*"`: `"./*"`

## Checklist for Completion
Before any task is considered complete, you **must** check the following:
- [ ] `npm run format` has been run to format all files
- [ ] `npm run lint:fix` has been run to lint with safe code fixes applied
- [ ] No remaining linting errors occur (run `npm run lint` to verify)
- [ ] Unit tests have been added for new functionality
- [ ] All tests pass (run `npm test` to verify)