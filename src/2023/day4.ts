import { range, sumBy } from "lodash";

import { readLines, sum } from "../utils";

const DATA_PATH = `${import.meta.dir}/day4.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day4-calibrate.txt`;

interface Card {
  name: string;
  results: string[];
  card: string[];
  copies: number;
}

function parseCard(line: string): Card {
  const [name, numbers] = line.split(":");
  const [winners, card] = numbers.trim().split("|");
  const winningList = winners
    .trim()
    .split(" ")
    .filter((c) => !!c);
  const cardList = card
    .trim()
    .split(" ")
    .filter((c) => !!c);
  return { name, results: winningList, card: cardList, copies: 1 };
}

function tally({ results, card }: Card) {
  let score = 0;
  for (const c of card) {
    if (!results.includes(c)) {
      continue;
    }
    if (score === 0) {
      score = 1;
    } else {
      score = score * 2;
    }
  }
  return score;
}

function sumWins({ results, card }: Card) {
  return card.filter((c) => results.includes(c)).length;
}

// 32609
async function problemOne() {
  const lines = await readLines(DATA_PATH);

  const scores = [];
  for (const line of lines) {
    if (!line) {
      continue;
    }

    const c = parseCard(line);
    scores.push(tally(c));
  }

  console.log("Problem one:", sum(scores));
}

// 14624680
async function problemTwo() {
  const lines = await readLines(DATA_PATH);

  const cards = [];
  for (const line of lines) {
    if (!line) {
      continue;
    }

    const c = parseCard(line);
    cards.push(c);
  }

  for (const [ix, c] of cards.entries()) {
    const wins = sumWins(c);
    const copyIndex = range(ix + 1, ix + 1 + wins);
    for (const cIx of copyIndex) {
      cards[cIx].copies += c.copies;
    }
  }

  console.log("Problem two:", sumBy(cards, "copies"));
}

await problemOne();
await problemTwo();
