import { handleLines } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

type Op = "AND" | "OR" | "XOR";

const OPS: Record<Op, (a: number, b: number) => number> = {
	AND: (a, b) => a & b,
	OR: (a, b) => a | b,
	XOR: (a, b) => a ^ b,
};

type Operation = { a: string; b: string; op: Op; out: string };

function numberForPrefix(values: Record<string, number>, prefix: string) {
	const digits = Object.entries(values).filter(([k]) => k.startsWith(prefix));
	digits.sort((a, b) => (a[0] < b[0] ? 1 : -1));

	const raw = digits.map(([, v]) => v.toString()).join("");
	return { value: Number.parseInt(raw, 2), raw };
}

async function parse(file: string) {
	const values: Record<string, number> = {};
	const operations: Operation[] = [];

	let maxX = "0";
	let maxY = "0";
	await handleLines(file, (l) => {
		if (l.includes(": ")) {
			const [k, v] = l.split(": ");
			values[k] = Number.parseInt(v, 10);
			if (k.startsWith("x") && k > maxX) maxX = k;
			else if (k.startsWith("y") && k > maxY) maxY = k;
		} else {
			const [input, out] = l.split(" -> ");
			const [a, op, b] = input.split(" ");
			operations.push({
				a,
				b,
				op: op as Op,
				out,
			});
		}
	});
	return { values, operations, maxX, maxY };
}

function run(values: Record<string, number>, operations: Operation[]) {
	const q = [...operations];
	while (q.length) {
		const c = q.shift();
		if (!c) break;
		const a = values[c.a];
		const b = values[c.b];

		if (a === undefined || b === undefined) {
			q.push(c);
			continue;
		}

		values[c.out] = OPS[c.op](a, b);
	}
}

async function problemOne() {
	const { values, operations } = await parse(DATA_PATH);

	run(values, operations);
	const { value, raw } = numberForPrefix(values, "z");
	console.log("Problem one:", value, raw);
}

async function problemTwo() {
	const { operations } = await parse(DATA_PATH);

	const badOps = [];
	// These are some hard-code-ish checks for bad operation combinations for a proper
	// full-adder circuit.
	for (const { a, b, out, op } of operations) {
		// Outputs must be the product of XOR, except for the final operation.
		if (out[0] === "z") {
			if (out !== "z45" && op !== "XOR") badOps.push({ a, b, out, op });
			continue;
		}

		if ([a[0], b[0]].includes("x") && [a[0], b[0]].includes("y")) {
			if (op === "XOR") {
				const other = operations.find(
					({ op, a, b }) => op === "XOR" && [a, b].includes(out),
				);
				if (!other) badOps.push({ op, a, b, out });
			}
			if (op === "AND") {
				if (!["x00", "y00"].includes(a) && !["x00", "y00"].includes(b)) {
					const other = operations.find(
						({ op, a, b }) => op === "OR" && [a, b].includes(out),
					);
					if (!other) badOps.push({ op, a, b, out });
				}
			}
			continue;
		}
		// AND/ORs are always ok when they don't involved initial inputs or output.
		if (["AND", "OR"].includes(op)) {
			continue;
		}
		// That leaves XORs which are never ok in the middle of the adder.
		badOps.push({ a, b, out, op });
	}

	const outs = badOps.map(({ out }) => out);
	outs.sort();
	console.log("Problem two", outs.join(","));
}

await problemOne();
await problemTwo();
