import { type Point, ps } from ".";
import MinHeap from "./MinHeap";

export type Candidate = { p: Point; c: number };
export type FindCandidates = (p: Point, cost: number) => Candidate[];

class Dijkstra {
  heap: MinHeap<Point>;
  visited: Set<string>;
  costs: Map<string, number>;

  constructor() {
    this.heap = new MinHeap<Point>();
    this.visited = new Set<string>();
    this.costs = new Map<string, number>();
  }

  traverse(
    start: Point,
    findCandidates: (p: Point, cost: number) => Candidate[],
    end?: Point
  ) {
    const sKey = ps(start);
    this.heap.set(sKey, 0, start);
    this.costs.set(sKey, 0);

    while (this.heap.size()) {
      const p = this.heap.pop();
      if (!p) {
        break;
      }
      const key = ps(p);
      if (this.visited.has(key)) {
        continue;
      }

      const cost = this.costs.get(key);

      const candidates = findCandidates(p, cost);
      for (const candidate of candidates) {
        const nKey = ps(candidate.p);
        const nCost = this.costs.get(nKey);
        if (nCost !== undefined && candidate.c >= nCost) {
          continue;
        }
        this.costs.set(nKey, candidate.c);
        this.heap.set(nKey, candidate.c, candidate.p);
      }
      this.visited.add(key);
      if (end && end[0] === p[0] && end[1] === p[1]) {
        break;
      }
    }
  }

  costAt(p: Point): number | null {
    return this.costs.get(ps(p)) || null;
  }
}

export default Dijkstra;
