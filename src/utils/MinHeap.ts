
class MinHeap<T> {
	heap: string[];
	values: Record<string, T>;
	priorities: Record<string, number>;

	constructor() {
		this.heap = [];
		this.values = {};
		this.priorities = {};
	}

	pop() {
		const k = this.heap[0];
		// Replace the top element with the max to heapify
		this.heap[0] = this.heap[this.heap.length - 1];
		this.heap.pop();

		// Get the value at the key and remove it from the heap
		const value = this.values[k];
		delete this.values[k];
		delete this.priorities[k];

		// Reconstruct the heap.
		this._heapify(0);

		return value;
	}

	peek() {
		return this.values[this.heap[0]];
	}

	size() {
		return this.heap.length;
	}

	set(k: string, p: number, v: T) {
		// If the key exists, remove it from the array to be added on the end.
		const oldP = this.priorities[k];
		this.priorities[k] = p;
		this.values[k] = v;

		if (oldP !== undefined) {
			const ix = this.heap.findIndex((v) => v === k);
			if (p < oldP) this._percolate(ix);
			else if (p > oldP) this._heapify(ix);
		} else {
			this.heap.push(k);
			this._percolate(this.heap.length - 1);
		}
	}

	_parent(ix: number) {
		return Math.floor((ix - 1) / 2);
	}

	_left(ix: number) {
		return 2 * ix + 1;
	}

	_right(ix: number) {
		return 2 * ix + 2;
	}

	_priority(ix: number) {
		return this.priorities[this.heap[ix]];
	}

	_percolate(i: number) {
		let ix = i;
		while (ix > 0 && this._priority(this._parent(ix)) > this._priority(ix)) {
			const pIx = this._parent(ix);
			const pK = this.heap[pIx];
			const k = this.heap[ix];
			// Swap the parent and child
			this.heap[pIx] = k;
			this.heap[ix] = pK;
			ix = pIx;
		}
	}

	_heapify(i: number) {
		// Nothing to do here.
		if (this.heap.length === 1) return;

		const l = this._left(i);
		const r = this._right(i);

		let minIx = i;
		if (l < this.heap.length && this._priority(l) < this._priority(minIx)) {
			minIx = l;
		}
		if (r < this.heap.length && this._priority(r) < this._priority(minIx)) {
			minIx = r;
		}
		// The current index is not the smallest, swap and heapify the subtree.
		if (minIx !== i) {
			const k = this.heap[i];
			this.heap[i] = this.heap[minIx];
			this.heap[minIx] = k;
			this._heapify(minIx);
		}
	}

	validate(ix: number) {
		const l = this._left(ix);
		const r = this._right(ix);
		const levelValid =
			(l >= this.heap.length || this._priority(ix) <= this._priority(l)) &&
			(r >= this.heap.length || this._priority(ix) <= this._priority(r));
		if (!levelValid)
			throw Error(
				`Invariant violated: p: (${this.heap[ix]}/${this._priority(ix)}), l: (${
					this.heap[l]
				}/${this._priority(l)}), r: (${this.heap[r]}/${this._priority(r)})`,
			);
		if (l < this.heap.length) this.validate(l);
		if (r < this.heap.length) this.validate(r);
	}
}

export default MinHeap;
