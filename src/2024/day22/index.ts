import { max } from "lodash";
import { addCounter, handleLines, sum } from "../../utils";
import { sec } from "mathjs";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

function mix(a: bigint, b: bigint) {
	return a ^ b
}

function prune(a: bigint) {
	return a % 16777216n
}

function first(s: bigint) {
	return prune(mix(s, s << 6n))
}

function second(s: bigint) {
	return prune(mix(s, s >> 5n))
}

function third(s: bigint) {
	return prune(mix(s, s << 11n))
}

async function problemOne() {
	const secrets: bigint[] = []
	await handleLines(DATA_PATH, (l) => {
		secrets.push(BigInt(l))
	})

	let total = 0n
	for (let secret of secrets) {
		for (let i = 0; i < 2000; i++) {
			secret = third(second(first(secret)))
		}
		total += secret
	}

	console.log("Problem one:", total);
}

async function problemTwo() {
	const secrets: bigint[] = []

	await handleLines(DATA_PATH, (l) => {
		secrets.push(BigInt(l))
	})

	const counter: Record<string, bigint> = {}
	for (const secret of secrets) {
		const changes = []
		const visited = new Set<string>()
		let current = secret
		for (let i = 0; i < 2000; i++) {
			const next = third(second(first(current)))
			changes.push((next % 10n) - (current % 10n))
			current = next

			if (changes.length === 4) {
				const key = changes.join(',')
				if (!visited.has(key)) {
					if (counter[key] === undefined) counter[key] = 0n
					counter[key] += (next % 10n)
					visited.add(key)
				}
				changes.shift()
			}
		}
	}

	console.log("Problem two:", max(Object.values(counter)));
}

// await problemOne();
await problemTwo();
