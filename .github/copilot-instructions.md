# Copilot-Improvement-Experiments Development Guidelines

Auto-generated from feature plans. Last updated: 2025-10-17

## Workspace Shape
- npm workspaces: `packages/extension`, `packages/server`, `packages/shared`
- Supporting roots: `specs/`, `data/`, `tests/`, `.specify/`
- TypeScript 5.x targeting Node.js 20 (see `.nvmrc`)

## Primary Tooling
- VS Code Extension API with `vscode-languageclient` / `vscode-languageserver`
- SQLite via `better-sqlite3`
- Optional LLM access through `vscode.lm`

## Commands
- `npm run lint`
- `npm run build`
- `npm run test:unit`
- `npm run test:integration`