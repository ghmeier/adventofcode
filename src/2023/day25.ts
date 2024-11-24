import { cloneDeep } from "lodash";
import { handleLines } from "../utils";
import { mincut } from "@graph-algorithm/minimum-cut";

const DATA_PATH = `${import.meta.dir}/day25.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day25-calibrate.txt`;

function connected(graph: Record<string, string[]>) {
	const visited = new Set<string>();
	const next = [Object.keys(graph)[0]];

	while (next.length) {
		const n = next.shift();
		if (visited.has(n)) continue;
		next.push(...graph[n]);
		visited.add(n);
	}
	// console.log(visited);
	return visited.size;
}

async function problemOne() {
	const graph: Record<string, string[]> = {};
	const connections: string[][] = [];
	await handleLines(CALIBRATE_PATH, (line) => {
		const [node, dest] = line.split(": ");
		const destNodes = dest.split(" ");
		if (!graph[node]) graph[node] = [];
		graph[node].push(...destNodes);
		connections.push(...destNodes.map((v) => [node, v]));

		for (const n of destNodes) {
			if (!graph[n]) graph[n] = [];
			graph[n].push(node);
		}
	});
	const nodes = Object.keys(graph);
    console.log(connections)
    console.log(mincut(connections))
	for (let i = 0; i < connections.length; i++) {
		for (let j = i + 1; j < connections.length; j++) {
			for (let p = j + 1; p < connections.length; p++) {
				const [n1, d1] = connections[i];
				const [n2, d2] = connections[j];
				const [n3, d3] = connections[p];
				const g = cloneDeep(graph);
				g[n1] = g[n1].filter((v) => v !== d1);
				g[d1] = g[d1].filter((v) => v !== n1);
				g[n2] = g[n2].filter((v) => v !== d2);
				g[d2] = g[d2].filter((v) => v !== n2);
				g[n3] = g[n3].filter((v) => v !== d3);
				g[d3] = g[d3].filter((v) => v !== n3);

				const size = connected(g);
				if (size !== nodes.length) {
					const key = `${n1}/${d1},${n2}/${d2},${n3}/${d3}`;
					console.log(key, size * (nodes.length - size));
				}
			}
		}
	}
	console.log("Problem one:", graph, connections);
}

await problemOne();
