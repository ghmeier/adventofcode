import {
	DIRECTIONS,
	DIRS,
	type Point,
	handleLines,
	iterateGrid,
	onSurroundingCell,
	ps,
	sum,
	toSingleDigitList,
	validCell,
} from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

function findBasins(grid: number[][]) {
	const basins: Point[] = [];
	iterateGrid(grid, (x, y) => {
		const isLower = Object.values(DIRECTIONS).every((p) => {
			const nextX = x + p[0];
			const nextY = y + p[1];
			if (
				nextX < 0 ||
				nextY < 0 ||
				nextX >= grid[y].length ||
				nextY >= grid.length
			) {
				return true;
			}
			return grid[y][x] < grid[nextY][nextX];
		});

		if (isLower) basins.push([x, y]);
	});
	return basins;
}

async function problemOne() {
	const grid: number[][] = [];
	await handleLines(DATA_PATH, (l) => {
		grid.push(toSingleDigitList(l));
	});

	const basins = findBasins(grid);

	console.log("Problem one:", sum(basins.map(([x, y]) => grid[y][x] + 1)));
}

async function problemTwo() {
	const grid: number[][] = [];
	await handleLines(DATA_PATH, (l) => {
		grid.push(toSingleDigitList(l));
	});

	const basins = findBasins(grid);

	const basinSizes: number[] = [];
	for (const basin of basins) {
		const visit: Point[] = [basin];
		const visited = new Set<string>();

		while (visit.length) {
			const p = visit.shift();
			if (!p) break;
			const key = ps(p);
			if (visited.has(key)) continue;
			visited.add(key);
			onSurroundingCell(grid, p, (next) => {
				if (grid[next[1]][next[0]] < 9) visit.push(next);
			});
		}
		basinSizes.push(visited.size);
	}

	const topThree = basinSizes.sort((a, b) => b - a).slice(0, 3);

	console.log(
		"Problem two:",
		topThree.reduce((acc, v) => v * acc, 1),
	);
}

await problemOne();
await problemTwo();
