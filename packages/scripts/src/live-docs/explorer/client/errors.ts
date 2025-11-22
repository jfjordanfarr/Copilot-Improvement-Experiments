import { requireElement } from "./dom";

export function reportFatalExplorerError(error: unknown): void {
  try {
    console.error("Live Docs Explorer fatal error", error);
  } catch (consoleError) {
    consoleError;
  }

  const statsLine = document.getElementById("stats-line");
  if (statsLine) {
    const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
    statsLine.textContent = `Error: ${message}`;
  }

  const detailBody = document.getElementById("detail-body");
  if (detailBody) {
    const stack = error instanceof Error && error.stack ? error.stack : String(error ?? "Unknown error");
    const escaped = stack.replace(/[&<>]/g, character => {
      switch (character) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        default:
          return character;
      }
    });
    detailBody.innerHTML = `<pre style="white-space:pre-wrap;color:#f88;">${escaped}</pre>`;
  }

  const overlay = document.getElementById("detail-panel");
  overlay?.classList.add("visible");

  (window as Window & { __liveDocsExplorerError?: unknown }).__liveDocsExplorerError = error;
}

export function attachGlobalErrorHandler(): void {
  window.addEventListener("error", event => {
    const globalWindow = window as Window & { __liveDocsExplorerError?: unknown };
    if (globalWindow.__liveDocsExplorerError) {
      return;
    }
    const payload = (event as ErrorEvent).error ?? event.message ?? event;
    reportFatalExplorerError(payload);
  });
}
