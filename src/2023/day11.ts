import {
	type Point,
	dumpGrid,
	handleLines,
	iterateGrid,
	pFromS,
	ps,
	readLines,
	sum,
} from "../utils";

const DATA_PATH = `${import.meta.dir}/day11.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day11-calibrate.txt`;

// 9329143
async function problemOne() {
	const grid: string[][] = [];
	await handleLines(DATA_PATH, (line) => {
		grid.push(line.split(""));
		if (!line.includes("#")) grid.push(line.split(""));
	});

	for (let x = 0; x < grid[0].length; x++) {
		let isEmpty = true;
		for (let y = 0; y < grid.length; y++) {
			if (grid[y][x] === "#") {
				isEmpty = false;
				break;
			}
		}
		if (isEmpty) {
			for (let y = 0; y < grid.length; y++) {
				grid[y] = [...grid[y].slice(0, x), ".", ...grid[y].slice(x)];
			}
			x++;
		}
	}

	const galaxies: Point[] = [];
	iterateGrid(grid, (x, y) => {
		if (grid[y][x] === "#") galaxies.push([x, y]);
	});

	const distances: number[] = [];
	const pairs = [];
	for (const [ix, galaxy] of galaxies.entries()) {
		for (let i = ix + 1; i < galaxies.length; i++) {
			const xDist = Math.abs(galaxy[0] - galaxies[i][0]);
			const yDist = Math.abs(galaxy[1] - galaxies[i][1]);
			pairs.push([ix, i].join(""));
			distances.push(xDist + yDist);
		}
	}
	console.log("Problem one:", sum(distances));
}

const EXPAND_FACTOR = 1000000;

// 710674907809
async function problemTwo() {
	const grid: string[][] = [];
	const distances: number[][] = [];
	await handleLines(DATA_PATH, (line) => {
		const row = line.split("");
		grid.push(row);
		if (!line.includes("#")) distances.push(row.map(() => EXPAND_FACTOR));
		else distances.push(row.map(() => 1));
	});

	for (let x = 0; x < grid[0].length; x++) {
		let isEmpty = true;
		for (let y = 0; y < grid.length; y++) {
			if (grid[y][x] === "#") {
				isEmpty = false;
				break;
			}
		}
		if (isEmpty) {
			for (let y = 0; y < grid.length; y++) {
				distances[y][x] = EXPAND_FACTOR;
			}
			x++;
		}
	}

	const galaxies: Point[] = [];
	iterateGrid(grid, (x, y) => {
		if (grid[y][x] === "#") galaxies.push([x, y]);
	});

	const pairs = [];
	for (const [ix, galaxy] of galaxies.entries()) {
		for (let i = ix + 1; i < galaxies.length; i++) {
			pairs.push([galaxy, galaxies[i]]);
		}
	}

	const paths = pairs.map(([[startX, startY], [endX, endY]]) => {
		let path = 0;
		let x = startX;
		let y = startY;
		while (x !== endX || y !== endY) {
			if (x < endX) {
				x++;
			} else if (x > endX) {
				x--;
			} else if (y < endY) {
				y++;
			} else if (y > endY) {
				y--;
			}
			path += distances[y][x];
		}

		return path;
	});

	console.log("Problem two:", sum(paths));
}

await problemOne();
await problemTwo();
