import { flatten } from "lodash";
import {
	DIRECTIONS,
	DIRS,
	type Point,
	handleLines,
	pFromS,
	ps,
	sum,
	validCell,
} from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;
const SMALL_PATH = `${import.meta.dir}/small.txt`;
const INTERNAL_PATH = `${import.meta.dir}/internal.txt`;

const D = Object.values(DIRECTIONS);

function group(
	point: Point,
	grid: string[][],
	toVisit: Set<string>,
): { p: Point; edges: number }[] {
	if (!toVisit.delete(ps(point))) return [];

	let edges = 0;
	const rest: { p: Point; edges: number }[] = [];
	for (const p of D) {
		const next: Point = [point[0] + p[0], point[1] + p[1]];
		if (
			!validCell(grid, next) ||
			grid[next[1]][next[0]] !== grid[point[1]][point[0]]
		) {
			edges += 1;
			continue;
		}
		rest.push(...group(next, grid, toVisit));
	}

	return [{ p: point, edges }, ...rest];
}

async function problemOne() {
	const grid: string[][] = [];
	const toVisit = new Set<string>();
	await handleLines(DATA_PATH, (l) => {
		const row = l.split("");
		row.forEach((_, ix) => toVisit.add(ps([grid.length, ix])));
		grid.push(row);
	});

	const iterator = toVisit.values();
	const groups = [];
	while (true) {
		const entry = iterator.next();
		if (entry.done) break;
		const p = pFromS(entry.value);
		groups.push(group(p, grid, toVisit));
	}

	const areas = groups.map((g) => g.length);
	const perimeters = groups.map((g) => sum(g.map(({ edges }) => edges)));
	const total = areas.reduce((acc, v, ix) => acc + v * perimeters[ix], 0);

	console.log("Problem one:", total);
}

function groupSides(
	point: Point,
	grid: string[][],
	toVisit: Set<string>,
	sides: Record<string, number[]>,
): Point[] {
	if (!toVisit.delete(ps(point))) return [];

	const rest: Point[] = [];
	for (const d of DIRS) {
		const p = DIRECTIONS[d];
		const next: Point = [point[0] + p[0], point[1] + p[1]];
		if (
			!validCell(grid, next) ||
			grid[next[1]][next[0]] !== grid[point[1]][point[0]]
		) {
			//
			const key = `${d}${p[0] ? next[0] : next[1]}`;
			if (!sides[key]) sides[key] = [];
			sides[key].push(p[0] ? next[1] : next[0]);
			continue;
		}
		rest.push(...groupSides(next, grid, toVisit, sides));
	}

	return [point, ...rest];
}

async function problemTwo() {
	const grid: string[][] = [];
	const toVisit = new Set<string>();
	await handleLines(DATA_PATH, (l) => {
		const row = l.split("");
		row.forEach((_, ix) => toVisit.add(ps([grid.length, ix])));
		grid.push(row);
	});

	const iterator = toVisit.values();
	const groups: Point[][] = [];
	const sides: number[] = [];
	while (true) {
		const entry = iterator.next();
		if (entry.done) break;
		const p = pFromS(entry.value);
		const s: Record<string, number[]> = {};
		groups.push(groupSides(p, grid, toVisit, s));
		sides.push(
			sum(
				Object.values(s).map((v) => {
					if (v.length === 0) return 1;
					v.sort((a, b) => a - b);
					let breaks = 1;
					for (let i = 1; i < v.length; i++) {
						if (v[i] !== v[i - 1] + 1) breaks += 1;
					}
					return breaks;
				}),
			),
		);
	}
	const areas = groups.map((g) => g.length);
	const total = areas.reduce((acc, v, ix) => acc + v * sides[ix], 0);

	console.log("Problem two:", total);
}

await problemOne();
await problemTwo();
