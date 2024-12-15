import { flatten, uniq } from "lodash";
import { DIRECTIONS, type Point, handleLines, ps, validCell } from "../../utils";
import PaintGrid from "../../utils/terminal";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const SMALL_PATH = `${import.meta.dir}/small.txt`;

const C_TO_D = {
	"^": DIRECTIONS.NORTH,
	v: DIRECTIONS.SOUTH,
	"<": DIRECTIONS.WEST,
	">": DIRECTIONS.EAST,
} as const;

async function parse(file: string) {
	const grid: string[][] = [];
	const moves: (keyof typeof C_TO_D)[] = [];
	let r: Point;
	await handleLines(file, (l) => {
		const row = l.split("");
		if (row.includes("#")) {
			const ix = row.findIndex((c) => c === "@");
			if (ix !== -1) r = [ix, grid.length];
			grid.push(row);
		} else {
			moves.push(...row);
		}
	});

	return { grid, moves, robot: r };
}

function move(grid: string[][], p: Point, d: Point) {
	const next: Point = [p[0] + d[0], p[1] + d[1]];
	if (!validCell(grid, next)) return false;

	const nextChar = grid[next[1]][next[0]];
	// Next spot is closed, so stop.
	if (nextChar === "#") return false;

	// Next spot is open, so move.
	if (grid[next[1]][next[0]] === ".") {
		grid[next[1]][next[0]] = grid[p[1]][p[0]];
		grid[p[1]][p[0]] = ".";
		return true;
	}

	// Check the next spot is open, then move in.
	if (!move(grid, next, d)) return false;
	grid[next[1]][next[0]] = grid[p[1]][p[0]];
	grid[p[1]][p[0]] = ".";
	return true;
}

function delay() {
	return new Promise<void>((resolve) => setTimeout(() => resolve(), 250));
}

async function problemOne() {
	let { grid, moves, robot } = await parse(DATA_PATH);
	const g = new PaintGrid(grid[0].length, grid.length, ".");
	g.grid = grid;
	await g.flush();

	while (moves.length) {
		const m = moves.shift();
		const d = C_TO_D[m];
		if (move(g.grid, robot, d)) {
			robot = [robot[0] + d[0], robot[1] + d[1]];
		}
		await g.flush();
	}
	let sum = 0;
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] !== "O") continue;
			sum += y * 100 + x;
		}
	}
	await g.close();
	console.log("\nProblem one:", sum);
}

async function parseL(file: string) {
	const grid: string[][] = [];
	const moves: (keyof typeof C_TO_D)[] = [];
	let r: Point;
	await handleLines(file, (l) => {
		const row = flatten(l.split("").map((c) => {
			if (c === "O") return ["[", "]"];
			if (c === ".") return [".", "."];
			if (c === "#") return ["#", "#"];
			if (c === "@") return ["@", "."];
			return c
		}));
		if (row[0] === "#") {
			const ix = row.findIndex((c) => c === "@");
			if (ix !== -1) r = [ix, grid.length];
			grid.push(row);
		} else {
			moves.push(...row);
		}
	});

	return { grid, moves, robot: r };
}

function update(grid: string[][], p: Point, next: Point) {
	grid[next[1]][next[0]] = grid[p[1]][p[0]];
	grid[p[1]][p[0]] = ".";
}

function canMove(grid: string[][], p: Point, d: Point): Point[] {
	const next: Point = [p[0] + d[0], p[1] + d[1]];
	if (!validCell(grid, next)) return [];
	const nextChar = grid[next[1]][next[0]];
	const currentChar = grid[p[1]][p[0]]
	// Next spot is closed, so stop.
	if (nextChar === "#") return [];
	if (nextChar === '.') return [p];
	if (d === DIRECTIONS.EAST || d === DIRECTIONS.WEST) {
		const moving = canMove(grid, next, d)
		if (moving.length) return [p, ...moving]
		return []
	}

	let nextPair: Point | null = null;
	const pair: Point[] = []
	if (nextChar === ']') nextPair = [next[0] - 1, next[1]]
	else if (nextChar === '[') nextPair = [next[0] + 1, next[1]]

	const moving = canMove(grid, next, d)
	if (!moving.length) return []

	if (!nextPair) throw new Error(`Unexpected next character: ${nextChar}`)

	const pairMoving = canMove(grid, nextPair, d)
	if (!pairMoving.length) return [];
	// console.log({p, moving, pairMoving})
	return uniq([p, ...moving, ...pairMoving])
}

function moveL(grid: string[][], p: Point, d: Point) {
	const points = canMove(grid, p, d)
	if (!points.length) return null;

	const moved = new Set<string>()
	while (points.length) {
		const m = points.pop()
		if (!m) break;
		const key = ps(m)
		if (moved.has(key)) continue;
		update(grid, m, [m[0] + d[0], m[1] + d[1]])
		moved.add(key)
	}
	return moved
}

async function problemTwo() {
	let { grid, moves, robot } = await parseL(DATA_PATH);

	const g = new PaintGrid(grid[0].length, grid.length, ".", false);
	let steps = 0;
	g.grid = grid;
	await g.flush();
	while (moves.length) {
		const m = moves.shift();
		if (!m) throw new Error("Invalid loop condition.")
		const d = C_TO_D[m];

		const moved = moveL(g.grid, robot, d)
		if (moved) {
			robot = [robot[0] + d[0], robot[1] + d[1]];
		}
		await g.flush();
		await g.cursorTo(grid[0].length + 1, 0)
		await g.write(`Move ${m} (${steps})`)
		await g.cursorTo(grid[0].length + 1, 1)
		if (moved) {
			await g.write(Array.from(moved).map((m) => m).join(' '))
		}

		steps++
	}
	g.close()

	let sum = 0;
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] !== "[") continue;
			sum += y * 100 + x;
		}
	}

	console.log("Problem two:", sum);
}

await problemOne();
await problemTwo();
