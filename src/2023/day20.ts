import { cond, flatten } from "lodash";
import { Point, handleLines, readLines, sum } from "../utils";
const DATA_PATH = `${import.meta.dir}/day20.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day20-calibrate.txt`;
import { lcm } from "mathjs";

type Pulse = "low" | "high";
type Result = "on" | "off";

type Action = (
	modules: Record<string, Module>,
	mod: Module,
	pulse: Pulse,
	i: string,
) => ActionHandler[];
type ActionHandler = () => ActionHandler[];

interface Module {
	name: string;
	value: Result;
	inputs: Record<string, Pulse>;
	destinations: string[];
	count: boolean;

	f: Action;
}

const PULSE_COUNT = { high: 0, low: 0 };

function flip(
	modules: Record<string, Module>,
	mod: Module,
	pulse: Pulse,
): ActionHandler[] {
	if (pulse === "high") return [];

	mod.value = mod.value === "off" ? "on" : "off";
	const next = mod.value === "on" ? "high" : "low";
	return mod.destinations.map((d) => {
		const destination = modules[d];
		// console.log(`${mod.name}  -${next}-> ${d}`);
		if (mod.count) PULSE_COUNT[next]++;
		return () => destination.f(modules, destination, next, mod.name);
	});
}

const conjunctions: Record<string, number> = {
	fn: 0,
	fh: 0,
	hh: 0,
	lk: 0,
};

const toCheck = ["fn", "fh", "hh", "lk"];

function conjunction(
	modules: Record<string, Module>,
	mod: Module,
	pulse: Pulse,
	i: string,
): ActionHandler[] {
	mod.inputs[i] = pulse;
	const next = Object.values(mod.inputs).every((v) => v === "high")
		? "low"
		: "high";

	if (toCheck.includes(mod.name) && next === "high") {
		conjunctions[mod.name] = presses;
		console.log(conjunctions);
	}
	return mod.destinations.map((d) => {
		const destination = modules[d];
		if (mod.count) PULSE_COUNT[next]++;
		// console.log(`${mod.name}  -${next}-> ${d}`);
		return () => destination.f(modules, destination, next, mod.name);
	});
}

function broadcast(
	modules: Record<string, Module>,
	mod: Module,
	pulse: Pulse,
): ActionHandler[] {
	return mod.destinations.map((d) => {
		const destination = modules[d];
		if (mod.count) PULSE_COUNT[pulse]++;
		// console.log(`${mod.name}  -${pulse}-> ${d}`);
		return () => destination.f(modules, destination, pulse, mod.name);
	});
}

function sink(
	_r: Record<string, Module>,
	_m: Module,
	pulse: Pulse,
): ActionHandler[] {
	if (pulse === "low") throw Error("Turning on!");
	return [() => []];
}

async function parse(file: string, count: boolean) {
	const modules: Record<string, Module> = {};
	await handleLines(file, (line) => {
		const [id, destinations] = line.split(" -> ");
		if (id === "broadcaster") {
			modules[id] = {
				name: id,
				value: "on",
				destinations: destinations.split(", "),
				inputs: {},
				count,
				f: broadcast,
			};
		} else if (id.startsWith("%")) {
			const name = id.replace("%", "");
			modules[name] = {
				name,
				value: "off",
				inputs: {},
				destinations: destinations.split(", "),
				count,
				f: flip,
			};
		} else if (id.startsWith("&")) {
			const name = id.replace("&", "");
			modules[name] = {
				name,
				value: "on",
				inputs: {},
				destinations: destinations.split(", "),
				count,
				f: conjunction,
			};
		}
	});
	for (const mod of Object.values(modules)) {
		for (const d of mod.destinations) {
			if (!modules[d])
				modules[d] = {
					name: d,
					inputs: { [d]: "high" },
					count,
					f: sink,
				};
			modules[d].inputs[mod.name] = "low";
		}
	}
	return modules;
}

// 1020211150
async function problemOne() {
	const modules = await parse(DATA_PATH, true);

	for (let i = 0; i < 1000; i++) {
		PULSE_COUNT.low++;
		// console.log("button -low-> broadcaster");
		const cycle = modules.broadcaster.f(
			modules,
			modules.broadcaster,
			"low",
			"broadcaster",
		);
		while (cycle.length) {
			const next = cycle.shift()();
			cycle.push(...next);
		}
	}

	console.log("Problem one:", PULSE_COUNT, PULSE_COUNT.low * PULSE_COUNT.high);
}

let presses = 0;
// 238 815 727 638 557
async function problemTwo() {
	const modules = await parse(DATA_PATH, false);

	while (
		!conjunctions.fn ||
		!conjunctions.fh ||
		!conjunctions.hh ||
		!conjunctions.lk
	) {
		// console.log(conjunctions);
		presses++;
		const cycle = modules.broadcaster.f(
			modules,
			modules.broadcaster,
			"low",
			"undefined",
		);
		while (cycle.length) {
			const next = cycle.shift()();
			cycle.push(...next);
		}
	}
	console.log(conjunctions);
	console.log(lcm(...Object.values(conjunctions)));
	console.log("Problem two:", presses);
}

await problemOne();
await problemTwo();
