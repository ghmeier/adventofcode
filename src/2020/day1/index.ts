import { handleLines } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

function pairMatchesValue(n: number[], v: number): [number, number] {
  for (let i = 0; i < n.length; i++) {
    const x = n[i] as number;

    for (let j = i + 1; j < n.length; j++) {
      const y = n[j] as number;
      if (x + y === v) {
        return [x, y];
      }
    }
  }
  throw new Error("No matching pair found.");
}

function trioMatchesValue(n: number[], v: number): [number, number, number] {
  for (let i = 0; i < n.length; i++) {
    const x = n[i] as number;

    for (let j = i + 1; j < n.length; j++) {
      const y = n[j] as number;
      for (let k = j + 1; k < n.length; k++) {
        const z = n[k] as number;
        if (x + y + z === v) {
          return [x, y, z];
        }
      }
    }
  }
  throw new Error("No matching trio found.");
}

async function problemOne() {
  const n: number[] = [];
  await handleLines(DATA_PATH, (line) => {
    n.push(Number.parseInt(line, 10));
  });

  const pair = pairMatchesValue(n, 2020);

  console.log("Problem one:", pair[0] * pair[1]);
}

async function problemTwo() {
  const n: number[] = [];
  await handleLines(DATA_PATH, (line) => {
    n.push(Number.parseInt(line, 10));
  });

  const trio = trioMatchesValue(n, 2020);

  console.log("Problem two:", trio[0] * trio[1] * trio[2]);
}

await problemOne();
await problemTwo();
