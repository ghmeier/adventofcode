import { handleLines } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
  const moves: number[] = [];

  await handleLines(DATA_PATH, (line) => {
    if (line.startsWith("L")) {
      moves.push(-Number.parseInt(line.replace("L", ""), 10) % 100);
    } else {
      moves.push(Number.parseInt(line.replace("R", ""), 10) % 100);
    }
  });

  let pos = 50;
  let zeros = 0;
  for (const move of moves) {
    pos += move;

    if (pos < 0) {
      pos = 100 - Math.abs(pos);
    } else if (pos > 99) {
      pos -= 100;
    }

    if (pos === 0) {
      zeros++;
    }
  }

  console.log("Problem one:", zeros);
}

async function problemTwo() {
  const moves: number[] = [];

  await handleLines(DATA_PATH, (line) => {
    if (line.startsWith("L")) {
      moves.push(-Number.parseInt(line.replace("L", ""), 10));
    } else {
      moves.push(Number.parseInt(line.replace("R", ""), 10));
    }
  });

  let pos = 50;
  let zeros = 0;

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i]!;
    const start = pos;
    const clicks = move % 100;
    let rotations =
      Math.abs(move) >= 100 ? (Math.abs(move) - Math.abs(clicks)) / 100 : 0;
    let crossed = false;

    pos += clicks;

    if (pos < 0) {
      pos = 100 - Math.abs(pos);
      crossed = start !== 0;
    } else if (pos > 99) {
      pos -= 100;
      crossed = start !== 0;
    }

    if (pos === 0 || crossed) {
      rotations++;
    }

    zeros += rotations;
  }

  console.log("Problem two:", zeros);
}

await problemOne();
await problemTwo();
