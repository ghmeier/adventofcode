import { readLines } from "../utils";

async function problemOne() {
  const lines = await readLines(`${import.meta.dir}/day1.txt`);
  let total = 0;
  for (const line of lines) {
    const digits = line
      .match(/\D+/)
      ?.filter((v) => !!v)
      .join("");
    if (!digits?.length) {
      continue;
    }

    const value = Number.parseInt(
      `${digits[0]}${digits[digits.length - 1]}`,
      10
    );
    total += value;
  }

  console.log(total);
}

const NAME_TO_DIGIT: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function parseDigit(text: string): string {
  return NAME_TO_DIGIT[text] || text;
}

async function problemTwo() {
  const lines = await readLines(`${import.meta.dir}/day1.txt`);
  let sum = 0;
  for (const line of lines) {
    if (!line) {
      continue;
    }

    const [first] = line.match(
      /\d|one|two|three|four|five|six|seven|eight|nine/
    ) as string[];
    const [last] = [...line]
      .reverse()
      .join("")
      .match(/\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/) as string[];
    const digits = [
      parseDigit(first),
      parseDigit([...last].reverse().join("")),
    ];

    const value = Number.parseInt(digits.join(""), 10);
    sum += value;
  }
  console.log(sum);
}

await problemOne();
await problemTwo();
