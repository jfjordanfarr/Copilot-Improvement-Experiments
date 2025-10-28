# Widget Registry Overview

The registry coordinates diagnostics widgets that model ripple propagation. Each widget exposes a
protected surface area so the platform can merge overrides without leaking implementation details.

- [`WidgetRegistry`](../src/Diagnostics/WidgetRegistry.cs) keeps a canonical list of widgets and
  promotes merge semantics via [`BaseWidget.TryMerge`](../src/Diagnostics/BaseWidget.cs).
- [`LatencyProbeWidget`](../src/Diagnostics/Widgets/LatencyProbeWidget.cs) instruments latency
  thresholds and requires `thresholdMilliseconds` state when rendering.
- [`SymbolDriftWidget`](../src/Diagnostics/Widgets/SymbolDriftWidget.cs) tracks recent
  acknowledgements and exposes its merge behaviour through `protected internal` overrides.
- [`RenderContext`](../src/Diagnostics/RenderContext.cs) enforces required render state and records
  instrumentation events for every widget subscription.
- [`WidgetMetadata`](../src/Diagnostics/WidgetMetadata.cs) normalises tag metadata and exposes the
  [`WithTag`](../src/Diagnostics/WidgetMetadata.cs#L25) helper used across diagnostics widgets.
- [`WidgetRegisteredEventArgs`](../src/Diagnostics/WidgetRegistry.cs#L39) surfaces registration
  telemetry so downstream audits can reconcile widget discovery ordering.

Additional symbol analysis scenarios live in [`docs/symbol-scenarios.md`](symbol-scenarios.md).
