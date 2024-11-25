import { type Point, handleLines } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

function toCommand(l: string): Point {
    const [command, magnitude] = l.split(" ");

    const m = Number.parseInt(magnitude, 10);
    if (command === "forward") return [m, 0];
    if (command === "down") return [0, m];
    if (command === "up") return [0, -1 * m];
    throw new Error(`Invalid command ${command}.`);
}

async function problemOne() {
    const data: Point[] = [];

    await handleLines(DATA_PATH, (l) => {
        data.push(toCommand(l));
    });

    let x = 0;
    let y = 0;
    for (const d of data) {
        x += d[0];
        y += d[1];
    }

    console.log("Problem one:", x * y);
}

async function problemTwo() {
    let x = 0;
    let y = 0;
    let aim = 0;
    await handleLines(DATA_PATH, (l) => {
        const [command, magnitude] = l.split(" ");

        const m = Number.parseInt(magnitude, 10);
        if (command === "forward") {
            x += m;
            y += m * aim;
        } else if (command === "down") {
            aim += m
        } else if (command === "up") {
            aim -= m
        }
    });

    console.log("Problem two:", x * y);
}

await problemOne();
await problemTwo();
