import { readLines, splitWhitespace, sum } from "../utils";

const DATA_PATH = `${import.meta.dir}/day9.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day9-calibrate.txt`;

function dump(readings: number[][]) {
  console.log(readings.map((v) => v.join(" ")).join("\n"));
}

export function calculateTrend(values: number[], back: boolean): number {
  if (values.every((v) => v === 0)) {
    return 0;
  }

  const diffs: number[] = [];
  for (let ix = 1; ix < values.length; ix++) {
    diffs.push(values[ix] - values[ix - 1]);
  }
  if (back) {
    const trend = values[0] - calculateTrend(diffs, back);
    return trend;
  }
  return values[values.length - 1] + calculateTrend(diffs, back);
}

// 1974232248
async function problemOne() {
  const lines = await readLines(DATA_PATH);

  const recursive = [];
  for (const line of lines) {
    if (!line) {
      continue;
    }

    recursive.push(
      calculateTrend(
        splitWhitespace(line).map((v) => Number.parseInt(v, 10)),
        false
      )
    );
  }
  console.log("Problem one:", sum(recursive));
}

async function problemTwo() {
  const lines = await readLines(DATA_PATH);

  const recursive = [];
  for (const line of lines) {
    if (!line) {
      continue;
    }
    recursive.push(
      calculateTrend(
        splitWhitespace(line).map((v) => Number.parseInt(v, 10)),
        true
      )
    );
  }
  console.log("Problem two:", sum(recursive));
}

// await problemOne();
// await problemTwo();
