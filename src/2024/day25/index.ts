import { max, sum } from "lodash";
import { dumpGrid, handleLines, readLines } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
	const grids: string[][][] = [];

	const lines = await readLines(DATA_PATH);
	let current: string[][] = [];
	for (const l of lines) {
		if (!l) {
			grids.push(current);
			current = [];
			continue;
		}
		current.push(l.split(""));
	}

	const locks = [];
	const keys = [];
	const space = grids[0].length - 2

	for (const grid of grids) {
		const heights = [];
		if (grid[0].every((c) => c === "#")) {
			// LOCK
			for (let x = 0; x < grid[0].length; x++) {
				let y = 0;
				while (grid[y][x] === "#") {
					y++;
				}
				heights.push(y - 1);
			}
			locks.push(heights)
		} else {
			// KEY
			for (let x = 0; x < grid[0].length; x++) {
				let y = grid.length - 1;
				while (grid[y][x] === "#") {
					y--;
				}
				heights.push(grid.length - y - 2);
			}
			keys.push(heights)
		}
	}

	let fit = 0;
	for (const lock of locks) {
		for (const key of keys) {
			const sums = lock.reduce((acc, v, ix) => {
				acc.push(v + key[ix])
				return acc
			}, [] as number[])

			if (sums.every((v) => v <= space)) {
				fit++;
			}
		}
	}

	console.log("Problem one:", fit);
}

await problemOne();
