using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace LinkAware.Diagnostics;

public sealed class WidgetRegistry
{
    private readonly ConcurrentDictionary<string, BaseWidget> _widgets = new(StringComparer.OrdinalIgnoreCase);

    public event EventHandler<WidgetRegisteredEventArgs>? WidgetRegistered;

    public bool TryRegister(BaseWidget widget)
    {
        ArgumentNullException.ThrowIfNull(widget);

        var added = _widgets.TryAdd(widget.Name, widget);
        if (added)
        {
            OnWidgetRegistered(new WidgetRegisteredEventArgs(widget));
        }

        return added;
    }

    public IReadOnlyCollection<BaseWidget> All => _widgets.Values;

    public BaseWidget? Resolve(string name)
    {
        ArgumentNullException.ThrowIfNull(name);
        _widgets.TryGetValue(name, out var widget);
        return widget;
    }

    public bool TryMerge(BaseWidget widget)
    {
        ArgumentNullException.ThrowIfNull(widget);

        if (!_widgets.TryGetValue(widget.Name, out var existing))
        {
            return false;
        }

        return existing.TryMerge(widget);
    }

    protected virtual void OnWidgetRegistered(WidgetRegisteredEventArgs args)
    {
        WidgetRegistered?.Invoke(this, args);
    }
}

public sealed class WidgetRegisteredEventArgs : EventArgs
{
    internal WidgetRegisteredEventArgs(BaseWidget widget)
    {
        Widget = widget;
        RegisteredAt = DateTimeOffset.UtcNow;
    }

    public BaseWidget Widget { get; }

    public DateTimeOffset RegisteredAt { get; }
}
