# Basic Graph Algorithms

Graph algorithms form the backbone of graph theory applications. They provide the tools necessary to analyze, navigate, and manipulate graphs efficiently. This section introduces some of the most fundamental graph algorithms, covering their purpose, logic, and common use cases.

---

## 1. Depth-First Search (DFS)

### Overview
DFS is a traversal algorithm that explores as far as possible along a branch before backtracking. It is commonly used to explore all the vertices and edges of a graph.

### Steps
1. Start at the chosen root vertex.
2. Mark the current vertex as visited.
3. Visit all unvisited neighbors of the current vertex recursively.
4. Backtrack when no more unvisited neighbors are left.

### Example
Consider the following graph:



Starting DFS from `A`, the order of traversal is: `A → B → C → E → D`.

### Use Cases
- Detecting cycles in graphs.
- Solving puzzles like mazes.
- Topological sorting in Directed Acyclic Graphs (DAGs).

---

## 2. Breadth-First Search (BFS)

### Overview
BFS explores vertices level by level, moving outward from the root vertex. It uses a queue to keep track of the vertices to visit next.

### Steps
1. Start at the root vertex and enqueue it.
2. Mark the current vertex as visited.
3. Dequeue a vertex and visit all its unvisited neighbors.
4. Repeat until the queue is empty.

### Example
For the same graph:



Starting BFS from `A`, the traversal order is: `A → B → D → C → E`.

### Use Cases
- Finding the shortest path in an unweighted graph.
- Networking (broadcasting or spreading information).
- Connected components identification.

---

## 3. Dijkstra’s Algorithm

### Overview
Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative weights.

### Steps
1. Initialize distances of all vertices as infinity, except the source vertex (set to 0).
2. Use a priority queue to pick the vertex with the smallest distance.
3. Update the distances of its neighbors.
4. Repeat until all vertices are processed.

### Example
For a weighted graph:



Starting from `A`, the shortest paths are:
- `A → B → C`
- `A → D → E`

### Use Cases
- Navigation systems (Google Maps).
- Network routing.
- Resource allocation problems.

---

## 4. Topological Sorting

### Overview
Topological sorting orders vertices in a Directed Acyclic Graph (DAG) such that for every directed edge `(u, v)`, vertex `u` appears before vertex `v`.

### Algorithm
1. Perform DFS on the graph.
2. As each vertex finishes processing, push it onto a stack.
3. Pop vertices from the stack for the topological order.

### Use Cases
- Task scheduling.
- Course prerequisite problems.
- Dependency resolution in package managers.

---

## 5. Kruskal’s Algorithm

### Overview
Kruskal's algorithm finds a Minimum Spanning Tree (MST) for a connected, weighted graph by selecting edges in increasing order of weight.

### Steps
1. Sort all edges by weight.
2. Pick the smallest edge that does not form a cycle with the already selected edges.
3. Repeat until the MST contains `(V - 1)` edges, where `V` is the number of vertices.

### Use Cases
- Network design (cables, pipelines).
- Approximation algorithms for NP-hard problems.
- Cost optimization in connected systems.

---

## 6. Prim’s Algorithm

### Overview
Prim’s algorithm is another MST algorithm, which starts from a vertex and grows the tree by adding the smallest edge connecting the tree to an unvisited vertex.

### Steps
1. Start with any vertex and mark it as part of the MST.
2. Add the smallest edge connecting the tree to the rest of the graph.
3. Repeat until all vertices are included.

### Use Cases
- Similar to Kruskal’s algorithm.
- Wireless networking.

---

## Conclusion

These fundamental algorithms form the basis for solving complex graph-related problems. Understanding their mechanics and applications enables developers and researchers to tackle real-world challenges effectively.
