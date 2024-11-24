import { lcm } from "mathjs";
import { readLines, sum } from "../utils";

const DATA_PATH = `${import.meta.dir}/day8.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day8-calibrate.txt`;

function parseNodes(lines: string[]) {
	const nodes: Record<string, [string, string]> = {};
	let directions: number[] = [];
	for (const line of lines) {
		if (!line) continue;
		if (!directions.length) {
			directions = line.split("").map((v) => (v === "L" ? 0 : 1));
		}

		const matches = line.match(
			/(?<node>[0-9A-Z]+) = \((?<left>[0-9A-Z]+),\ (?<right>[0-9A-Z]+)\)/,
		);
		if (!matches?.groups) continue;
		const { node, left, right } = matches.groups;
		nodes[node] = [left, right];
	}

	return { nodes, directions };
}

// 21409
async function problemOne() {
	const lines = await readLines(DATA_PATH);

	const { nodes, directions } = parseNodes(lines);

	let currentNode = "AAA";
	let ix = 0;
	let steps = 0;
	while (currentNode !== "ZZZ") {
		currentNode = nodes[currentNode][directions[ix]];
		ix++;
		if (ix >= directions.length) ix = 0;
		steps++;
	}

	console.log("Problem one:", steps);
}

// 21165830176709
async function problemTwo() {
	const lines = await readLines(DATA_PATH);
	const { nodes, directions } = parseNodes(lines);

	const startNodes = Object.keys(nodes).filter((v) => v.endsWith("A"));
	const stepsToEnd = [];

	for (let currentNode of startNodes) {
		let ix = 0;
		let steps = 0;

		while (!currentNode.endsWith("Z")) {
			currentNode = nodes[currentNode][directions[ix]];

			ix++;
			if (ix >= directions.length) ix = 0;
			steps++;
		}
		stepsToEnd.push(steps);
	}
	// @ts-ignore
	const totalSteps = lcm(...stepsToEnd);

	console.log("Problem two:", totalSteps);
}

await problemOne();
await problemTwo();
