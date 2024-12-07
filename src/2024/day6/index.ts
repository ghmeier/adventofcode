import {
	type Point,
	dumpGrid,
	handleLines,
	pFromS,
	ps,
	validCell,
} from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const _CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

const directions = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
];

async function problemOne() {
	const grid: string[][] = [];
	let p: Point = [-1, -1];
	await handleLines(DATA_PATH, (l) => {
		const line = l.split("");
		grid.push(line);
		const i = line.findIndex((c) => c === "^");
		if (i === -1) return;
		p = [i, grid.length - 1];
	});

	let ix = 0;
	const visited = new Set([ps(p)]);
	while (true) {
		const next: Point = [p[0] + directions[ix][0], p[1] + directions[ix][1]];
		if (!validCell(grid, next)) break;

		if (grid[next[1]][next[0]] === "#") {
			ix += 1;
			if (ix > 3) ix = 0;
			continue;
		}
		visited.add(ps(next));
		p = next;
	}

	console.log("Problem one:", visited.size);
}

function hasLoop(grid: string[][], p: Point) {
	let ix = 0;
	const visited: Record<string, number> = {};
	let guard: Point = [...p];

	while (true) {
		const next: Point = [
			guard[0] + directions[ix][0],
			guard[1] + directions[ix][1],
		];
		if (!validCell(grid, next)) break;

		if (grid[next[1]][next[0]] === "#") {
			ix += 1;
			if (ix > 3) ix = 0;
			continue;
		}
		const key = `${ps(next)},${ix}`;
		if (visited[key]) return true;

		visited[key] = 1;
		guard = next;
	}
	return false;
}

async function problemTwo() {
	const grid: string[][] = [];
	let p: Point = [-1, -1];
	await handleLines(DATA_PATH, (l) => {
		const line = l.split("");
		grid.push(line);
		const i = line.findIndex((c) => c === "^");
		if (i === -1) return;
		p = [i, grid.length - 1];
	});

	let ix = 0;
	const candidates = new Set<string>();
	let current = [...p];
	while (true) {
		const next: Point = [
			current[0] + directions[ix][0],
			current[1] + directions[ix][1],
		];
		if (!validCell(grid, next)) break;

		if (grid[next[1]][next[0]] === "#") {
			ix += 1;
			if (ix > 3) ix = 0;
			continue;
		}
		candidates.add(ps(next));
		current = next;
	}

	const c = Array.from(candidates).map(pFromS);

	let loops = 0;
	for (const [x, y] of c) {
		grid[y][x] = "#";
		if (hasLoop(grid, p)) loops += 1;
		grid[y][x] = ".";
	}
	console.log("Problem two:", loops);
}

await problemOne();
await problemTwo();
