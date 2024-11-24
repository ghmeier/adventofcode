import type { Point } from ".";

class ShoelaceArea {
	sum: Point;
	current: Point;

	constructor(start: Point) {
		this.sum = [0, 0];
		this.current = [...start];
	}

	add(next: Point) {
		this.sum[0] += this.current[0] * next[1];
		this.sum[1] += this.current[1] * next[0];
		this.current = [...next];
	}

	total() {
		return Math.abs(this.sum[0] - this.sum[1]) / 2;
	}
}

export default ShoelaceArea;
