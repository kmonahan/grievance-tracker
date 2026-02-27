---
name: write-tests
description: Write unit tests for new functionality based on user-provided requirements
disable-model-invocation: true
argument-hint: "[requirements or description of what to test]"
---

# Write Unit Tests

You are writing unit tests for new functionality that **does not exist yet**. The user will provide requirements and you will write tests that describe the expected behavior. The test suite is expected to fail until the functionality is implemented.

## Input

The user's requirements are: $ARGUMENTS

If no requirements were provided, ask the user to describe what they want tested.

## Workflow

### 1. Understand the requirements

Read the user's requirements carefully. If anything is unclear or ambiguous, **ask questions before writing any tests**. Pay attention to:

- API endpoints, HTTP methods, and request/response formats
- Expected success and error behaviors
- Where data comes from (form fields, props, server actions, etc.)
- How errors should be displayed and how form state should be preserved

### 2. Research the codebase

Before writing tests, thoroughly explore the codebase to understand:

- **Existing test patterns**: Read existing test files to match conventions (mocking style, setup/teardown, assertion patterns). Start with files in the same directory or related feature directories.
- **The component or module under test**: Read the source file that will be modified. Understand its current props, state, hooks, and rendering.
- **Related implementations**: Find analogous features that already exist (e.g., if testing a new form action, find existing form actions and their tests). Mirror their patterns.
- **Shared UI components**: Read any shared components used by the code under test (FormCard, FormField, FormSelect, etc.) to understand their props and rendered output.
- **Type definitions and state shapes**: Understand the state types used by `useActionState` and server actions in similar features.

### 3. Write the tests

Follow these rules:

- **Match existing patterns exactly.** Use the same mocking approach, `beforeEach` setup, describe/it structure, and assertion style found in existing tests.
- **Cover both positive and negative scenarios.** Test success paths, error paths, edge cases, and state preservation.
- **Create stub files if needed.** If the tests import a module that doesn't exist yet, create a minimal stub (type exports + a function that throws `"Not implemented"`) so Jest can load the test file. Keep stubs minimal.
- **Do not implement the actual functionality.** Only write tests and the minimum stubs needed for Jest to parse them.
- **Prefer adding to existing test files** when the tests relate to an existing component. Create new test files only for new modules (e.g., a new server action).

### 4. Verify

After writing all tests:

1. Run `npm run format` to format all files
2. Run `npm run lint:fix` to auto-fix lint issues
3. Run `npm run lint` to confirm no lint errors remain
4. Run the new tests with `npx jest <test-file>` to confirm:
   - The test file loads without parse/import errors
   - All **existing** tests in modified files still pass
   - The **new** tests fail as expected (since the implementation doesn't exist)
5. Report a summary: how many new tests were added, how many pass/fail, and what the tests cover
