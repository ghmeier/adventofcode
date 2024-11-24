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

export function iterateGrid(
	grid: string[][],
	f: (x: number, y: number) => void,
) {
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			f(x, y);
		}
	}
}

export function validCell(grid: string[][], [x, y]: Point) {
	return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
}

export const DIRECTIONS: Record<string, Point> = {
	NORTH: [0, -1],
	SOUTH: [0, 1],
	EAST: [1, 0],
	WEST: [-1, 0],
} as const;

export const DIRS = Object.keys(DIRECTIONS);
