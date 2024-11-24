import { flatten, max } from "lodash";
import { readLines, sum, toSingleDigitList } from "../utils";

const DATA_PATH = `${import.meta.dir}/day8.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day8-calibrate.txt`;

function upVal(grid: T[][], x: number, y: number) {
	let ix = y;
	while (ix > 0) {
		if (grid[ix - 1][x] >= grid[y][x]) return y - ix + 1;
		ix--;
	}
	return y - ix;
}

function leftVal(grid: T[][], x: number, y: number) {
	let ix = x;
	while (ix > 0) {
		if (grid[y][ix - 1] >= grid[y][x]) return x - ix + 1;
		ix--;
	}
	return x - ix;
}

function downVal(grid: T[][], x: number, y: number) {
	let ix = y;
	while (ix < grid.length - 1) {
		if (grid[ix + 1][x] >= grid[y][x]) return ix - y + 1;
		ix++;
	}

	return ix - y;
}

function rightVal(grid: T[][], x: number, y: number) {
	let ix = x;
	while (ix < grid[y].length - 1) {
		if (grid[y][ix + 1] >= grid[y][x]) return ix - x + 1;
		ix++;
	}
	return ix - x;
}

const dirVals = [upVal, leftVal, downVal, rightVal];

function displayList(list: number[][]) {
	console.log(
		list.map((n) => n.map((n) => (n === null ? "u" : n)).join("")).join("\n"),
	);
	console.log("-----");
}

//1711
async function problemOne() {
	const lines = await readLines(DATA_PATH);

	const trees: number[][] = [];
	const visible: number[][] = [];
	const unresolved = [];
	for (const line of lines) {
		if (!line) continue;
		const heights = toSingleDigitList(line);
		trees.push(heights);
		visible.push(heights.map(() => null));
		unresolved.push(...heights.map((_, ix) => [ix, trees.length - 1]));
	}

	while (unresolved.length) {
		const [x, y] = unresolved.pop();
		if (y === 0 || y === trees.length - 1) visible[y][x] = 1;
		else if (x === 0 || x === trees[y].length - 1) visible[y][x] = 1;
		else {
			if (dirVals.some((f) => f(trees, x, y) > 1)) {
				visible[y][x] = 1;
			} else {
				visible[y][x] = 0;
			}
		}
	}

	const allVisible = flatten(visible);
	displayList(visible);
	console.log("Problem one:", sum(allVisible), allVisible.length);
}

// 301392
async function problemTwo() {
	const lines = await readLines(DATA_PATH);
	const trees: number[][] = [];
	const sights: number[] = [];
	const unresolved = [];
	for (const line of lines) {
		if (!line) continue;
		const heights = toSingleDigitList(line);
		trees.push(heights);
		unresolved.push(...heights.map((_, ix) => [ix, trees.length - 1]));
	}

	while (unresolved.length) {
		const [x, y] = unresolved.pop();
		if (y === 0 || y === trees.length - 1) continue;
		if (x === 0 || x === trees[y].length - 1) continue;

		sights.push(
			dirVals.map((f) => f(trees, x, y)).reduce((acc, v) => acc * v, 1),
		);
	}

	console.log("Problem two:", max(sights));
}

await problemOne();
await problemTwo();
