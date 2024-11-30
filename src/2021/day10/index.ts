import { handleLines } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

const CORRPUTED_POINTS = { ")": 3, "]": 57, "}": 1197, ">": 25137 } as const;
const AUTOCOMPLETE_POINTS = { ")": 1, "]": 2, "}": 3, ">": 4 } as const;

const PAIRS = { "(": ")", "[": "]", "{": "}", "<": ">" } as const;

async function problemOne() {
	const corrupted: string[] = [];
	let score = 0;
	await handleLines(DATA_PATH, (l) => {
		const closing: string[] = [];

		for (const c of l) {
			// If this is the next valid close symbol, pop it and expect the next one down.
			if (c === closing[0]) closing.shift();
			// If this is an opening symbol, add it's corrspending closing symbol as the next expectation.
			else if (c in PAIRS) closing.unshift(PAIRS[c]);
			// This indicates an invalid closing symbol.
			else {
				corrupted.push(l);
				score += CORRPUTED_POINTS[c];
				break;
			}
		}
	});

	console.log("Problem one:", score);
}

async function problemTwo() {
	const scores: number[] = [];
	await handleLines(DATA_PATH, (l) => {
		const closing: string[] = [];

		for (const c of l) {
			// If this is the next valid close symbol, pop it and expect the next one down.
			if (c === closing[0]) closing.shift();
			// If this is an opening symbol, add it's corrspending closing symbol as the next expectation.
			else if (c in PAIRS) closing.unshift(PAIRS[c]);
			// This indicates a corrupted line. Ignore it.
			else return;
		}
		scores.push(
			closing.reduce((acc, v) => {
				return acc * 5 + AUTOCOMPLETE_POINTS[v];
			}, 0),
		);
	});
	const winner = scores.sort((a, b) => b - a)[Math.floor(scores.length / 2)];

	console.log("Problem two:", winner);
}

await problemOne();
await problemTwo();
