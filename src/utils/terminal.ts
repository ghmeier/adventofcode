import { range } from "lodash";

import { dumpGrid } from ".";

export default class PaintGrid<T> {
  width: number;
  height: number;
  grid: T[][];
  maxX: number;
  maxY: number;
  stream: NodeJS.WriteStream;
  debug: boolean;
  delay: number;

  constructor(
    width: number,
    height: number,
    d: T,
    options?: { delay?: number; debug?: boolean }
  ) {
    this.width = width;
    this.height = height;
    this.grid = range(0, height).map(() => range(0, width).map(() => d));
    this.stream = process.stderr;
    this.maxY = Math.min(this.stream.rows - 1, this.height);
    this.maxX = Math.min(this.stream.columns, this.width);
    this.debug = options?.debug || false;
    this.delay = options?.delay || 50;
    this.stream.on("resize", () => {
      this.maxY = Math.min(this.stream.rows - 1, this.height);
      this.maxX = Math.min(this.stream.columns, this.width);
      this.flush();
    });
  }

  async initialize() {
    if (this.debug) {
      return;
    }
    for (let y = 0; y < this.maxY; y++) {
      await this.clearLine(y);
    }
  }

  async cursorTo(x: number, y: number) {
    if (this.debug) {
      return;
    }
    return new Promise<void>((resolve) => this.stream.cursorTo(x, y, resolve));
  }

  async clearLine(y: number) {
    if (this.debug) {
      return;
    }

    await this.cursorTo(0, y);
    return new Promise<void>((resolve) => this.stream.clearLine(0, resolve));
  }

  async write(s: string) {
    if (this.debug) {
      console.log(s);
      return;
    }
    return new Promise<void>((resolve, reject) =>
      this.stream.write(s, (err) => (err ? reject(err) : resolve()))
    );
  }

  visible(x: number, y: number) {
    return x >= 0 && x < this.maxX && y >= 0 && y < this.maxY;
  }

  async flush() {
    if (this.debug) {
      dumpGrid(this.grid);
      return;
    }
    for (let y = 0; y < this.maxY; y++) {
      await this.clearLine(y);
      await this.write(this.grid[y].slice(0, this.maxX).join(""));
    }
  }

  async tick() {
    if (this.debug) {
      return;
    }
    return new Promise<void>((resolve) =>
      setTimeout(() => resolve(), this.delay)
    );
  }

  async update(x: number, y: number, char: T) {
    this.grid[y][x] = char;
    if (!this.visible(x, y)) {
      return;
    }
    if (this.debug) {
      dumpGrid(this.grid);
      console.log("");
      return;
    }
    await this.cursorTo(x, y);
    await this.write(`${char}`);
  }

  async close() {
    await this.cursorTo(0, this.maxY + 1);
  }
}
