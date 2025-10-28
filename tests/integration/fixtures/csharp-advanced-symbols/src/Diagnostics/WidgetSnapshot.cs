using System.Collections.Generic;

namespace LinkAware.Diagnostics;

public readonly record struct WidgetSnapshot(
    string Name,
    IReadOnlyList<string> Dependencies,
    WidgetMetadata Metadata,
    IReadOnlyList<string> Events);
