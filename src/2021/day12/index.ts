import { intersection } from "lodash";
import { handleLines } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;
const LARGEST_CALIBRATE_PATH = `${import.meta.dir}/calibrate-largest.txt`;

type Cave = { paths: Set<string>; unlimited: boolean };
type Caves = Record<string, Cave>;

function isUpper(s: string) {
	return !!s.match(/[A-Z]/);
}

async function parse(file: string) {
	const graph: Caves = {};

	await handleLines(file, (l) => {
		const [s, e] = l.split("-");
		if (!graph[s]) {
			graph[s] = { paths: new Set<string>(), unlimited: isUpper(s) };
		}
		if (!graph[e]) {
			graph[e] = { paths: new Set<string>(), unlimited: isUpper(e) };
		}
		graph[s].paths.add(e);
		graph[e].paths.add(s);
	});
	return graph;
}

function visit(graph: Caves, c: string, path: string[]): string[][] {
	const next = [...path, c];
	if (c === "end") return [next];
	if (!graph[c].unlimited && path.includes(c)) return [];

	const paths: string[][] = [];
	for (const [n] of graph[c].paths.entries()) {
		paths.push(...visit(graph, n, next));
	}

	return paths;
}

function visitDouble(
	graph: Caves,
	c: string,
	path: string[],
	double: string | null,
): string[][] {
	const next = [...path, c];
	if (c === "end") return [next];
	if (c === "start" && path.length) return [];
	const hasVisited =
		!graph[c].unlimited && path.filter((p) => p === c).length >= 1;
	if (hasVisited && double) return [];
	const nextDouble = double || (hasVisited && c) || null;
	const paths: string[][] = [];
	for (const [n] of graph[c].paths.entries()) {
		paths.push(...visitDouble(graph, n, next, nextDouble));
	}
	return paths;
}

async function problemOne() {
	const graph = await parse(DATA_PATH);
	const paths = visit(graph, "start", []);

	console.log("Problem one:", paths.length);
}

async function problemTwo() {
	const graph = await parse(DATA_PATH);
	const paths = visitDouble(graph, "start", [], null);
	console.log("Problem two:", paths.length);
}

await problemOne();
await problemTwo();
