import { handleLines } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

type Password = {
  password: string;
  letter: string;
  min: number;
  max: number;
};

function isValid({ password, letter, min, max }: Password) {
  let count = 0;
  for (let i = 0; i < password.length; i++) {
    if (password[i] === letter) {
      count++;
    }
    if (count > max) {
      return false;
    }
  }
  return count >= min;
}

function isIndexValid({ password, letter, min, max }: Password) {
  let count = 0;
  if (password[min] === letter) {
    count++;
  }
  if (password[max] === letter) {
    count++;
  }
  return count === 1;
}

async function problemOne() {
  const passwords: Password[] = [];

  await handleLines(DATA_PATH, (line) => {
    const [policy, password] = line.split(": ") as [string, string];
    const [counts, letter] = policy.split(" ") as [string, string];
    const [min, max] = counts.split("-") as [string, string];

    passwords.push({
      password,
      letter,
      min: Number.parseInt(min, 10),
      max: Number.parseInt(max, 10),
    });
  });

  const valid = passwords.map(isValid);
  console.log(
    "Problem one:",
    valid.reduce((acc, v) => (v ? acc + 1 : acc), 0)
  );
}

async function problemTwo() {
  const passwords: Password[] = [];

  await handleLines(DATA_PATH, (line) => {
    const [policy, password] = line.split(": ") as [string, string];
    const [counts, letter] = policy.split(" ") as [string, string];
    const [min, max] = counts.split("-") as [string, string];

    passwords.push({
      password,
      letter,
      min: Number.parseInt(min, 10) - 1,
      max: Number.parseInt(max, 10) - 1,
    });
  });
  const valid = passwords.map(isIndexValid);
  console.log(valid);
  console.log(
    "Problem two:",
    valid.reduce((acc, v) => (v ? acc + 1 : acc), 0)
  );
}

await problemOne();
await problemTwo();
