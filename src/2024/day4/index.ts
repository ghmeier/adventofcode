import {
  DIRECTIONS_DIAGONAL,
  DIRS_DIAGONAL,
  handleLines,
  type Point,
  validCell,
} from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
  const grid: string[][] = [];
  await handleLines(DATA_PATH, (l) => grid.push(l.split("")));

  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== "X") {
        continue;
      }

      for (const dir of DIRS_DIAGONAL) {
        const remaining = ["M", "A", "S"];
        const next: Point = [
          x + DIRECTIONS_DIAGONAL[dir][0],
          y + DIRECTIONS_DIAGONAL[dir][1],
        ];
        while (remaining.length) {
          if (!validCell(grid, next)) {
            break;
          }
          if (grid[next[1]][next[0]] !== remaining[0]) {
            break;
          }
          remaining.shift();
          next[0] += DIRECTIONS_DIAGONAL[dir][0];
          next[1] += DIRECTIONS_DIAGONAL[dir][1];
        }
        if (!remaining.length) {
          count += 1;
        }
      }
    }
  }

  console.log("Problem one:", count);
}

async function problemTwo() {
  const grid: string[][] = [];
  await handleLines(DATA_PATH, (l) => grid.push(l.split("")));

  let count = 0;
  for (let y = 1; y < grid.length - 1; y++) {
    for (let x = 1; x < grid[y].length - 1; x++) {
      if (grid[y][x] !== "A") {
        continue;
      }

      const corners: Point[] = [
        [x - 1, y - 1],
        [x + 1, y + 1],
        [x - 1, y + 1],
        [x + 1, y - 1],
      ];
      const left = [
        grid[corners[0][1]][corners[0][0]],
        grid[corners[1][1]][corners[1][0]],
      ];
      const right = [
        grid[corners[2][1]][corners[2][0]],
        grid[corners[3][1]][corners[1][0]],
      ];
      if (
        ["M", "S"].every((v) => left.includes(v)) &&
        ["M", "S"].every((v) => right.includes(v))
      ) {
        count += 1;
      }
    }
  }

  console.log("Problem two:", count);
}

await problemOne();
await problemTwo();
