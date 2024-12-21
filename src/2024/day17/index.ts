import { handleLines } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

type Registers = {
	A: bigint;
	B: bigint;
	C: bigint;
}
type Operand = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'

function getOperand(r: Registers, o: bigint): bigint {
	if (o <= 3n) return o;
	if (o === 4n) return r.A;
	if (o === 5n) return r.B;
	if (o === 6n) return r.C;
	throw Error("Invalid Operation")
}

const OPERATIONS: ((r: Registers, o: bigint, p: number, out: bigint[]) => number)[] = [
	(r, o, p) => {
		r.A = r.A >> getOperand(r, o);
		return p + 2;
	},
	(r, o, p) => {
		r.B = r.B ^ o;
		return p + 2;
	},
	(r, o, p) => {
		r.B = getOperand(r, o) & 7n
		return p + 2;
	},
	(r, o, p) => {
		if (r.A === 0n) return p + 2;
		return Number(o)
	},
	(r, _o, p) => {
		r.B = r.B ^ r.C;
		return p + 2
	},
	(r, o, p, out) => {
		out.push(getOperand(r, o) & 7n)
		return p + 2
	},
	(r, o, p) => {
		r.B = r.A >> getOperand(r, o);
		return p + 2;
	},
	(r, o, p) => {
		r.C = r.A >> getOperand(r, o);
		return p + 2;
	}
]

async function problemOne() {
	const registers: Registers = { A: 0n, B: 0n, C: 0n }
	const program: bigint[] = []
	await handleLines(DATA_PATH, (l) => {
		if (l.startsWith('Register A:')) registers.A = BigInt(l.replace('Register A: ', ""))
		else if (l.startsWith('Register B:')) registers.B = BigInt(l.replace('Register B: ', ""))
		else if (l.startsWith('Register C:')) registers.C = BigInt(l.replace('Register C: ', ""))
		else program.push(...l.replace("Program: ", "").split(',').map((v) => BigInt(v)))
	})
	console.log(registers,program)
	let ptr = 0;
	const out: bigint[] = []
	while (ptr < program.length) {
		ptr = OPERATIONS[Number(program[ptr])](registers, program[ptr + 1], ptr, out)
	}

	console.log("Problem one:", out.join(','));
}

async function problemTwo() {
	const registers: Registers = { A: 0n, B: 0n, C: 0n }
	const program: bigint[] = []
	await handleLines(DATA_PATH, (l) => {
		if (l.startsWith('Register A:')) registers.A = BigInt(l.replace('Register A: ', ""))
		else if (l.startsWith('Register B:')) registers.B = BigInt(l.replace('Register B: ', ""))
		else if (l.startsWith('Register C:')) registers.C = BigInt(l.replace('Register C: ', ""))
		else program.push(...l.replace("Program: ", "").split(',').map((v) => BigInt(v)))
	})
	const search = program.join(',')

	let steps = 0n;
	while (true) {
		console.log(steps)
		const r: Registers = { A: steps, B: registers.B, C: registers.C }
		let ptr = 0;
		const out: bigint[] = []
		while (ptr < program.length) {
			ptr = OPERATIONS[Number(program[ptr])](r, program[ptr + 1], ptr, out)
			if (out.length > program.length) break;
			if (out.length && out[out.length - 1] !== program[out.length - 1]) break;
			// console.log(r)
		}
		if (out.length === program.length && search === out.join(',')) break;
		steps++

	}

	console.log("Problem two:", steps);
}

await problemOne();
// await problemTwo();
