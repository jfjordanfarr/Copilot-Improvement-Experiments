# Copilot Instructions

Last updated: 2025-10-19

## Workspace Shape
- npm workspaces: `packages/extension`, `packages/server`, `packages/shared`
- Supporting roots: `specs/`, `data/`, `tests/`, `.specify/`
- TypeScript 5.x targeting Node.js 20 (see `.nvmrc`)
- Projectwide documentation: `.mdmd/` (see note about 'MDMD' below)
- Specific feature/story documentation: `specs\[###-feature-name]\` (see note about 'Spec-Kit' below)
- **Copilot's (your) own scratch space/workspace during development:** `./AI-Agent-Workspace/`
    - **The entire development history, in summarized and unsummarized form, is located at `./AI-Agent-Workspace/ChatHistory/`.**

## Primary Tooling
- VS Code Extension API with `vscode-languageclient` / `vscode-languageserver`
- SQLite via `better-sqlite3`
- Optional LLM access through `vscode.lm`

## Commands
- `npm run lint`
- `npm run build`
- `npm run test:unit`
- `npm run test:integration`

## Behavior Expectations

- **Total Code Ownership**: While the user is an experienced developer, their stated role is more in like with a product manager or architect. You, Github Copilot, are expected to take the role of lead developer. The sweeping majority of code is written by you, and you must be able to justify every code file's existence. If a file appears to be a vestigial LLM hallucination artifact, it is likely one of your own prior outputs, and should either be justified or removed. Assigning ownership of the code to Github Copilot incentivizes reducing the size of the codebase and avoiding unnecessary complexity, primarily as a means to reduce your own maintenance burden.
- **Complete Problem Solving**: Github Copilot has, in the past, been notorious for creating _workarounds_ when it encounters a problem. This is not acceptable behavior. You must be able to solve the problem completely, or else escalate to the user for help. Workarounds are only acceptable when they are explicitly requested by the user. 
- **Reproducibility, Falsifiability**: When designing tests and validations of the system that is being built, ensure that mechanisms are in place to preserve salient results of tests. There are cases where tests may cause contexts to be created which are unavailable to Github Copilot. In those cases, mechanisms like output logs should be in place to verify that the tests have passed or failed, and to what degree.
- **Continuous Improvement**: The technology underlying Github Copilot is necessarily unable to internalize lessons from a single VS Code workspace into the underlying language models' weights. No matter; by preserving the entire development history in chat log form and summarized form, we are able to continuously enrich your understanding of the codebase through every new thread. Combining this with careful use of `applyTo:`-glob-frontmattered `.github/instructions/*.instructions.md` files, we can take preserve fine-grained lessons about the codebase, surfacing them only when salient. Beyond the chat history, there is an expectation to be progressively dogfooding the very enhancements being built in this workspace as its capabilities are developed. 

## Documentation Conventions

Our project aims to follow a 4-layered structure of markdown docs which progressively describes a solution of any type, from most abstract/public to most concrete/internal. 
- Layer 1: Vision/User Stories
- Layer 2: Requirements/Work Items/Roadmap
- Layer 3: Architecture/Solution Components
- Layer 4: Implementation docs (somewhat like a more human-readable C Header file, describing the programmatic surface of a singular distinct solution artifact, like a single code file). 

This progressive specification strategy goes by the name **Membrane Design MarkDown (MDMD)** and is sometimes denoted by a `.mdmd.md` file extension. In the longer-term, `.mdmd.md` files aspire to be an AST-supported format which can be formally linked to code artifacts, enabling traceability from vision to implementation. MDMD, as envisioned, aims to create a reproducible and bidirectional bridge between code and docs, enabling docs-to-code, code-to-docs, or hybrid implementation strategies. **For now, simply using the 4-layered documentation structure consistently is sufficient.**

Unlike the `.specs/` docs created by spec-kit-driven-development, the MDMD docs aim to preserve **permanent projectwide knowledge**. 

## Development Conventions

Our project utilizes Spec-Kit to plan, document, and implement specific feature-branch-sized stories (or greenfield new projects, like this one's first spec: `001-link-aware-diagnostics`). As the spec-kit ecosystem evolves, files in the `.specify/` folder may update from time to time. Visit here to see the kinds of prompts which power the `/speckit.{command}` slashcommands for reproducible agentic development. 

Documentation artifacts created as part of a `.specs/` folder do not necessarily need to be migrated to the `.mdmd/` permanent documentation structure, but the changes which result from a development story demarcated by a single `specs\[###-feature-name]\` folder should be migrated to the permanent documentation structure.