import { handleLines, type Point } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

function treesForSlope(grid: string[][], slope: Point) {
  let trees = 0;
  const pos: Point = [0, 0];
  while (pos[1] < grid.length) {
    if (grid[pos[1]][pos[0] % grid[0]?.length] === "#") {
      trees++;
    }
    pos[0] += slope[0];
    pos[1] += slope[1];
  }
  return trees;
}

async function problemOne() {
  const grid: string[][] = [];
  await handleLines(DATA_PATH, (line) => {
    grid.push(line.split(""));
  });

  console.log("Problem one:", treesForSlope(grid, [3, 1]));
}

async function problemTwo() {
  const grid: string[][] = [];
  await handleLines(DATA_PATH, (line) => {
    grid.push(line.split(""));
  });

  const counts = [
    treesForSlope(grid, [1, 1]),
    treesForSlope(grid, [3, 1]),
    treesForSlope(grid, [5, 1]),
    treesForSlope(grid, [7, 1]),
    treesForSlope(grid, [1, 2]),
  ];

  console.log(counts);

  console.log(
    "Problem two:",
    counts.reduce((acc, v) => acc * v, 1)
  );
}

await problemOne();
await problemTwo();
