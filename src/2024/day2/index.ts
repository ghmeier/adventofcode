import { handleLines, splitWhitespace } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

function verify(report: number[], tolerate = false) {
	let isDecreasing = null;
	for (let i = 0; i < report.length - 1; i++) {
		const diff = report[i + 1] - report[i];
		try {
			if (isDecreasing !== null) {
				if (isDecreasing && diff > 0)
					throw Error("Invalid increase after decreasing");
				if (!isDecreasing && diff < 0)
					throw Error("Invalid decrease after increasing");
			}
			const m = Math.abs(diff);
			if (m < 1 || m > 3)
				throw new Error(
					`Invalid magnitude ${m} (${report[i]}->${report[i + 1]})`,
				);
			isDecreasing = diff < 0;
		} catch (e: unknown) {
			if (!tolerate) throw e;
			if ((e as Error).message.includes(" after ") && i !== 0) {
				try {
					return verify(report.filter((_, ix) => ix !== 0));
				} catch {}
			}
			try {
				return verify(report.filter((_, ix) => ix !== i + 1));
			} catch {}
			return verify(report.filter((_, ix) => ix !== i));
		}
	}
}

function isSafe(report: number[]) {
	const isDecreasing = report[1] - report[0] < 0;
	for (let i = 1; i < report.length; i++) {
		const diff = report[i] - report[i - 1];
		if (isDecreasing && diff > 0) return false;
		if (!isDecreasing && diff < 0) return false;
		const m = Math.abs(diff);
		if (m < 1 || m > 3) return false;
	}
	return true;
}

async function problemOne() {
	const reports: number[][] = [];
	await handleLines(DATA_PATH, (l) => {
		reports.push(splitWhitespace(l).map((v) => Number.parseInt(v, 10)));
	});

	let safe = 0;
	for (const report of reports) {
		try {
			verify(report);
			safe += 1;
		} catch {}
	}
	console.log("Problem one:", safe);
}

async function problemTwo() {
	const reports: number[][] = [];
	await handleLines(DATA_PATH, (l) => {
		reports.push(splitWhitespace(l).map((v) => Number.parseInt(v, 10)));
	});

	let safe = 0;
	for (const report of reports) {
		for (let i = 0; i < report.length; i++) {
			if (isSafe(report.filter((_, ix) => ix !== i))) {
				safe++;
				break;
			}
		}
	}

	console.log("Problem two:", safe);
}

await problemOne();
await problemTwo();
