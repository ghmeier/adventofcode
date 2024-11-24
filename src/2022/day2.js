import { readLines, sum } from "../utils.js";

const toType = {
	A: "rock",
	B: "paper",
	C: "scissors",
	X: "rock",
	Y: "paper",
	Z: "scissors",
};

const toOutcome = {
	X: { value: 0, key: "beats" },
	Y: { value: 3, key: "draw" },
	Z: { value: 6, key: "loses" },
};

const rules = {
	rock: { value: 1, beats: "scissors", loses: "paper" },
	paper: { value: 2, beats: "rock", loses: "scissors" },
	scissors: { value: 3, beats: "paper", loses: "rock" },
};

async function problemOne() {
	const lines = await readLines("./2022/day2.txt");

	const scores = [];
	for (const line of lines) {
		if (!line) continue;

		const [a, b] = line.split(" ");
		const opponent = toType[a];
		const myself = toType[b];
		let outcomeScore = 0;
		if (myself === opponent) outcomeScore = 3;
		else if (rules[myself].beats === opponent) outcomeScore = 6;

		scores.push(rules[myself].value + outcomeScore);
	}
	console.log(sum(scores));
}

async function problemTwo() {
	const lines = await readLines("./2022/day2.txt");

	const scores = [];
	for (const line of lines) {
		if (!line) continue;

		const [a, b] = line.split(" ");
		const opponent = toType[a];
		const outcome = toOutcome[b];
		const myself =
			outcome.key === "draw" ? opponent : rules[opponent][outcome.key];
		scores.push(outcome.value + rules[myself].value);
	}
	console.log(sum(scores));
}

await problemOne();
await problemTwo();
