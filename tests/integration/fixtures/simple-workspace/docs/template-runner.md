# Template Runner

The template runner keeps the configuration scaffold aligned with diagnostics scenarios.

- [`scripts/applyTemplate.ts`](../scripts/applyTemplate.ts) defines the `applyTemplate` entry point.
- The `applyTemplate` function renders `templates/config.template.yaml` into the workspace while
  preserving the placeholder structure required by US5 integration tests.
