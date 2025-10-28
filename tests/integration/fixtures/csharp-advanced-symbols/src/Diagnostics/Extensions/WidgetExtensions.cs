using System.Collections.Generic;

namespace LinkAware.Diagnostics.Extensions;

using LinkAware.Diagnostics;

internal static class WidgetExtensions
{
    internal static IReadOnlyList<string> FlattenDependencies(this BaseWidget widget, RenderContext context)
    {
        var snapshot = widget.Render(context);
        return snapshot.Dependencies;
    }
}
