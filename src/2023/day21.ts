import {
	DIRECTIONS,
	DIRS,
	Point,
	dumpGrid,
	handleLines,
	pFromS,
	ps,
	readLines,
	sum,
	validCell,
} from "../utils";
import { cond, flatten, range } from "lodash";
import MinHeap from "../utils/MinHeap";
import { calculateTrend } from "./day9";
const DATA_PATH = `${import.meta.dir}/day21.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day21-calibrate.txt`;

const STEPS_ONE = 64;

function dump(grid: string[][], points: Point[]) {
	for (const [x, y] of points) {
		grid[y][x] = "O";
	}

	dumpGrid(grid);
}

function dumpCost(grid: string[][], found: Record<string, number>) {
	const points = Object.keys(found).map(pFromS);
	for (const f of Object.keys(found)) {
		const [x, y] = pFromS(f);
		grid[y][x] = found[f].toString();
	}

	dumpPad(grid);
}

// 3639
async function problemOne() {
	const grid: string[][] = [];
	const heap = new MinHeap<{ p: Point; cost: number }>();

	await handleLines(DATA_PATH, (line) => {
		const row = line.split("");
		const startIndex = row.findIndex((s) => s === "S");
		if (startIndex !== -1) {
			const p: Point = [startIndex, grid.length];
			row[startIndex] = ".";
			heap.set(ps(p), 0, { p, cost: 0 });
		}
		grid.push(row);
	});

	const found: Record<string, number> = {};
	while (heap.size()) {
		const current = heap.pop();
		const [x, y] = current.p;
		for (const D of DIRS) {
			const [dx, dy] = DIRECTIONS[D];
			const next: Point = [x + dx, y + dy];
			if (!validCell(grid, next) || grid[next[1]][next[0]] === "#") continue;
			const cost = current.cost + 1;
			if (cost >= STEPS_ONE) {
				found[ps(next)] = cost;
				continue;
			}
			heap.set(ps(next), cost, { p: next, cost });
		}
	}
	dump(grid, Object.keys(found).map(pFromS));

	console.log("Problem one:", Object.keys(found).length);
}

function dumpPad(grid: string[][]) {
	console.log(
		grid
			.map((row) => row.map((c) => c.toString().padStart(4, " ")).join(""))
			.join("\n"),
	);
}

function traverse(grid: string[][], start: Point) {
	const visited = new Set<string>();
	const found: Record<string, number> = {};
	const heap = new MinHeap<{ p: Point; cost: number }>();

	heap.set(ps(start), 0, { p: start, cost: 0 });
	while (heap.size()) {
		const current = heap.pop();
		const [x, y] = current.p;
		const pKey = ps(current.p);
		found[pKey] = current.cost;
		visited.add(pKey);
		for (const D of DIRS) {
			const [dx, dy] = DIRECTIONS[D];
			const next: Point = [x + dx, y + dy];
			const nextCheck = {
				p: next,
				cost: current.cost + 1,
			};
			const nextKey = ps(next);
			if (
				!validCell(grid, next) ||
				grid[next[1]][next[0]] === "#" ||
				nextCheck.cost >= found[nextKey]
			)
				continue;
			if (visited.has(nextKey)) continue;
			heap.set(nextKey, nextCheck.cost, nextCheck);
		}
	}
	return found;
}

