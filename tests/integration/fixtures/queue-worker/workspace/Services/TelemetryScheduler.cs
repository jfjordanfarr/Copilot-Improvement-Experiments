using Hangfire;
using QueueWorker.Workers;

namespace QueueWorker.Services;

public class TelemetryScheduler
{
    private readonly IRecurringJobManager _recurringJobs;

    public TelemetryScheduler(IRecurringJobManager recurringJobs)
    {
        _recurringJobs = recurringJobs;
    }

    public void Configure()
    {
        _recurringJobs.AddOrUpdate<TelemetryWorker>("telemetry-daily", job => job.Process("daily"), Cron.Daily);
    }
}
