using System.Collections.Generic;

namespace LinkAware.Diagnostics.Widgets;

public abstract class CompositeWidget : BaseWidget
{
    private readonly List<BaseWidget> _children = new();

    protected CompositeWidget(string name) : base(name)
    {
    }

    protected internal override void RenderCore(RenderContext context)
    {
        foreach (var child in _children)
        {
            child.Render(context);
        }
    }

    public void AttachChild(BaseWidget widget)
    {
        if (!_children.Contains(widget))
        {
            _children.Add(widget);
        }
    }

    protected internal override IEnumerable<string> CollectDependencies()
    {
        foreach (var dependency in base.CollectDependencies())
        {
            yield return dependency;
        }

        foreach (var child in _children)
        {
            yield return $"widget:{child.Name}";
        }
    }
}
