import { cloneDeep, fill, range } from "lodash";
import { deepEqual } from "mathjs";
import { handleLines, sum, toSingleDigitList } from "../../utils";
import MinHeap from "../../utils/MinHeap";

const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const EVIL_PATH = `${import.meta.dir}/evil.txt`;
const VERY_EVIL_PATH = `${import.meta.dir}/very-evil.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

type FileLocation = { id: number; locations: number[] };

async function problemOne() {
	const filled: FileLocation[] = [];
	const freeHeap = new MinHeap<number>();
	let diskSize = 0;
	await handleLines(DATA_PATH, (l) => {
		let diskLocation = 0;
		toSingleDigitList(l).forEach((d, ix) => {
			const locations = range(diskLocation, diskLocation + d);
			diskLocation += d;
			if (ix % 2 === 0) {
				filled.push({ id: filled.length, locations });
				diskSize += locations.length;
			} else {
				locations.forEach((v) => freeHeap.set(v.toString(), v, v));
			}
		});
	});

	// collapse
	let collapseIx = filled.length - 1;
	while (true) {
		if (freeHeap.peek() >= diskSize) break;
		const last = filled[collapseIx];
		last.locations = last.locations.map((v) => {
			const val = freeHeap.pop();
			freeHeap.set(v.toString(), v, v);
			return val;
		});
		collapseIx -= 1;
	}

	const checksum = filled.reduce((acc, { id, locations }) => {
		return acc + sum(locations.map((l) => l * id));
	}, 0);
	console.log("Problem one:", checksum);
}

function mapReallocate(
	f: FileLocation,
	heapMap: Record<number, MinHeap<number[]>>,
) {
	let size = f.locations.length;
	let foundSize = -1;
	// known max chunk size.
	while (size <= 9) {
		if (
			!heapMap[size] ||
			!heapMap[size].size() ||
			f.locations[0] < heapMap[size].peek()[0]
		) {
			size++;
			continue;
		}
		if (
			foundSize === -1 ||
			heapMap[size].peek()[0] < heapMap[foundSize].peek()[0]
		) {
			foundSize = size;
		}
		size++;
	}
	if (foundSize === -1) return;

	const next = heapMap[foundSize].pop();
	if (!heapMap[f.locations.length]) heapMap[f.locations.length] = new MinHeap();
	heapMap[f.locations.length].set(
		f.locations[0].toString(),
		f.locations[0],
		f.locations,
	);
	if (next.length < f.locations.length) throw new Error("INVALID");

	f.locations = next.splice(0, f.locations.length);
	if (next.length) heapMap[next.length].set(next[0].toString(), next[0], next);
	return;
}

async function problemTwo() {
	const filled: FileLocation[] = [];
	const freeHeap = new MinHeap<number[]>();
	const heapMap: Record<number, MinHeap<number[]>> = {};
	await handleLines(VERY_EVIL_PATH, (l) => {
		let diskLocation = 0;
		toSingleDigitList(l).forEach((d, ix) => {
			const locations = range(diskLocation, diskLocation + d);
			diskLocation += d;
			if (ix % 2 === 0) {
				filled.push({ id: filled.length, locations });
			} else if (locations.length) {
				freeHeap.set(locations[0].toString(), locations[0], locations);
				if (!heapMap[locations.length])
					heapMap[locations.length] = new MinHeap();
				heapMap[locations.length].set(locations[0].toString(), locations[0], [
					...locations,
				]);
			}
		});
	});

	let collapseIx = filled.length - 1;
	while (collapseIx >= 0) {
		mapReallocate(filled[collapseIx], heapMap);
		collapseIx -= 1;
	}

	const checksum = filled.reduce((acc, { id, locations }) => {
		return acc + sum(locations.map((l) => l * id));
	}, 0);

	console.log("Problem two:", checksum);
}

console.time("partOne");
await problemOne();
console.timeEnd("partOne");

console.time("partTwo");
await problemTwo();
console.timeEnd("partTwo");
