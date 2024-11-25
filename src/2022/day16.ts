import { open } from "node:fs";
import { maxBy } from "lodash";
import { Point, dumpGrid, handleLines, iterateGrid, ps, sum } from "../utils";

const DATA_PATH = `${import.meta.dir}/day16.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day16-calibrate.txt`;

interface Path {
	valves: string[];
	remaining: number;
	opened: Record<string, number>;
	release: (string | null)[];
}
interface Valve {
	rate: number;
	paths: string[];
}

const releaseByValveRemaining: Record<string, number> = {};

function key({ valves, remaining, opened }: Path) {
	return `${valves.sort().join(",")},${remaining},${Object.keys(opened).join(
		",",
	)}`;
}

function traverse(path: Path, valves: Record<string, Valve>) {
	const { rate, paths } = valves[path.valves[0]];

	// If we've determined the max value for this path, return.
	const k = key(path);
	if (path.remaining <= 1) {
		releaseByValveRemaining[k] = 0;
		return releaseByValveRemaining[k];
	}
	if (releaseByValveRemaining[k] !== undefined) {
		return releaseByValveRemaining[k];
	}

	const released = [];
	if (rate && !path.opened[path.valves[0]]) {
		const release = rate * (path.remaining - 1);
		for (const v of paths) {
			released.push(
				traverse(
					{
						valves: [v],
						remaining: path.remaining - 2,
						opened: {
							...path.opened,
							[path.valves[0]]: 1,
						},
						release: [null, null],
					},
					valves,
				) + release,
			);
		}
	}
	for (const v of paths) {
		released.push(
			traverse(
				{
					valves: [v],
					remaining: path.remaining - 1,
					opened: { ...path.opened },
					release: [null, null],
				},
				valves,
			),
		);
	}
	releaseByValveRemaining[k] = Math.max(...released);
	return releaseByValveRemaining[k];
}

function traverseMultiple(path: Path, valves: Record<string, Valve>) {
	// If we've determined the max value for this path, return.
	const [a, b] = path.valves;
	let k = key(path);

	const canMoveA = !path.release[0];
	const canMoveB = !path.release[1];

	if (path.release[0]) {
		path.opened[path.release[0]] = 26 - path.remaining;
	}
	if (path.release[1]) {
		path.opened[path.release[1]] = 26 - path.remaining;
	}
	const shouldOpenA = path.opened[a] === undefined;
	const shouldOpenB = path.opened[b] === undefined;

	k = key(path);
	if (
		path.opened.DD === 2 &&
		path.opened.JJ === 3 &&
		path.opened.HH === 8 &&
		path.opened.BB === 8 &&
		path.release.includes("CC")
	) {
		console.log(path);
	}
	if (canMoveA && canMoveB) {
		// Only use cached values after settling opened valves.
		if (releaseByValveRemaining[k] !== undefined) {
			if (
				path.opened.DD === 2 &&
				path.opened.JJ === 3 &&
				path.opened.HH === 8 &&
				path.opened.BB === 8 &&
				path.valves.includes("CC")
			) {
				console.log(path, releaseByValveRemaining[k]);
			}
			return { ...releaseByValveRemaining[k] };
		}
		// Short circuit if we've opened everything.
		if (Object.keys(valves).length === Object.keys(path.opened).length) {
			releaseByValveRemaining[k] = { value: 0, opened: path.opened };
			return { ...releaseByValveRemaining[k] };
		}
	}
	if (path.remaining < 1) {
		releaseByValveRemaining[k] = { value: 0, opened: path.opened };
		return { ...releaseByValveRemaining[k] };
	}

	const released: { value: number; path: string[] }[] = [];
	const remaining = path.remaining - 1;
	if (!canMoveA && !canMoveB) {
		released.push(
			traverseMultiple(
				{
					valves: [a, b],
					remaining,
					opened: { ...path.opened },
					release: [null, null],
				},
				valves,
			),
		);
	} else if (canMoveA && canMoveB) {
		// if (
		// 	path.opened.DD === 2 &&
		// 	path.opened.JJ === 3 &&
		// 	path.opened.HH === 8 &&
		// 	path.opened.BB === 8
		// ) {
		// 	console.log(path);
		// }
		// If A should open, try those paths.
		if (shouldOpenA) {
			for (const q of valves[b].paths) {
				if (q === a) continue;
				const option = traverseMultiple(
					{
						valves: [a, q],
						remaining,
						opened: { ...path.opened },
						release: [a, null],
					},
					valves,
				);
				option.value += valves[a].rate * remaining;
				released.push(option);
			}
		}
		for (const v of valves[a].paths) {
			// Traverse this path of a with all b's
			if (shouldOpenB) {
				const option = traverseMultiple(
					{
						valves: [v, b],
						remaining,
						opened: { ...path.opened },
						release: [null, b],
					},
					valves,
				);
				option.value += valves[b].rate * remaining;
				released.push(option);
			}
			released.push(
				...valves[b].paths
					.filter((q) => q !== v)
					.map((q) =>
						traverseMultiple(
							{
								valves: [v, q],
								remaining,
								opened: { ...path.opened },
								release: [null, null],
							},
							valves,
						),
					),
			);
		}

		if (a !== b && shouldOpenA && shouldOpenB) {
			const option = traverseMultiple(
				{
					valves: [a, b],
					remaining,
					opened: {
						...path.opened,
					},
					release: [a, b],
				},
				valves,
			);
			option.value += valves[a].rate * remaining + valves[b].rate * remaining;
			released.push(option);
		}
	} else if (canMoveA) {
		if (shouldOpenA) {
			const option = traverseMultiple(
				{
					valves: [a, b],
					remaining,
					opened: { ...path.opened },
					release: [a, null],
				},
				valves,
			);
			option.value += valves[a].rate * remaining;
			released.push(option);
		}
		released.push(
			...valves[a].paths
				.filter((v) => b !== v)
				.map((v) =>
					traverseMultiple(
						{
							valves: [v, b],
							remaining,
							opened: { ...path.opened },
							release: [null, null],
						},
						valves,
					),
				),
		);
	} else if (canMoveB) {
		if (shouldOpenB) {
			const option = traverseMultiple(
				{
					valves: [a, b],
					remaining,
					opened: { ...path.opened },
					release: [null, b],
				},
				valves,
			);
			option.value += valves[b].rate * remaining;
			released.push(option);
		}
		released.push(
			...valves[b].paths
				.filter((v) => a !== v)
				.map((v) =>
					traverseMultiple(
						{
							valves: [a, v],
							remaining,
							opened: { ...path.opened },
							release: [null, null],
						},
						valves,
					),
				),
		);
	}
	const max = maxBy(released, "value");
	max.opened = { ...max.opened, ...path.opened };
	// if (max.opened.JJ === 3 && max.opened.DD === 2) console.log(max.opened);
	releaseByValveRemaining[k] = max;

	return { ...releaseByValveRemaining[k] };
}

