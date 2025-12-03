import { readLines, sum } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

const ALL_FACTORS: Record<number, number[]> = {};

function getFactors(digits: number): number[] {
  if (ALL_FACTORS[digits]) {
    return ALL_FACTORS[digits];
  }

  ALL_FACTORS[digits] = [];
  for (let i = 1; i < digits; i++) {
    if (digits % i) {
      continue;
    }
    ALL_FACTORS[digits].push(i);
  }

  return ALL_FACTORS[digits];
}

function isRepeated(full: string, times: number): boolean {
  const part = full.slice(0, times);
  const repeats = full.length / times;

  if (part.repeat(repeats) === full) {
    return true;
  }
  return false;
}

function isRepeatedSequence(v: string): boolean {
  const digits = v.length;
  const factors = getFactors(digits);

  for (const factor of factors) {
    if (isRepeated(v, factor)) {
      return true;
    }
  }
  return false;
}

function findTwoRepeats(s: string, e: string): number[] {
  const repeats: number[] = [];

  // Entirely Odd digits ranges can never have 2 sequences repeated.
  if (s.length % 2 && e.length % 2 && s.length === e.length) {
    return repeats;
  }

  const start = Number.parseInt(s, 10);
  const end = Number.parseInt(e, 10);

  for (let i = start; i <= end; i++) {
    const v = i.toString();
    if (v.length % 2 === 0 && isRepeated(v, v.length / 2)) {
      repeats.push(i);
    }
  }

  return repeats;
}

function findAnyRepeats(s: string, e: string): number[] {
  const repeats: number[] = [];
  const start = Number.parseInt(s, 10);
  const end = Number.parseInt(e, 10);

  for (let i = start; i <= end; i++) {
    const v = i.toString();
    if (isRepeatedSequence(v)) {
      repeats.push(i);
    }
  }

  return repeats;
}

async function problemOne() {
  const ranges = (await readLines(DATA_PATH))
    .filter((ln) => ln.trim())[0]
    ?.split(",")
    .map((range) => range.split("-")) as [string, string][];

  const repeats: number[] = [];
  for (const [s, e] of ranges) {
    repeats.push(...findTwoRepeats(s, e));
  }

  console.log("Problem one:", sum(repeats));
}

async function problemTwo() {
  const ranges = (await readLines(DATA_PATH))
    .filter((ln) => ln.trim())[0]
    ?.split(",")
    .map((range) => range.split("-")) as [string, string][];

  const repeats: number[] = [];
  for (const [s, e] of ranges) {
    const rangeRepeats = findAnyRepeats(s, e);
    repeats.push(...rangeRepeats);
  }

  console.log("Problem two:", sum(repeats));
}

await problemOne();
await problemTwo();
