using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;

public class IndexModel : PageModel
{
    private readonly IConfiguration _configuration;

    public IndexModel(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string InstrumentationKey { get; private set; } = string.Empty;

    public void OnGet()
    {
        InstrumentationKey = _configuration["Telemetry:InstrumentationKey"] ?? string.Empty;
    }
}
