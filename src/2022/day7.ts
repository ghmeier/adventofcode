import { get } from "lodash";
import { readLines, sum } from "../utils";

const DATA_PATH = `${import.meta.dir}/day7.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day7-calibrate.txt`;

enum CommandName {
	cd = "cd",
	ls = "ls",
}

interface Command {
	cmd: CommandName;
	target: string | null;
}

interface File {
	name: string;
	size: number;
}

interface Directory {
	name: string;
	files: File[];
	directories: { [x: string]: Directory };
}

function parseCommand(line: string): Command | null {
	const parts = line.split(" ");
	if (parts[0] !== "$") return null;

	return {
		cmd: parts[1] as CommandName,
		target: parts[1] === "cd" ? parts[2] : null,
	};
}

function parseListLine(line: string, dir: Directory) {
	const parts = line.split(" ");
	if (parts[0] === "dir") {
		dir.directories[parts[1]] = { name: parts[1], files: [], directories: {} };
	} else {
		dir.files.push({ name: parts[1], size: Number.parseInt(parts[0], 10) });
	}
}

function summarizeDirectorySize(
	directory: Directory,
	parent?: string,
): Record<string, number> {
	let size = directory.files.reduce((t, { size }) => t + size, 0);
	const key = [parent, directory.name].filter((v) => !!v).join(".");
	const subdirectory: Record<string, number> = Object.keys(
		directory.directories,
	).reduce(
		(acc, k) => {
			const sub = summarizeDirectorySize(directory.directories[k], key);
			size += sub[[key, k].join(".")];
			return {
				...acc,
				...sub,
			};
		},
		{} as Record<string, number>,
	);

	return {
		[key]: size,
		...subdirectory,
	};
}

function createFileSystem(lines: string[]): Directory {
	let cwd = [];
	const fileSystem: Directory = { name: "root", files: [], directories: {} };

	for (const line of lines) {
		if (!line) continue;

		const command = parseCommand(line);
		if (command) {
			if (command.cmd === "cd") {
				if (command.target === "/") cwd = [];
				else if (command.target === "..") cwd.pop();
				else cwd.push(command.target);
			}
			continue;
		}

		const directory = cwd.length
			? get(fileSystem.directories, cwd.join(".directories."))
			: fileSystem;
		parseListLine(line, directory);
	}

	return fileSystem;
}

// 1583951
async function problemOne() {
	const lines = await readLines(DATA_PATH);

	const fileSystem = createFileSystem(lines);
	const summary = summarizeDirectorySize(fileSystem);

	console.log(
		"Part one:",
		sum(Object.values(summary).filter((v) => v <= 100000)),
	);
}

// 214171
async function problemTwo() {
	const lines = await readLines(DATA_PATH);

	const fileSystem = createFileSystem(lines);
	const summary = summarizeDirectorySize(fileSystem);

	const currentUnused = 70000000 - summary.root;
	const minDeleteSize = 30000000 - currentUnused;

	const candidates = Object.values(summary).filter((v) => v >= minDeleteSize);

	console.log("Problem two:", Math.min(...candidates));
}

await problemOne();
await problemTwo();
