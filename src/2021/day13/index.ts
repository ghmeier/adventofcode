import { range } from "lodash";

import { dumpGrid, handleLines, iterateGrid, type Point } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

type Orientation = "x" | "y";

async function parse(file: string) {
  const grid: string[][] = [];
  let maxX = 0;
  let maxY = 0;
  const points: Point[] = [];
  const folds: [Orientation, number][] = [];
  await handleLines(file, (l) => {
    if (l.startsWith("fold along ")) {
      const [axis, line] = l.replace("fold along ", "").split("=");
      folds.push([axis as Orientation, Number.parseInt(line, 10)]);
      return;
    }
    const point = l.split(",").map((p) => Number.parseInt(p, 10)) as Point;
    if (point[0] > maxX) {
      maxX = point[0];
    }
    if (point[1] > maxY) {
      maxY = point[1];
    }
    points.push(point);
  });

  for (let y = 0; y <= maxY; y++) {
    grid.push(range(0, maxX + 1).map(() => "."));
  }
  for (const [x, y] of points) {
    grid[y][x] = "#";
  }

  return { grid, folds };
}

function foldX(grid: string[][], line: number) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = line + 1; x < grid[0].length; x++) {
      if (grid[y][x] === ".") {
        continue;
      }
      grid[y][line - (x - line)] = "#";
      grid[y][x] = ".";
    }
  }
  return grid.map((r) => r.slice(0, line));
}

function foldY(grid: string[][], line: number) {
  for (let x = 0; x < grid[0].length; x++) {
    for (let y = line + 1; y < grid.length; y++) {
      if (grid[y][x] === ".") {
        continue;
      }
      grid[line - (y - line)][x] = "#";
      grid[y][x] = ".";
    }
  }
  return grid.slice(0, line);
}

async function problemOne() {
  let { grid, folds } = await parse(DATA_PATH);
  dumpGrid(grid);

  for (const [axis, line] of folds) {
    console.log(`Fold ${axis}=${line}`);
    if (axis === "y") {
      grid = foldY(grid, line);
    }
    if (axis === "x") {
      grid = foldX(grid, line);
    }
    dumpGrid(grid);
    break;
  }

  let count = 0;
  iterateGrid(grid, (x, y) => {
    if (grid[y][x] === "#") {
      count += 1;
    }
  });

  console.log("Problem one:", count);
}

async function problemTwo() {
  let { grid, folds } = await parse(DATA_PATH);
  dumpGrid(grid);

  for (const [axis, line] of folds) {
    console.log(`Fold ${axis}=${line}`);
    if (axis === "y") {
      grid = foldY(grid, line);
    }
    if (axis === "x") {
      grid = foldX(grid, line);
    }
    dumpGrid(grid);
  }

  console.log("Problem two:", null);
}

await problemOne();
await problemTwo();
