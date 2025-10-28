using System;
using System.Collections.Generic;

namespace LinkAware.Diagnostics;

public sealed class RenderContext
{
    private readonly List<string> _events = new();

        public RenderContext(IDictionary<string, object?> state)
        {
                ArgumentNullException.ThrowIfNull(state);
                State = new Dictionary<string, object?>(state);
        }

    public IDictionary<string, object?> State { get; }

    public IReadOnlyList<string> Events => _events;

    public void Record(string message)
    {
        if (!string.IsNullOrWhiteSpace(message))
        {
            _events.Add(message);
        }
    }

    public T Require<T>(string key)
    {
        if (!State.TryGetValue(key, out var raw) || raw is not T typed)
        {
            throw new InvalidOperationException($"Render state missing required key '{key}'.");
        }

        return typed;
    }
}
