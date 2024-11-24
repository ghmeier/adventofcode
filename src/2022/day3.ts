import { readLines, sum } from "../utils";

const DATA_PATH = `${import.meta.dir}/day3.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day3-calibrate.txt`;

function toPriority(char: string) {
	const code = char.charCodeAt(0);
	return char.match(/[A-Z]/) ? code - 38 : code - 96;
}

async function problemOne() {
	const lines = await readLines(DATA_PATH);

	const duplicated = [];
	for (const line of lines) {
		const compartments = [
			line.substring(0, line.length / 2),
			line.substring(line.length / 2),
		];

		for (const char of compartments[1]) {
			if (compartments[0].includes(char)) {
				duplicated.push(toPriority(char));
				break;
			}
		}
	}
	console.log(sum(duplicated));
}

async function problemTwo() {
	const lines = await readLines(DATA_PATH);

	const badges = [];
	for (let lineNumber = 0; lineNumber < lines.length; lineNumber += 3) {
		const group = [
			lines[lineNumber].split(""),
			lines[lineNumber + 1].split(""),
			lines[lineNumber + 2].split(""),
		];

		const badge = new Set(
			group[0]
				.filter((c) => group[1].includes(c))
				.filter((c) => group[2].includes(c)),
		);
		if (badge.size > 1) console.log("MULTIPLE BADGES", badge);

		badges.push(toPriority(Array.from(badge)[0]));
	}
	console.log(sum(badges));
}

await problemOne();
await problemTwo();
