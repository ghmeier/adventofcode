import { handleLines, type Point, ps } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
  const segments: Point[][] = [];
  const counts: Record<string, number> = {};
  await handleLines(DATA_PATH, (l) => {
    const segment = l
      .split(" -> ")
      .map((p) => p.split(",").map((v) => Number.parseInt(v, 10))) as Point[];

    if (segment[0][0] === segment[1][0]) {
      let start = 0;
      let end = 0;
      if (segment[0][1] < segment[1][1]) {
        start = segment[0][1];
        end = segment[1][1];
      } else {
        start = segment[1][1];
        end = segment[0][1];
      }
      for (let i = start; i <= end; i++) {
        const point = ps([segment[0][0], i]);
        if (!counts[point]) {
          counts[point] = 0;
        }
        counts[point] += 1;
      }
    } else if (segment[0][1] === segment[1][1]) {
      let start = 0;
      let end = 0;
      if (segment[0][0] < segment[1][0]) {
        start = segment[0][0];
        end = segment[1][0];
      } else {
        start = segment[1][0];
        end = segment[0][0];
      }
      for (let i = start; i <= end; i++) {
        const point = ps([i, segment[0][1]]);
        if (!counts[point]) {
          counts[point] = 0;
        }
        counts[point] += 1;
      }
    }
    segments.push(segment);
  });
  const overlap = Object.values(counts).filter((v) => v > 1);

  console.log("Problem one:", overlap.length);
}

async function problemTwo() {
  const segments: Point[][] = [];
  const counts: Record<string, number> = {};
  await handleLines(DATA_PATH, (l) => {
    const segment = l
      .split(" -> ")
      .map((p) => p.split(",").map((v) => Number.parseInt(v, 10))) as Point[];

    if (segment[0][0] === segment[1][0]) {
      let start = 0;
      let end = 0;
      if (segment[0][1] < segment[1][1]) {
        start = segment[0][1];
        end = segment[1][1];
      } else {
        start = segment[1][1];
        end = segment[0][1];
      }
      for (let i = start; i <= end; i++) {
        const point = ps([segment[0][0], i]);
        if (!counts[point]) {
          counts[point] = 0;
        }
        counts[point] += 1;
      }
    } else if (segment[0][1] === segment[1][1]) {
      let start = 0;
      let end = 0;
      if (segment[0][0] < segment[1][0]) {
        start = segment[0][0];
        end = segment[1][0];
      } else {
        start = segment[1][0];
        end = segment[0][0];
      }
      for (let i = start; i <= end; i++) {
        const point = ps([i, segment[0][1]]);
        if (!counts[point]) {
          counts[point] = 0;
        }
        counts[point] += 1;
      }
    } else {
      let xDir = 1;
      let yDir = 1;
      const m = Math.abs(segment[0][0] - segment[1][0]);
      if (segment[0][0] > segment[1][0]) {
        xDir = -1;
      }
      if (segment[0][1] > segment[1][1]) {
        yDir = -1;
      }
      for (let i = 0; i <= m; i++) {
        const point = ps([segment[0][0] + xDir * i, segment[0][1] + yDir * i]);
        if (!counts[point]) {
          counts[point] = 0;
        }
        counts[point] += 1;
      }
    }
    segments.push(segment);
  });
  const overlap = Object.values(counts).filter((v) => v > 1);

  console.log("Problem two:", overlap.length);
}

await problemOne();
await problemTwo();
