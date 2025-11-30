import { addCounter, handleLines, splitWhitespace, sum } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function parse(file: string) {
  const stones: Record<string, number> = {};
  await handleLines(file, (l) => {
    splitWhitespace(l).forEach((v) => {
      if (!stones[v]) {
        stones[v] = 0;
      }
      stones[v] += 1;
    });
  });
  return stones;
}

function iterate(stones: Record<string, number>, maxSteps: number) {
  let s = { ...stones };
  let steps = 0;
  while (steps < maxSteps) {
    s = Object.entries(s).reduce(
      (acc, [k, v]) => {
        if (k === "0") {
          addCounter(acc, "1", v);
        } else if (k.length % 2 === 0) {
          addCounter(acc, k.slice(0, k.length / 2), v);
          addCounter(acc, Number.parseInt(k.slice(k.length / 2), 10), v);
        } else {
          const value = Number.parseInt(k, 10) * 2024;
          addCounter(acc, value.toString(), v);
        }
        return acc;
      },
      {} as Record<string, number>
    );
    steps++;
  }
  return s;
}

async function problem() {
  const stones = await parse(DATA_PATH);

  console.time("one");
  let result = iterate(stones, 25);
  console.timeEnd("one");
  console.log("Problem one:", sum(Object.values(result)));
  console.time("two");
  result = iterate(stones, 75);
  console.timeEnd("two");
  console.log("Problem two:", sum(Object.values(result)));
}

await problem();
