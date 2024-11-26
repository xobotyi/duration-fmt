import { describe, expect, test } from "vitest";
import { format } from "./format.js";

describe("format", () => {
  describe("default options", () => {
    test.each<{
      args: Parameters<typeof format>;
      out: ReturnType<typeof format>;
    }>([
      { args: [0], out: "0ms" },
      { args: [1], out: "1ms" },
      { args: [1000], out: "1s" },
      { args: [3000], out: "3s" },
      { args: [1050], out: "1s 50ms" },
      { args: [61001], out: "1m 1s 1ms" },
      { args: [3601001], out: "1h 1s 1ms" },
      { args: [86461001], out: "1d 1m 1s 1ms" },
      { args: [604801000], out: "1w 1s" },
    ])("format($args) => $out", ({ args, out }) => {
      expect(format(...args)).toBe(out);
    });
  });

  describe("improper options", () => {
    test("throws an error when input unit is not in the units array", () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        format(1, { inputUnit: "y" });
      }).toThrowError(
        "Invalid input unit option, it must be present in the units array",
      );
    });
  });

  describe("custom separator", () => {
    test.each<{
      args: Parameters<typeof format>;
      out: ReturnType<typeof format>;
    }>([
      { args: [1001, { separator: "-" }], out: "1s-1ms" },
      { args: [61001, { separator: "" }], out: "1m1s1ms" },
      { args: [3601001, { separator: "-" }], out: "1h-1s-1ms" },
      { args: [86461001, { separator: "" }], out: "1d1m1s1ms" },
    ])("format($args) => $out", ({ args, out }) => {
      expect(format(...args)).toBe(out);
    });
  });

  describe("custom input unit", () => {
    test.each<{
      args: Parameters<typeof format>;
      out: ReturnType<typeof format>;
    }>([
      { args: [60, { inputUnit: "s" }], out: "1m" },
      { args: [60, { inputUnit: "m" }], out: "1h" },
      { args: [24, { inputUnit: "h" }], out: "1d" },
      { args: [604800, { inputUnit: "s" }], out: "1w" },
    ])("format($args) => $out", ({ args, out }) => {
      expect(format(...args)).toBe(out);
    });
  });

  describe("custom units", () => {
    const units = [
      ["нед", 604800],
      ["д", 86400],
      ["с", 1],
    ] as const;

    test.each<{
      args: Parameters<typeof format>;
      out: ReturnType<typeof format>;
    }>([
      { args: [0, { units }], out: "0с" },
      { args: [1, { units }], out: "1с" },
      { args: [3 * 86400, { units }], out: "3д" },
      { args: [7 * 604800, { units }], out: "7нед" },
      { args: [2 * 86400 + 5, { units }], out: "2д 5с" },
      { args: [3, { units, inputUnit: "д" }], out: "3д" },
      { args: [1, { units, inputUnit: "нед" }], out: "1нед" },
    ])("format($args) => $out", ({ args, out }) => {
      expect(format(...args)).toBe(out);
    });
  });
});
