using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;

namespace BlazorTelemetry.Pages;

public class HostModel : PageModel
{
    public HostModel(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    private IConfiguration Configuration { get; }

    public string TelemetryEndpoint => Configuration["Telemetry:Endpoint"] ?? string.Empty;

    public string InstrumentationKey => Configuration["Telemetry:InstrumentationKey"] ?? string.Empty;
}
