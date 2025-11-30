import { handleLines, type Point, sum } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

function count({ a, b }: { a: Point; b: Point }, p: Point) {
  let value = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i <= 100; i++) {
    for (let j = 0; j <= 100; j++) {
      const r = [a[0] * i + b[0] * j, a[1] * i + b[1] * j];
      if (r[0] !== p[0] || r[1] !== p[1]) {
        continue;
      }

      const potential = i * 3 + j;
      if (potential < value) {
        value = potential;
      }
    }
  }
  return value;
}

function countFast({ a, b }: { a: Point; b: Point }, p: Point) {
  const rX = (p[1] * b[0] - p[0] * b[1]) / (a[1] * b[0] - a[0] * b[1]);
  const rY = -((p[1] * a[0] - p[0] * a[1]) / (a[1] * b[0] - a[0] * b[1]));
  if (!Number.isInteger(rX) || !Number.isInteger(rY)) {
    return 0;
  }
  return rX * 3 + rY;
}

async function parse(file: string, modifier = 0) {
  const buttons: { a: Point; b: Point }[] = [];
  const prizes: Point[] = [];

  await handleLines(file, (l) => {
    if (l.startsWith("Button A: ")) {
      buttons.push({
        a: l
          .replace("Button A: X+", "")
          .replace(" Y+", "")
          .split(",")
          .map(Number) as Point,
        b: [0, 0],
      });
    } else if (l.startsWith("Button B: ")) {
      buttons[buttons.length - 1].b = l
        .replace("Button B: X+", "")
        .replace(" Y+", "")
        .split(",")
        .map(Number) as Point;
    } else if (l.startsWith("Prize: ")) {
      prizes.push(
        l
          .replace("Prize: X=", "")
          .replace(" Y=", "")
          .split(",")
          .map((v) => Number.parseInt(v, 10) + modifier) as Point
      );
    }
  });
  return { buttons, prizes };
}

async function problemOne() {
  const { buttons, prizes } = await parse(DATA_PATH);

  const results = buttons
    .map((b, ix) => count(b, prizes[ix]))
    .filter((v) => v !== Number.MAX_SAFE_INTEGER);
  console.log("Problem one:", sum(results));
}

async function problemTwo() {
  const { buttons, prizes } = await parse(DATA_PATH, 10000000000000);
  const results = buttons.map((b, ix) => countFast(b, prizes[ix]));
  console.log("Problem two:", sum(results));
}

await problemOne();
await problemTwo();
