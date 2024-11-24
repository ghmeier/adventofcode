import { cond, flatten } from "lodash";
import { type Point, readLines, sum } from "../utils";
import ShoelaceArea from "../utils/ShoelaceArea";
const DATA_PATH = `${import.meta.dir}/day19.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day19-calibrate.txt`;

interface Part {
	values: Record<string, number>;
	workflow: string;
}

type Condition = (p: Record<string, number>) => string | null;
type Workflow = Condition[];

function toCondition(
	t: string,
	c: string | undefined,
	v: string | undefined,
	d: string | undefined,
): Condition {
	return (p: Record<string, number>) => {
		if (!d) {
			return t;
		}
		if (c === ">") {
			if (p[t] > Number.parseInt(v, 10)) return d;
			return null;
		}
		if (p[t] < Number.parseInt(v, 10)) return d;
		return null;
	};
}

function parse(lines: string[]) {
	const parts: Part[] = [];
	const workflows: Record<string, Workflow> = {};

	let doneParts = false;
	for (const line of lines) {
		if (!line) {
			doneParts = true;
			continue;
		}

		if (!doneParts) {
			const { condition, rest } =
				line.match(/(?<condition>\w+)\{(?<rest>.*)\}/)?.groups || {};
			workflows[condition] = rest.split(",").map((r) => {
				const { t, c, v, d } =
					r.match(/(?<t>[\w]+)(?<c>[\<\>])?(?<v>[\d]+)?[:]?(?<d>[\w]+)?/)
						?.groups || {};

				return toCondition(t, c, v, d);
			});
		} else {
			const values = line
				.replace(/[\{\}]/g, "")
				.split(",")
				.reduce(
					(acc, raw) => {
						const [k, v] = raw.split("=");
						acc[k] = Number.parseInt(v, 10);
						return acc;
					},
					{} as Record<string, number>,
				);
			parts.push({ values, workflow: "in" });
		}
	}

	return { parts, workflows };
}

type Partition = {
	key: string;
	condition: "<" | ">";
	partition: number;
	next: string;
};

function partition(lines: string[]) {
	const workflows: Record<string, Partition[]> = {};

	let done = false;
	for (const line of lines) {
		if (!line) {
			done = true;
			continue;
		}

		if (!done) {
			const { condition, rest } =
				line.match(/(?<condition>\w+)\{(?<rest>.*)\}/)?.groups || {};
			workflows[condition] = rest.split(",").map((r) => {
				const { t, c, v, d } =
					r.match(/(?<t>[\w]+)(?<c>[\<\>])?(?<v>[\d]+)?[:]?(?<d>[\w]+)?/)
						?.groups || {};

				return {
					key: t,
					condition: c,
					partition: Number.parseInt(v, 10),
					next: d || t,
				};
			});
		}
	}

	return workflows;
}

// 395382
async function problemOne() {
	const lines = await readLines(DATA_PATH);
	const { parts, workflows } = parse(lines);

	const accepted: Part[] = [];
	while (parts.length) {
		const p = parts.shift() as Part;
		p.workflow = workflows[p.workflow].find((condition) => condition(p.values))(
			p.values,
		);
		if (p.workflow === "R") continue;
		if (p.workflow === "A") {
			accepted.push(p);
			continue;
		}

		parts.push(p);
	}

	const values = flatten(accepted.map(({ values }) => Object.values(values)));
	console.log("Problem one:", sum(values));
}

function calculate(
	range: Record<string, Point>,
	workflow: string,
	workflows: Record<string, Partition[]>,
): number {
	if (workflow === "R") return 0;
	if (workflow === "A") {
		return Object.values(range).reduce((acc, [s, e]) => acc * (e - s + 1), 1);
	}

	const progressiveRange = { ...range };
	const options = workflows[workflow].map((partition) => {
		const nextRange = { ...progressiveRange };
		if (partition.condition === ">") {
			// If the max value at the key is less than the partition, it cannot be satisfied so return 0.
			if (nextRange[partition.key][1] < partition.partition) return 0;
			nextRange[partition.key] = [
				partition.partition + 1,
				nextRange[partition.key][1],
			];
			progressiveRange[partition.key] = [
				progressiveRange[partition.key][0],
				partition.partition,
			];
		} else if (partition.condition === "<") {
			// If the min value is greater than the partition, it cannot be satisfied so return 0.
			if (nextRange[partition.key][0] > partition.partition) return 0;
			nextRange[partition.key] = [
				nextRange[partition.key][0],
				partition.partition - 1,
			];
			progressiveRange[partition.key] = [
				partition.partition,
				progressiveRange[partition.key][1],
			];
		}
		return calculate(nextRange, partition.next, workflows);
	});

	return sum(options);
}

// 167409079868000
// 167409079868000

async function problemTwo() {
	const lines = await readLines(DATA_PATH);
	const workflows = partition(lines);

	const range = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] };
	const total = calculate(range, "in", workflows);
	console.log("Problem two:", total);
}

await problemOne();
await problemTwo();
