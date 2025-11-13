using System.Collections.Generic;

namespace LinkAware.Diagnostics.Extensions;

using LinkAware.Diagnostics;

/// <summary>
/// Provides helpers for flattening widget dependency graphs.
/// </summary>
internal static class WidgetExtensions
{
    internal static IReadOnlyList<string> FlattenDependencies(this BaseWidget widget, RenderContext context)
    {
        var snapshot = widget.Render(context);
        return snapshot.Dependencies;
    }
}
