import { isEqual } from "lodash";

import { readLines, sum } from "../utils";

const DATA_PATH = `${import.meta.dir}/day13.txt`;
const _CALIBRATE_PATH = `${import.meta.dir}/day13-calibrate.txt`;

function parseList(line: string) {
  const parts = line
    .substring(1, line.length - 1)
    .split(",")
    .filter((p) => p);

  const values = [];
  while (parts.length) {
    if (parts[0].match(/^\d+$/)) {
      values.push(Number.parseInt(parts.shift() as string, 10));
    } else if (parts[0].match(/^\[\d*\]$/)) {
      values.push(parseList(parts.shift() as string));
    } else if (parts[0].startsWith("[")) {
      const sublist = [parts.shift() as string];
      let brace =
        (sublist[0].match(/\[/g)?.length || 0) -
        (sublist[0].match(/\]/g)?.length || 0);
      while (brace > 0) {
        const open = parts[0].match(/\[/g)?.length || 0;
        const close = parts[0].match(/\]/g)?.length || 0;
        brace = brace + open - close;
        sublist.push(parts.shift() as string);
      }
      values.push(parseList(sublist.join(",")));
    } else {
      throw Error(`Invalid list section ${parts[0]}`);
    }
  }

  return values;
}

function isOrdered(left, right): number {
  for (let ix = 0; ix < left.length; ix++) {
    let l = left[ix];
    let r = right[ix];
    if (!r) {
      return -1;
    }

    if (typeof l === "number" && typeof r === "number") {
      if (l < r) {
        return 1;
      }
      if (r < l) {
        return -1;
      }
      continue;
    }
    if (!Array.isArray(l)) {
      l = [l];
    }
    if (!Array.isArray(r)) {
      r = [r];
    }

    const result = isOrdered(l, r);
    if (result !== 0) {
      return result;
    }
  }
  if (left.length === right.length) {
    return 0;
  }
  return 1;
}

// 5778
async function problemOne() {
  const lines = await readLines(DATA_PATH);
  const pairs = [];
  let pair = [];
  for (const line of lines) {
    if (!line) {
      pairs.push([...pair]);
      pair = [];
      continue;
    }
    pair.push(parseList(line));
  }

  const ordered = [];
  for (const [ix, [left, right]] of pairs.entries()) {
    if (isOrdered(left, right) === 1) {
      ordered.push(ix + 1);
    }
  }

  console.log("Problem one:", sum(ordered));
}

// 22425s
async function problemTwo() {
  const lines = await readLines(DATA_PATH);
  const packets = [[[2]], [[6]]];
  for (const line of lines) {
    if (!line) {
      continue;
    }
    packets.push(parseList(line));
  }

  packets.sort((left, right) => isOrdered(right, left));
  const [a, b] = packets
    .map((p, ix) => (isEqual(p, [[2]]) || isEqual(p, [[6]]) ? ix + 1 : 0))
    .filter((v) => v);
  console.log("Problem two:", a * b);
}

await problemOne();
await problemTwo();
