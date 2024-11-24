import { readLines } from "../utils";

type Color = "red" | "green" | "blue";

interface Game {
	id: number;
	tries: [Color, number][][];
}

function parseGame(line: string): Game {
	const [name, details] = line.split(":");
	const tries = details.split(";").map((t) => {
		return t.split(",").map((t) => {
			const [value, color] = t.trim().split(" ");
			return [color as Color, Number.parseInt(value, 10)] as [Color, number];
		});
	});

	return { id: Number.parseInt(name.replace("Game ", ""), 10), tries };
}

async function parseGames(): Promise<Game[]> {
	const lines = await readLines(`${import.meta.dir}/day2.txt`);

	return lines.filter((l) => !!l).map(parseGame);
}

function checkPossibility({ tries }: Game) {
	return tries.every((t) => {
		return t.every(([color, value]) => value <= MAX_CUBES[color]);
	});
}

function findPower({ tries }: Game) {
	const colors = tries.reduce(
		(v, t) => {
			for (const [color, value] of t) {
				v[color].push(value);
			}
			return v;
		},
		{ red: [], green: [], blue: [] } as {
			red: number[];
			green: number[];
			blue: number[];
		},
	);

	return Object.keys(colors).reduce(
		(v, color) => v * Math.max(...colors[color as Color]),
		1,
	);
}

const MAX_CUBES = { red: 12, green: 13, blue: 14 } as const;

async function problemOne() {
	const games = await parseGames();
	const sum = games.filter(checkPossibility).reduce((v, { id }) => v + id, 0);

	console.log(sum);
}

async function problemTwo() {
	const games = await parseGames();

	const sum = games.map(findPower).reduce((v, acc) => v + acc, 0);
	console.log(sum);
}

await problemOne();
await problemTwo();
