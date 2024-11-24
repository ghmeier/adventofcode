import { range } from "lodash";
import { Point, dumpGrid, handleLines, ps, sum } from "../utils";
import intersects from "intersects";
import { intersect } from "mathjs";
const DATA_PATH = `${import.meta.dir}/day24.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/day24-calibrate.txt`;

// 16812
async function problemOne() {
	const stones: { p: number[]; m: number; b: number }[] = [];
	await handleLines(DATA_PATH, (line) => {
		const [pos, mag] = line.split(" @ ");
		const [x, y] = pos.split(", ").map((v) => parseInt(v, 10));
		const [mx, my] = mag.split(", ").map((v) => parseInt(v, 10));
		const [x2, y2] = [x + mx, y + my];
		const m = (y2 - y) / (x2 - x);

		const b = y - m * x;
		stones.push({
			p: [x, y],
			m,
			b,
			mag: [mx, my],
		});
	});
	const bounds = [-1000000000000000, 1000000000000000];
	const threshold = [200000000000000, 400000000000000];
	const found = {};
	for (const s of stones) {
		const k = ps(s.p);
		const intersections = stones.some((s1) => {
			const k1 = ps(s1.p);
			if (found[`${k},${k1}`]) return false;

			if (s.p[0] === s1.p[0] && s.p[1] === s1.p[1]) return false;
			const start = [s.p[0], s.m * s.p[0] + s.b];
			const end = [bounds[1], s.m * bounds[1] + s.b];
			const start1 = [s.p[0], s1.m * s.p[0] + s1.b];
			const end1 = [bounds[1], s1.m * bounds[1] + s1.b];
			const ip = intersect(
				[start[0], start[1]],
				[end[0], end[1]],
				[start1[0], start1[1]],
				[end1[0], end1[1]],
			);

			if (!ip) return false;
			const inBounds =
				ip[0] >= threshold[0] &&
				ip[0] <= threshold[1] &&
				ip[1] >= threshold[0] &&
				ip[1] <= threshold[1];
			if (!inBounds) return false;

			const u =
				(s.p[1] * s1.mag[0] +
					s1.mag[1] * s1.p[0] -
					s1.p[1] * s1.mag[0] -
					s1.mag[1] * s.p[0]) /
				(s.mag[0] * s1.mag[1] - s.mag[1] * s1.mag[0]);
			const v = (s.p[0] + s.mag[0] * u - s1.p[0]) / s1.mag[0];
			if (u <= 0 || v <= 0) return false;
			found[`${k},${k1}`] = true;
			found[`${k1},${k}`] = true;
		});
	}

	console.log("Problem one:", Object.keys(found).length / 2);
}

await problemOne();
