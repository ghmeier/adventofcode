import { range } from "lodash";
import { readLines, splitWhitespace, sum } from "../utils";

const DATA_PATH = `${import.meta.dir}/day10.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day10-calibrate.txt`;

function display(cycles: number[]) {
	console.log(
		cycles.map((v, ix) => ((ix - 19) % 40 === 0 ? `<${v}>` : v)).join(","),
	);
}

function parseCycles(lines: string[]) {
	const cycles = [];
	let x = 1;
	for (const line of lines) {
		if (!line) continue;

		const cmd = splitWhitespace(line);
		if (cmd[0] === "noop") cycles.push(x);
		else {
			cycles.push(x, x);
			x += parseInt(cmd[1], 10);
		}
	}
	cycles.push(x);

	return cycles;
}

// 11820
async function problemOne() {
	const lines = await readLines(DATA_PATH);

	const cycles = parseCycles(lines);

	const samples = [];
	for (let cycle = 20; cycle < cycles.length; cycle += 40) {
		samples.push(cycles[cycle - 1] * cycle);
		console.log(cycle);
	}
	display(cycles);
	console.log(samples);
	console.log("Problem one:", sum(samples));
}

// EPJBRKAH
async function problemTwo() {
	const lines = await readLines(DATA_PATH);

	const cycles = parseCycles(lines);

	let line = [];
	const screen = [];
	for (let c = 0; c < cycles.length; c++) {
		if (c % 40 === 0) {
			screen.push(line.join(""));
			line = [];
		}
		const s = cycles[c];
		const sMin = s - 1;
		const sMax = s + 1;
		if (sMin <= line.length && line.length <= sMax) line.push("#");
		else line.push(".");
	}
	console.log(screen.join("\n"));

	console.log("Problem two:", 0);
}

await problemOne();
await problemTwo();
