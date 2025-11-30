import { flatten } from "lodash";

import { handleLines } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

function check(
  c: string,
  computers: Record<string, string[]>,
  visited: string[]
): string[][] {
  if (visited.length > 3) {
    return [];
  }
  if (visited.length === 3 && visited[0] === c) {
    return [visited];
  }

  const options = flatten(
    computers[c].map((v) => check(v, computers, [...visited, c]))
  );

  return options;
}

async function problemOne() {
  const connections: Record<string, string[]> = {};
  await handleLines(DATA_PATH, (l) => {
    const [a, b] = l.split("-");
    if (!connections[a]) {
      connections[a] = [];
    }
    connections[a].push(b);
    if (!connections[b]) {
      connections[b] = [];
    }
    connections[b].push(a);
  });

  const found = new Set<string>();
  for (const c of Object.keys(connections)) {
    const result = check(c, connections, []);
    result.forEach((v) => {
      const isMatch = v.filter((c) => c.startsWith("t")).length > 0;
      if (!isMatch) {
        return;
      }
      v.sort();
      found.add(v.join(","));
    });
  }

  console.log("Problem one:", found.size);
}

const memo: Record<string, Set<string>> = {};

function combine(
  computers: string[],
  connections: Record<string, Set<string>>
) {
  const key = computers.join("");
  if (memo[key]) {
    return memo[key];
  }

  if (computers.length === 2) {
    let overlap: Set<string>;
    if (connections[computers[0]].has(computers[1])) {
      overlap = new Set(computers);
    } else {
      overlap = new Set();
    }
    memo[key] = overlap;
    return overlap;
  }

  let maxOverlap = new Set<string>();
  // let maxOverlapSequence: string[] = [];
  for (let i = 0; i < computers.length; i++) {
    const p = computers.shift();
    if (!p) {
      break;
    }

    const overlap = combine([...computers], connections);
    if (overlap.size + 1 < maxOverlap.size) {
      continue;
    }
    if (connections[p].isSupersetOf(overlap)) {
      overlap.add(p);
    }

    // console.log(computers.join(","), overlap);
    if (overlap.size > maxOverlap.size) {
      maxOverlap = overlap;
      // computers.forEach((v) => max)
      // maxOverlapSequence = [...computers, ...overlap];
    }
    computers.push(p);
    // break;
  }
  memo[key] = maxOverlap;

  return maxOverlap;
}

async function problemTwo() {
  const connections: Record<string, Set<string>> = {};
  await handleLines(DATA_PATH, (l) => {
    const [a, b] = l.split("-");
    if (!connections[a]) {
      connections[a] = new Set([]);
    }
    connections[a].add(b);
    if (!connections[b]) {
      connections[b] = new Set([]);
    }
    connections[b].add(a);
  });

  let maxSet: Set<string> = new Set();
  for (const c of Object.keys(connections)) {
    const check = [c, ...connections[c]];
    check.sort();
    const candidate = combine(check, connections);
    if (candidate.size > maxSet.size) {
      maxSet = candidate;
    }
    console.log(c, check);
  }
  console.log("Problem two:", maxSet);
}

// await problemOne();
await problemTwo();
