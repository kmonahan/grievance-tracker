---
name: implement-from-tests
description: Implement new functionality to make failing unit tests pass
disable-model-invocation: true
argument-hint: "[path to test file(s) or description of what to implement]"
---

# Implement From Tests

You are implementing new functionality that is described by **pre-existing, failing unit tests**. The tests are the specification — your job is to make them pass by writing the production code.

## Input

The user's input is: $ARGUMENTS

If no test file or description was provided, ask the user which test file(s) to implement against.

## Ground Rules

- **You CANNOT modify any test files.** Tests are the spec and are off-limits.
- If you believe a test is incorrect, you **must stop**, explain the issue clearly to the user, and **wait for explicit approval** before making any change to a test.
- You may refactor existing production code as needed to support the new functionality.

## Workflow

### 1. Identify and run the failing tests

- Locate the relevant test file(s) based on the user's input.
- Run the tests with `npx jest <test-file> --no-coverage` to see the current failures.
- Parse the output to understand exactly which tests are failing and why.

### 2. Analyze the tests

Read the test file(s) thoroughly to understand:

- **What is being imported**: modules, components, server actions, types, utilities.
- **What is being mocked**: API calls, modules, hooks, next/navigation, cookies, etc.
- **What behavior is expected**: rendering output, user interactions, form submissions, API calls made, navigation, error handling, state changes.
- **Setup and teardown patterns**: what `beforeEach`/`afterEach` do, how mocks are reset.

Build a mental model of what the implementation needs to do before writing any code.

### 3. Research the codebase

Before writing implementation code, explore existing patterns:

- **Read analogous implementations**: find similar features that already exist (e.g., if implementing a new form, find existing forms and their server actions). Mirror their patterns closely.
- **Read shared components**: understand the props and behavior of any shared UI components referenced in the tests (FormCard, FormField, FormSelect, etc.).
- **Read type definitions**: find existing types that are similar to what the tests expect.
- **Read related server actions**: if the tests mock a server action, find similar existing server actions to match their patterns.
- **Read API patterns**: understand how the back-end API is called (fetch wrappers, auth headers, error handling).

### 4. Ask clarifying questions

If anything is unclear after analyzing the tests and codebase, **ask the user before implementing**. Common things to clarify:

- Back-end API endpoint URLs, methods, request/response shapes (if not obvious from the mocks)
- Business logic that the tests imply but don't fully specify
- Where new files should live if the tests don't make the path obvious
- Relationships to other features or pages

### 5. Implement the functionality

Write the production code to make the tests pass:

- **Match existing codebase patterns exactly.** Follow the same file organization, naming conventions, component structure, and coding style found in analogous features.
- **Implement only what the tests require.** Don't add features, error handling, or UI elements that aren't tested.
- **Work incrementally.** Start with the simplest failing test and build up. Run the tests frequently with `npx jest <test-file> --no-coverage` to check progress.
- **Create new files as needed** for components, server actions, types, etc. — but only what the tests require.

### 6. Run the completion checklist

After all tests in the target file pass, run the full completion checklist from CLAUDE.md:

1. Run `npm run format` to format all files
2. Run `npm run lint:fix` to lint with safe code fixes applied
3. Run `npm run lint` to confirm no lint errors remain
4. Run `npm run typecheck` to confirm no TypeScript errors
5. Run `npm test` to confirm the **entire** test suite passes (not just the target tests)

If any step fails, fix the issue and re-run until everything is clean.

### 7. Report results

Provide a summary:

- Which test file(s) were targeted
- How many tests now pass
- What files were created or modified
- Any issues encountered and how they were resolved
