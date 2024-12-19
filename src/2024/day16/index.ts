import { minBy } from "lodash";
import {
	DIRECTIONS,
	DIRS,
	type Point,
	dumpGrid,
	handleLines,
	onSurroundingCell,
	ps,
	validCell,
} from "../../utils";
import MinHeap from "../../utils/MinHeap";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

type DirKey = keyof typeof DIRECTIONS;

const MOVE_MAP: Record<DirKey, DirKey[]> = {
	NORTH: ["EAST", "WEST"],
	SOUTH: ["EAST", "WEST"],
	EAST: ["NORTH", "SOUTH"],
	WEST: ["NORTH", "SOUTH"],
};

const DIR_TO_CHAR: Record<DirKey, string> = {
	NORTH: "^",
	SOUTH: "v",
	EAST: ">",
	WEST: "<",
};

async function parse(file: string) {
	const grid: string[][] = [];
	const costs: number[][] = [];
	let start: Point = [-1, -1];
	let end: Point = [-1, -1];

	await handleLines(file, (l) => {
		const row = l.split("");
		const startIx = row.findIndex((c) => c === "S");
		if (startIx !== -1) start = [startIx, grid.length];
		const endIx = row.findIndex((c) => c === "E");
		if (endIx !== -1) end = [endIx, grid.length];
		grid.push(row);
		costs.push(row.map(() => Number.MAX_SAFE_INTEGER));
	});

	const heap = new MinHeap<{
		p: Point;
		dir: DirKey;
	}>();
	const neighbors: Record<string, string[]> = {};

	costs[start[1]][start[0]] = 0;
	const key = ps(start);
	heap.set(key, 0, { p: start, dir: "EAST" });

	return { grid, costs, start, end, heap, neighbors };
}

function traverse(
	grid: string[][],
	costs: number[][],
	heap: MinHeap<{
		p: Point;
		dir: DirKey;
	}>,
	neighbors: Record<string, string[]>,
) {
	while (heap.size()) {
		const { p, dir } = heap.pop();
		const key = ps(p);

		if (!neighbors[key]) neighbors[key] = [];

		const checkDirs = [...MOVE_MAP[dir], dir];
		for (const d of checkDirs) {
			const next: Point = [p[0] + DIRECTIONS[d][0], p[1] + DIRECTIONS[d][1]];
			const nextKey = ps(next);
			if (
				!validCell(grid, next) ||
				grid[next[1]][next[0]] === "#" ||
				neighbors[nextKey]
			)
				continue;

			const cost = costs[p[1]][p[0]] + (d === dir ? 1 : 1001);
			if (cost >= costs[next[1]][next[0]]) continue;
			costs[next[1]][next[0]] = cost;
			grid[next[1]][next[0]] = DIR_TO_CHAR[d];
			neighbors[key].push(nextKey);
			heap.set(nextKey, cost, { p: next, dir: d });
		}
	}
}

async function problemOne() {
	const { grid, costs, end, heap, neighbors } = await parse(DATA_PATH);

	traverse(grid, costs, heap, neighbors);

	dumpGrid(grid);
	console.log("Problem one:", costs[end[1]][end[0]]);
}

function travel(
	grid: string[][],
	end: Point,
	maxCost: number,
	p: Point,
	dir: DirKey,
	cost: number,
	visited: Record<string, number>,
) {
	if (cost > maxCost) return null;
	const v = { ...visited, [ps(p)]: cost };
	if (p[0] === end[0] && p[1] === end[1]) return v;

	const checkDirs = [...MOVE_MAP[dir], dir];
	let upcomingPaths: Record<string, number> = {};
	let hasEndPath = false;
	for (const d of checkDirs) {
		const next: Point = [p[0] + DIRECTIONS[d][0], p[1] + DIRECTIONS[d][1]];
		const nextKey = ps(next);
		if (
			!validCell(grid, next) ||
			grid[next[1]][next[0]] === "#" ||
			visited[nextKey]
		)
			continue;
		const nextCost = cost + (d === dir ? 1 : 1001);
		const nextVisited = travel(grid, end, maxCost, next, d, nextCost, v);
		if (nextVisited) {
			hasEndPath = true;
			upcomingPaths = { ...upcomingPaths, ...nextVisited };
		}
	}

	if (hasEndPath) return upcomingPaths;
	return null;
}

async function problemTwo() {
	const { grid, costs, start, end, heap, neighbors } =
		await parse(CALIBRATE_PATH);
	traverse(grid, costs, heap, neighbors);

	const toVisit = [end];
	const path = new Set<string>();

	while (toVisit.length) {
		const p = toVisit.pop();
		if (!p) break;
		const key = ps(p);
		path.add(key);
		grid[p[1]][p[0]] = "O";

		const cost = costs[p[1]][p[0]];
		for (const d of DIRS) {
			const next: Point = [p[0] + DIRECTIONS[d][0], p[1] + DIRECTIONS[d][1]];
			if (!validCell(grid, next) || grid[next[1]][next[0]] === "#") continue;

			const nextCost = costs[next[1]][next[0]];
			if (nextCost !== cost - 1 && nextCost !== cost - 1001) {
				const nextNextCost =
					costs[next[1] + DIRECTIONS[d][1]][next[0] + DIRECTIONS[d][0]];
				// console.log({ p, next, nextNextCost, nextCost, cost });
				if (nextNextCost !== cost - 2) continue;
			}

			toVisit.push(next);
		}
	}
	dumpGrid(grid);
	console.log(
		grid
			.map((r, y) =>
				r
					.map((v, x) =>
						v === "#" ? "######" : `${costs[y][x].toString().padStart(6, " ")}`,
					)
					.join(""),
			)
			.join("\n"),
	);
	console.log("Problem two:", path.size);
}

// await problemOne();
await problemTwo();
