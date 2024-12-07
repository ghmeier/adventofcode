import { type Point, handleLines, validCell } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

const directions = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
];

async function problemOne() {
	const grid: string[][] = [];
	let p: Point;
	await handleLines(CALIBRATE_PATH, (l) => {
		const line = l.split("");
		grid.push(line);
		const i = line.findIndex((c) => c === "^");
		if (i === -1) return;
		p = [i, grid.length - 1];
	});

	let ix = 0;
	let count = 0;
	while (true) {
		const next: Point = [p[0] + directions[ix][0], p[1] + directions[ix][1]];
		if (!validCell(grid, next)) break;
		if (grid[next[1]][next[0]] === "#") {
			ix += 1;
			continue;
		}
		count += 1;
		p = next;
	}

	console.log("Problem one:", count);
}

async function problemTwo() {
	console.log("Problem two:", null);
}

await problemOne();
await problemTwo();
