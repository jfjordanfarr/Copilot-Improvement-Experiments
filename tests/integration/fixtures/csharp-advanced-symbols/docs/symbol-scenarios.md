# Symbol Coverage Scenarios

## Merge Semantics

`SymbolDriftWidget` demonstrates how internal merge logic can be safely exposed without opening the
class to the public API surface. The overridden
[`TryMerge`](../src/Diagnostics/Widgets/SymbolDriftWidget.cs) method must still be detected as a
symbol so documentation tooling can track drift remediation.

## Metadata Orchestration

`LatencyProbeWidget` attaches telemetry metadata via
[`UpdateMetadata`](../src/Diagnostics/BaseWidget.cs#L29) to ensure downstream diagnostics surface
context tags. The probe relies on [`RenderContext.Require`](../src/Diagnostics/RenderContext.cs#L24)
to enforce state contracts while populating event logs.

## Extension Hints

[`WidgetExtensions`](../src/Diagnostics/Extensions/WidgetExtensions.cs) provides an internal helper
used only in test harnesses. Our linting should continue to track these helpers even when they are
non-public and live under nested namespaces.

## Composite Aggregation

[`CompositeWidget`](../src/Diagnostics/Widgets/CompositeWidget.cs) sequences multiple widgets under a
single render loop so dependency fan-out remains observable. Its override of
[`CollectDependencies`](../src/Diagnostics/Widgets/CompositeWidget.cs#L26) hydrates downstream
analytics for every child widget.

## Snapshot Introspection

[`WidgetSnapshot`](../src/Diagnostics/WidgetSnapshot.cs) records the metadata emitted by a widget
render cycle. The fixtures assert that [`FlattenDependencies`](../src/Diagnostics/Extensions/WidgetExtensions.cs#L8)
exposes the snapshot output for audit pipelines.
