import {
  DIRECTIONS,
  handleLines,
  type Point,
  ps,
  sum,
  toSingleDigitList,
  validCell,
} from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

const D = Object.values(DIRECTIONS);

function score(
  grid: number[][],
  [x, y]: Point,
  m: Record<string, number>,
  distinct: boolean
): number {
  const height = grid[y][x];
  const key = ps([x, y]);
  if (m[key] !== undefined) {
    return distinct ? 0 : m[key];
  }
  if (height === 9) {
    m[key] = 1;
    return 1;
  }
  const next = D.map((d) => {
    const n: Point = [x + d[0], y + d[1]];
    if (!validCell(grid, n) || grid[n[1]][n[0]] - 1 !== height) {
      return null;
    }
    return n;
  }).filter((n) => !!n);
  if (!next.length) {
    m[key] = 0;
    return 0;
  }

  return sum(
    next.map((p) => {
      return score(grid, p, m, distinct);
    })
  );
}

async function problems() {
  const grid: number[][] = [];
  const heads: Point[] = [];
  await handleLines(DATA_PATH, (l) => {
    const row = toSingleDigitList(l);

    row.forEach((v, ix) => {
      if (v !== 0) {
        return;
      }
      heads.push([ix, grid.length]);
    });
    grid.push(row);
  });

  const scores = heads.map((p) => score(grid, p, {}, true));
  console.log("Problem one:", sum(scores));

  const ratings = heads.map((p) => score(grid, p, {}, false));
  console.log("Problem two:", sum(ratings));
}

await problems();
