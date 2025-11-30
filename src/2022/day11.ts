import { handleLines } from "../utils";

const DATA_PATH = `${import.meta.dir}/day11.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day11-calibrate.txt`;

const START = "Starting items: ";
const OPERATION = "Operation: new = ";
const TEST = "Test: divisible by ";
const PASS = "If true: throw to monkey ";
const FAIL = "If false: throw to monkey ";

function getOperation({
  left,
  right,
  modifier,
}: {
  left: string;
  right: string;
  modifier: string;
}) {
  return (v: number) => {
    const leftVal = left === "old" ? v : Number.parseInt(left, 10);
    const rightVal = right === "old" ? v : Number.parseInt(right, 10);

    if (modifier === "+") {
      return leftVal + rightVal;
    }
    if (modifier === "-") {
      return leftVal - rightVal;
    }
    if (modifier === "*") {
      return leftVal * rightVal;
    }
    if (modifier === "/") {
      return leftVal / rightVal;
    }
    return v;
  };
}

interface Monkey {
  items: number[];
  operation: (v: number) => number;
  test: (v: number) => boolean;
  pass: () => number;
  fail: () => number;
  inspections: number;
}

function runRounds(monkeys: Monkey[], rounds: number, relief?: number) {
  for (let r = 0; r < rounds; r++) {
    for (const monkey of monkeys) {
      for (const item of monkey.items) {
        const value = relief
          ? monkey.operation(item) % relief
          : Math.floor(monkey.operation(item) / 3);
        const hasPassed = monkey.test(value);
        if (hasPassed) {
          monkeys[monkey.pass()].items.push(value);
        } else {
          monkeys[monkey.fail()].items.push(value);
        }
        if (value >= Number.MAX_VALUE) {
          console.log(monkeys);
          throw Error(`Invalid Value after round: ${r}`);
        }
        monkey.inspections++;
      }
      monkey.items = [];
    }
  }
}

function getParser(monkeys: Monkey[], divisors: number[]) {
  return (line: string) => {
    const cleaned = line.trim();
    if (cleaned.startsWith("Monkey")) {
      monkeys.push({
        items: [],
        operation: () => -1,
        test: () => false,
        pass: () => -1,
        fail: () => -1,
        inspections: 0,
      });
      return;
    }

    const current = monkeys[monkeys.length - 1];
    if (cleaned.startsWith(START)) {
      current.items = cleaned
        .replace(START, "")
        .split(", ")
        .map((v) => Number.parseInt(v, 10));
      return;
    }
    if (cleaned.startsWith(OPERATION)) {
      const [left, modifier, right] = cleaned.replace(OPERATION, "").split(" ");
      current.operation = getOperation({ left, modifier, right });
      return;
    }
    if (cleaned.startsWith(TEST)) {
      const divisor = Number.parseInt(cleaned.replace(TEST, ""), 10);
      divisors.push(divisor);
      current.test = (v: number) => v % divisor === 0;
    }
    if (cleaned.startsWith(FAIL)) {
      current.fail = () => Number.parseInt(cleaned.replace(FAIL, ""), 10);
    }
    if (cleaned.startsWith(PASS)) {
      current.pass = () => Number.parseInt(cleaned.replace(PASS, ""), 10);
    }
  };
}

// 90294
async function problemOne() {
  const monkeys: Monkey[] = [];

  await handleLines(DATA_PATH, getParser(monkeys, []));

  runRounds(monkeys, 20);
  const [first, second] = monkeys
    .map(({ inspections }) => inspections)
    .sort((a, b) => b - a);
  console.log("Problem one:", first * second, first, second);
}

async function problemTwo() {
  const monkeys: Monkey[] = [];
  const divisors: number[] = [];

  await handleLines(DATA_PATH, getParser(monkeys, divisors));

  const relief = divisors.reduce((acc, v) => acc * v, 1);
  runRounds(monkeys, 10000, relief);
  console.log(monkeys);
  const [first, second] = monkeys
    .map(({ inspections }) => inspections)
    .sort((a, b) => b - a);
  console.log("Problem two:", first * second, first, second);
}

await problemOne();
await problemTwo();
