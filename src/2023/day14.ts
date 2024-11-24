import { cloneDeep } from "lodash";
import { Point, handleLines, iterateGrid } from "../utils";

const DATA_PATH = `${import.meta.dir}/day14.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day14-calibrate.txt`;

const NORTH: Point = [0, -1];
const SOUTH: Point = [0, 1];
const EAST: Point = [1, 0];
const WEST: Point = [-1, 0];

const CYCLE = [NORTH, WEST, SOUTH, EAST];

function valid(grid: string[][], [x, y]: Point) {
	return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
}

function roll(grid: string[][], [x, y]: Point, [moveX, moveY]: Point) {
	if (grid[y][x] !== "O") return;
	let current: Point = [x, y];
	let next: Point = [x + moveX, y + moveY];
	while (valid(grid, next) && grid[next[1]][next[0]] === ".") {
		current = next;
		next = [next[0] + moveX, next[1] + moveY];
	}

	grid[y][x] = ".";
	grid[current[1]][current[0]] = "O";
}

function consolidate(grid: string[][], dir: Point) {
	if (dir === SOUTH) {
		for (let y = grid.length - 1; y >= 0; y--) {
			for (let x = 0; x < grid[y].length; x++) {
				roll(grid, [x, y], dir);
			}
		}
		return;
	}

	if (dir === EAST) {
		for (let y = 0; y < grid.length; y++) {
			for (let x = grid[y].length - 1; x >= 0; x--) {
				roll(grid, [x, y], dir);
			}
		}
		return;
	}
	iterateGrid(grid, (x, y) => {
		if (grid[y][x] !== "O") return;
		roll(grid, [x, y], dir);
	});
}

function sumLoad(grid: string[][]) {
	let sum = 0;
	iterateGrid(grid, (x, y) => {
		if (grid[y][x] !== "O") return;
		sum += grid.length - y;
	});
	return sum;
}

async function problemOne() {
	const grid: string[][] = [];
	await handleLines(DATA_PATH, (line) => {
		grid.push(line.split(""));
	});

	consolidate(grid, NORTH);

	console.log("Problem one:", sumLoad(grid));
}

const CYCLES: Record<string, { key: string; grid: string[][] }> = {};

function key(grid: string[][]) {
	return grid.map((l) => l.join("")).join("");
}

// 102055
async function problemTwo() {
	let grid: string[][] = [];
	await handleLines(DATA_PATH, (line) => {
		grid.push(line.split(""));
	});

	let nextKey = "";
	for (let c = 0; c < 1000000000; c++) {
		const currentKey = nextKey || key(grid);
		if (CYCLES[currentKey]) {
			grid = CYCLES[currentKey].grid;
			nextKey = CYCLES[currentKey].key;
			continue;
		}

		for (const dir of CYCLE) {
			consolidate(grid, dir);
		}
		const cached = {
			grid: cloneDeep(grid),
			key: key(grid),
		};

		CYCLES[currentKey] = cached;
		nextKey = cached.key;
	}

	console.log("Problem two:", sumLoad(grid));
}

await problemOne();
await problemTwo();
