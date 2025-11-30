import { range } from "lodash";

import { dumpGrid, handleLines, ps } from "../utils";

const DATA_PATH = `${import.meta.dir}/day14.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day14-calibrate.txt`;

function fall(filled: Record<string, string>, max: number) {
  let x = 500;
  let y = 0;
  while (true) {
    if (y > max) {
      return false;
    }
    if (!filled[ps([x, y + 1])]) {
      y++;
    } else if (!filled[ps([x - 1, y + 1])]) {
      x--;
      y++;
    } else if (!filled[ps([x + 1, y + 1])]) {
      x++;
      y++;
    } else {
      filled[ps([x, y])] = "o";
      return true;
    }
    // console.log(x, y);
    // filled[ps([x, y])] = "-";
  }
}

function fallFull(filled: Record<string, string>, max: number) {
  let x = 500;
  let y = 0;
  while (true) {
    if (y >= max) {
      filled[ps([x, y])] = "o";
      return true;
    }
    if (!filled[ps([x, y + 1])]) {
      y++;
    } else if (!filled[ps([x - 1, y + 1])]) {
      x--;
      y++;
    } else if (!filled[ps([x + 1, y + 1])]) {
      x++;
      y++;
    } else {
      filled[ps([x, y])] = "o";
      return x !== 500 || y !== 0;
    }
  }
}

// 843
async function problemOne() {
  const filled: Record<string, string> = {};
  let maxY = 0;
  await handleLines(DATA_PATH, (line) => {
    const shape = line.split(" -> ").map((p) => {
      const pair = p.split(",").map((c) => Number.parseInt(c, 10));
      if (pair[1] > maxY) {
        maxY = pair[1];
      }
      return pair;
    });
    let [cX, cY] = shape.shift();

    while (shape.length) {
      filled[ps([cX, cY])] = "#";
      if (cX === shape[0][0] && cY === shape[0][1]) {
        [cX, cY] = shape.shift();
      } else if (cX === shape[0][0]) {
        if (cY < shape[0][1]) {
          cY++;
        } else {
          cY--;
        }
      } else if (cY === shape[0][1]) {
        if (cX < shape[0][0]) {
          cX++;
        } else {
          cX--;
        }
      }
    }
  });

  let round = 0;
  while (fall(filled, maxY)) {
    round++;
  }
  dumpGrid(
    range(0, 100).map((y) =>
      range(450, 550).map((x) => filled[ps([x, y])] || ".")
    )
  );
  console.log("Problem one:", round);
}

// 27625
async function problemTwo() {
  const filled: Record<string, string> = {};
  let maxY = 0;
  await handleLines(DATA_PATH, (line) => {
    const shape = line.split(" -> ").map((p) => {
      const pair = p.split(",").map((c) => Number.parseInt(c, 10));
      if (pair[1] > maxY) {
        maxY = pair[1];
      }
      return pair;
    });
    let [cX, cY] = shape.shift();

    while (shape.length) {
      filled[ps([cX, cY])] = "#";
      if (cX === shape[0][0] && cY === shape[0][1]) {
        [cX, cY] = shape.shift();
      } else if (cX === shape[0][0]) {
        if (cY < shape[0][1]) {
          cY++;
        } else {
          cY--;
        }
      } else if (cY === shape[0][1]) {
        if (cX < shape[0][0]) {
          cX++;
        } else {
          cX--;
        }
      }
    }
  });

  while (fallFull(filled, maxY + 1)) {}
  const rest = Object.values(filled).filter((v) => v === "o");
  console.log("Problem two:", rest.length);
}

await problemOne();
await problemTwo();
