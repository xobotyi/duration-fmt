import {type DurationUnitNames, durationUnits, type DurationUnits} from './duration.js';

const parseRX = /(\d+)(\p{L}+)[\t ]*/giu;

type ParseOptions<DU extends DurationUnits<string>, U = DurationUnitNames<DU>> = {
	units?: DU;
	outputUnit?: U;
};

export function parse<DU extends DurationUnits<string> = typeof durationUnits>(
	input: string,
	options?: ParseOptions<DU>,
): number {
	const optionsResolved = {
		units: durationUnits,

		...options,
	};

	if (optionsResolved.outputUnit === undefined) {
		const smallestUnit = optionsResolved.units.at(-1);
		if (smallestUnit === undefined) {
			throw new Error('Units array must not be empty');
		}

		optionsResolved.outputUnit = smallestUnit[0] as DurationUnitNames<DU>;
	}

	const outputUnit = optionsResolved.units.find(([unit]) => unit === optionsResolved.outputUnit);
	if (!outputUnit) {
		throw new Error('Invalid output unit option, it must be present in the units array');
	}

	let matchedLength = 0;
	let result = 0;

	for (const match of input.matchAll(parseRX)) {
		matchedLength += match[0].length;
		const [, amount, unit] = match;

		const unitData = optionsResolved.units.find(([u]) => u === unit);
		if (unitData === undefined) {
			throw new Error(`Invalid duration unit: ${unit}`);
		}

		result += Number(amount) * unitData[1];
	}

	if (matchedLength !== input.length) {
		throw new Error('Invalid input string');
	}

	return result / outputUnit[1];
}
