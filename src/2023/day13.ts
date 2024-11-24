import { range } from "lodash";
import {
	dumpGrid,
	iterateGrid,
	readLines,
	splitWhitespace,
	sum,
} from "../utils";

const DATA_PATH = `${import.meta.dir}/day13.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day13-calibrate.txt`;

function horizontalReflectionSize(grid: string[][], x: number, y: number) {
	let next = 0;
	while (next <= y && next + y + 1 < grid.length) {
		// console.log({
		// 	y,
		// 	x,
		// 	next,
		// 	left: grid[y - next][x],
		// 	right: grid[y + next + 1][x],
		// });
		if (grid[y - next][x] !== grid[y + next + 1][x]) return 0;
		next++;
	}
	return 1;
}

function verticalReflectionSize(grid: string[][], x: number, y: number) {
	let next = 0;
	while (next <= x && next + x + 1 < grid[0].length) {
		// console.log({ left: grid[y][x - next], right: grid[y][x + next + 1] });
		if (grid[y][x - next] !== grid[y][x + next + 1]) return 0;
		next++;
	}
	return 1;
}

function calculateReflection(grid: string[][]) {
	// horizontal reflections
	const reflections = [];
	for (let y = 0; y < grid.length - 1; y++) {
		const hasReflection = grid[y].every(
			(_, ix) => horizontalReflectionSize(grid, ix, y) > 0,
		);
		if (hasReflection) {
			reflections.push((y + 1) * 100);
		}
	}

	// vertical reflections
	for (let x = 0; x < grid[0].length - 1; x++) {
		const hasReflection = grid.every(
			(_, ix) => verticalReflectionSize(grid, x, ix) > 0,
		);

		if (hasReflection) {
			reflections.push(x + 1);
		}
	}

	return reflections;
}

// 27664
async function problemOne() {
	const lines = await readLines(DATA_PATH);

	let current: string[][] = [];
	let sum = 0;
	for (const line of lines) {
		if (!line) {
			const [val] = calculateReflection(current);
			if (val === undefined) throw Error("No reflection found");
			sum += val;
			current = [];
			continue;
		}
		current.push(line.split(""));
	}

	console.log("Problem one:", sum);
}

function findSmudge(grid: string[][], initial: number) {
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			const original = grid[y][x];
			grid[y][x] = original === "." ? "#" : ".";
			const reflections = calculateReflection(grid);
			if (
				reflections.length &&
				reflections.filter((r) => r !== initial).length
			) {
				return reflections.filter((r) => r !== initial)[0];
			}
			grid[y][x] = original;
		}
	}
	return -1;
}

// 33991
async function problemTwo() {
	const lines = await readLines(DATA_PATH);

	let current: string[][] = [];
	let sum = 0;
	for (const line of lines) {
		if (!line) {
			const [initial] = calculateReflection(current);
			const val = findSmudge(current, initial);
			if (val === -1) {
				throw Error("No new reflection found");
			}
			sum += val;
			current = [];
			continue;
		}
		current.push(line.split(""));
	}

	console.log("Problem two:", sum);
}

await problemOne();
await problemTwo();
