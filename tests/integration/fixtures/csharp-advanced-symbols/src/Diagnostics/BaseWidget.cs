using System;
using System.Collections.Generic;
using System.Linq;

namespace LinkAware.Diagnostics;

public abstract class BaseWidget
{
    protected BaseWidget(string name)
    {
        Name = name ?? throw new ArgumentNullException(nameof(name));
    }

    public string Name { get; }

    internal WidgetMetadata Metadata { get; private set; } = WidgetMetadata.Empty;

    public WidgetSnapshot Render(RenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        var dependencies = CollectDependencies()
            .Where(static candidate => !string.IsNullOrWhiteSpace(candidate))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        RenderCore(context);
        return new WidgetSnapshot(Name, dependencies, Metadata, context.Events);
    }

    protected internal abstract void RenderCore(RenderContext context);

    protected internal virtual IEnumerable<string> CollectDependencies()
    {
        yield break;
    }

    protected void UpdateMetadata(Func<WidgetMetadata, WidgetMetadata> mutator)
    {
        ArgumentNullException.ThrowIfNull(mutator);
        Metadata = mutator(Metadata);
    }

    protected internal virtual bool TryMerge(BaseWidget other)
    {
        ArgumentNullException.ThrowIfNull(other);
        return false;
    }
}
