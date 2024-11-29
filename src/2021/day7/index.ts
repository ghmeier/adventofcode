import { max } from "lodash";
import { handleLines, sum } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
	let positions: number[] = [];
	await handleLines(DATA_PATH, (l) => {
		positions = l.split(",").map((v) => Number.parseInt(v, 10));
	});

	const maxPos = max(positions) || 0;
	let minMoves = Number.MAX_SAFE_INTEGER;
	for (let i = 0; i < maxPos; i++) {
		const moves = sum(positions.map((p) => Math.abs(p - i)));
		if (moves < minMoves) minMoves = moves;
	}
	console.log("Problem one:", minMoves);
}

async function problemTwo() {
	let positions: number[] = [];
	await handleLines(DATA_PATH, (l) => {
		positions = l.split(",").map((v) => Number.parseInt(v, 10));
	});

	const maxPos = max(positions) || 0;
	const costs: Record<number, number> = { 0: 0 };
	for (let i = 1; i < maxPos; i++) {
		costs[i] = i + costs[i - 1];
	}

	let minMoves = Number.MAX_SAFE_INTEGER;
	for (let i = 0; i < maxPos; i++) {
		const moves = sum(
			positions.map((p) => {
				const diff = Math.abs(p - i);
				return costs[diff];
			}),
		);
		if (moves < minMoves) minMoves = moves;
	}

	console.log("Problem two:", minMoves);
}

await problemOne();
await problemTwo();
