import { addCounter, handleLines } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const _CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function parse(file: string) {
  let base = "";
  const rules: Record<string, string> = {};
  await handleLines(file, (l) => {
    if (l.includes(" -> ")) {
      const [pair, insert] = l.split(" -> ");
      rules[pair] = insert;
      return;
    }
    base = l;
  });
  if (!base) {
    throw new Error("No base found.");
  }
  return { base, rules };
}

function insertionsSlow(
  b: string,
  rules: Record<string, string>,
  steps: number
) {
  let base = b;
  let next = "";
  for (let step = 0; step < steps; step++) {
    next = "";
    for (let i = 0; i < base.length; i++) {
      const pair = base.substring(i, i + 2);
      if (!rules[pair]) {
        next = `${next}${base.charAt(i)}`;
      } else {
        next = `${next}${base.charAt(i)}${rules[pair]}`;
      }
    }
    base = next;
  }
  return base;
}

function insertions(b: string, rules: Record<string, string>, steps: number) {
  let pairs: Record<string, number> = {};
  for (let i = 0; i < b.length - 1; i++) {
    const pair = b.substring(i, i + 2);
    addCounter(pairs, pair);
  }

  for (let step = 0; step < steps; step++) {
    const next: Record<string, number> = {};
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.keys(pairs).forEach((p) => {
      const count = pairs[p];
      const insert = rules[p];
      if (!insert) {
        addCounter(next, p, count);
        return;
      }

      const first = `${p.charAt(0)}${insert}`;
      const last = `${insert}${p.charAt(1)}`;
      addCounter(next, first, count);
      addCounter(next, last, count);
    });
    pairs = next;
  }
  return pairs;
}

async function problemOne() {
  const { base, rules } = await parse(DATA_PATH);
  const result = insertionsSlow(base, rules, 10);

  const chars = result.split("");
  const counts: Record<string, number> = {};
  for (const c of chars) {
    if (!counts[c]) {
      counts[c] = 0;
    }
    counts[c] += 1;
  }
  const values = Object.values(counts).sort((a, b) => b - a);
  console.log("Problem one:", values[0] - values[values.length - 1]);
}

async function problemTwo() {
  const { base, rules } = await parse(DATA_PATH);

  const pairs = insertions(base, rules, 40);
  const counts = Object.entries(pairs).reduce(
    (acc, [k, v]) => {
      const [a, b] = k.split("");
      addCounter(acc, a, v);
      addCounter(acc, b, v);
      return acc;
    },
    {} as Record<string, number>
  );

  const values = Object.values(counts)
    .map((v) => Math.ceil(v / 2))
    .sort((a, b) => b - a);
  console.log("Problem two:", values[0] - values[values.length - 1]);
}

await problemOne();
await problemTwo();
