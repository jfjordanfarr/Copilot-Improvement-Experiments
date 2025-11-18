const telemetryElement = document.getElementById("telemetry-endpoint");

if (telemetryElement) {
  const endpoint = telemetryElement.getAttribute("data-endpoint") ?? "";
  const instrumentationKey = telemetryElement.getAttribute("data-instrumentation") ?? "";

  window.__blazorTelemetry = {
    endpoint,
    instrumentationKey
  };
}
