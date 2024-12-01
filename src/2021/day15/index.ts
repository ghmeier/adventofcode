import {
	DIRECTIONS,
	DIRS,
	type Point,
	dumpGrid,
	handleLines,
	ps,
	toSingleDigitList,
	validCell,
} from "../../utils";
import MinHeap from "../../utils/MinHeap";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
	const grid: number[][] = [];
	const costs: number[][] = [];
	const heap = new MinHeap<{ p: Point; cost: number }>();

	heap.set(ps([0, 0]), 0, { p: [0, 0], cost: 0 });
	await handleLines(DATA_PATH, (l) => {
		const row = toSingleDigitList(l);
		grid.push(row);
		costs.push(row.map(() => Number.MAX_SAFE_INTEGER));
	});
	costs[0][0] = 0;

	// Quick and dirty dijkstra implementation to traverse a grid of weights.
	const visited = new Set<string>();
	while (heap.size()) {
		const node = heap.pop();
		const key = ps(node.p);
		visited.add(key);

		for (const dir of DIRS) {
			const next: Point = [
				node.p[0] + DIRECTIONS[dir][0],
				node.p[1] + DIRECTIONS[dir][1],
			];
			const nextKey = ps(next);
			if (!validCell(grid, next) || visited.has(nextKey)) continue;
			const cost = costs[node.p[1]][node.p[0]] + grid[next[1]][next[0]];
			if (cost >= costs[next[1]][next[0]]) continue;
			costs[next[1]][next[0]] = cost;
			heap.set(nextKey, cost, { p: next, cost });
		}
	}

	// costs.forEach((row) => console.log(row.join(",")));
	console.log("Problem one:", costs[grid.length - 1][grid[0].length - 1]);
}

async function problemTwo() {
	const grid: number[][] = [];
	const costs: number[][] = [];
	const heap = new MinHeap<{ p: Point; cost: number }>();

	heap.set(ps([0, 0]), 0, { p: [0, 0], cost: 0 });
	await handleLines(CALIBRATE_PATH, (l) => {
		const row = toSingleDigitList(l);
		grid.push(row);
		costs.push(row.map(() => Number.MAX_SAFE_INTEGER));
	});

	const expanded: number[][] = [];
	for (let y = 0; y < grid.length * 5; y++) {
		const row: number[] = [];
		for (let x = 0; x < grid[0].length * 5; x++) {
			let risk: number;
			if (x - grid[0].length >= 0) risk = row[x - grid[0].length] + 1;
			if (y - grid.length >= 0) risk = expanded[y - grid.length][x] + 1;
			if (risk >= 10) risk = 1;
			row.push(risk);
		}
		expanded.push(row);
	}
    dumpGrid(expanded)

	costs[0][0] = 0;

	// Quick and dirty dijkstra implementation to traverse a grid of weights.
	const visited = new Set<string>();
	while (heap.size()) {
		const node = heap.pop();
		const key = ps(node.p);
		visited.add(key);

		for (const dir of DIRS) {
			const next: Point = [
				node.p[0] + DIRECTIONS[dir][0],
				node.p[1] + DIRECTIONS[dir][1],
			];
			const nextKey = ps(next);
			if (!validCell(grid, next) || visited.has(nextKey)) continue;
			const cost = costs[node.p[1]][node.p[0]] + grid[next[1]][next[0]];
			if (cost >= costs[next[1]][next[0]]) continue;
			costs[next[1]][next[0]] = cost;
			heap.set(nextKey, cost, { p: next, cost });
		}
	}

	console.log("Problem two:", null);
}

await problemOne();
await problemTwo();
