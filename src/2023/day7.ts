import { readLines, sum } from "../utils";

const DATA_PATH = `${import.meta.dir}/day7.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day7-calibrate.txt`;

enum Matches {
  FIVE_OF_KIND = 6,
  FOUR_OF_KIND = 5,
  FULL_HOUSE = 4,

  THREE_OF_KIND = 3,
  TWO_PAIR = 2,
  PAIR = 1,
  HIGH = 0,
}

interface Hand {
  bid: number;
  cards: string;
  match: Matches | null;
}

const VALUES = {
  A: 14,
  K: 13,
  Q: 12,
  J: 1,
  T: 10,
};

function matchForCounts(counted: Record<string, number>) {
  const groups = Object.values(counted);
  if (groups.length === 1) {
    return Matches.FIVE_OF_KIND;
  }
  if (groups.includes(4)) {
    return Matches.FOUR_OF_KIND;
  }
  if (groups.includes(3)) {
    if (groups.length === 2) {
      return Matches.FULL_HOUSE;
    }
    return Matches.THREE_OF_KIND;
  }
  const pairs = groups.filter((v) => v === 2);
  if (pairs.length === 2) {
    return Matches.TWO_PAIR;
  }
  if (pairs.length === 1) {
    return Matches.PAIR;
  }
  return Matches.HIGH;
}

function resolveMatch(hand: Hand) {
  const counted = Array.from(hand.cards).reduce(
    (acc, v) => {
      if (!acc[v]) {
        acc[v] = 0;
      }
      acc[v] += 1;
      return acc;
    },
    {} as Record<string, number>
  );
  return matchForCounts(counted);
}

function resolveMatchWild(hand: Hand) {
  let counted = Array.from(hand.cards).reduce(
    (acc, v) => {
      if (!acc[v]) {
        acc[v] = 0;
      }
      acc[v] += 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (Object.values(counted).length === 1) {
    return Matches.FIVE_OF_KIND;
  }
  const baseMatch = matchForCounts(counted);
  if (!counted.J) {
    return baseMatch;
  }
  let wilds = 0;
  ({ J: wilds, ...counted } = counted);

  if (baseMatch === Matches.FOUR_OF_KIND || baseMatch === Matches.FULL_HOUSE) {
    return Matches.FIVE_OF_KIND;
  }
  if (baseMatch === Matches.THREE_OF_KIND) {
    if (wilds === 2) {
      return Matches.FIVE_OF_KIND;
    }
    return Matches.FOUR_OF_KIND;
  }
  if (baseMatch === Matches.TWO_PAIR) {
    if (wilds === 2) {
      return Matches.FOUR_OF_KIND;
    }
    return Matches.FULL_HOUSE;
  }
  if (baseMatch === Matches.PAIR) {
    return Matches.THREE_OF_KIND;
  }
  return Matches.PAIR;
}

function sortHands(hands: Hand[]) {
  hands.sort((a, b) => {
    if (a.match === null || b.match === null) {
      return 0;
    }
    if (a.match !== b.match) {
      return a.match - b.match;
    }
    for (let i = 0; i < a.cards.length; i++) {
      if (a.cards[i] === b.cards[i]) {
        continue;
      }
      const aVal = VALUES[a.cards[i]] || Number.parseInt(a.cards[i], 10);
      const bVal = VALUES[b.cards[i]] || Number.parseInt(b.cards[i], 10);
      return aVal - bVal;
    }
  });
}

// 250120186
async function problemOne() {
  const lines = await readLines(DATA_PATH);

  const hands = [];
  for (const line of lines) {
    if (!line) {
      continue;
    }
    const [c, b] = line.split(/\s+/);
    const h: Hand = { bid: Number.parseInt(b, 10), cards: c, match: null };
    h.match = resolveMatch(h);
    hands.push(h);
  }
  sortHands(hands);

  console.log("Problem one:", sum(hands.map(({ bid }, ix) => bid * (ix + 1))));
}

// 250665248
async function problemTwo() {
  const lines = await readLines(DATA_PATH);
  const hands = [];
  for (const line of lines) {
    if (!line) {
      continue;
    }
    const [c, b] = line.split(/\s+/);
    const h: Hand = { bid: Number.parseInt(b, 10), cards: c, match: null };
    h.match = resolveMatchWild(h);
    hands.push(h);
  }
  sortHands(hands);

  console.log("Problem two:", sum(hands.map(({ bid }, ix) => bid * (ix + 1))));
}

await problemOne();
await problemTwo();
