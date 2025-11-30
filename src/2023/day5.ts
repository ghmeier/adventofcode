import { flattenDeep } from "lodash";

import { readLines, splitWhitespace } from "../utils";

const DATA_PATH = `${import.meta.dir}/day5.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day5-calibrate.txt`;

type Range = [number, number];
type SeedMapping = { src: number[]; dest: number[] }[];

function parseSeeds(line: string) {
  return line
    .replace("seeds: ", "")
    .split(/\s+/)
    .map((v) => Number.parseInt(v, 10));
}

function parseSeedRange(line: string) {
  const ranges = line
    .replace("seeds: ", "")
    .split(/\s+/)
    .map((v) => Number.parseInt(v, 10));
  const seeds: Range[] = [];
  for (let ix = 0; ix < ranges.length; ix += 2) {
    seeds.push([ranges[ix], ranges[ix] + ranges[ix + 1] - 1]);
  }

  return seeds;
}

function parseMappings<T extends number | Range>(
  lines: string[],
  parseSeeds: (line: string) => T[]
) {
  let seeds: T[] = [];
  const mappings: SeedMapping[] = [];
  for (const line of lines) {
    if (!line) {
      continue;
    }
    if (line.includes("seeds: ")) {
      seeds = parseSeeds(line);
      continue;
    }
    if (line.includes(" map:")) {
      mappings.push([]);
      continue;
    }
    const [dest, src, size] = splitWhitespace(line).map((v) =>
      Number.parseInt(v, 10)
    );

    mappings[mappings.length - 1].push({
      src: [src, src + size - 1],
      dest: [dest, dest + size - 1],
    });
  }
  for (const mapping of mappings) {
    mapping.sort(({ src }) => -src[0]);
  }

  return { mappings, seeds };
}

function translateRange(mappings: SeedMapping[], seedRange: Range) {
  let translated: Range[] = [[...seedRange]];
  for (const mapping of mappings) {
    translated = translated.reduce((acc, r) => {
      let start = r[0];
      let end = r[1];
      for (const { src, dest } of mapping) {
        // The start is within the current mapping range
        const diff = dest[0] - src[0];
        if (src[0] <= start && start <= src[1]) {
          const translatedStart = start + diff;
          // If the end is less than the range end, the entire range is contained and we can return.
          if (end <= src[1]) {
            acc.push([translatedStart, end + diff]);
            return acc;
          }

          // Otherwise, this is a partial range and we must continue with a new start point after the current range.
          acc.push([translatedStart, dest[1]]);
          start = src[1] + 1;
          // The start is _not_ in the current mapping range but the end is.
        } else if (src[0] <= end && end <= src[1]) {
          acc.push([dest[0], src[0] + diff]);
          end = src[0] - 1;
        }
      }
      acc.push([start, end]);
      return acc;
    }, [] as Range[]);
  }
  return translated;
}

function findDestinations(mappings: SeedMapping[], seeds: number[]) {
  let min = null;
  for (const seed of seeds) {
    let current = seed;
    for (const mapping of mappings) {
      const mapRange = mapping.find(
        ({ src }) => src[0] <= current && current < src[1]
      );
      if (mapRange) {
        const diff = current - mapRange.src[0];
        current = mapRange.dest[0] + diff;
      }
    }
    if (!min || current < min) {
      min = current;
    }
  }
  return min;
}

// 510109797
async function problemOne() {
  const lines = await readLines(DATA_PATH);

  const { mappings, seeds } = parseMappings(lines, parseSeeds);

  const final = findDestinations(mappings, seeds);
  console.log("Problem one:", final);
}

// 9622622
async function problemTwo() {
  const lines = await readLines(DATA_PATH);

  const { mappings, seeds } = parseMappings(lines, parseSeedRange);
  const final = flattenDeep(
    seeds.map((seedRange) => translateRange(mappings, seedRange))
  );
  console.log("Problem two:", Math.min(...final));
}

await problemOne();
await problemTwo();
