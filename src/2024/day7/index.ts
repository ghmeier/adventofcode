import { range } from "lodash";
import { handleLines, splitWhitespace, sum } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
	const equations: { result: number; numbers: number[] }[] = [];
	await handleLines(DATA_PATH, (l) => {
		const [result, numbers] = l.split(": ");
		equations.push({
			result: Number.parseInt(result, 10),
			numbers: splitWhitespace(numbers).map((v) => Number.parseInt(v, 10)),
		});
	});

	let solvable: number[] = [];
	const unsolvable: { result: number; numbers: number[] }[] = [];
	for (const { result, numbers } of equations) {
		const [start, ...rest] = numbers;
		const max = 2 ** numbers.length;
		const masks = range(0, numbers.length - 1).map((_, ix) => 1 << ix);
		let counter = 0;
		while (counter < max) {
			const sum = rest.reduce((acc, v, ix) => {
				if (masks[ix] & counter) return acc * v;
				return acc + v;
			}, start);

			if (sum === result) {
				solvable.push(result);
				break;
			}

			counter += 1;
		}
		if (counter >= max) unsolvable.push({ numbers, result });
	}

	const sumFirst = sum(solvable);
	console.log("Problem one:", sumFirst);

	solvable = [];
	for (const { result, numbers } of unsolvable) {
		const [start, ...rest] = numbers;
		const max = 3 ** (numbers.length - 1);
		let counter = 0;
		while (counter < max) {
			const mask = counter.toString(3).padStart(numbers.length - 1, "0");
			const sum = rest.reduce((acc, v, ix) => {
				const char = mask[ix];
				// console.log({ char, ix, acc, v })
				if (char === "1") return acc * v;
				if (char === "2") return Number.parseInt(`${acc}${v}`, 10);
				return acc + v;
			}, start);

			if (sum === result) {
				solvable.push(result);
				break;
			}

			counter += 1;
		}
		// break;
	}
	const sumSecond = sum(solvable);

	console.log("Problem two:", sumSecond + sumFirst);
}

await problemOne();
