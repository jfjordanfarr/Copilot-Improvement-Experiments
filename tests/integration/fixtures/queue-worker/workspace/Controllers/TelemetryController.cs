using System;
using Hangfire;
using Microsoft.AspNetCore.Mvc;
using QueueWorker.Workers;

namespace QueueWorker.Controllers;

[ApiController]
[Route("api/telemetry")]
public class TelemetryController : ControllerBase
{
    [HttpPost]
    public IActionResult Record()
    {
        BackgroundJob.Enqueue<TelemetryWorker>(worker => worker.Process("battery"));
        BackgroundJob.Schedule<TelemetryWorker>(worker => worker.Process("maintenance"), TimeSpan.FromMinutes(5));
        return Accepted();
    }
}
