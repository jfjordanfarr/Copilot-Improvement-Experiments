export function initializeTelemetry() {
  const hiddenField = document.getElementById("app-insights-key");
  if (!hiddenField) {
    console.warn("App Insights key field not present.");
    return;
  }

  const instrumentationKey = hiddenField.value;
  window.appTelemetryConfig = { instrumentationKey };
}
