using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace LinkAware.Diagnostics;

/// <summary>
/// Maintains widget registrations and surfaces change notifications.
/// </summary>
/// <remarks>
/// <para>Widget registries coordinate cross-module widget discovery.</para>
/// <para>Thread-safety is provided by a concurrent dictionary shared by all callers.</para>
/// </remarks>
/// <seealso href="../../docs/registry.md">Widget architecture</seealso>
public sealed class WidgetRegistry
{
    private readonly ConcurrentDictionary<string, BaseWidget> _widgets = new(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Raised when a widget is successfully added to the registry.
    /// </summary>
    /// <remarks>
    /// Subscribers receive <see cref="WidgetRegisteredEventArgs"/> instances describing the change.
    /// </remarks>
    public event EventHandler<WidgetRegisteredEventArgs>? WidgetRegistered;

    /// <summary>
    /// Attempts to register a widget and emits <see cref="WidgetRegistered"/> upon success.
    /// </summary>
    /// <remarks>
    /// <para>Duplicate registrations update existing entries when <paramref name="widget"/> shares the same name.</para>
    /// <para>Generated events run on the caller's thread.</para>
    /// </remarks>
    /// <param name="widget">The widget instance being registered.</param>
    /// <returns><see langword="true"/> when the widget is added; otherwise <see langword="false"/>.</returns>
    /// <exception cref="ArgumentNullException">Thrown when <paramref name="widget"/> is <see langword="null"/>.</exception>
    /// <example>
    /// Registers a widget and inspects the resulting event payload.
    /// <code lang="csharp">
    /// var registry = new WidgetRegistry();
    /// var widget = new CompositeWidget("alpha");
    /// registry.TryRegister(widget);
    /// </code>
    /// </example>
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

    /// <summary>
    /// Returns all registered widgets in insertion order.
    /// </summary>
    /// <value>The ordered collection of registered widgets.</value>
    public IReadOnlyCollection<BaseWidget> All => _widgets.Values;

    /// <summary>
    /// Resolves a widget by name or returns <c>null</c> when not found.
    /// </summary>
    /// <param name="name">The widget name used to locate existing registrations.</param>
    /// <returns>The registered widget, or <c>null</c> when the name is unknown.</returns>
    /// <remarks>Lookup is case-insensitive.</remarks>
    /// <exception cref="ArgumentNullException">Thrown when <paramref name="name"/> is <see langword="null"/>.</exception>
    public BaseWidget? Resolve(string name)
    {
        ArgumentNullException.ThrowIfNull(name);
        _widgets.TryGetValue(name, out var widget);
        return widget;
    }

    /// <summary>
    /// Attempts to merge an incoming widget into the stored entry.
    /// </summary>
    /// <remarks>Delegates to <see cref="BaseWidget.TryMerge(BaseWidget)"/> for the merge semantics.</remarks>
    /// <param name="widget">The incoming widget to merge.</param>
    /// <returns><see langword="true"/> when the widget merged successfully; otherwise <see langword="false"/>.</returns>
    /// <exception cref="ArgumentNullException">Thrown when <paramref name="widget"/> is <see langword="null"/>.</exception>
    /// <seealso cref="Resolve(string)"/>
    public bool TryMerge(BaseWidget widget)
    {
        ArgumentNullException.ThrowIfNull(widget);

        if (!_widgets.TryGetValue(widget.Name, out var existing))
        {
            return false;
        }

        return existing.TryMerge(widget);
    }

    /// <inheritdoc cref="WidgetRegistered"/>
    protected virtual void OnWidgetRegistered(WidgetRegisteredEventArgs args)
    {
        WidgetRegistered?.Invoke(this, args);
    }
}

/// <summary>
/// Describes the widget that triggered a registration event.
/// </summary>
/// <remarks>Provides access to the widget and its registration timestamp.</remarks>
/// <seealso cref="WidgetRegistered"/>
public sealed class WidgetRegisteredEventArgs : EventArgs
{
    internal WidgetRegisteredEventArgs(BaseWidget widget)
    {
        Widget = widget;
        RegisteredAt = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// The widget that triggered the event.
    /// </summary>
    /// <value>The widget instance passed to the registration event.</value>
    public BaseWidget Widget { get; }

    /// <summary>
    /// Time when the widget was registered.
    /// </summary>
    /// <value>A UTC timestamp captured at registration time.</value>
    public DateTimeOffset RegisteredAt { get; }
}
