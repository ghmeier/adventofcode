import { partition } from "lodash";

import { handleLines, sum } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

interface Pattern {
  signals: string[][];
  output: string[][];
}

async function parse(file: string) {
  const patterns: Pattern[] = [];
  await handleLines(file, (l) => {
    const [signalRaw, outputRaw] = l.split(" | ");
    patterns.push({
      signals: signalRaw.split(" ").map((v) => v.split("").sort()),
      output: outputRaw.split(" ").map((v) => v.split("").sort()),
    });
  });
  return patterns;
}

async function problemOne() {
  const patterns = await parse(DATA_PATH);

  let unqiueDigits = 0;
  for (let i = 0; i < patterns.length; i++) {
    const filtered = {
      signals: patterns[i].signals.filter((v) =>
        [1, 4, 7, 8].includes(v.length)
      ),
      output: patterns[i].output.filter((v) => [2, 3, 4, 7].includes(v.length)),
    };

    unqiueDigits += filtered.output.length;
  }
  console.log("Problem one:", unqiueDigits);
}

async function problemTwo() {
  const patterns = await parse(DATA_PATH);

  const results = [];
  for (const pattern of patterns) {
    // For each pattern we want to fill in the signals array - a string that represents
    // that index being displayed on the screen. e.g. signals[7] displays a 7 in the output.
    // In order to do that we also need to figure out the letter for each of the 7 screen
    // segments arrangec like this visually:
    //  000
    // 1   2
    // 1   2
    // 1   2
    //  333
    // 4   5
    // 4   5
    // 4   5
    //  666
    const segments: (string | null)[] = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    const signals: (string[] | null)[] = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];

    // Parse unique digits 1, 4, 7 and 8
    [[signals[1]], pattern.signals] = partition(
      pattern.signals,
      (v) => v.length === 2
    );
    [[signals[4]], pattern.signals] = partition(
      pattern.signals,
      (v) => v.length === 4
    );
    [[signals[7]], pattern.signals] = partition(
      pattern.signals,
      (v) => v.length === 3
    );
    [[signals[8]], pattern.signals] = partition(
      pattern.signals,
      (v) => v.length === 7
    );

    // Segment 0 is present in the signal for 7 but not 1.
    segments[0] = signals[7].find((c) => !signals[1].includes(c)) || null;
    // The signal for 6 has 6 segments and does not inlude all of signal 1.
    [[signals[6]], pattern.signals] = partition(
      pattern.signals,
      (v) => v.length === 6 && !signals[1].every((c) => v.includes(c))
    );
    // Segment 2 is the segment in signal 1 but not 6.
    segments[2] = signals[1].find((c) => !signals[6].includes(c)) || null;
    // Segment 5 is the segment in signal 1 but not 2
    segments[5] = signals[1].find((c) => c !== segments[2]) || null;
    // Signal 3 has 5 segments, 2 of which are unknown (3 and 6)
    [[signals[3]], pattern.signals] = partition(
      pattern.signals,
      (v) =>
        v.length === 5 &&
        v.filter(
          (c) => c !== segments[0] && c !== segments[2] && c !== segments[5]
        ).length === 2
    );
    const fourOverlapThree = signals[4].filter(
      (c) => c !== segments[2] && c !== segments[5]
    );
    const threeOverlapFour = signals[3].filter(
      (c) => c !== segments[2] && c !== segments[5] && c !== segments[0]
    );
    // Segment 3 is the shared unknown segment between signals 3 and 4
    segments[3] =
      fourOverlapThree.find((c) => threeOverlapFour.includes(c)) || null;
    // Segment 6 is the one remaining unknown segment in 3
    segments[6] = signals[3].find((c) => !segments.includes(c)) || null;
    // Segment 1 is the remaining unknown segment in 4
    segments[1] = signals[4].find((c) => !segments.includes(c)) || null;
    // Segment 4 is the remaining unknown segment in 8
    segments[4] = signals[8].find((c) => !segments.includes(c)) || null;
    // We have all the segments, so manually construct and sort the remaining signals.
    signals[2] = [
      segments[0],
      segments[2],
      segments[3],
      segments[4],
      segments[6],
    ].sort();
    signals[0] = [
      segments[0],
      segments[1],
      segments[2],
      segments[4],
      segments[5],
      segments[6],
    ].sort();
    signals[5] = [
      segments[0],
      segments[1],
      segments[3],
      segments[5],
      segments[6],
    ].sort();
    signals[9] = [
      segments[0],
      segments[1],
      segments[2],
      segments[3],
      segments[5],
      segments[6],
    ].sort();

    const sortedSignals = signals.map((v) => v.join(""));
    // Find the output digits. Everything is a sorted string, so an equals comparison is sufficient.
    const digits = pattern.output
      .map((o) => {
        const output = o.join("");
        return sortedSignals.findIndex((v) => v === output).toString();
      })
      .join("");
    results.push(Number.parseInt(digits, 10));
  }

  console.log(results);
  console.log("Problem two:", sum(results));
}

await problemOne();
await problemTwo();
