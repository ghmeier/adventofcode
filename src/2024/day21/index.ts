import { flatten, isNumber, min, range, reduce, zip, zipObject } from "lodash";
import { type Point, handleLines, sum } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

const MOVES = {
	UP: [0, -1],
	DOWN: [0, 1],
	LEFT: [-1, 0],
	RIGHT: [1, 0],
};
// const DOOR: PadMove[][] = [
// 	[7, 8, 9],
// 	[4, 5, 6],
// 	[1, 2, 3],
// 	[null, 0, ACTIVATE],
// ];
// const KEYPAD = [
// 	[null, UP, ACTIVATE],
// 	[LEFT, DOWN, RIGHT],
// ];

type PadMove = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A";

const LOCATIONS: Record<PadMove, Point> = {
	"7": [0, 0],
	"8": [1, 0],
	"9": [2, 0],
	"4": [0, 1],
	"5": [1, 1],
	"6": [2, 1],
	"1": [0, 2],
	"2": [1, 2],
	"3": [2, 2],
	"0": [1, 3],
	A: [2, 3],
};

const PAD_ENTRIES = Object.entries(LOCATIONS) as [PadMove, Point][];

function padForPoint([x, y]: Point) {
	const ix = PAD_ENTRIES.findIndex(([v, [lx, ly]]) => lx === x && ly === y);
	if (ix === -1) throw Error(`Invalid Pad ${x},${y}`);
	return PAD_ENTRIES[ix][0];
}

enum KeyMove {
	UP = "^",
	DOWN = "v",
	LEFT = "<",
	RIGHT = ">",
	ACTIVATE = "A",
}

const MOVE_LOCATIONS: Record<KeyMove, Point> = {
	[KeyMove.UP]: [1, 0],
	[KeyMove.LEFT]: [0, 1],
	[KeyMove.DOWN]: [1, 1],
	[KeyMove.RIGHT]: [2, 1],
	[KeyMove.ACTIVATE]: [2, 0],
};

const KEY_ENTRIES = Object.entries(MOVE_LOCATIONS) as [KeyMove, Point][];

function keyForPoint([x, y]: Point) {
	const ix = KEY_ENTRIES.findIndex(([v, [lx, ly]]) => lx === x && ly === y);
	return KEY_ENTRIES[ix][0];
}

const MOVE_DIRS = {
	[KeyMove.UP]: [0, -1],
	[KeyMove.LEFT]: [-1, 0],
	[KeyMove.DOWN]: [0, 1],
	[KeyMove.RIGHT]: [1, 0],
	[KeyMove.ACTIVATE]: [0, 0],
};

function kPaths(s: PadMove, d: PadMove): KeyMove[][] {
	if (s === d) {
		return [[KeyMove.ACTIVATE]];
	}

	const [sx, sy] = LOCATIONS[s];
	const [dx, dy] = LOCATIONS[d];
	const moves: KeyMove[] = [];
	if (sx > dx) moves.push(KeyMove.LEFT);
	if (sx < dx) moves.push(KeyMove.RIGHT);
	if (sy > dy) moves.push(KeyMove.UP);
	if (sy < dy) moves.push(KeyMove.DOWN);

	const paths: KeyMove[][] = [];
	for (const m of moves) {
		const [x, y] = MOVE_DIRS[m];
		const next: Point = [sx + x, sy + y];
		// // Invalid square
		if (next[0] === 0 && next[1] === 3) continue;
		paths.push(...kPaths(padForPoint(next), d).map((p) => [m, ...p]));
	}

	return paths;
}

const nPathsMemo: Record<string, KeyMove[][]> = {};

function nPaths(s: KeyMove, d: KeyMove): KeyMove[][] {
	const key = `${s}${d}`;
	if (nPathsMemo[key]) return nPathsMemo[key];

	if (s === d) return [[KeyMove.ACTIVATE]];

	const [sx, sy] = MOVE_LOCATIONS[s];
	const [dx, dy] = MOVE_LOCATIONS[d];
	const moves: KeyMove[] = [];
	if (sx > dx) moves.push(KeyMove.LEFT);
	if (sx < dx) moves.push(KeyMove.RIGHT);
	if (sy > dy) moves.push(KeyMove.UP);
	if (sy < dy) moves.push(KeyMove.DOWN);

	const paths: KeyMove[][] = [];
	for (const m of moves) {
		const [x, y] = MOVE_DIRS[m];
		const next: Point = [sx + x, sy + y];

		// // Invalid square
		if (next[0] === 0 && next[1] === 0) continue;

		paths.push(...nPaths(keyForPoint(next), d).map((p) => [m, ...p]));
	}
	nPathsMemo[key] = paths;
	return paths;
}

function reducePaths(paths: KeyMove[][][]) {
	let reduced = paths[0];
	for (let i = 1; i < paths.length; i++) {
		reduced = flatten(paths[i].map((p) => reduced.map((r) => [...r, ...p])));
	}
	return reduced;
}

async function problemOne() {
	const sequences: { code: PadMove[]; value: number }[] = [];
	await handleLines(DATA_PATH, (l) => {
		sequences.push({
			code: l.split("") as PadMove[],
			value: Number.parseInt(l.replace("A", ""), 10),
		});
	});

	const lengths: number[] = [];

	for (const { code } of [sequences[0]]) {
		let pMove: PadMove = "A";
		const keyPaths = code.map((v) => {
			const paths = kPaths(pMove, v);
			pMove = v;
			return paths;
		});
		let paths = reducePaths(keyPaths);
		for (let robot = 0; robot < 2; robot++) {
			const shortest = min(paths.map((p) => p.length));
			paths = flatten(
				paths
					.filter((p) => p.length === shortest)
					.map((path) => {
						let kMove: KeyMove = KeyMove.ACTIVATE;
						return reducePaths(
							path.map((v) => {
								const paths = nPaths(kMove, v);
								kMove = v;
								return paths;
							}),
						);
					}),
			);
		}

		const short = min(paths.map((p) => p.length)) || 0;
		lengths.push(short);
	}
	const values: number[] = lengths.map((l, ix) => l * sequences[ix].value);

	console.log("Problem one:", sum(values));
}

async function problemTwo() {
	console.log("Problem two:", null);
}

await problemOne();
await problemTwo();
