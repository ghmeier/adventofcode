import Graph from "node-dijkstra";

import { handleLines } from "../utils";

const DATA_PATH = `${import.meta.dir}/day12.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day12-calibrate.txt`;

type Point = [number, number];
type Grid = number[][];
type Path = { point: Point; visited: Set<string> };

const visit = [
  // Up
  (p: Point, g: Grid): Point | null => {
    const x = p[0];
    const y = p[1] + 1;
    if (y >= g.length || g[y][x] - 1 > g[p[1]][p[0]]) {
      return null;
    }
    return [x, y];
  },
  // Down
  (p: Point, g: Grid): Point | null => {
    const x = p[0];
    const y = p[1] - 1;
    if (y < 0 || g[y][x] - 1 > g[p[1]][p[0]]) {
      return null;
    }
    return [x, y];
  },
  // Left
  (p: Point, g: Grid): Point | null => {
    const x = p[0] - 1;
    const y = p[1];
    if (x < 0 || g[y][x] - 1 > g[p[1]][p[0]]) {
      return null;
    }
    return [x, y];
  },
  // Right
  (p: Point, g: Grid): Point | null => {
    const x = p[0] + 1;
    const y = p[1];
    if (x >= g[y].length || g[y][x] - 1 > g[p[1]][p[0]]) {
      return null;
    }
    return [x, y];
  },
];

function ps(p: Point) {
  return p.join(",");
}

function displayPath(path: string[], grid: Grid) {
  const lines = [];
  for (let y = 0; y < grid.length; y++) {
    const line = [];
    for (let x = 0; x < grid[y].length; x++) {
      const compare = ps([x, y]);
      const p = path.findIndex((v) => v === compare);
      if (p !== -1) {
        line.push(`${p.toString().padStart(4, " ")} `);
      } else {
        line.push(".....");
      }
    }
    lines.push(line.join(""));
  }
  console.log(lines.join("\n"));
}

function constructGraph(grid: Grid): Graph {
  const graph = new Graph();

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const nodes = visit
        .map((f) => f([x, y], grid))
        .filter((p) => p)
        .map((p) => ps(p))
        .reduce(
          (acc, v) => {
            acc[v] = 1;
            return acc;
          },
          {} as Record<string, number>
        );
      graph.addNode(ps([x, y]), nodes);
    }
  }
  return graph;
}

// 412
async function problemOne() {
  let start: Point = [-1, -1];
  let end: Point = [-1, -1];
  const grid: number[][] = [];
  await handleLines(DATA_PATH, (line: string) => {
    const row = line.split("").map((c, ix) => {
      if (c === "S") {
        start = [ix, grid.length];
        return "a".charCodeAt(0);
      }
      if (c === "E") {
        end = [ix, grid.length];
        return "z".charCodeAt(0);
      }
      return c.charCodeAt(0);
    });
    grid.push(row);
  });

  const graph = constructGraph(grid);
  const minPath = graph.path(ps(start), ps(end));

  console.log("Problem one:", minPath.length - 1);
}

async function problemTwo() {
  const starts: Point[] = [];
  let end: Point = [-1, -1];
  const grid: number[][] = [];
  await handleLines(DATA_PATH, (line: string) => {
    const row = line.split("").map((c, ix) => {
      if (c === "S" || c === "a") {
        starts.push([ix, grid.length]);
        return "a".charCodeAt(0);
      }
      if (c === "E") {
        end = [ix, grid.length];
        return "z".charCodeAt(0);
      }
      return c.charCodeAt(0);
    });
    grid.push(row);
  });

  const graph = constructGraph(grid);
  const minPaths = starts
    .map((start) => graph.path(ps(start), ps(end)))
    .filter((p) => p)
    .map((p) => p.length);

  console.log("Problem two:", Math.min(...minPaths) - 1);
}

await problemOne();
await problemTwo();
