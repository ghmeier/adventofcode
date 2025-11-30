import { handleLines, onSurroundingCell, type Point } from "../../utils";
import Dijkstra, {
  type Candidate,
  type FindCandidates,
} from "../../utils/Dijkstra";
import PaintGrid from "../../utils/terminal";

// biome-ignore lint/correctness/noUnusedVariables: This is ok
const DATA_PATH = `${import.meta.dir}/data.txt`;
// biome-ignore lint/correctness/noUnusedVariables: This is ok
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

async function problemOne() {
  const limit = 1024;
  const size = 71;
  let bytes = 0;

  const screen = new PaintGrid(size, size, ".");

  await handleLines(DATA_PATH, (l) => {
    if (bytes >= limit) {
      return;
    }
    const p = l.split(",").map(Number) as Point;
    screen.grid[p[1]][p[0]] = "#";

    bytes++;
  });

  const start: Point = [size - 1, size - 1];
  const d = new Dijkstra();
  const findCandidates: FindCandidates = (p, cost) => {
    const points: Candidate[] = [];
    onSurroundingCell(screen.grid, p, (next) => {
      if (screen.grid[next[1]][next[0]] === "#") {
        return;
      }

      points.push({ p: next, c: cost + 1 });
    });
    return points;
  };
  d.traverse(start, findCandidates, [0, 0]);

  console.log("Problem one:", d.costAt([0, 0]));
}

async function problemTwo() {
  const size = 71;
  const bytes: Point[] = [];
  const screen = new PaintGrid(size, size, ".", { debug: false });

  await handleLines(DATA_PATH, (l) => {
    bytes.push(l.split(",").map(Number) as Point);
  });

  await screen.initialize();
  await screen.flush();

  for (let i = 0; i < 1024; i++) {
    const byte = bytes.shift();
    if (!byte) {
      break;
    }
    screen.grid[byte[1]][byte[0]] = "#";
  }

  let lastByte: Point = [-1, -1];
  while (bytes.length) {
    const byte = bytes.shift();
    if (!byte) {
      break;
    }

    await screen.update(byte[0], byte[1], "#");

    const start: Point = [size - 1, size - 1];
    const d = new Dijkstra();
    const findCandidates: FindCandidates = (p, cost) => {
      const points: Candidate[] = [];
      onSurroundingCell(screen.grid, p, (next) => {
        if (screen.grid[next[1]][next[0]] === "#") {
          return;
        }

        points.push({ p: next, c: cost + 1 });
      });
      return points;
    };
    d.traverse(start, findCandidates, [0, 0]);

    if (!d.costAt([0, 0])) {
      lastByte = byte;
      break;
    }
  }
  await screen.cursorTo(size + 1, 0);
  await screen.write(`Result: ${lastByte.join(",")}`);
  await screen.close();
}

// await problemOne();
await problemTwo();
