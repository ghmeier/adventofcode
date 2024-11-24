import { range } from "lodash";
import { handleLines, sum } from "../utils";

const DATA_PATH = `${import.meta.dir}/day15.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day15-calibrate.txt`;

function hash(input: string) {
	let val = 0;
	for (let i = 0; i < input.length; i++) {
		val += input.charCodeAt(i);
		val = (val * 17) % 256;
	}
	return val;
}

// 505427
async function problemOne() {
	const hashes = [];
	await handleLines(DATA_PATH, (line) => {
		const entries = line.split(",");
		hashes.push(...entries.map(hash));
	});

	console.log("Problem one:", sum(hashes));
}

type Box = { label: string; focal: number }[];
function dump(boxes: Box[]) {
	for (const [ix, lenses] of boxes.entries()) {
		if (!lenses.length) continue;
		console.log(
			`Box ${ix}: ${lenses
				.map(({ label, focal }) => `[${label} ${focal}]`)
				.join(" ")}`,
		);
	}
}

// 243747
async function problemTwo() {
	const boxes: Box[] = range(0, 256).map(() => []);

	await handleLines(DATA_PATH, (line) => {
		const entries = line.split(",");
		for (const entry of entries) {
			const [label, f] = entry.split(/[=-]/);
			const focal = parseInt(f, 10);
			const ix = hash(label);
			if (!focal) {
				boxes[ix] = boxes[ix].filter((l) => l.label !== label);
			} else {
				const lensIx = boxes[ix].findIndex((l) => l.label === label);
				if (lensIx !== -1) {
					boxes[ix][lensIx] = { focal, label };
				} else {
					boxes[ix].push({ focal, label });
				}
			}
			// dump(boxes);
		}
	});

	let power = 0;
	for (const [ix, lenses] of boxes.entries()) {
		for (const [lensIx, lens] of lenses.entries()) {
			const factor = (ix + 1) * (lensIx + 1) * lens.focal;
			power += factor;
		}
	}
	console.log("Problem two:", power);
}

await problemOne();
await problemTwo();
