import { readLines } from "../utils";

const DATA_PATH = `${import.meta.dir}/day6.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day6-calibrate.txt`;

// 138915
async function problemOne() {
	const lines = await readLines(DATA_PATH);

	const times = lines[0]
		.replace("Time:", "")
		.split(/\s+/)
		.filter((v) => !!v)
		.map((v) => parseInt(v, 10));
	const distances = lines[1]
		.replace("Distance:", "")
		.split(/\s+/)
		.filter((v) => !!v)
		.map((v) => parseInt(v, 10));

	let total = 1;
	for (let i = 0; i < times.length; i++) {
		const time = times[i];
		const distance = distances[i];

		total *= possibleWins(time, distance);
	}

	console.log("Problem one:", total);
}

function possibleWins(time: number, distance: number) {
	let firstWin = 0;
	for (let s = 1; s < time; s++) {
		if (!firstWin && s * (time - s) > distance) {
			firstWin = s;
			break;
		}
	}
	return time - firstWin - firstWin + 1;
}

// 27340847
async function problemTwo() {
	const lines = await readLines(DATA_PATH);

	const time = parseInt(
		lines[0]
			.replace("Time:", "")
			.split(/\s+/)
			.filter((v) => !!v)
			.join(""),
		10,
	);
	const distance = parseInt(
		lines[1]
			.replace("Distance:", "")
			.split(/\s+/)
			.filter((v) => !!v)
			.join(""),
		10,
	);


	console.log("Problem two:", possibleWins(time,distance));
}

await problemOne();
await problemTwo();
