# Contributing to Atlas Marketplace

Thanks for taking the time to contribute! This project is a portfolio/demo storefront, so feel free to use it as a playground — but please follow these ground rules.

## Getting Started

1. Fork the repository and clone your fork.
2. Create a branch: `git checkout -b feat/your-feature` (use `fix/` for bugfixes, `chore/` for maintenance).
3. Run the app: `npm install && npm run dev`.

## Development Commands

```bash
npm run dev     # start the dev server
npm run lint    # run ESLint (must pass)
npm run build   # production build (must pass)
```

## Before Submitting

- Run `npm run lint` and `npm run build` and make sure both pass.
- Keep changes focused — one patch, one purpose.
- Confirm the feature still works in offline demo mode (no backend running).
- Update `README.md` if you changed public-facing behavior or environment variables.

## Commit Messages

Follow the conventional commits style:

```
feat(scope): description
fix(scope): description
docs: description
chore: description
```

## Opening a Pull Request

- Base your PR on the `dev` branch.
- Fill out the [pull request template](.github/pull_request_template.md).
- Reference any related issue in the description.

## Code Conventions

Preserve the existing patterns:

- TypeScript strict mode, no `any`.
- React Server Components by default; client components opt in with `"use client"`.
- No new comments unless they explain non-obvious decisions.
- Demo data and localization-friendly copy live in `src/lib/demo/`.

## Questions?

Open an issue tagged `question` and someone will get back to you.