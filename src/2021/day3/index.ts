import { handleLines, sum } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
  const data: string[][] = [];
  await handleLines(DATA_PATH, (l) => {
    data.push(l.split(""));
  });

  const gamma = [];
  const epsilon = [];
  const half = data.length / 2;
  for (let i = 0; i < data[0].length; i++) {
    if (sum(data.map((d) => (d[i] === "1" ? 1 : 0))) >= half) {
      gamma.push("1");
      epsilon.push("0");
    } else {
      gamma.push("0");
      epsilon.push("1");
    }
  }

  const gammaResult = Number.parseInt(gamma.join(""), 2);
  const epsilonResult = Number.parseInt(epsilon.join(""), 2);

  console.log("Problem one:", gammaResult * epsilonResult);
}

function partitionSignificant(data: string[][], ix: number) {
  const [zero, one] = data.reduce(
    (acc, d) => {
      if (d[ix] === "1") {
        acc[1].push(d);
      } else {
        acc[0].push(d);
      }
      return acc;
    },
    [[], []] as [string[][], string[][]]
  );

  if (one.length >= zero.length) {
    return one;
  }
  return zero;
}

function partitionInsignificant(data: string[][], ix: number) {
  const [zero, one] = data.reduce(
    (acc, d) => {
      if (d[ix] === "1") {
        acc[1].push(d);
      } else {
        acc[0].push(d);
      }
      return acc;
    },
    [[], []] as [string[][], string[][]]
  );

  if (one.length >= zero.length) {
    return zero;
  }
  return one;
}

async function problemTwo() {
  const data: string[][] = [];
  await handleLines(DATA_PATH, (l) => {
    data.push(l.split(""));
  });

  let oxygen = data;
  let co2 = data;
  for (let i = 0; i < data[0].length; i++) {
    if (oxygen.length > 1) {
      oxygen = partitionSignificant(oxygen, i);
    }
    if (co2.length > 1) {
      co2 = partitionInsignificant(co2, i);
    }
  }
  const oxygenResult = Number.parseInt(oxygen[0].join(""), 2);
  const co2Result = Number.parseInt(co2[0].join(""), 2);

  console.log("Problem two:", oxygenResult * co2Result);
}

await problemOne();
await problemTwo();
