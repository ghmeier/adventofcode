import { fill, range } from "lodash";
import { handleLines, sum, toSingleDigitList } from "../../utils";
import MinHeap from "../../utils/MinHeap";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
	const filled: { id: number; locations: number[] }[] = [];
	const freeHeap = new MinHeap<number>();
	let diskSize = 0;
	await handleLines(DATA_PATH, (l) => {
		let diskLocation = 0;
		toSingleDigitList(l).forEach((d, ix) => {
			const locations = range(diskLocation, diskLocation + d);
			diskLocation += d
			if (ix % 2 === 0) {
				filled.push({ id: filled.length, locations })
				diskSize += locations.length
			} else {
				locations.forEach((v) => freeHeap.set(v.toString(), v, v))
			}
		});
	});

	// collapse
	let collapseIx = filled.length - 1
	while (true) {
		if (freeHeap.peek() >= diskSize) break;
		const last = filled[collapseIx];
		last.locations = last.locations.map((v) => {
			const val = freeHeap.pop()
			freeHeap.set(v.toString(), v, v)
			return val
		})
		collapseIx -= 1
	}

	const checksum = filled.reduce((acc, { id, locations }) => {
		return acc + sum(locations.map((l) => l * id))
	}, 0)
	console.log("Problem one:", checksum);
}

async function problemTwo() {
	const filled: { id: number; locations: number[] }[] = [];
	const freeHeap = new MinHeap<number>();
	await handleLines(DATA_PATH, (l) => {
		let diskLocation = 0;
		toSingleDigitList(l).forEach((d, ix) => {
			const locations = range(diskLocation, diskLocation + d);
			diskLocation += d
			if (ix % 2 === 0) {
				filled.push({ id: filled.length, locations });
			} else {
				locations.forEach((v) => freeHeap.set(v.toString(), v, v));
			}
		});
	});

	// collapse
	const noSizeRemaining: Record<number, boolean> = {}
	let collapseIx = filled.length - 1
	while (true) {
		if (collapseIx < 0) break;
		const last = filled[collapseIx];
		if (noSizeRemaining[last.locations.length] || last.locations[0] < freeHeap.peek()) {
			collapseIx -= 1;
			continue;
		}
		let potential: number[] = [];
		const discarded: number[] = [];
		// console.log(filled)
		while (potential.length < last.locations.length) {
			if (!freeHeap.size() || freeHeap.peek() > last.locations[0]) {
				break;
			}
			const next = freeHeap.pop();
			// Contiguous
			if (!potential.length || potential[potential.length - 1] + 1 === next) {
				potential.push(next)
			} else {
				discarded.push(...potential)
				potential = [next]
			}
		}
		last.locations.forEach((v) => freeHeap.set(v.toString(), v, v));
		discarded.forEach((v) => freeHeap.set(v.toString(), v, v))
		if (potential.length === last.locations.length) {
			last.locations = potential;
		} else {
			noSizeRemaining[last.locations.length] = true
			potential.forEach((v) => freeHeap.set(v.toString(), v, v))
		}
		// console.log(last.id, last.locations)
		collapseIx -= 1
	}

	const checksum = filled.reduce((acc, { id, locations }) => {
		return acc + sum(locations.map((l) => l * id))
	}, 0)

	console.log("Problem two:", checksum);
}

await problemOne();
await problemTwo();
