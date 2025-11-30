import { type Point, ps, readLines, sum } from "../utils";

const DATA_PATH = `${import.meta.dir}/day10.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day10-calibrate.txt`;

const NORTH: Point = [0, -1];
const SOUTH: Point = [0, 1];
const EAST: Point = [1, 0];
const WEST: Point = [-1, 0];

const DIRECTIONS = [NORTH, SOUTH, EAST, WEST];

const CONNECTIONS = {
  "|": [NORTH, SOUTH],
  "-": [EAST, WEST],
  L: [NORTH, EAST],
  J: [NORTH, WEST],
  "7": [SOUTH, WEST],
  F: [SOUTH, EAST],
  ".": null,
} as const;

function dump(grid: string[][]) {
  console.log(grid.map((row) => row.join("")).join("\n"));
}

function validCell(grid: string[][], x: number, y: number) {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
}

function hasConnection(grid: string[][], [ax, ay]: Point, [bx, by]: Point) {
  const aChar = validCell(grid, ax, ay) ? CONNECTIONS[grid[ay][ax]] : null;
  const bChar = validCell(grid, bx, by) ? CONNECTIONS[grid[by][bx]] : null;
  if (!aChar || !bChar) {
    return false;
  }
  const aConnects = aChar.some(([moveX, moveY]: Point) => {
    return ax + moveX === bx && ay + moveY === by;
  });
  const bConnects = bChar.some(([moveX, moveY]: Point) => {
    return bx + moveX === ax && by + moveY === ay;
  });
  return aConnects && bConnects;
}

function parseGrid(lines: string[]) {
  const grid: string[][] = [];
  let start: Point = [-1, -1];
  for (const line of lines) {
    if (!line) {
      continue;
    }
    const row = line.split("");
    const startIx = row.findIndex((c) => c === "S");
    if (startIx !== -1) {
      start = [startIx, grid.length];
    }
    grid.push(row);
  }

  for (const c of Object.keys(CONNECTIONS)) {
    grid[start[1]][start[0]] = c;
    const connections = sum(
      DIRECTIONS.map(([moveX, moveY]: Point) => {
        return hasConnection(grid, start, [start[0] + moveX, start[1] + moveY])
          ? 1
          : 0;
      })
    );
    if (connections === 2) {
      break;
    }
  }

  return { grid, start };
}

function traverseLoop(grid: string[][], start: Point) {
  const distances = { [ps(start)]: 0 };
  const visited = new Set<string>();
  const path = [start];
  while (path.length) {
    const current = path.shift() as Point;
    const currentIndex = ps(current);
    if (visited.has(currentIndex)) {
      continue;
    }

    visited.add(currentIndex);
    const connections = DIRECTIONS.map(([moveX, moveY]) => {
      const check: Point = [current[0] + moveX, current[1] + moveY];
      const checkIndex = ps(check);
      if (visited.has(checkIndex) || !hasConnection(grid, current, check)) {
        return null;
      }
      distances[checkIndex] = distances[currentIndex] + 1;
      return check;
    }).filter((p) => !!p) as Point[];
    path.push(...connections);
  }

  return distances;
}

function fillInterior(grid: string[][], distances: Record<string, number>) {
  let filled = 0;
  for (let y = 0; y < grid.length; y++) {
    let seen = 0;
    for (let x = 0; x < grid[y].length; x++) {
      if (distances[ps([x, y])] !== undefined) {
        if (["|", "L", "J"].includes(grid[y][x])) {
          seen++;
        }
      } else if (seen % 2 === 1) {
        grid[y][x] = "#";
        filled++;
      }
    }
  }
  return filled;
}

// 6923
async function problemOne() {
  const lines = await readLines(DATA_PATH);

  const { grid, start } = parseGrid(lines);

  const distances = traverseLoop(grid, start);

  console.log("Problem one:", Math.max(...Object.values(distances)));
}

// 529
async function problemTwo() {
  const lines = await readLines(DATA_PATH);

  const { grid, start } = parseGrid(lines);
  const distances = traverseLoop(grid, start);

  const filled = fillInterior(grid, distances);

  console.log("Problem two:", filled);
}

await problemOne();
await problemTwo();
