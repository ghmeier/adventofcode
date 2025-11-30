import {
  handleLines,
  iterateGrid,
  onSurroundingCellDiagonal,
  type Point,
  pFromS,
  ps,
  toSingleDigitList,
} from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
  const grid: number[][] = [];
  await handleLines(DATA_PATH, (l) => grid.push(toSingleDigitList(l)));

  const steps = 100;
  let flashCount = 0;
  for (let s = 0; s < steps; s++) {
    const pending: Point[] = [];
    iterateGrid(grid, (x, y) => {
      grid[y][x] += 1;
      if (grid[y][x] >= 10) {
        pending.push([x, y]);
      }
    });

    const flashed = new Set<string>();
    while (pending.length) {
      const p = pending.shift();
      if (!p) {
        continue;
      }

      const key = ps(p);
      if (flashed.has(key)) {
        continue;
      }
      flashed.add(key);

      onSurroundingCellDiagonal(grid, p, ([x, y]) => {
        grid[y][x] += 1;
        if (grid[y][x] >= 10) {
          pending.push([x, y]);
        }
      });
    }
    flashCount += flashed.size;
    for (const [key] of flashed.entries()) {
      const p = pFromS(key);
      grid[p[1]][p[0]] = 0;
    }
  }

  console.log("Problem one:", flashCount);
}

async function problemTwo() {
  const grid: number[][] = [];
  await handleLines(DATA_PATH, (l) => grid.push(toSingleDigitList(l)));

  let steps = 0;
  while (true) {
    const pending: Point[] = [];
    iterateGrid(grid, (x, y) => {
      grid[y][x] += 1;
      if (grid[y][x] >= 10) {
        pending.push([x, y]);
      }
    });

    const flashed = new Set<string>();
    while (pending.length) {
      const p = pending.shift();
      if (!p) {
        continue;
      }

      const key = ps(p);
      if (flashed.has(key)) {
        continue;
      }
      flashed.add(key);

      onSurroundingCellDiagonal(grid, p, ([x, y]) => {
        grid[y][x] += 1;
        if (grid[y][x] >= 10) {
          pending.push([x, y]);
        }
      });
    }
    for (const [key] of flashed.entries()) {
      const p = pFromS(key);
      grid[p[1]][p[0]] = 0;
    }
    steps += 1;
    if (flashed.size === 100) {
      break;
    }
  }

  console.log("Problem two:", steps);
}

await problemOne();
await problemTwo();
