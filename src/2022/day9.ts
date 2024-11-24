import { range } from "lodash";
import { readLines } from "../utils";

const DATA_PATH = `${import.meta.dir}/day9.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day9-calibrate.txt`;

type Point = [number, number];

const MOVE = {
	D: [0, -1],
	U: [0, 1],
	L: [-1, 0],
	R: [1, 0],
};

function movePoint(dir: keyof typeof MOVE, point: Point): Point {
	return [point[0] + MOVE[dir][0], point[1] + MOVE[dir][1]];
}

function follow(point: Point, center: Point): Point {
	if (
		center[0] - 1 <= point[0] &&
		point[0] <= center[0] + 1 &&
		center[1] - 1 <= point[1] &&
		point[1] <= center[1] + 1
	) {
		return point;
	}

	if (center[0] === point[0]) {
		if (center[1] > point[1]) return movePoint("U", point);
		return movePoint("D", point);
	}
	if (center[1] === point[1]) {
		if (center[0] > point[0]) return movePoint("R", point);
		return movePoint("L", point);
	}
	if (center[0] > point[0]) {
		if (center[1] > point[1]) return movePoint("U", movePoint("R", point));
		return movePoint("D", movePoint("R", point));
	}

	if (center[1] > point[1]) return movePoint("U", movePoint("L", point));
	return movePoint("D", movePoint("L", point));
}

function display(points: Point[]) {
	const xList = points.map(([x]) => x);
	const yList = points.map(([, y]) => y);
	const minX = Math.min(...xList) - 3;
	const maxX = Math.max(...xList) + 3;
	const minY = Math.min(...yList) - 3;
	const maxY = Math.max(...yList) + 3;

	for (let y = maxY; y >= minY; y--) {
		const line = [];
		for (let x = minX; x <= maxX; x++) {
			const p = points.findIndex((p) => x === p[0] && y === p[1]);
			if (p === -1) line.push(".");
			else if (p === 0) line.push("H");
			else if (p === points.length - 1) line.push("T");
			else line.push(p.toString());
		}
		console.log(line.join(""));
	}
}

function displayVisited(points: Point[]) {
	const xList = points.map(([x]) => x);
	const yList = points.map(([, y]) => y);
	const minX = Math.min(...xList);
	const maxX = Math.max(...xList);
	const minY = Math.min(...yList);
	const maxY = Math.max(...yList);

	for (let y = maxY; y >= minY; y--) {
		const line = [];
		for (let x = minX; x <= maxX; x++) {
			if (x === 0 && y === 0) line.push("s");
			else if (points.some((p) => x === p[0] && y === p[1])) line.push("#");
			else line.push(".");
		}
		console.log(line.join(""));
	}
}

// 6354
async function problemOne() {
	const lines = await readLines(DATA_PATH);

	let t: Point = [0, 0];
	let h: Point = [0, 0];
	const visited: Record<string, Point> = {};
	for (const line of lines) {
		if (!line) continue;
		const [dir, raw] = line.split(" ");
		let amount = Number.parseInt(raw, 10);
		while (amount > 0) {
			h = movePoint(dir as keyof typeof MOVE, h);
			t = follow(t, h);
			console.log("Grid:", dir, t, h);
			display([h, t]);
			visited[t.join(",")] = t;
			amount--;
		}
		if (Math.abs(t[0] - h[0]) > 2 || Math.abs(t[1] - h[1]) > 2) {
			throw Error("Invalid board position detected.");
		}
	}
	console.log("Problem one:", Object.keys(visited).length);
}

// 2651
async function problemTwo() {
	const lines = await readLines(DATA_PATH);

	const rope: Point[] = range(0, 10).map(() => [0, 0]);
	const visited: Record<string, Point> = {};
	for (const line of lines) {
		if (!line) continue;
		const [dir, raw] = line.split(" ");
		let amount = Number.parseInt(raw, 10);
		while (amount > 0) {
			for (let ix = 0; ix < rope.length; ix++) {
				if (ix === 0) rope[ix] = movePoint(dir as keyof typeof MOVE, rope[ix]);
				else rope[ix] = follow(rope[ix], rope[ix - 1]);
			}

			const tail = rope[rope.length - 1];
			visited[tail.join(",")] = tail;
			console.log("Grid:", dir, rope);
			display(rope);
			amount--;
		}
	}
	console.log("Problem two:", Object.keys(visited).length);
}

await problemOne();
await problemTwo();
