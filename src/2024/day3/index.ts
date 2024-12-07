import { handleLines, sum } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
	let line = "";
	await handleLines(DATA_PATH, (l) => {
		line += l;
	});

	const matches = [...line.matchAll(/mul\((\d+)\,(\d+)\)/g)];
	const values = matches.map(
		([_, x, y]) => Number.parseInt(x) * Number.parseInt(y),
	);

	console.log("Problem one:", sum(values));
}

async function problemTwo() {
	let line = "";
	await handleLines(DATA_PATH, (l) => {
		line += l;
	});

	const matches = [
		...line.matchAll(/(?:mul\((\d+)\,(\d+)\)|do\(\)|don\'t\(\))/g),
	];
	let result = 0;

	let enabled = true;
	for (const [op, x, y] of matches) {
		if (op === "do()") enabled = true;
		else if (op === "don't()") enabled = false;
		else if (enabled) {
			// console.log(x,y, op)
			result += Number.parseInt(x) * Number.parseInt(y);
		}
	}
	console.log(matches);

	console.log("Problem two:", result);
}

await problemOne();
await problemTwo();
