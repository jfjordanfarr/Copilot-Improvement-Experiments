import { describe, expect, it } from "vitest";

import { HysteresisController } from "./hysteresisController";

describe("HysteresisController", () => {
  it("suppresses reciprocal emissions within hysteresis window", () => {
    let now = 0;
    const controller = new HysteresisController({ now: () => new Date(now) });

    controller.recordEmission("file:///a.md", "file:///b.ts", "change-a");

    expect(controller.shouldSuppress("file:///b.ts", "file:///a.md", 1000)).toBe(true);

    now = 1501;
    expect(controller.shouldSuppress("file:///b.ts", "file:///a.md", 1000)).toBe(false);
  });

  it("allows explicit acknowledgement to clear suppression state", () => {
    const controller = new HysteresisController({ now: () => new Date(0) });

    controller.recordEmission("file:///docs.md", "file:///impl.ts", "change-1");
    expect(controller.shouldSuppress("file:///impl.ts", "file:///docs.md", 1000)).toBe(true);

    controller.acknowledge("file:///docs.md", "file:///impl.ts");
    expect(controller.shouldSuppress("file:///impl.ts", "file:///docs.md", 1000)).toBe(false);
  });

  it("trims oldest entries when capacity is exceeded", () => {
    let now = 0;
    const controller = new HysteresisController({ now: () => new Date(now), maxEntries: 2 });

    controller.recordEmission("file:///one.md", "file:///two.ts");
    now = 10;
    controller.recordEmission("file:///alpha.md", "file:///beta.ts");
    now = 20;
    controller.recordEmission("file:///red.md", "file:///blue.ts");

    expect(controller.getActiveCount()).toBe(2);
    expect(controller.shouldSuppress("file:///two.ts", "file:///one.md", 1000)).toBe(false);
  });
});
