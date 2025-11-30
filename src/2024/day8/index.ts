import {
  handleLines,
  type Point,
  pairwiseIterate,
  ps,
  validCell,
} from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function parseGrid(file: string) {
  const grid: string[][] = [];
  const nodesByFrequency: Record<string, Point[]> = {};

  await handleLines(file, (l) => {
    const row = l.split("");
    grid.push(row);
    row.forEach((c, ix) => {
      if (c === ".") {
        return;
      }
      if (!nodesByFrequency[c]) {
        nodesByFrequency[c] = [];
      }
      nodesByFrequency[c].push([ix, grid.length - 1]);
    });
  });
  return { grid, nodeGroups: Object.values(nodesByFrequency) };
}

async function problemOne() {
  const { grid, nodeGroups } = await parseGrid(DATA_PATH);

  const antinodes = new Set();
  for (const nodes of nodeGroups) {
    pairwiseIterate(nodes, (a, b) => {
      const diff: Point = [a[0] - b[0], a[1] - b[1]];
      const cells: Point[] = [
        [a[0] + diff[0], a[1] + diff[1]],
        [a[0] - 2 * diff[0], a[1] - 2 * diff[1]],
      ];
      if (validCell(grid, cells[0])) {
        antinodes.add(ps(cells[0]));
      }
      if (validCell(grid, cells[1])) {
        antinodes.add(ps(cells[1]));
      }
    });
  }

  console.log("Problem one:", antinodes.size);
}

async function problemTwo() {
  const { grid, nodeGroups } = await parseGrid(DATA_PATH);

  const antinodes = new Set();
  for (const nodes of nodeGroups) {
    pairwiseIterate(nodes, (a, b) => {
      const diff: Point = [a[0] - b[0], a[1] - b[1]];
      antinodes.add(ps(a));
      antinodes.add(ps(b));
      let next: Point = [...a];
      while (validCell(grid, next)) {
        antinodes.add(ps(next));
        next[0] += diff[0];
        next[1] += diff[1];
      }
      next = [...a];
      while (validCell(grid, next)) {
        antinodes.add(ps(next));
        next[0] -= diff[0];
        next[1] -= diff[1];
      }
    });
  }

  console.log("Problem two:", antinodes.size);
}

await problemOne();
await problemTwo();
