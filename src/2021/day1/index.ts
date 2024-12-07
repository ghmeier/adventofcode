import { handleLines, sum } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
	const data: number[] = [];
	await handleLines(DATA_PATH, (l) => {
		data.push(Number.parseInt(l.trim()));
	});

	const increased = sum(
		data.map((d, ix) => {
			return ix > 0 && d > data[ix - 1] ? 1 : 0;
		}),
	);

	console.log("Problem one:", increased);
}

async function problemTwo() {
	const data: number[] = [];
	await handleLines(DATA_PATH, (l) => {
		data.push(Number.parseInt(l.trim()));
	});

	const windows: number[] = [];

	for (let i = 2; i < data.length; i++) {
		windows.push(data[i] + data[i - 1] + data[i - 2]);
	}

	const increased = sum(
		windows.map((d, ix) => {
			return ix > 0 && d > windows[ix - 1] ? 1 : 0;
		}),
	);

	console.log("Problem two:", increased);
}

await problemOne();
await problemTwo();
