import { describe, expect, test } from "vitest";
import { duration } from "./duration.js";
import { parse } from "./parse.js";

describe("parse", () => {
  test("invalid input string", () => {
    expect(() => {
      parse("1s duration");
    }).toThrowError("Invalid input string");
    expect(() => {
      parse("1s\n1ms");
    }).toThrowError("Invalid input string");

    expect(() => {
      parse("1sduration");
    }).toThrowError("Invalid duration unit: sduration");
  });

  test("invalid output unit", () => {
    expect(() => {
      parse("1s", {
        // @ts-expect-error testing invalid output unit
        outputUnit: "invalid",
      });
    }).toThrowError(
      "Invalid output unit option, it must be present in the units array",
    );
  });

  describe("default options", () => {
    test.each<{
      args: Parameters<typeof parse>;
      out: ReturnType<typeof parse>;
    }>([
      { args: ["1d"], out: duration.d },
      { args: ["1d1s"], out: duration.d + duration.s },
      { args: ["2d 9s"], out: 2 * duration.d + 9 * duration.s },
      { args: ["6w\t2ms"], out: 6 * duration.w + 2 * duration.ms },
    ])("parse($args) => $out", ({ args, out }) => {
      expect(parse(...args)).toBe(out);
    });
  });

  describe("custom output unit", () => {
    test.each<{
      args: Parameters<typeof parse>;
      out: ReturnType<typeof parse>;
    }>([
      { args: ["1d", { outputUnit: "h" }], out: 24 },
      { args: ["1d", { outputUnit: "m" }], out: 24 * 60 },
      { args: ["1d2h", { outputUnit: "s" }], out: 24 * 60 * 60 + 2 * 60 * 60 },
      { args: ["2d", { outputUnit: "ms" }], out: 2 * 24 * 60 * 60 * 1000 },
    ])("parse($args) => $out", ({ args, out }) => {
      expect(parse(...args)).toBe(out);
    });
  });

  describe("custom units", () => {
    const units = [
      ["нед", 604800],
      ["д", 86400],
      ["с", 1],
    ] as const;

    test.each<{
      args: Parameters<typeof parse>;
      out: ReturnType<typeof parse>;
    }>([
      { args: ["0с", { units }], out: 0 },
      { args: ["1с", { units }], out: 1 },
      { args: ["3д", { units }], out: 3 * 86400 },
      { args: ["7нед", { units }], out: 7 * 604800 },
      { args: ["2д 5с", { units }], out: 2 * 86400 + 5 },
      {
        args: ["2д 5с", { units, outputUnit: "д" }],
        out: (2 * 86400 + 5) / 86400,
      },
      { args: ["7д", { units, outputUnit: "нед" }], out: 1 },
    ])("parse($args) => $out", ({ args, out }) => {
      expect(parse(...args)).toBe(out);
    });
  });
});
