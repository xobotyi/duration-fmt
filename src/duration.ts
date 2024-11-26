export const duration: Record<string, number> = {};

duration.ms = 1;
duration.s = 1000 * duration.ms;
duration.m = 60 * duration.s;
duration.h = 60 * duration.m;
duration.d = 24 * duration.h;
duration.w = 7 * duration.d;
duration.mo = 30 * duration.d;
duration.y = 365 * duration.d;

/**
 * Describes a duration unit precedence order, its text representation and its value.
 * Order goes from the largest unit to the smallest.
 * All units must be a multiple of the smallest unit.
 */
export type DurationUnits<U extends string> = readonly (readonly [U, number])[];

export type DurationUnitNames<DU> =
  DU extends DurationUnits<infer U> ? U : never;

export const durationUnits = [
  ["w", duration.w],
  ["d", duration.d],
  ["h", duration.h],
  ["m", duration.m],
  ["s", duration.s],
  ["ms", duration.ms],
] as const;
