class HopcroftKarp {

  constructor(graph) {
    const { left, right, edges } = graph;
    this.left = left;
    this.right = right;
    this.edges = edges;
    this.pairU = new Map();
    this.pairV = new Map();
    this.dist = new Map();
    this.NIL = 0;
    this.queue = [];
  }

  bfs() {
    for (const u of this.left) {
      if (this.pairU.get(u) === this.NIL) {
        this.dist.set(u, 0);
        this.queue.push(u);
      } else {
        this.dist.set(u, Infinity);
      }
    }
    this.dist.set(this.NIL, Infinity);

    while (this.queue.length > 0) {
      const u = this.queue.shift();
      if (this.dist.get(u) < this.dist.get(this.NIL)) {
        for (const v of this.edges.get(u)) {
          if (this.dist.get(this.pairV.get(v)) === Infinity) {
            this.dist.set(this.pairV.get(v), this.dist.get(u) + 1);
            this.queue.push(this.pairV.get(v));
          }
        }
      }
    }
    return this.dist.get(this.NIL) !== Infinity;
  }

  dfs(u) {
    if (u !== this.NIL) {
      for (const v of this.edges.get(u)) {
        if (this.dist.get(this.pairV.get(v)) === this.dist.get(u) + 1) {
          if (this.dfs(this.pairV.get(v))) {
            this.pairV.set(v, u);
            this.pairU.set(u, v);
            return true;
          }
        }
      }
      this.dist.set(u, Infinity);
      return false;
    }
    return true;
  }

  run() {
    for (const u of this.left) {
      this.pairU.set(u, this.NIL);
    }
    for (const v of this.right) {
      this.pairV.set(v, this.NIL);
    }
    let matching = 0;
    while (this.bfs()) {
      for (const u of this.left) {
        if (this.pairU.get(u) === this.NIL) {
          if (this.dfs(u)) {
            matching = matching + 1;
          }
        }
      }
    }
    console.log('matching', matching);
    return {
      pairU: this.pairU,
      pairV: this.pairV
    };
  }

}

module.exports = { HopcroftKarp }