import { readLines, sum } from "../utils";

interface Boundaries {
  x: [number, number];
  y: [number, number];
}

function parseBoundaries(
  lines: string[],
  x: number,
  y: number,
  digitLength: number
): Boundaries {
  const startX = Math.max(x - digitLength, 0);
  const startY = Math.max(y - 1, 0);
  const endX = Math.min(x + 1, lines[0].length - 1);
  const endY = Math.min(y + 1, lines.length - 1);

  return { x: [startX, endX], y: [startY, endY] };
}

function hasSymbol(lines: string[], x: number, y: number, digitLength: number) {
  const boundaries = parseBoundaries(lines, x, y, digitLength);

  for (let searchX = boundaries.x[0]; searchX <= boundaries.x[1]; searchX++) {
    for (let searchY = boundaries.y[0]; searchY <= boundaries.y[1]; searchY++) {
      const char = lines[searchY][searchX];
      if (char.match(/[^\d.]/)) {
        return true;
      }
    }
  }
  return false;
}

function hasGear(lines: string[], boundaries: Boundaries) {
  for (let searchX = boundaries.x[0]; searchX <= boundaries.x[1]; searchX++) {
    for (let searchY = boundaries.y[0]; searchY <= boundaries.y[1]; searchY++) {
      const char = lines[searchY][searchX];
      if (char.match(/[*]/)) {
        return { x: searchX, y: searchY };
      }
    }
  }
  return false;
}

function handleNumber(lines: string[], digits: string[], x: number, y: number) {
  if (!digits.length) {
    return;
  }
  if (!hasSymbol(lines, x, y, digits.length)) {
    return;
  }

  return Number.parseInt(digits.join(""), 10);
}

function handleGearNumber(
  lines: string[],
  digits: string[],
  x: number,
  y: number
) {
  if (!digits.length) {
    return;
  }
  const boundaries = parseBoundaries(lines, x, y, digits.length);
  const gearPosition = hasGear(lines, boundaries);
  if (!gearPosition) {
    return;
  }

  return { ...gearPosition, value: Number.parseInt(digits.join(""), 10) };
}

function parseLines(
  lines: string[],
  handler: (digits: string[], x: number, y: number) => void
) {
  for (const y in lines) {
    const line = lines[y];
    if (!line) {
      continue;
    }

    let digits = [];
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      let xVal = x;
      if (char.match(/\d/)) {
        digits.push(char);

        if (x !== line.length - 1) {
          continue;
        }
      } else {
        xVal -= 1;
      }

      handler(digits, xVal, Number.parseInt(y, 10));
      digits = [];
    }
  }
}

async function problemOne() {
  const lines = (await readLines(`${import.meta.dir}/day3.txt`)).filter(
    (l) => !!l
  );

  const found: number[] = [];
  parseLines(lines, (digits, x, y) => {
    const partNumber = handleNumber(lines, digits, x, y);
    if (partNumber) {
      found.push(partNumber);
    }
  });

  console.log("Part one:", sum(found));
}

async function problemTwo() {
  const lines = (await readLines(`${import.meta.dir}/day3.txt`)).filter(
    (l) => !!l
  );
  const potentialGears: Record<string, number[]> = {};

  parseLines(lines, (digits, x, y) => {
    const gearPosition = handleGearNumber(lines, digits, x, y);
    if (gearPosition) {
      const gearId = [gearPosition.x, gearPosition.y].join(",");
      if (!potentialGears[gearId]) {
        potentialGears[gearId] = [];
      }
      potentialGears[gearId].push(gearPosition.value);
    }
  });

  const ratios = Object.values(potentialGears)
    .filter((v) => v.length === 2)
    .map(([a, b]) => a * b);
  console.log("Part two:", sum(ratios));
}

await problemOne();
await problemTwo();
