import {
	Point,
	dumpGrid,
	handleLines,
	ps,
	toSingleDigitList,
	validCell,
} from "../utils";
import { cloneDeep, map, minBy } from "lodash";
import MinHeap from "../utils/MinHeap";

const DATA_PATH = `${import.meta.dir}/day17.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day17-calibrate.txt`;

// This one uses dijkstra's algorithm to pathfind through a grid with keys point + direction.
// Probably adaptable to other usecases.

const DIRECTIONS: Record<string, Point> = {
	NORTH: [0, -1],
	SOUTH: [0, 1],
	EAST: [1, 0],
	WEST: [-1, 0],
} as const;

const DIRS = Object.keys(DIRECTIONS);

interface Path {
	p: Point;
	dir: keyof typeof DIRECTIONS;
	cost: number;
}

function dumpPath(
	grid: string[][],
	previous: Record<string, string | undefined>,
	endKey: string,
) {
	const path = [];
	let k = endKey;
	while (k) {
		path.push(k);
		k = previous[k];
	}
	const g = cloneDeep(grid);
	for (const p of path) {
		const [x, y] = p.split(",").map((x) => parseInt(x, 10));
		g[y][x] = "*";
	}
	dumpGrid(g);
}

function key({ p, dir }: Path) {
	return `${p[0]},${p[1]},${dir}`;
}

// 953
async function problemOne() {
	const grid: number[][] = [];
	const empty: string[][] = [];
	const distance: Record<string, Record<string, number>> = {};
	const previous: Record<string, string | undefined> = {};
	await handleLines(DATA_PATH, (line) => {
		const row = toSingleDigitList(line);
		grid.push(row);
		empty.push(row.map(() => "."));
		for (const [x, _] of row.entries()) {
			previous[ps([x, grid.length - 1])] = undefined;
			distance[ps([x, grid.length - 1])] = {};
		}
	});

	const heap = new MinHeap<Path>();
	heap.set("0,0,NORTH", 0, { p: [0, 0], dir: "NORTH", cost: 0 });

	distance["0,0"]["NORTH"] = 0;
	const visited = new Set<string>();
	while (heap.size()) {
		const current = heap.pop();
		const pKey = key(current);
		visited.add(pKey);

		for (const dir of DIRS) {
			if (dir === current.dir) continue;
			if (dir === "SOUTH" && current.dir === "NORTH") continue;
			if (dir === "NORTH" && current.dir === "SOUTH") continue;
			if (dir === "EAST" && current.dir === "WEST") continue;
			if (dir === "WEST" && current.dir === "EAST") continue;
			let cost = 0;
			for (let i = 1; i < 4; i++) {
				const next: Point = [
					current.p[0] + DIRECTIONS[dir][0] * i,
					current.p[1] + DIRECTIONS[dir][1] * i,
				];

				if (!validCell(grid, next)) continue;

				cost += grid[next[1]][next[0]];
				const nextCheck = {
					p: next,
					dir,
					cost: current.cost + cost,
				};
				const nextKey = key(nextCheck);
				if (visited.has(nextKey)) continue;

				if (nextCheck.cost >= distance[ps(nextCheck.p)][nextCheck.dir])
					continue;

				heap.set(
					`${nextCheck.p[0]},${nextCheck.p[1]},${nextCheck.dir}`,
					nextCheck.cost,
					nextCheck,
				);

				previous[nextKey] = pKey;
				distance[ps(nextCheck.p)][nextCheck.dir] = nextCheck.cost;
			}
		}
	}

	const endKey = ps([grid[0].length - 1, grid.length - 1]);
	const dir = minBy(
		map(distance[endKey], (v, k) => ({ k, v })),
		"v",
	);
	dumpPath(
		empty,
		previous,
		`${grid[0].length - 1},${grid.length - 1},${dir.k}`,
	);
	console.log("Problem one:", dir.v);
}

// 1180
async function problemTwo() {
	const grid: number[][] = [];
	const empty: string[][] = [];
	const distance: Record<string, Record<string, number>> = {};
	const previous: Record<string, string | undefined> = {};
	await handleLines(DATA_PATH, (line) => {
		const row = toSingleDigitList(line);
		grid.push(row);
		empty.push(row.map(() => "."));
		for (const [x, _] of row.entries()) {
			previous[ps([x, grid.length - 1])] = undefined;
			distance[ps([x, grid.length - 1])] = {};
		}
	});

	const heap = new MinHeap<Path>();
	heap.set("0,0,NORTH", 0, { p: [0, 0], dir: "NORTH", cost: 0 });

	distance["0,0"]["NORTH"] = 0;
	const visited = new Set<string>();
	while (heap.size()) {
		const current = heap.pop();

		const pKey = key(current);
		visited.add(pKey);

		for (const dir of DIRS) {
			if (dir === current.dir) continue;
			if (dir === "SOUTH" && current.dir === "NORTH") continue;
			if (dir === "NORTH" && current.dir === "SOUTH") continue;
			if (dir === "EAST" && current.dir === "WEST") continue;
			if (dir === "WEST" && current.dir === "EAST") continue;
			let cost = 0;
			for (let i = 1; i < 11; i++) {
				const next: Point = [
					current.p[0] + DIRECTIONS[dir][0] * i,
					current.p[1] + DIRECTIONS[dir][1] * i,
				];

				if (!validCell(grid, next)) continue;

				cost += grid[next[1]][next[0]];
				if (i < 4) continue;

				const nextCheck = {
					p: next,
					dir,
					cost: current.cost + cost,
				};
				const nextKey = key(nextCheck);
				if (visited.has(nextKey)) continue;

				if (nextCheck.cost >= distance[ps(nextCheck.p)][nextCheck.dir])
					continue;

				heap.set(
					`${nextCheck.p[0]},${nextCheck.p[1]},${nextCheck.dir}`,
					nextCheck.cost,
					nextCheck,
				);
				previous[nextKey] = pKey;
				distance[ps(nextCheck.p)][nextCheck.dir] = nextCheck.cost;
			}
		}
	}

	const endKey = ps([grid[0].length - 1, grid.length - 1]);
	const dir = minBy(
		map(distance[endKey], (v, k) => ({ k, v })),
		"v",
	);
	dumpPath(
		empty,
		previous,
		`${grid[0].length - 1},${grid.length - 1},${dir.k}`,
	);
	console.log("Problem two:", dir.v);
}

await problemOne();
await problemTwo();
