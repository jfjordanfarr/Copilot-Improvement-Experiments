using System;
using System.Collections.Generic;
using System.Linq;

namespace LinkAware.Diagnostics;

public readonly struct WidgetMetadata
{
    public WidgetMetadata(string category, string? description, IReadOnlyList<string> tags)
    {
        Category = string.IsNullOrWhiteSpace(category) ? "unspecified" : category;
        Description = description;
        Tags = tags ?? Array.Empty<string>();
    }

    public string Category { get; }

    public string? Description { get; }

    public IReadOnlyList<string> Tags { get; }

    public static WidgetMetadata Empty { get; } = new WidgetMetadata("unspecified", null, Array.Empty<string>());

    internal WidgetMetadata WithTag(string tag)
    {
        if (string.IsNullOrWhiteSpace(tag))
        {
            return this;
        }

        var buffer = Tags.ToList();
        if (!buffer.Contains(tag, StringComparer.OrdinalIgnoreCase))
        {
            buffer.Add(tag);
        }

        return new WidgetMetadata(Category, Description, buffer);
    }
}
