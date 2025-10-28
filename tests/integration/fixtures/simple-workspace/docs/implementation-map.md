# Implementation Map

This catalog ties the simple workspace implementation files back to the symbols that integration
stories depend on. Each section links directly to the source artifact so graph audits can confirm
coverage while SlopCop symbol linting keeps the documentation honest.

## Core Request Processor

[`src/core.ts`](../src/core.ts) defines the `Request`/`Response` contracts and coordinates
`processRequest` with `validateRequest` when the extension evaluates file changes.

## Feature Evaluation Surface

[`src/feature.ts`](../src/feature.ts) describes the `FeatureEvaluation` domain object and provides
`evaluateFeature` plus the `executeFeature` entry point used across diagnostics stories.

## Payload Builders

[`src/dataAlpha.ts`](../src/dataAlpha.ts) keeps the `createAlphaPayload` factory that US4 mutates
during scoped identifier collision tests.

[`src/dataBeta.ts`](../src/dataBeta.ts) mirrors the alpha payload construction via
`createBetaPayload`, giving the suite contrasting data inputs without cross-file ripples.

## Normalization Utilities

[`src/util.ts`](../src/util.ts) exports `PrimitiveValue`, `NormalizedValue`, `NormalizedArray`, and
`NormalizedObject` alongside the `normalizeValue` and `summarizeShape` helpers that the request
processor relies upon.
