import {type DurationUnitNames, durationUnits, type DurationUnits} from './duration.js';

export type FormatOptions<DU extends DurationUnits<string>, U = DurationUnitNames<DU>> = {
	units?: DU;
	inputUnit?: U;

	separator?: string;
};

export function format<DU extends DurationUnits<string> = typeof durationUnits>(
	input: number,
	options?: FormatOptions<DU>,
): string {
	const optionsResolved = {
		units: durationUnits,
		separator: ' ',

		...options,
	};

	if (optionsResolved.units.length === 0) {
		throw new Error('Units array must not be empty');
	}

	const smallestUnit = optionsResolved.units.at(-1)!;
	optionsResolved.inputUnit ??= smallestUnit[0] as DurationUnitNames<DU>;
	const result: string[] = [];

	if (input < smallestUnit[1]) {
		return `0${smallestUnit[0]}`;
	}

	const inputUnit = optionsResolved.units.find(([unit]) => unit === optionsResolved.inputUnit);
	if (!inputUnit) {
		throw new Error('Invalid input unit option, it must be present in the units array');
	}

	input *= inputUnit[1];

	for (const [unit, unitValue] of optionsResolved.units) {
		const value = Math.floor(input / unitValue);
		if (value > 0) {
			result.push(`${value}${unit}`);

			input -= value * unitValue;
		}
	}

	return result.join(optionsResolved.separator);
}
