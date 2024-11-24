import { readLines } from "../utils";

const DATA_PATH = `${import.meta.dir}/day4.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day4-calibrate.txt`;

function parseLine(line: string) {
	return line.split(",").map((a) => a.split("-").map((a) => parseInt(a, 10)));
}

function isContained(first: number[], second: number[]) {
	return first[0] <= second[0] && first[1] >= second[1];
}

function hasOverlap(first: number[], second: number[]) {
	return first[0] <= second[0] && first[1] >= second[0];
}

async function problemOne() {
	const lines = await readLines(DATA_PATH);

	let contained = 0;
	for (const line of lines) {
		const [first, second] = parseLine(line);
		if (isContained(first, second) || isContained(second, first)) {
			contained++;
		}
	}
	console.log("Problem one:", contained);
}

async function problemTwo() {
	const lines = await readLines(DATA_PATH);

	let overlap = 0;
	for (const line of lines) {
		const [first, second] = parseLine(line);
		if (hasOverlap(first, second) || hasOverlap(second, first)) {
			overlap++;
		}
	}
	console.log("Problem two:", overlap);
}

await problemOne();
await problemTwo();