function traverseUnbounded(grid: string[][], start: Point, limit: number) {
	const visited = new Set<string>();
	const found: Record<string, number> = {};
	const heap = new MinHeap<{ p: Point; cost: number; mod: Point }>();

	const key = (p: Point, m: Point) => ps([ps(p), ps(m)]);
	heap.set(key(start, [0, 0]), 0, { p: start, cost: 0, mod: [0, 0] });
	while (heap.size()) {
		const current = heap.pop();
		const [x, y] = current.p;
		const pKey = key(current.p, current.mod);
		found[pKey] = current.cost;
		visited.add(pKey);
		for (const D of DIRS) {
			const [dx, dy] = DIRECTIONS[D];
			const next: Point = [x + dx, y + dy];
			const nextCheck = {
				p: next,
				cost: current.cost + 1,
				mod: [...current.mod] as Point,
			};

			if (next[0] < 0) {
				next[0] = grid[0].length - 1;
				nextCheck.mod[0] -= 1;
			} else if (next[0] >= grid[0].length) {
				next[0] = 0;
				nextCheck.mod[0] += 1;
			} else if (next[1] < 0) {
				next[1] = grid.length - 1;
				nextCheck.mod[1] -= 1;
			} else if (next[1] >= grid.length) {
				next[1] = 0;
				nextCheck.mod[1] += 1;
			}

			const nextKey = key(next, nextCheck.mod);
			if (
				grid[next[1]][next[0]] === "#" ||
				nextCheck.cost >= found[nextKey] ||
				nextCheck.cost > limit
			)
				continue;
			if (visited.has(nextKey)) continue;
			heap.set(nextKey, nextCheck.cost, nextCheck);
		}
	}
	return found;
}

// high 604592316160930
//      604592315756328
604592263562930;
//      604592263562670
// low  604592262551165

async function problemTwo() {
	const grid: string[][] = [];
	let start: Point = [0, 0];
	await handleLines(DATA_PATH, (line) => {
		const row = line.split("");
		const startIndex = row.findIndex((s) => s === "S");
		if (startIndex !== -1) {
			start = [startIndex, grid.length];
			row[startIndex] = ".";
		}
		grid.push(row);
	});

	const found65 = traverseUnbounded(grid, start, 65);
	const locations65 = Object.values(found65).filter(
		(v) => v <= 65 && v % 2 === 1,
	).length;

	const found196 = traverseUnbounded(grid, start, 196);
	const locations196 = Object.values(found196).filter(
		(v) => v <= 196 && v % 2 === 0,
	).length;
	const found327 = traverseUnbounded(grid, start, 327);
	const locations327 = Object.values(found327).filter(
		(v) => v <= 327 && v % 2 === 1,
	).length;

	const found428 = traverseUnbounded(grid, start, 428);
	const locations428 = Object.values(found428).filter(
		(v) => v <= 428 && v % 2 === 0,
	).length;

	const found589 = traverseUnbounded(grid, start, 589);
	const locations589 = Object.values(found589).filter(
		(v) => v <= 589 && v % 2 === 0,
	).length;
	console.log(
		calculateTrend(
			[locations65, locations196, locations327, locations428],
			false,
		),
	);
	console.log({
		locations65,
		locations196,
		locations327,
		locations428,
		locations589,
	});

	const found = traverse(grid, start);

	const half = Math.floor(grid.length / 2);

	const distance = (k: string) => {
		const [x, y] = pFromS(k);
		return Math.abs(x - half) + Math.abs(y - half);
	};
	const oddCorners = Object.entries(found).filter(
		([k, v]) => v > half && v % 2 === 1,
	).length;
	const evenCorners = Object.entries(found).filter(
		([k, v]) => v > half && v % 2 === 0,
	).length;
	const oddAll = Object.values(found).filter((v) => v % 2 === 1).length;
	const evenAll = Object.values(found).filter((v) => v % 2 === 0).length;
	const evenFound = Object.entries(found)
		.filter(([k, v]) => v % 2 === 1)
		.map(([k]) => pFromS(k));

	const GRID_DIAMETER = 202300;
	const result =
		(GRID_DIAMETER + 1) * (GRID_DIAMETER + 1) * oddAll +
		GRID_DIAMETER * GRID_DIAMETER * evenAll -
		(GRID_DIAMETER + 1) * oddCorners +
		GRID_DIAMETER * evenCorners -
		GRID_DIAMETER * 4 * 65;
	// dump(grid, evenFound);
	console.log("Problem two:", half, result);
}

// await problemOne();
await problemTwo();
