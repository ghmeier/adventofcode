import { cloneDeep, maxBy } from "lodash";

import {
  DIRECTIONS,
  DIRS,
  dumpGrid,
  handleLines,
  type Point,
  pFromS,
  ps,
  validCell,
} from "../utils";

const DATA_PATH = `${import.meta.dir}/day23.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day23-calibrate.txt`;

const SLIDE: Record<string, Point> = {
  ">": DIRECTIONS.EAST,
  "^": DIRECTIONS.NORTH,
  "<": DIRECTIONS.WEST,
  v: DIRECTIONS.SOUTH,
};

function dump(grid: string[][], visited: Record<string, boolean>) {
  const points = Object.keys(visited).map(pFromS);
  for (const [x, y] of points) {
    grid[y][x] = "O";
  }

  dumpGrid(grid);
}

function traverse(
  grid: string[][],
  p: Point,
  visited: Record<string, boolean>,
  end: Point
): { path: Record<string, boolean>; cost: number } {
  const pKey = ps(p);
  const costs = DIRS.map((d) => [
    p[0] + DIRECTIONS[d][0],
    p[1] + DIRECTIONS[d][1],
  ])
    .filter(
      ([x, y]) =>
        validCell(grid, [x, y]) && grid[y][x] !== "#" && !visited[ps([x, y])]
    )
    .map(([x, y]) => {
      const k = ps([x, y]);
      const nextVisited: Record<string, boolean> = { ...visited, [k]: pKey };
      let cost = 1;
      const s = SLIDE[grid[y][x]];
      if (s) {
        if (x + s[0] === p[0] && y + s[1] === p[1]) {
          return null;
        }
        cost += 1;
        x += s[0];
        y += s[1];
        nextVisited[ps([x, y])] = pKey;
      }

      if (x === end[0] && y === end[1]) {
        return { path: nextVisited, cost: 1 };
      }

      const remaining = traverse(grid, [x, y], nextVisited, end);
      return { path: remaining.path, cost: cost + remaining.cost };
    })
    .filter((v) => !!v);
  return maxBy(costs, "cost");
}

type Dir = keyof typeof DIRECTIONS;

function next(
  grid: string[][],
  [x, y]: Point,
  from: keyof typeof DIRECTIONS
): Dir[] {
  return DIRS.filter((d) => {
    const p = [x + DIRECTIONS[d][0], y + DIRECTIONS[d][1]];
    return d !== from && validCell(grid, p) && grid[p[1]][p[0]] !== "#";
  });
}

type Node = { neighbors: { [x: string]: number }; end: number };
type QueueItem = { p: Point; to: Dir };

const TO_FROM: Record<Dir, Dir> = {
  NORTH: "SOUTH",
  SOUTH: "NORTH",
  EAST: "WEST",
  WEST: "EAST",
};

function createGraph(grid: string[][], p: Point, end: Point) {
  const q: QueueItem[] = [{ p, to: "SOUTH" }];
  const graph: Record<string, Node> = {};

  while (q.length) {
    const cur = q.shift() as QueueItem;

    const cKey = ps([cur.p[0], cur.p[1]]);
    if (!graph[cKey]) {
      graph[cKey] = { neighbors: {}, end: 0 };
    }

    // Traverse to the next intersection.
    let nextDir: Dir[] = [];
    const nextP: Point = [
      cur.p[0] + DIRECTIONS[cur.to][0],
      cur.p[1] + DIRECTIONS[cur.to][1],
    ];
    let nextFrom = TO_FROM[cur.to];
    let cost = 1;
    while (true) {
      nextDir = next(grid, nextP, nextFrom);
      if (nextDir.length !== 1) {
        break;
      }
      cost++;
      nextP[0] += DIRECTIONS[nextDir[0]][0];
      nextP[1] += DIRECTIONS[nextDir[0]][1];
      nextFrom = TO_FROM[nextDir[0]];
    }
    if (nextP[0] === end[0] && nextP[1] === end[1]) {
      graph[cKey].end = cost;
    }

    const nextKey = ps(nextP);
    graph[cKey].neighbors[nextKey] = cost;
    if (graph[nextKey]) {
      graph[nextKey].neighbors[cKey] = cost;
    } else {
      q.push(...nextDir.map((to) => ({ p: nextP, to })));
    }
  }
  return graph;
}

function traverseGraph(
  graph: Record<string, Node>,
  k: string,
  visited: Record<string, boolean>
): { path: Record<string, boolean>; cost: number } {
  if (graph[k].end) {
    return { path: visited, cost: graph[k].end };
  }

  const costs = Object.entries(graph[k].neighbors)
    .filter(([n]) => !visited[n])
    .map(([n, v]) => {
      const nextVisited = { ...visited, [n]: true };
      const remaining = traverseGraph(graph, n, nextVisited);
      return {
        path: remaining.path,
        cost: v + remaining.cost,
      };
    })
    .filter(({ path }) => !!path);
  if (!costs.length) {
    return { path: {}, cost: 0 };
  }
  return maxBy(costs, "cost");
}

// 1966
async function problemOne() {
  const grid: string[][] = [];
  await handleLines(DATA_PATH, (line) => {
    grid.push(line.split(""));
  });
  const start: Point = [grid[0].findIndex((c) => c === "."), 0];
  const end: Point = [
    grid[grid.length - 1].findIndex((c) => c === "."),
    grid.length - 1,
  ];
  const result = traverse(grid, start, { [ps(start)]: true }, end);
  dump(cloneDeep(grid), result.path);
  console.log("Problem one:", result.cost);
}

// 6286
async function problemTwo() {
  const grid: string[][] = [];
  await handleLines(DATA_PATH, (line) => {
    grid.push(line.split(""));
  });
  const start: Point = [grid[0].findIndex((c) => c === "."), 0];
  const end: Point = [
    grid[grid.length - 1].findIndex((c) => c === "."),
    grid.length - 1,
  ];
  const graph = createGraph(cloneDeep(grid), start, end);
  const result = traverseGraph(graph, ps(start), { [ps(start)]: true });
  dump(cloneDeep(grid), result.path);
  console.log("Problem two:", result.cost);
}

await problemOne();
await problemTwo();
