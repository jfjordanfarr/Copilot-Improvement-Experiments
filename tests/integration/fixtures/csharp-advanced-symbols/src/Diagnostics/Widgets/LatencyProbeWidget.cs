using System.Collections.Generic;

namespace LinkAware.Diagnostics.Widgets;

public sealed class LatencyProbeWidget : BaseWidget
{
    public LatencyProbeWidget() : base("LatencyProbe")
    {
        UpdateMetadata(static metadata => metadata.WithTag("telemetry"));
    }

    protected internal override void RenderCore(RenderContext context)
    {
        context.Record("Latency probe executed");
        var threshold = context.Require<int>("thresholdMilliseconds");
        context.Record($"Threshold: {threshold}ms");
    }

    protected internal override IEnumerable<string> CollectDependencies()
    {
        yield return "diagnostics/pipeline";
        yield return "diagnostics/hysteresis";
        yield return "diagnostics/batching";
    }
}