// 2056
async function problemOne() {
	const valves: Record<string, Valve> = {};
	await handleLines(DATA_PATH, (line) => {
		const { valve, rate, paths } = (
			line.match(
				/Valve (?<valve>\w+) has flow rate=(?<rate>\d+); tunnel[s]? lead[s]? to valve[s]? (?<paths>[\w+,\s]+)/,
			) as RegExpMatchArray
		).groups as { valve: string; rate: string; paths: string };
		valves[valve] = {
			rate: Number.parseInt(rate, 10),
			paths: paths.split(", "),
		};
	});
	const opened = Object.keys(valves).reduce(
		(acc, v) => {
			// Consider valves with no rate opened.
			if (!valves[v].rate) acc[v] = 1;
			return acc;
		},
		{} as Record<string, number>,
	);
	const max = traverse(
		{ valves: ["AA"], remaining: 30, opened: opened, release: [] },
		valves,
	);
	console.log("Problem one:", max);
}

async function problemTwo() {
	const valves: Record<string, Valve> = {};
	await handleLines(CALIBRATE_PATH, (line) => {
		const { valve, rate, paths } = (
			line.match(
				/Valve (?<valve>\w+) has flow rate=(?<rate>\d+); tunnel[s]? lead[s]? to valve[s]? (?<paths>[\w+,\s]+)/,
			) as RegExpMatchArray
		).groups as { valve: string; rate: string; paths: string };
		valves[valve] = {
			rate: Number.parseInt(rate, 10),
			paths: paths.split(", "),
		};
	});
	const opened = Object.keys(valves).reduce(
		(acc, v) => {
			// Consider valves with no rate opened.
			if (!valves[v].rate) acc[v] = 0;
			return acc;
		},
		{} as Record<string, number>,
	);

	const max = traverseMultiple(
		{ valves: ["AA", "AA"], remaining: 26, opened, release: [null, null] },
		valves,
	);

	console.log("Problem two:", max);
}

await problemOne();
// await problemTwo();
