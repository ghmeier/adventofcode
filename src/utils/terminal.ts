import { range } from "lodash";

export default class PaintGrid<T> {
    width: number;
    height: number;
    grid: T[][];
    maxX: number;
    maxY: number;
    stream: NodeJS.WriteStream

    constructor(width: number, height: number, d: T) {
        this.width = width;
        this.height = height;
        this.grid = range(0, height).map(() => range(0, width).map(() => d))
        this.stream = process.stderr;
        this.maxY = Math.min(this.stream.rows - 1, this.height);
        this.maxX = Math.min(this.stream.columns, this.width);
        this.stream.on('resize', () => {
            this.maxY = Math.min(this.stream.rows - 1, this.height);
            this.maxX = Math.min(this.stream.columns, this.width);
            this.flush()
        })
    }

    cursorTo(x: number, y: number) {
        return new Promise<void>((resolve) => this.stream.cursorTo(x, y, resolve))
    }

    clearLine() {
        return new Promise<void>((resolve) => this.stream.clearLine(0, resolve))
    }

    write(s: string) {
        return new Promise<void>((resolve, reject) => this.stream.write(s, (err) => err ? reject(err) : resolve()))
    }

    visible(x: number, y: number) {
        return x >= 0 && x < this.maxX && y >= 0 && y < this.maxY
    }

    async flush() {
        for (let y = 0; y < this.maxY; y++) {
            await this.cursorTo(0, y)
            await this.clearLine()
            await this.write(this.grid[y].slice(0, this.maxX).join(''))
        }
    }


    async update(x: number, y: number, char: T) {
        this.grid[y][x] = char;
        if (!this.visible(x, y)) return;
        await this.cursorTo(x, y)
        await this.write(`${char}`)
    }

    async close() {
        await this.cursorTo(0, this.maxY + 1)
    }
}

