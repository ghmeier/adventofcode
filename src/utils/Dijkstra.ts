import { type Point, onSurroundingCell, ps } from ".";
import MinHeap from "./MinHeap";

export type Candidate = { p: Point, c: number }
export type FindCandidates = (p: Point, cost: number) => Candidate[]

class Dijkstra {
    heap: MinHeap<Point>;
    visited: Set<string>;
    costs: Record<string, number>

    constructor() {
        this.heap = new MinHeap<Point>();
        this.visited = new Set<string>()
        this.costs = {}
    }

    traverse(start: Point, findCandidates: (p: Point, cost: number) => Candidate[], end?: Point) {
        const sKey = ps(start)
        this.heap.set(sKey, 0, start);
        this.costs[sKey] = 0

        while (this.heap.size()) {
            const p = this.heap.pop();
            if (!p) break;
            const key = ps(p);
            if (this.visited.has(key)) continue;

            const cost = this.costs[key];

            const candidates = findCandidates(p, cost)
            for (const candidate of candidates) {
                const nKey = ps(candidate.p)
                if (this.costs[nKey] && candidate.c >= this.costs[nKey]) continue;
                this.costs[nKey] = candidate.c
                this.heap.set(nKey, candidate.c, candidate.p)

            }
            this.visited.add(key);
            if (end && end[0] === p[0] && end[1] === p[1]) break;
        }
    }

    costAt(p: Point): number | null {
        return this.costs[ps(p)] || null
    }
}

export default Dijkstra;
