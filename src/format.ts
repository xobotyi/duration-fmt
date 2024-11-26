import { DurationUnitNames, durationUnits, DurationUnits } from "./duration.js";

export type FormatOptions<
  DU extends DurationUnits<string>,
  U = DurationUnitNames<DU>,
> = {
  units?: DU;
  inputUnit?: U;

  separator?: string;
};

export function format<DU extends DurationUnits<string> = typeof durationUnits>(
  input: number,
  options?: FormatOptions<DU>,
): string {
  const opts = {
    units: durationUnits,
    separator: " ",

    ...options,
  };
  const smallestUnit = opts.units[opts.units.length - 1];
  opts.inputUnit ??= smallestUnit[0] as DurationUnitNames<DU>;
  let result: string[] = [];

  if (input < smallestUnit[1]) {
    return `0${smallestUnit[0]}`;
  }

  const inputUnit = opts.units.find(([unit]) => unit === opts.inputUnit);
  if (!inputUnit) {
    throw new Error(
      "Invalid input unit option, it must be present in the units array",
    );
  }

  input *= inputUnit[1];

  for (const [unit, unitVal] of opts.units) {
    const value = Math.floor(input / unitVal);
    if (value > 0) {
      result.push(`${value}${unit}`);

      input -= value * unitVal;
    }
  }

  return result.join(opts.separator);
}
