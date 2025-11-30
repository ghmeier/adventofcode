import { handleLines, sum } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

type Square = {
  marked: boolean;
  x: number;
  y: number;
};

class Board {
  squares: Record<string, Square>;
  score: Record<string, number>;

  constructor() {
    this.squares = {};
    this.score = {};
  }

  addSquare(key: string, x: number) {
    const line = Math.floor(this.count() / 5);
    this.squares[key] = { x, y: line, marked: false };
  }

  count() {
    return Object.values(this.squares).length;
  }

  isFull() {
    return this.count() === 25;
  }

  mark(key: string) {
    if (!this.squares[key]) {
      return;
    }
    this.squares[key].marked = true;
    this.score = Object.values(this.squares).reduce(
      (acc, square) => {
        if (!square.marked) {
          return acc;
        }
        const xKey = `x:${square.x}`;
        const yKey = `y:${square.y}`;
        if (!acc[xKey]) {
          acc[xKey] = 0;
        }
        acc[xKey] += 1;
        if (!acc[yKey]) {
          acc[yKey] = 0;
        }
        acc[yKey] += 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  bingo() {
    const entries = Object.entries(this.score);
    const entry = entries.find(([_, v]) => v >= 5);
    if (!entry) {
      return false;
    }
    return true;
  }
}

async function fill(file: string) {
  let draw: string[];
  const boards: Board[] = [];

  await handleLines(file, (l) => {
    if (!draw) {
      draw = l.split(",");
      return;
    }

    const newBoard = !boards.length || boards[boards.length - 1].isFull();
    if (newBoard) {
      boards.push(new Board());
    }

    const board = boards[boards.length - 1];
    l.trim()
      .split(/\s+/g)
      .forEach((key, x) => board.addSquare(key, x));
  });

  return { boards, draw };
}

async function problemOne() {
  const { draw, boards } = await fill(DATA_PATH);
  for (let i = 0; i < draw.length; i++) {
    // biome-ignore lint/complexity/noForEach: <explanation>
    boards.forEach((b) => b.mark(draw[i]));

    const winner = boards.find((b) => b.bingo());
    if (winner) {
      const unmarked = Object.entries(winner.squares).map(([v, square]) =>
        square.marked ? 0 : Number.parseInt(v, 10)
      );
      const callValue = Number.parseInt(draw[i], 10);
      console.log("Problem one:", sum(unmarked) * callValue);
      break;
    }
  }
}

async function problemTwo() {
  let { draw, boards } = await fill(DATA_PATH);
  for (let i = 0; i < draw.length; i++) {
    // biome-ignore lint/complexity/noForEach: <explanation>
    boards.forEach((b) => b.mark(draw[i]));

    const winners = boards.filter((b) => b.bingo());
    if (boards.length === 1 && winners.length === 1) {
      const winner = winners[0];
      const unmarked = Object.entries(winner.squares).map(([v, square]) =>
        square.marked ? 0 : Number.parseInt(v, 10)
      );
      const callValue = Number.parseInt(draw[i], 10);
      console.log("Problem two:", sum(unmarked) * callValue);
      break;
    }
    boards = boards.filter((b) => !b.bingo());
  }
}

await problemOne();
await problemTwo();
