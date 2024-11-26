import { DurationUnitNames, durationUnits, DurationUnits } from "./duration.js";

const parseRX = /(\d+)(\p{L}+)[\t ]*/giu;

type ParseOptions<
  DU extends DurationUnits<string>,
  U = DurationUnitNames<DU>,
> = {
  units?: DU;
  outputUnit?: U;
};

export function parse<DU extends DurationUnits<string> = typeof durationUnits>(
  input: string,
  options?: ParseOptions<DU>,
): number {
  const opts = {
    units: durationUnits,

    ...options,
  };

  if (opts.outputUnit === undefined) {
    opts.outputUnit = opts.units[
      opts.units.length - 1
    ][0] as DurationUnitNames<DU>;
  }

  const outputUnit = opts.units.find(([unit]) => unit === opts.outputUnit);
  if (!outputUnit) {
    throw new Error(
      "Invalid output unit option, it must be present in the units array",
    );
  }

  let matchedLength = 0;
  let result = 0;

  for (const match of input.matchAll(parseRX)) {
    matchedLength += match[0].length;
    const [, amount, unit] = match;

    const unitData = opts.units.find(([u]) => u === unit);
    if (unitData === undefined) {
      throw new Error(`Invalid duration unit: ${unit}`);
    }

    result += +amount * unitData[1];
  }

  if (matchedLength != input.length) {
    throw new Error("Invalid input string");
  }

  return result / outputUnit[1];
}
