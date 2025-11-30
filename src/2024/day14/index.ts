import { range } from "lodash";
import "node:tty";

import {
  DIRECTIONS,
  handleLines,
  type Point,
  pFromS,
  ps,
  validCell,
} from "../../utils";
import PaintGrid from "../../utils/terminal";

const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

type Robot = { position: Point; velocity: Point };

async function parse(file: string) {
  const robots: Robot[] = [];

  await handleLines(DATA_PATH, (l) => {
    const [position, velocity] = l
      .replace("p=", "")
      .replace("v=", "")
      .split(" ")
      .map((p) => p.split(",").map(Number)) as [Point, Point];

    robots.push({ position, velocity });
  });
  return robots;
}

function move({ position, velocity }: Robot, max: Point) {
  const next: Point = [
    (position[0] + velocity[0]) % max[0],
    (position[1] + velocity[1]) % max[1],
  ];
  if (next[0] < 0) {
    next[0] = max[0] + next[0];
  }
  if (next[1] < 0) {
    next[1] = max[1] + next[1];
  }
  return next;
}

async function problemOne() {
  const max: Point = [101, 103];
  const steps = 100;
  const robots = await parse(DATA_PATH);

  for (let step = 0; step < steps; step++) {
    for (const r of robots) {
      r.position = move(r, max);
    }
  }

  const counts: Record<string, number> = { TL: 0, TR: 0, BL: 0, BR: 0 };
  const bounds = [Math.floor(max[0] / 2), Math.floor(max[1] / 2)];
  robots.forEach(({ position }) => {
    let key: string | null = null;
    if (position[1] < bounds[1]) {
      key = "T";
    } else if (position[1] > bounds[1]) {
      key = "B";
    }

    if (position[0] < bounds[0]) {
      key += "L";
    } else if (position[0] > bounds[0]) {
      key += "R";
    }

    if (key && counts[key] !== undefined) {
      counts[key]++;
    }
  });

  console.log(
    "Problem one:",
    Object.values(counts).reduce((acc, v) => v * acc, 1)
  );
}

const D = Object.values(DIRECTIONS);
function group(point: Point, grid: number[][], toVisit: Set<string>) {
  if (!toVisit.delete(ps(point))) {
    return 0;
  }

  let rest = 1;
  for (const p of D) {
    const next: Point = [point[0] + p[0], point[1] + p[1]];
    if (!validCell(grid, next) || grid[next[1]][next[0]] === 0) {
      continue;
    }
    rest += group(next, grid, toVisit);
  }
  return rest;
}

// We'll assume that the robots should be clustered in a group, so
// search through the robots and see if they're in groups larger than 120.
function checkGroup(robots: Robot[], grid: number[][]) {
  const toVisit = new Set(robots.map((r) => ps(r.position)));
  const iterator = toVisit.values();
  while (true) {
    const entry = iterator.next();
    if (entry.done) {
      break;
    }
    const p = pFromS(entry.value);
    const size = group(p, grid, toVisit);
    if (size > 120) {
      return true;
    }
  }
  return false;
}

// 6377
async function problemTwo() {
  const max: Point = [101, 103];
  const steps = 10000;
  const robots = await parse(DATA_PATH);

  const g = new PaintGrid(max[0], max[1], 0);
  await g.flush();
  const grid = range(0, max[1]).map(() => range(0, max[0]).map(() => 0));
  for (const { position } of robots) {
    await g.update(
      position[0],
      position[1],
      g.grid[position[1]][position[0]] + 1
    );
    g.grid[position[1]][position[0]]++;
  }

  for (let step = 0; step < steps; step++) {
    for (const r of robots) {
      await g.update(
        r.position[0],
        r.position[1],
        g.grid[r.position[1]][r.position[0]] - 1
      );
      grid[r.position[1]][r.position[0]]--;
      r.position = move(r, max);
      await g.update(
        r.position[0],
        r.position[1],
        g.grid[r.position[1]][r.position[0]] + 1
      );
      grid[r.position[1]][r.position[0]]++;
    }

    await g.cursorTo(max[0] + 1, 0);
    await g.write(`<- Step ${step}`);

    if (step > 5000 && checkGroup(robots, g.grid)) {
      await g.cursorTo(max[0] + 1, 1);
      await g.write(`Problem two: ${step + 1}`);
      await g.close();
      break;
    }
  }
  console.log("bi?");
}

await problemOne();
await problemTwo();
