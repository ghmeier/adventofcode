import _max from "lodash/max";

import { handleLines, sum } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

function maxPair(bank: number[]) {
  let max = 0;

  for (let i = 0; i < bank.length - 1; i++) {
    for (let j = i + 1; j < bank.length; j++) {
      const candidate = bank[i] * 10 + bank[j];
      if (candidate > max) {
        max = candidate;
      }
    }
  }

  return max;
}

function maxInRange(range: number[], remaining: number): number {
  if (!remaining) {
    return 0;
  }
  const digit = _max(range.slice(0, range.length - remaining + 1)) as number;
  const index = range.indexOf(digit);

  return (
    digit * 10 ** (remaining - 1) +
    maxInRange(range.slice(index + 1), remaining - 1)
  );
}

async function problemOne() {
  const banks: number[][] = [];
  await handleLines(DATA_PATH, (line) => {
    banks.push(line.split("").map((v) => Number.parseInt(v, 10)));
  });

  const maxes = banks.map(maxPair);
  console.log("Problem one:", sum(maxes));
}

async function problemTwo() {
  const banks: number[][] = [];
  await handleLines(DATA_PATH, (line) => {
    banks.push(line.split("").map((v) => Number.parseInt(v, 10)));
  });

  const maxes = banks.map((bank) => maxInRange(bank, 12));
  console.log("Problem two:", sum(maxes));
}

await problemOne();
await problemTwo();
