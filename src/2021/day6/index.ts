import { handleLines, sum } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
	let fish: number[] = [];
	await handleLines(DATA_PATH, (l) => {
		fish = l.split(",").map((v) => Number.parseInt(v, 10));
	});

	const days = 80;
	for (let i = 0; i < days; i++) {
		const next: number[] = [];
		// biome-ignore lint/complexity/noForEach: <explanation>
		fish.forEach((f) => {
			if (f === 0) {
				next.push(6, 8);
			} else {
				next.push(f - 1);
			}
		});
		fish = next;
	}
	console.log("Problem one:", fish.length);
}

async function problemTwo() {
	let fish: Record<number, number> = {
		0: 0,
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
	};
	await handleLines(DATA_PATH, (l) => {
		l.split(",").map((v) => {
			fish[Number.parseInt(v, 10)] += 1;
		});
	});

	const days = 256;
	for (let i = 0; i < days; i++) {
		fish = {
			0: fish[1],
			1: fish[2],
			2: fish[3],
			3: fish[4],
			4: fish[5],
			5: fish[6],
			6: fish[7] + fish[0],
			7: fish[8],
			8: fish[0],
		};
	}

	console.log("Problem two:", sum(Object.values(fish)));
}

await problemOne();
await problemTwo();
