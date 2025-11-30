import { cloneDeep, range } from "lodash";

import { handleLines } from "../utils";

const DATA_PATH = `${import.meta.dir}/day17.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day17-calibrate.txt`;

const FLAT = [0b0011110];

const PLUS = [0b0001000, 0b0011100, 0b0001000].reverse();

const ANGLE = [0b0000100, 0b0000100, 0b0011100].reverse();

const VERT = [0b0010000, 0b0010000, 0b0010000, 0b0010000].reverse();

const BOX = [0b0011000, 0b0011000].reverse();

const SHAPES = [FLAT, PLUS, ANGLE, VERT, BOX];

function shiftLeft(well: number[], rock: number[], y: number) {
  if (rock.some((v) => 0b1000000 & v)) {
    return rock;
  }
  const shifted = rock.map((v) => v << 1);

  if (!shifted.some((v, ix) => y + ix < well.length && v & well[y + ix])) {
    return shifted;
  }
  return rock;
}

function binDump(b: number[]) {
  console.log(b.map((v) => v.toString(2).padStart(7, "0")).join("\n"));
  console.log("");
}

function shiftRight(well: number[], rock: number[], y: number) {
  if (rock.some((v) => 0b0000001 & v)) {
    return rock;
  }
  const shifted = rock.map((v) => v >> 1);

  if (!shifted.some((v, ix) => y + ix < well.length && v & well[y + ix])) {
    return shifted;
  }
  return rock;
}

function canShiftDown(well: number[], rock: number[], y: number) {
  return !rock.some((v, ix) => v & well[y + ix - 1]);
}

// 3055
async function problemOne() {
  const well = range(0, 3).map(() => 0b0000000);

  let jets: string[] = [];
  await handleLines(DATA_PATH, (line) => {
    jets = line.split("");
  });
  let placed = 0;
  let steps = 0;
  while (placed < 2022) {
    let rock = cloneDeep(SHAPES[placed % SHAPES.length]);
    let y = well.length;
    while (true) {
      rock =
        jets[steps % jets.length] === ">"
          ? shiftRight(well, rock, y)
          : shiftLeft(well, rock, y);
      steps++;
      if (y > 0 && canShiftDown(well, rock, y)) {
        y--;
      } else {
        for (let ix = 0; ix < rock.length; ix++) {
          if (ix + y >= well.length) {
            well.push(rock[ix]);
          } else {
            well[y + ix] = well[y + ix] | rock[ix];
          }
        }
        const top = well.length - (y + rock.length);
        if (top < 3) {
          well.push(...range(0, 3 - top).map(() => 0b0000000));
        }
        placed++;
        break;
      }
    }
  }
  console.log("Problem one:", well.length - 3);
}

async function problemTwo() {
  const well = range(0, 3).map(() => 0b0000000);

  let jets: string[] = [];
  await handleLines(CALIBRATE_PATH, (line) => {
    jets = line.split("");
  });
  let placed = 0;
  let steps = 0;
  const keysToHeight = {};
  while (placed < 1000) {
    let rock = cloneDeep(SHAPES[placed % SHAPES.length]);
    let y = well.length;
    while (true) {
      rock =
        jets[steps % jets.length] === ">"
          ? shiftRight(well, rock, y)
          : shiftLeft(well, rock, y);
      steps++;
      if (y > 0 && canShiftDown(well, rock, y)) {
        y--;
      } else {
        for (let ix = 0; ix < rock.length; ix++) {
          if (ix + y >= well.length) {
            well.push(rock[ix]);
          } else {
            well[y + ix] = well[y + ix] | rock[ix];
          }
        }
        const top = well.length - (y + rock.length);
        if (top < 3) {
          well.push(...range(0, 3 - top).map(() => 0b0000000));
        }
        placed++;
        break;
      }
    }
    const k = `${placed % SHAPES.length},${steps % jets.length}`;
    if (!keysToHeight[k]) {
      keysToHeight[k] = well.length - 3;
    } else {
      console.log("Found loop", k, well.length - 3 - keysToHeight[k], placed);
    }
    // console.log(well.length - 3, placed);
  }
  console.log("Problem two:", 0);
}

await problemOne();
await problemTwo();
