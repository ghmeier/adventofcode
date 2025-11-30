import {
  DIRECTIONS,
  DIRS,
  handleLines,
  onSurroundingCell,
  type Point,
  ps,
} from "../../utils";
import MinHeap from "../../utils/MinHeap";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function parse(file: string) {
  let start: Point = [-1, -1];
  let end: Point = [-1, -1];
  const grid: string[][] = [];

  await handleLines(file, (l) => {
    const row = l.split("");
    const startIx = row.findIndex((c) => c === "S");
    if (startIx !== -1) {
      start = [startIx, grid.length];
    }
    const endIx = row.findIndex((c) => c === "E");
    if (endIx !== -1) {
      end = [endIx, grid.length];
    }
    grid.push(row);
  });

  const path = [];
  const visited = new Set<string>();
  let cur = start;
  while (cur[0] !== end[0] || cur[1] !== end[1]) {
    let next: Point = [-1, -1];
    onSurroundingCell(grid, cur, ([x, y]) => {
      if (grid[y][x] === "#" || visited.has(ps([x, y]))) {
        return;
      }
      next = [x, y];
    });
    visited.add(ps(cur));
    path.push(cur);
    cur = next;
  }
  path.push(cur);
  const pToIx = new Map<string, number>();
  path.forEach((p, ix) => pToIx.set(ps(p), ix));
  return { path, pToIx, grid };
}

async function problemOne() {
  const { path, pToIx } = await parse(DATA_PATH);

  const saved = [];
  for (const p of path) {
    const pIx = pToIx.get(ps(p));
    if (pIx === undefined) {
      throw new Error(`Invalid path point ${p}`);
    }
    for (const d of DIRS) {
      const next: Point = [
        p[0] + DIRECTIONS[d][0] * 2,
        p[1] + DIRECTIONS[d][1] * 2,
      ];
      const nextIx = pToIx.get(ps(next));
      if (nextIx === undefined) {
        continue;
      }
      if (nextIx < pIx) {
        continue;
      }
      saved.push(nextIx - pIx - 2);
    }
  }
  const filtered = saved.filter((v) => v >= 100);

  console.log("Problem one:", filtered.length);
}

function cheatFast(pToIx: Map<string, number>, [x, y]: Point, pIx: number) {
  const candidates = new Map<number, number>();
  for (let i = -20; i <= 20; i++) {
    for (let j = -20; j <= 20; j++) {
      const nKey = ps([x + i, y + j]);
      const nIx = pToIx.get(nKey);
      if (nIx === undefined) {
        continue;
      }
      const saved = nIx - pIx - (i + j);
      const existing = candidates.get(nIx);
      if (existing === undefined || existing > saved) {
        candidates.set(nIx, saved);
      }
    }
  }
  return candidates;
}

function invalidCell<T>(grid: T[][], [x, y]: Point) {
  return x < 1 || y < 1 || x >= grid.length - 1 || y >= grid.length - 1;
}

function cheatFill(
  grid: string[][],
  pToIx: Map<string, number>,
  start: Point,
  pIx: number,
  threshold: number
) {
  const heap = new MinHeap<Point>();
  const costs = new Map<string, number>();
  onSurroundingCell(grid, start, (next) => {
    if (invalidCell(grid, next)) {
      return;
    }
    const nKey = ps(next);
    costs.set(nKey, 1);
    heap.set(nKey, 1, next);
  });

  const visited = new Set<string>();
  while (heap.size()) {
    const p = heap.pop();
    if (!p) {
      break;
    }
    const pKey = ps(p);

    if (visited.has(pKey)) {
      continue;
    }
    visited.add(pKey);

    const nextCost = costs.get(pKey) + 1;
    if (nextCost > 20) {
      continue;
    }

    onSurroundingCell(grid, p, (next) => {
      if (invalidCell(grid, next)) {
        return;
      }

      const nKey = ps(next);
      const nIx = pToIx.get(nKey);
      if (nIx === pIx) {
        return;
      }
      if (costs.has(nKey) && nextCost >= costs.get(nKey)) {
        return;
      }
      costs.set(nKey, nextCost);
      heap.set(nKey, nextCost, next);
    });
  }

  const exits: number[] = [];
  costs.forEach((v, nKey) => {
    const nIx = pToIx.get(nKey);
    if (nIx === undefined || nIx < pIx) {
      return;
    }
    const saved = nIx - pIx - v;
    if (saved < threshold) {
      return;
    }
    exits.push(saved);
  });
  return exits;
}

async function problemTwo() {
  const { grid, path, pToIx } = await parse(DATA_PATH);

  let saved = 0;
  for (const p of path) {
    const pKey = ps(p);
    const pIx = pToIx.get(pKey);
    if (pIx === undefined) {
      throw new Error(`Invalid path point ${p}`);
    }

    saved += cheatFill(grid, pToIx, p, pIx, 100).length;
  }
  console.log("Problem two:", saved);
}

await problemOne();
await problemTwo();
