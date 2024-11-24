import { range } from "lodash";
import { Point, dumpGrid, handleLines, sum } from "../utils";
import intersects from "intersects";
const DATA_PATH = `${import.meta.dir}/day22.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day22-calibrate.txt`;

type Point3 = [number, number, number];

interface Brick {
	ix: string;
	min: Point;
	max: Point;
	z: number;
	height: number;
}

// True if bottom of A intersects with top of b
function isIntersection(a: Brick, b: Brick) {
	// If a is above b, they cannot intersect.
	if (a.z >= b.z + b.height) return false;
	return intersects.boxBox(
		a.min[0],
		a.min[1],
		a.max[0] - a.min[0] + 1,
		a.max[1] - a.min[1] + 1,
		b.min[0],
		b.min[1],
		b.max[0] - b.min[0] + 1,
		b.max[1] - b.min[1] + 1,
	);
}

function dumpX(grid: string[][], bricks: Brick[]) {
	for (const b of bricks) {
		for (const x of range(b.min[0], b.max[0] + 1)) {
			for (const z of range(0, b.height)) {
				if (grid[b.z + z][x] !== "....") grid[b.z + z][x] = "????";
				else grid[b.z + z][x] = b.ix;
			}
		}
	}
	dumpGrid(grid);
}

function dumpY(grid: string[][], bricks: Brick[]) {
	for (const b of bricks) {
		for (const y of range(b.min[1], b.max[1] + 1)) {
			for (const z of range(0, b.height)) {
				if (grid[b.z + z][y] !== "....") grid[b.z + z][y] = "????";
				else grid[b.z + z][y] = b.ix;
			}
		}
	}
	dumpGrid(grid);
}

function sumSupporting(
	k: string,
	supporting: Record<string, string[]>,
	resting: Record<string, string[]>,
): number {
	const q = [k];
	const visited = new Set(q);
	const willFall = (di: string) => resting[di].every((sb) => visited.has(sb));
	while (q.length) {
		const i = q.shift() as string;
		for (const di of supporting[i].filter(willFall)) {
			q.push(di);
			visited.add(di);
		}
	}

	return visited.size - 1;
}

// 499
// 95059
async function problems() {
	const bricks: Brick[] = [];
	const supporting: Record<string, string[]> = {};
	const resting: Record<string, string[]> = {};
	await handleLines(DATA_PATH, (line) => {
		const [start, end]: Point3[] = line
			.split("~")
			.map((v) => v.split(",").map((i) => parseInt(i, 10)) as Point3);
		const z = Math.min(start[2], end[2]);
		const ix = bricks.length.toString().padStart(4, " "); // String.fromCharCode(bricks.length);
		bricks.push({
			ix,
			min: [Math.min(start[0], end[0]), Math.min(start[1], end[1])],
			max: [Math.max(start[0], end[0]), Math.max(start[1], end[1])],
			z,
			height: Math.abs(start[2] - end[2]) + 1,
		});
		supporting[ix] = [];
		resting[ix] = [];
	});
	bricks.sort((a, b) => a.z - b.z);

	const placed: Brick[] = [];
	while (bricks.length) {
		const a = bricks.shift() as Brick;

		a.z = 1;
		while (placed.some((b) => isIntersection(a, b))) {
			a.z += 1;
		}
		for (const b of placed) {
			if (!isIntersection({ ...a, z: a.z - 1 }, b)) continue;

			resting[a.ix].push(b.ix);
			supporting[b.ix].push(a.ix);
		}
		placed.push(a);
	}

	// console.log(supporting, resting);
	// console.log(placed.sort((a, b) => a.z - b.z));
	let removable = Object.keys(supporting).length;
	const impact = [];
	for (const [k, v] of Object.entries(supporting)) {
		// If it's not supporting any other bricks, it's definitely removable.
		if (v.some((i) => resting[i].filter((r) => r !== k).length === 0))
			removable--;
		impact.push(sumSupporting(k, supporting, resting));
	}

	console.log("Problem one:", removable);
	console.log("Problem two:", sum(impact));
}

await problems();
