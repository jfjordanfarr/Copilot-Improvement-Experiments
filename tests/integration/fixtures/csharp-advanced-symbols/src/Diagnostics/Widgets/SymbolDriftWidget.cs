using System;
using System.Collections.Generic;

namespace LinkAware.Diagnostics.Widgets;

internal sealed class SymbolDriftWidget : BaseWidget
{
    private readonly HashSet<string> _recentlyAcknowledged;

    internal SymbolDriftWidget(IEnumerable<string> acknowledgements)
        : base("SymbolDrift")
    {
    _recentlyAcknowledged = new HashSet<string>(acknowledgements, StringComparer.OrdinalIgnoreCase);
        UpdateMetadata(metadata => metadata.WithTag("symbol-coverage"));
    }

    protected internal override void RenderCore(RenderContext context)
    {
        foreach (var entry in _recentlyAcknowledged)
        {
            context.Record($"ack:{entry}");
        }
    }

    protected internal override IEnumerable<string> CollectDependencies()
    {
        yield return "docs/symbol-scenarios.md";
        yield return "docs/registry.md";
    }

    protected internal override bool TryMerge(BaseWidget other)
    {
        if (other is not SymbolDriftWidget drift)
        {
            return false;
        }

        foreach (var symbol in drift._recentlyAcknowledged)
        {
            _recentlyAcknowledged.Add(symbol);
        }

        return true;
    }
}
