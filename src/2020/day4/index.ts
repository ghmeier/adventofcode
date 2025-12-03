import { readLines } from "../../utils";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

// type Passport = {
//   byr?: string; // (Birth Year)
//   iyr?: string; // (Issue Year)
//   eyr?: string; // (Expiration Year)
//   hgt?: string; // (Height)
//   hcl?: string; // (Hair Color)
//   ecl?: string; // (Eye Color)
//   pid?: string; // (Passport ID)
//   cid?: string; // (Country ID)
// };

const keys = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid", "cid"] as const;

const required = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"] as const;

type Keys = (typeof keys)[number];

type Passport = Partial<Record<Keys, string>>;

function isValid(p: Passport): boolean {
  return required.every((k) => p[k]);
}

function parse(lines: string[]): Passport[] {
  const passports: Passport[] = [];

  let passport: Passport = {};
  for (const line of lines) {
    if (!line) {
      passports.push({ ...passport });
      passport = {};
      continue;
    }

    const kvs = line.split(" ");
    for (const kv of kvs) {
      const [key, value] = kv.split(":") as [Keys, string];
      passport[key] = value;
    }
  }
  passports.push(passport);
  return passports;
}

const validators: Record<Keys, (v: string) => boolean> = {
  byr: (v: string) => {
    try {
      const year = Number.parseInt(v, 10);
      return year >= 1920 && year <= 2002;
    } catch {
      return false;
    }
  },
  iyr: (v: string) => {
    try {
      const year = Number.parseInt(v, 10);
      return year >= 2010 && year <= 2020;
    } catch {
      return false;
    }
  },
  eyr: (v: string) => {
    try {
      const year = Number.parseInt(v, 10);
      return year >= 2020 && year <= 2030;
    } catch {
      return false;
    }
  },
  hgt: (v: string) => {
    const isCm = !!v.match(/^[0-9]+cm$/i);
    const isIn = !!v.match(/^[0-9]+in$/i);

    if (isCm) {
      const height = Number.parseInt(v.replace("cm", ""), 10);
      return height >= 150 && height <= 198;
    }
    if (isIn) {
      const height = Number.parseInt(v.replace("in", ""), 10);
      return height >= 59 && height <= 76;
    }
    return false;
  },
  hcl: (v) => !!v.match(/^#[0-9a-f]{6}$/g),
  ecl: (v) => ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(v),
  pid: (v) => !!v.match(/^[0-9]{9}$/),
  cid: () => true,
};

function validate(p: Passport): boolean {
  if (!isValid(p)) {
    return false;
  }

  return required.map((k) => validators[k](p[k])).every((v) => v);
}

async function problemOne() {
  const lines = await readLines(DATA_PATH);
  const passports = parse(lines);

  const valid = passports.map(isValid);
  const count = valid.reduce((acc, v) => (v ? acc + 1 : acc), 0);

  console.log("Problem one:", count);
}

async function problemTwo() {
  const lines = await readLines(DATA_PATH);
  const passports = parse(lines);

  const valid = passports.map(validate);
  const count = valid.reduce((acc, v) => (v ? acc + 1 : acc), 0);
  console.log("Problem two:", count);
}

await problemOne();
await problemTwo();
