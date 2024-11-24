import { memoize } from "lodash";
import { handleLines, sum } from "../utils";

const DATA_PATH = `${import.meta.dir}/day12.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day12-calibrate.txt`;

// 7599
async function problemOne() {
	const options: number[] = [];
	await handleLines(DATA_PATH, (line) => {
		const [row, g] = line.split(" ");
		const groups = g.split(",").map((v) => Number.parseInt(v, 10));

		options.push(memoizedCountCombos(row, groups));
	});

	console.log("Problem one:", sum(options));
}

function expandGroups(g: string) {
	const groups = g.split(",").map((v) => Number.parseInt(v, 10));

	return [].concat(...Array(5).fill(groups));
}

function expandSprings(s: string) {
	return s + `?${s}`.repeat(4);
}

function sameWithWild(a: string, b: string) {
	return a
		.split("")
		.map((_, k) => (b[k] !== "?" && b[k] !== a[k] ? 0 : 1))
		.every((v) => v === 1);
}

const memoizedCountCombos = memoize(
	countCombinations,
	(q, groups) => `${q}-${groups.join(",")}`,
);

function countCombinations(q: string, groups: number[]) {
	if (q.length === 0) {
		// If we've also run out of groups, there is exactly one valid combination.
		return groups.length === 0 ? 1 : 0;
	}
	if (groups.length === 0 && q.length > 0) {
		// If there are no groups but remaining springs, there are no valid combinations.
		return q.includes("#") ? 0 : 1;
	}
	let s = 0;
	for (let i = 0; i <= q.length - groups[0]; i++) {
		let w = "#".repeat(groups[0]);
		// If there are remaining groups, we must end this group with a dot.
		if (groups.length > 1) {
			w = `${w}.`;
		}
		// Progressively check remaining groups after all possible first group matches.
		if (sameWithWild(w, q.slice(i, i + w.length)))
			s += memoizedCountCombos(q.slice(i + w.length), groups.slice(1));
		if (q[i] === "#") break;
	}
	return s;
}

// 15454556629917
async function problemTwo() {
	const options: number[] = [];
	await handleLines(DATA_PATH, (line) => {
		const [row, g] = line.split(" ");
		const groups = expandGroups(g);
		const springs = expandSprings(row);
		options.push(memoizedCountCombos(springs, groups));
	});

	console.log("Problem two:", sum(options));
}

await problemOne();
await problemTwo();
