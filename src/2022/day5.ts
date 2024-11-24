import { readLines } from "../utils";

const DATA_PATH = `${import.meta.dir}/day5.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day5-calibrate.txt`;

interface Action {
	amount: number;
	src: number;
	dest: number;
}

type CrateRow = string | null[];

function parseCrateRow(line: string): CrateRow {
	const matches = line.match(/(\s{4}|\[[A-Z]\]\s?)/g);
	if (!matches) return [];
	return matches.map((m) => {
		const cleaned = m.trim();
		if (!cleaned) return null;
		return m.match(/[A-Z]/)[0];
	});
}

function parseAction(line: string): Action {
	const match = line.match(
		/move (?<amount>\d+) from (?<src>\d+) to (?<dest>\d+)/,
	);
	const { amount, src, dest } = match?.groups || {};
	return {
		amount: Number.parseInt(amount, 10),
		src: Number.parseInt(src, 10) - 1,
		dest: Number.parseInt(dest, 10) - 1,
	};
}

function topIndex(crates: CrateRow[], stack: number) {
	let row = 0;
	while (row < crates.length && !crates[row][stack]) {
		row++;
	}

	return row;
}

function printCrates(crates: CrateRow[]) {
	for (const row of crates) {
		console.log(row.map((v) => (v ? `[${v}]` : "   ")).join(" "));
	}
}

function moveCrate(crates: CrateRow[], action: Action, depth = 0) {
	let from = topIndex(crates, action.src) + depth;
	let to = topIndex(crates, action.dest);

	if (to === 0) {
		const empty = [];
		fillRow(empty, crates[0].length);
		crates.unshift(empty);
		from++;
	} else {
		to--;
	}

	if (crates[to][action.dest])
		throw Error(f`Cannot overwrite row ${to} stack ${action.dest}`);

	crates[to][action.dest] = crates[from][action.src];
	crates[from][action.src] = null;
}

function takeAction(crates: CrateRow[], action: Action) {
	for (let a = 0; a < action.amount; a++) {
		console.log(`move 1 from ${action.src} to ${action.dest}:`);
		moveCrate(crates, action);
		printCrates(crates);
	}
}

function takeGroupAction(crates: CrateRow[], action: Action) {
	console.log(`move ${action.amount} from ${action.src} to ${action.dest}:`);
	for (let a = action.amount - 1; a >= 0; a--) {
		moveCrate(crates, action, a);
	}
	printCrates(crates);
}

function fillRow(row: CrateRow, size: number) {
	for (let ix = row.length; ix < size; ix++) {
		row.push(null);
	}
}

function parseInput(lines: string[]): {
	crates: CrateRow[];
	actins: Action[];
	stacks: number;
} {
	const crates = [];
	const actions = [];
	let parseCrates = true;
	for (const line of lines) {
		if (!line) {
			parseCrates = false;
			continue;
		}

		if (parseCrates) {
			const row = parseCrateRow(line);
			if (row.length) crates.push(row);
		} else {
			actions.push(parseAction(line));
		}
	}

	const stacks = crates[crates.length - 1].length;
	for (const row of crates) {
		fillRow(row, stacks);
	}

	return { crates, actions, stacks };
}

// QGTHFZBHV
async function problemOne() {
	const lines = await readLines(DATA_PATH);

	const { crates, actions, stacks } = parseInput(lines);

	printCrates(crates);
	for (const action of actions) {
		takeAction(crates, action);
	}

	const topCrates = [];
	for (let stack = 0; stack < stacks; stack++) {
		const crate = crates[topIndex(crates, stack)][stack];
		topCrates.push(crate);
	}
	console.log("Problem one:", topCrates.join(""));
}

// MGDMPSZTM
async function problemTwo() {
	const lines = await readLines(DATA_PATH);

	const { crates, actions, stacks } = parseInput(lines);

	printCrates(crates);
	for (const action of actions) {
		takeGroupAction(crates, action);
	}

	const topCrates = [];
	for (let stack = 0; stack < stacks; stack++) {
		const crate = crates[topIndex(crates, stack)][stack];
		topCrates.push(crate);
	}

	console.log("Problem two:", topCrates.join(""));
}

await problemOne();
await problemTwo();
