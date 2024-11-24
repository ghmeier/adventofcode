import { Point, handleLines } from "../utils";
import ShoelaceArea from "../utils/ShoelaceArea";

const DATA_PATH = `${import.meta.dir}/day18.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day18-calibrate.txt`;

// Uses the shoelace formula

const DIRECTIONS: Record<string, Point> = {
	R: [1, 0],
	D: [0, 1],
	L: [-1, 0],
	U: [0, -1],
} as const;

const DIRS = Object.keys(DIRECTIONS);

// 48795
async function problemOne() {
	const actions: [string, number][] = [];

	await handleLines(DATA_PATH, (line) => {
		const [d, s] = line.split(" ");
		actions.push([d, parseInt(s, 10)]);
	});

	let edge = 0;
	const area = new ShoelaceArea([0, 0]);
	while (actions.length) {
		const [dir, amount] = actions.shift() as [string, number];
		area.add([
			area.current[0] + DIRECTIONS[dir][0] * amount,
			area.current[1] + DIRECTIONS[dir][1] * amount,
		]);
		edge += amount;
	}
	console.log("Problem one:", area.total() + edge / 2 + 1);
}

// 40654918441248
async function problemTwo() {
	const actions: [string, number][] = [];

	await handleLines(DATA_PATH, (line) => {
		const [d, s, color] = line.split(" ");
		const trimmed = color.replace(/[\(\)#]/g, "");
		const dir = parseInt(trimmed.substring(trimmed.length - 1), 16);
		const amount = parseInt(trimmed.substring(0, trimmed.length - 1), 16);

		actions.push([DIRS[dir], amount]);
	});

	let edge = 0;
	const area = new ShoelaceArea([0, 0]);
	while (actions.length) {
		const [dir, amount] = actions.shift() as [string, number];
		area.add([
			area.current[0] + DIRECTIONS[dir][0] * amount,
			area.current[1] + DIRECTIONS[dir][1] * amount,
		]);
		edge += amount;
	}

	// Area + edges + 1 for the start point.
	console.log("Problem two:", area.total() + edge / 2 + 1);
}

await problemOne();
await problemTwo();
