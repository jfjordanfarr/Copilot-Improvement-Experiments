# Architecture Overview

This document captures the architecture of the `simple-workspace` fixture that underpins the US1–US3 integration suite.

## Core Module

The core module implements the primary business logic for evaluating change ripples. Implementation specifics live in [`src/core.ts`](../src/core.ts), and the exported surface is catalogued in the [implementation map](./implementation-map.md).

## Data Flow

Requests move through a short pipeline: the feature evaluator in [`src/feature.ts`](../src/feature.ts) asks helpers in [`src/util.ts`](../src/util.ts) to normalise inputs, while [`src/dataAlpha.ts`](../src/dataAlpha.ts) and [`src/dataBeta.ts`](../src/dataBeta.ts) provide contrasting data sets for regression coverage.

## Breaking Change Scenario

Integration tests append extra notes under this heading when simulating release-impact discussions. Keep the title stable so the diagnostics can anchor to it, but ensure the body stays concise to avoid duplicate-heading lint noise.

## Updated Section Placeholder

Quick-fix automation writes provisional updates here before promoting them into long-form documents. Tests assume the heading text is unchanged.

## Hysteresis Test Scenario

Reciprocal diagnostic suppression checks mutate this section while ensuring previously acknowledged warnings stay quenched across repeated runs.