import { type DurationUnitNames, durationUnits, type DurationUnits } from './duration.js';

export type FormatOptions<DU extends DurationUnits<string>, U = DurationUnitNames<DU>> = {
	units?: DU;
	inputUnit?: U;

	separator?: string;
};

export function format<DU extends DurationUnits<string> = typeof durationUnits>(
	input: number,
	options?: FormatOptions<DU>
): string {
	const options_ = {
		units: durationUnits,
		separator: ' ',

		...options,
	};
	const smallestUnit = options_.units.at(-1);
	options_.inputUnit ??= smallestUnit[0] as DurationUnitNames<DU>;
	const result: string[] = [];

	if (input < smallestUnit[1]) {
		return `0${smallestUnit[0]}`;
	}

	const inputUnit = options_.units.find(([unit]) => unit === options_.inputUnit);
	if (!inputUnit) {
		throw new Error('Invalid input unit option, it must be present in the units array');
	}

	input *= inputUnit[1];

	for (const [unit, unitValue] of options_.units) {
		const value = Math.floor(input / unitValue);
		if (value > 0) {
			result.push(`${value}${unit}`);

			input -= value * unitValue;
		}
	}

	return result.join(options_.separator);
}
