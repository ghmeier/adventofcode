import { handleLines, type Point, ps } from "../utils";

const DATA_PATH = `${import.meta.dir}/day15.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day15-calibrate.txt`;

interface Signal {
  p: Point;
  distance: number;
}

function d([x, y]: Point, [a, b]: Point) {
  return Math.abs(x - a) + Math.abs(y - b);
}

async function initialize(file: string) {
  let maxX = Number.MIN_VALUE;
  let maxY = Number.MIN_VALUE;
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  const points: { p: Point; distance: number }[] = [];
  const beacons = new Set<string>();
  await handleLines(file, (line) => {
    const { sx, sy, bx, by } = (
      line.match(
        /Sensor at x=(?<sx>-?\d+), y=(?<sy>-?\d+): closest beacon is at x=(?<bx>-?\d+), y=(?<by>-?\d+)/
      ) as RegExpMatchArray
    ).groups;
    const p = [sx, sy].map((v) => Number.parseInt(v, 10)) as Point;
    const b = [bx, by].map((v) => Number.parseInt(v, 10)) as Point;
    const distance = d(p, b);
    maxX = Math.max(p[0] + distance, b[0] + distance, maxX);
    maxY = Math.max(p[1] + distance, b[1] + distance, maxY);
    minX = Math.min(p[0] - distance, b[0] - distance, minX);
    minY = Math.min(p[1] - distance, b[1] - distance, minY);

    points.push({ p, distance });
    beacons.add(ps(b));
  });

  return { points, beacons, max: [maxX, maxY], min: [minX, minY] };
}

function inRange(points: Signal[], [x, y]: Point) {
  return points.some(({ p, distance }) => d(p, [x, y]) <= distance);
}

// 5147333
async function problemOne() {
  const { points, beacons, max, min } = await initialize(DATA_PATH);

  const y = 2000000;
  const confirmed = [];
  for (let x = min[0]; x <= max[0]; x++) {
    if (beacons.has(ps([x, y]))) {
      continue;
    }
    if (inRange(points, [x, y])) {
      confirmed.push(x);
    }
  }
  console.log("Problem one:", confirmed.length);
}

const MAX_BOUND = 4000000;

function checkPerimeter(
  { p, distance }: Signal,
  points: Signal[],
  min: number,
  max: number
) {
  let x = p[0];
  let y = p[1] + distance + 1;
  const open: Point[] = [];
  while (y > p[1]) {
    if (x >= min && x <= max && y >= min && y <= max) {
      if (!inRange(points, [x, y])) {
        open.push([x, y]);
      }
    }
    x--;
    y--;
  }
  while (y < p[1] - distance) {
    if (x >= min && x <= max && y >= min && y <= max) {
      if (!inRange(points, [x, y])) {
        open.push([x, y]);
      }
    }
    x++;
    y--;
  }
  while (y > p[1]) {
    if (x >= min && x <= max && y >= min && y <= max) {
      if (!inRange(points, [x, y])) {
        open.push([x, y]);
      }
    }
    x++;
    y++;
  }
  while (y > p[1] + distance) {
    if (x >= min && x <= max && y >= min && y <= max) {
      if (!inRange(points, [x, y])) {
        open.push([x, y]);
      }
    }
    x--;
    y++;
  }
  return open;
}

// 13734006908372
async function problemTwo() {
  const { points } = await initialize(DATA_PATH);

  let found: Point[] = [];
  for (const p of points) {
    found = found.concat(checkPerimeter(p, points, 0, MAX_BOUND));
  }
  if (found.length > 1) {
    console.log("Too many points", found);
  }

  console.log("Problem two:", found[0][0] * 4000000 + found[0][1]);
}

await problemOne();
await problemTwo();
