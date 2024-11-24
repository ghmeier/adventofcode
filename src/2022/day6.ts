import { readLines } from "../utils";

const DATA_PATH = `${import.meta.dir}/day6.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day6-calibrate.txt`;

function packetStartIndex(line: string, size: number) {
	let sequence: string[] = [];
	for (const [ix, c] of line.split("").entries()) {
		const foundIndex = sequence.indexOf(c);
		sequence.push(c);
		if (foundIndex === -1) {
			if (sequence.length === size) {
				return ix;
			}
			continue;
		}
		sequence = sequence.slice(1 + foundIndex);
	}
	throw Error("No start packed found");
}

// 1625
async function problemOne() {
	const lines = await readLines(DATA_PATH);

	for (const line of lines) {
		if (!line) continue;
		const index = packetStartIndex(line, 4);
		console.log("First packet char", index + 1);
	}
}

// 2250
async function problemTwo() {
	const lines = await readLines(DATA_PATH);

	for (const line of lines) {
		if (!line) continue;
		const index = packetStartIndex(line, 14);
		console.log("First message char", index + 1);
	}
}

await problemOne();
await problemTwo();
