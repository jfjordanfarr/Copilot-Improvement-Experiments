using System;
using Microsoft.Extensions.Configuration;

namespace QueueWorker.Workers;

public class TelemetryWorker
{
    private readonly IConfiguration _configuration;

    public TelemetryWorker(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Process(string payload)
    {
        var queueName = _configuration["Hangfire:Queue"];
        if (string.IsNullOrWhiteSpace(queueName))
        {
            throw new InvalidOperationException("Queue configuration missing");
        }

        _ = payload + queueName;
    }
}
