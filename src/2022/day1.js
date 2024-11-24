import { readLines } from "../utils.js";

async function problemOne() {
	const lines = await readLines("./2022/day1.txt");

	const calorieTotals = [];
	let currentTotal = 0;
	for (const line of lines) {
		if (!line) {
			calorieTotals.push(currentTotal);
			currentTotal = 0;
			continue;
		}
		currentTotal += parseInt(line, 10);
	}

	console.log(Math.max(...calorieTotals));
}

async function problemTwo() {
	const lines = await readLines("./2022/day1.txt");

	const calorieTotals = [];
	let currentTotal = 0;
	for (const line of lines) {
		if (!line) {
			calorieTotals.push(currentTotal);
			currentTotal = 0;
			continue;
		}
		currentTotal += parseInt(line, 10);
	}

	const topThree = calorieTotals.sort((a, b) => a - b).slice(-3);
	console.log(topThree.reduce((t, v) => t + v, 0));
}

await problemOne();
await problemTwo();
