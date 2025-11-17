function initializeTelemetry() {
  const hiddenField = document.getElementById("AppInsightsInstrumentationKey");
  if (!hiddenField) {
    console.warn("Instrumentation key hidden field missing");
    return;
  }

  const instrumentationKey = hiddenField.value;
  window.appInsightsConfig = { instrumentationKey };
}

export { initializeTelemetry };
