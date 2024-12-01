import { addCounter, handleLines, splitWhitespace, sum } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
	let left: number[] = [];
	let right: number[] = [];
	await handleLines(DATA_PATH, (line) => {
		const [l, r] = splitWhitespace(line).map((v) => Number.parseInt(v));
		left.push(l);
		right.push(r);
	});

	left = left.sort((a, b) => a - b);
	right = right.sort((a, b) => a - b);
	const diff = left.map((v, ix) => Math.abs(v - right[ix]));
	console.log("Problem one:", sum(diff));
}

async function problemTwo() {
	const reference: string[] = [];
	const counts: Record<string, number> = {};
	await handleLines(DATA_PATH, (line) => {
		const [l, r] = splitWhitespace(line);
		reference.push(l);
		addCounter(counts, r);
	});
	const similarity = reference.reduce(
		(acc, r) => acc + Number.parseInt(r, 10) * (counts[r] || 0),
		0,
	);

	console.log("Problem two:", similarity);
}

await problemOne();
await problemTwo();
