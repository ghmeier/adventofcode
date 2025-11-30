import { handleLines, sum } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
  let re: RegExp;

  const designs: string[] = [];
  await handleLines(DATA_PATH, (l) => {
    if (!re) {
      re = RegExp(`^(?:${l.split(", ").join("|")})+$`);
    } else {
      designs.push(l);
    }
  });

  let valid = 0;
  for (const d of designs) {
    if (re.test(d)) {
      valid++;
    }
  }
  console.log("Problem one:", valid);
}

function walkDef(design: string, towels: string[]): number {
  if (!design) {
    return 1;
  }
  return sum(
    towels.map((towel) =>
      design.startsWith(towel) ? walk(design.slice(towel.length), towels) : 0
    )
  );
}

const cache = new Map<string, number>();

function walk(design: string, towels: string[]): number {
  if (cache.has(design)) {
    return cache.get(design) || 0;
  }
  const result = walkDef(design, towels);
  cache.set(design, result);
  return result;
}

async function problemTwo() {
  let towels: string[];
  const designs: string[] = [];
  await handleLines(DATA_PATH, (l) => {
    if (!towels) {
      towels = l.split(", ");
    } else {
      designs.push(l);
    }
  });

  const results = designs.map((d) => walk(d, towels));

  console.log("Problem two:", sum(results));
}

await problemOne();
await problemTwo();
