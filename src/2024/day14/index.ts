import { range } from "lodash";
import {
	DIRECTIONS,
	type Point,
	dumpGrid,
	handleLines,
	pFromS,
	ps,
	validCell,
} from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
	const max = [101, 103];
	const steps = 100;
	const robots: { position: Point; velocity: Point }[] = [];

	await handleLines(DATA_PATH, (l) => {
		const [position, velocity] = l
			.replace("p=", "")
			.replace("v=", "")
			.split(" ")
			.map((p) => p.split(",").map(Number)) as [Point, Point];

		robots.push({ position, velocity });
	});

	for (let step = 0; step < steps; step++) {
		for (const r of robots) {
			const next: Point = [
				r.position[0] + r.velocity[0],
				r.position[1] + r.velocity[1],
			];
			if (next[0] >= max[0]) next[0] = next[0] - max[0];
			if (next[1] >= max[1]) next[1] = next[1] - max[1];
			if (next[0] < 0) next[0] = max[0] + next[0];
			if (next[1] < 0) next[1] = max[1] + next[1];
			r.position = next;
		}
	}

	const counts = { T: { L: 0, R: 0 }, B: { L: 0, R: 0 } };
	const grid = range(0, max[1]).map(() => range(0, max[0]).map(() => 0));
	robots.forEach(({ position }) => {
		let horizontal: "L" | "R" | null = null;
		let vertical: "T" | "B" | null = null;
		if (position[0] < Math.floor(max[0] / 2)) {
			horizontal = "L";
		} else if (position[0] > Math.floor(max[0] / 2)) {
			horizontal = "R";
		}
		if (position[1] < Math.floor(max[1] / 2)) {
			vertical = "T";
		} else if (position[1] > Math.floor(max[1] / 2)) {
			vertical = "B";
		}

		if (horizontal && vertical) counts[vertical][horizontal]++;

		grid[position[1]][position[0]] += 1;
	});

	console.log(
		"Problem one:",
		counts.T.R * counts.T.L * counts.B.R * counts.B.L,
	);
}

const D = Object.values(DIRECTIONS);
type Robot = { position: Point; velocity: Point };
function group(point: Point, grid: number[][], toVisit: Set<string>) {
	if (!toVisit.delete(ps(point))) return 0;

	let rest = 0;
	for (const p of D) {
		const next: Point = [point[0] + p[0], point[1] + p[1]];
		if (!validCell(grid, next) || grid[next[1]][next[0]] === 0) {
			continue;
		}
		rest += group(next, grid, toVisit);
	}
	return 1 + rest;
}

function checkGroup(robots: Robot[], grid: number[][]) {
	const toVisit = new Set(robots.map((r) => ps(r.position)));
	const iterator = toVisit.values();
	while (true) {
		const entry = iterator.next();
		if (entry.done) break;
		const p = pFromS(entry.value);
		const size = group(p, grid, toVisit);
		if (size > 120) return true;
	}
	return false;
}

async function problemTwo() {
	const max = [101, 103];
	const steps = 10000;
	const robots: Robot[] = [];
	const grid = range(0, max[1]).map(() => range(0, max[0]).map(() => 0));
	await handleLines(DATA_PATH, (l) => {
		const [position, velocity] = l
			.replace("p=", "")
			.replace("v=", "")
			.split(" ")
			.map((p) => p.split(",").map(Number)) as [Point, Point];

		grid[position[1]][position[0]]++;
		robots.push({ position, velocity });
	});

	for (let step = 0; step < steps; step++) {
		for (const r of robots) {
			const next: Point = [
				r.position[0] + r.velocity[0],
				r.position[1] + r.velocity[1],
			];
			if (next[0] >= max[0]) next[0] = next[0] - max[0];
			if (next[1] >= max[1]) next[1] = next[1] - max[1];
			if (next[0] < 0) next[0] = max[0] + next[0];
			if (next[1] < 0) next[1] = max[1] + next[1];
			grid[r.position[1]][r.position[0]]--;
			r.position = next;
			grid[r.position[1]][r.position[0]]++;
		}
		if (step > 5000 && checkGroup(robots, grid)) {
			console.log(
				grid.map((r) => r.map((v) => (v ? v : ".")).join("")).join("\n"),
			);
			console.log("Problem two:", step + 1);
			break;
		}
	}
}

await problemOne();
await problemTwo();
