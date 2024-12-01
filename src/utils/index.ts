export async function readLines(fileName: string): Promise<string[]> {
	const data = await Bun.file(fileName).text();
	return data.split("\n").slice(0, data.length - 1);
}

export async function handleLines(fileName: string, f: (line: string) => void) {
	const lines = await readLines(fileName);

	// biome-ignore lint/complexity/noForEach: <explanation>
	lines.forEach((l) => {
		if (!l) return;
		f(l);
	});
}

export function sum(list: number[]): number {
	return list.reduce((t, v) => t + v, 0);
}

export function toSingleDigitList(line: string) {
	return line.split("").map((v) => Number.parseInt(v, 10));
}

export function splitWhitespace(line: string) {
	return line.split(/\s+/);
}

export type Point = [number, number];

export function ps(p: (string | number)[]) {
	return p.join(",");
}

export function pFromS(s: string): Point {
	return s
		.split(",")
		.slice(0, 2)
		.map((c) => Number.parseInt(c, 10)) as Point;
}

export function dumpGrid(grid: string[][]) {
	console.log(grid.map((row) => row.join("")).join("\n"));
}

export function iterateGrid<T>(grid: T[][], f: (x: number, y: number) => void) {
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			f(x, y);
		}
	}
}

export function validCell<T>(grid: T[][], [x, y]: Point) {
	return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
}

export function onSurroundingCell<T>(
	grid: T[][],
	[x, y]: Point,
	f: (next: Point) => void,
) {
	for (const d of DIRS) {
		const next: Point = [x + DIRECTIONS[d][0], y + DIRECTIONS[d][1]];
		if (validCell(grid, next)) f(next);
	}
}

export function onSurroundingCellDiagonal<T>(
	grid: T[][],
	[x, y]: Point,
	f: (next: Point) => void,
) {
	for (const d of DIRS_DIAGONAL) {
		const next: Point = [
			x + DIRECTIONS_DIAGONAL[d][0],
			y + DIRECTIONS_DIAGONAL[d][1],
		];
		if (validCell(grid, next)) f(next);
	}
}

export const DIRECTIONS: Record<string, Point> = {
	NORTH: [0, -1],
	SOUTH: [0, 1],
	EAST: [1, 0],
	WEST: [-1, 0],
} as const;

export const DIRECTIONS_DIAGONAL: Record<string, Point> = {
	NORTH: [0, -1],
	SOUTH: [0, 1],
	EAST: [1, 0],
	WEST: [-1, 0],
	NORTH_EAST: [1, -1],
	NORTH_WEST: [-1, -1],
	SOUTH_EASH: [1, 1],
	SOUTH_WEST: [-1, 1],
} as const;

export const DIRS = Object.keys(DIRECTIONS);
export const DIRS_DIAGONAL = Object.keys(DIRECTIONS_DIAGONAL);

export function addCounter<T extends string | number | symbol>(map: Record<T, number>, k: T, v = 1) {
	if (!map[k]) map[k] = 0
	map[k] += v
}
