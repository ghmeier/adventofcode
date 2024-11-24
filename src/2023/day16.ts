import { isEqual, range } from "lodash";
import { handleLines, sum, Point, ps, iterateGrid } from "../utils";

const DATA_PATH = `${import.meta.dir}/day16.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day16-calibrate.txt`;

const DIRECTIONS: Record<string, Point> = {
	NORTH: [0, -1],
	SOUTH: [0, 1],
	EAST: [1, 0],
	WEST: [-1, 0],
};

function dump(grid: string[][], visited) {
	for (let y = 0; y < grid.length; y++) {
		const l = [];
		for (let x = 0; x < grid[y].length; x++) {
			if (visited[ps([x, y])]) l.push("#");
			else l.push(".");
		}
		console.log(l.join(""));
	}
}

function visit(grid: string[][], points) {
	const visited: Record<string, Point[]> = {};
	while (points.length) {
		const {
			point: [x, y],
			dir,
		} = points.shift();

		const cKey = ps([x, y]);
		if (!visited[cKey]) {
			visited[cKey] = [dir];
		} else if (visited[cKey].findIndex((p) => isEqual(p, dir)) !== -1) {
			// We've already been here from this direction, so exit.
			continue;
		} else {
			visited[cKey].push(dir);
		}

		const nextX = x + dir[0];
		const nextY = y + dir[1];
		if (
			nextX < 0 ||
			nextX >= grid[y].length ||
			nextY < 0 ||
			nextY >= grid.length
		)
			continue;

		const next = grid[nextY][nextX];
		if (next === ".") points.push({ point: [nextX, nextY], dir });
		else if (next === "\\") {
			points.push({ point: [nextX, nextY], dir: [dir[1], dir[0]] });
		} else if (next === "/") {
			points.push({ point: [nextX, nextY], dir: [-dir[1], -dir[0]] });
		} else if (next === "-") {
			if (dir[0] !== 0) points.push({ point: [nextX, nextY], dir });
			else {
				points.push({ point: [nextX, nextY], dir: DIRECTIONS.WEST });
				points.push({ point: [nextX, nextY], dir: DIRECTIONS.EAST });
			}
		} else if (next === "|") {
			if (dir[1] !== 0) points.push({ point: [nextX, nextY], dir });
			else {
				points.push({ point: [nextX, nextY], dir: DIRECTIONS.NORTH });
				points.push({ point: [nextX, nextY], dir: DIRECTIONS.SOUTH });
			}
		}
	}
	return visited;
}

// 6921
async function problemOne() {
	const grid: string[][] = [];
	await handleLines(DATA_PATH, (line) => {
		grid.push(line.split(""));
	});

	const visited: Record<string, Point[]> = visit(grid, [
		{ point: [0, 0], dir: DIRECTIONS.SOUTH },
	]);
	dump(grid, visited);
	console.log("Problem one:", Object.keys(visited).length);
}

// 7594
async function problemTwo() {
	const grid: string[][] = [];
	await handleLines(DATA_PATH, (line) => {
		grid.push(line.split(""));
	});

	let max = 0;
	for (let y = 0; y < grid.length; y++) {
		if (y !== 0 && y !== grid.length - 1) continue;
		for (let x = 0; x < grid[y].length; x++) {
			if (y === 0) {
				const v = visit(grid, [{ point: [x, y], dir: DIRECTIONS.SOUTH }]);
				const visited = Object.keys(v).length;
				if (visited > max) max = visited;
			}
			if (y === grid.length - 1) {
				const v = visit(grid, [{ point: [x, y], dir: DIRECTIONS.NORTH }]);
				const visited = Object.keys(v).length;
				if (visited > max) max = visited;
			}
			if (x === 0) {
				const v = visit(grid, [{ point: [x, y], dir: DIRECTIONS.EAST }]);
				const visited = Object.keys(v).length;
				if (visited > max) max = visited;
			}
			if (x === grid[y].length - 1) {
				const v = visit(grid, [{ point: [x, y], dir: DIRECTIONS.WEST }]);
				const visited = Object.keys(v).length;
				if (visited > max) max = visited;
			}
		}
	}

	console.log("Problem two:", max);
}

await problemOne();
await problemTwo();
