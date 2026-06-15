# Graph Applications and Problems

<cite>
**Referenced Files in This Document**
- [797.all-paths-from-source-to-target.js](file://算法/797.all-paths-from-source-to-target.js)
- [332.reconstruct-itinerary.js](file://算法/332.reconstruct-itinerary.js)
- [399.evaluate-division.js](file://算法/399.evaluate-division.js)
- [743.network-delay-time.js](file://算法/743.network-delay-time.js)
- [1091.shortest-path-in-binary-matrix.js](file://算法/1091.shortest-path-in-binary-matrix.js)
- [133.clone-graph.js](file://算法/133.clone-graph.js)
- [1061.lexicographically-smallest-equivalent-string.js](file://算法/1061.lexicographically-smallest-equivalent-string.js)
- [386.lexicographical-numbers.js](file://算法/386.lexicographical-numbers.js)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document presents advanced graph applications and problem-solving techniques drawn from the repository’s algorithm set. It focuses on:
- Shortest path with obstacles and weighted/unweighted graphs
- Bidirectional search optimization patterns
- A* algorithm foundations and heuristic design
- Constraint satisfaction problems (CSP) and state-space graph construction
- Graph modification techniques, dynamic graph algorithms, and decomposition strategies
- Competitive programming patterns, optimization heuristics, and problem transformation for specific constraints

Where applicable, we map solutions to real implementations present in the repository to illustrate practical techniques.

## Project Structure
The relevant graph-focused implementations are primarily located under the “算法” directory. Representative files include:
- Path enumeration and DFS/backtracking on DAGs
- Graph traversal with memoization and pruning
- BFS shortest path on grids with obstacles
- Graph cloning and equivalence relations
- Lexicographical ordering and union-find-style transformations

```mermaid
graph TB
A["Repository Root"] --> B["算法/"]
B --> C["Path Enumeration<br/>797.all-paths-from-source-to-target.js"]
B --> D["Graph Traversal & Memo<br/>399.evaluate-division.js"]
B --> E["Network Delay (DFS)<br/>743.network-delay-time.js"]
B --> F["Shortest Path Grid<br/>1091.shortest-path-in-binary-matrix.js"]
B --> G["Graph Clone<br/>133.clone-graph.js"]
B --> H["Lexicographic Ordering<br/>386.lexicographical-numbers.js"]
B --> I["Equivalence Transform<br/>1061.lexicographically-smallest-equivalent-string.js"]
```

**Diagram sources**
- [797.all-paths-from-source-to-target.js:16-44](file://算法/797.all-paths-from-source-to-target.js#L16-L44)
- [399.evaluate-division.js:51-91](file://算法/399.evaluate-division.js#L51-L91)
- [743.network-delay-time.js:18-55](file://算法/743.network-delay-time.js#L18-L55)
- [1091.shortest-path-in-binary-matrix.js:16-65](file://算法/1091.shortest-path-in-binary-matrix.js#L16-L65)
- [133.clone-graph.js](file://算法/133.clone-graph.js)
- [386.lexicographical-numbers.js](file://算法/386.lexicographical-numbers.js)
- [1061.lexicographically-smallest-equivalent-string.js](file://算法/1061.lexicographically-smallest-equivalent-string.js)

**Section sources**
- [797.all-paths-from-source-to-target.js:16-44](file://算法/797.all-paths-from-source-to-target.js#L16-L44)
- [399.evaluate-division.js:51-91](file://算法/399.evaluate-division.js#L51-L91)
- [743.network-delay-time.js:18-55](file://算法/743.network-delay-time.js#L18-L55)
- [1091.shortest-path-in-binary-matrix.js:16-65](file://算法/1091.shortest-path-in-binary-matrix.js#L16-L65)
- [133.clone-graph.js](file://算法/133.clone-graph.js)
- [386.lexicographical-numbers.js](file://算法/386.lexicographical-numbers.js)
- [1061.lexicographically-smallest-equivalent-string.js](file://算法/1061.lexicographically-smallest-equivalent-string.js)

## Core Components
- Path enumeration on DAGs via DFS/backtracking with pruning
- Memoized DFS/BFS with state caching and early termination
- BFS shortest path on grids with obstacle constraints
- Graph cloning and traversal with visited/mark structures
- Lexicographical ordering and union-find inspired transformations

Implementation highlights:
- Backtracking on DAGs with pruning at target node
- DFS with memoization and cache keys
- BFS with level-wise expansion and grid marking
- Graph clone using visited map and adjacency traversal
- Equivalence relation transformation and lexicographic ordering

**Section sources**
- [797.all-paths-from-source-to-target.js:16-44](file://算法/797.all-paths-from-source-to-target.js#L16-L44)
- [399.evaluate-division.js:51-91](file://算法/399.evaluate-division.js#L51-L91)
- [1091.shortest-path-in-binary-matrix.js:16-65](file://算法/1091.shortest-path-in-binary-matrix.js#L16-L65)
- [133.clone-graph.js](file://算法/133.clone-graph.js)
- [1061.lexicographically-smallest-equivalent-string.js](file://算法/1061.lexicographically-smallest-equivalent-string.js)

## Architecture Overview
The repository demonstrates several reusable patterns:
- DFS/backtracking with pruning for exhaustive exploration
- Memoized recursion to avoid recomputation
- BFS for shortest path in unweighted or grid graphs
- Graph traversal with visited sets/maps
- Union-find or equivalence-class transformations for lexicographic ordering

```mermaid
graph TB
subgraph "Traversal Patterns"
P1["DFS with Pruning<br/>797"]
P2["Memoized DFS<br/>399"]
P3["BFS Grid Shortest Path<br/>1091"]
P4["Graph Clone<br/>133"]
end
subgraph "Problem Adaptations"
A1["Network Delay (DFS)<br/>743"]
A2["Lexicographic Ordering<br/>386"]
A3["Equivalence Transform<br/>1061"]
end
P1 --> A3
P2 --> A1
P3 --> A1
P4 --> A3
```

**Diagram sources**
- [797.all-paths-from-source-to-target.js:16-44](file://算法/797.all-paths-from-source-to-target.js#L16-L44)
- [399.evaluate-division.js:51-91](file://算法/399.evaluate-division.js#L51-L91)
- [743.network-delay-time.js:18-55](file://算法/743.network-delay-time.js#L18-L55)
- [1091.shortest-path-in-binary-matrix.js:16-65](file://算法/1091.shortest-path-in-binary-matrix.js#L16-L65)
- [133.clone-graph.js](file://算法/133.clone-graph.js)
- [386.lexicographical-numbers.js](file://算法/386.lexicographical-numbers.js)
- [1061.lexicographically-smallest-equivalent-string.js](file://算法/1061.lexicographically-smallest-equivalent-string.js)

## Detailed Component Analysis

### Path Enumeration on DAGs (Backtracking with Pruning)
- Problem: Enumerate all paths from source to target in a DAG
- Technique: DFS/backtracking with pruning when reaching the target
- Key ideas:
  - Append current node to path before exploring neighbors
  - On reaching target, push a copy of the current path to results
  - Pop node after recursion to backtrack
  - Prune when current node equals target to avoid cycles in DAG

```mermaid
flowchart TD
Start(["Start DFS at node i"]) --> CheckTarget{"i == target?"}
CheckTarget --> |Yes| AddPath["Push current path + i to results"]
AddPath --> Return(["Return"])
CheckTarget --> |No| Push["Push i to path"]
Push --> ForEach["For each neighbor j of i"]
ForEach --> Recurse["DFS(j)"]
Recurse --> Pop["Pop i from path"]
Pop --> End(["Return"])
```

**Diagram sources**
- [797.all-paths-from-source-to-target.js:16-44](file://算法/797.all-paths-from-source-to-target.js#L16-L44)

**Section sources**
- [797.all-paths-from-source-to-target.js:16-44](file://算法/797.all-paths-from-source-to-target.js#L16-L44)

### Memoized DFS with Caching (Division Queries on Graph)
- Problem: Evaluate division queries on equations forming a directed weighted graph
- Technique: DFS with memoization keyed by (start, end) pair
- Key ideas:
  - Build adjacency map with weights
  - For each query, DFS from start to end multiplying edge weights
  - Cache results to avoid recomputation
  - Early termination if node not found

```mermaid
sequenceDiagram
participant Caller as "Caller"
participant Graph as "Adjacency Map"
participant DFS as "dfs(start,end)"
participant Cache as "Memo Table"
Caller->>Graph : Build graph from equations
Caller->>DFS : evaluateQueries(queries)
loop For each query (s,e)
DFS->>Cache : lookup(s,e)
alt Found
Cache-->>DFS : value
else Not Found
DFS->>Graph : traverse neighbors
Graph-->>DFS : weight to neighbor
DFS->>DFS : multiply path weights
DFS->>Cache : memoize(s,e)
end
DFS-->>Caller : result or -1
end
```

**Diagram sources**
- [399.evaluate-division.js:51-91](file://算法/399.evaluate-division.js#L51-L91)

**Section sources**
- [399.evaluate-division.js:51-91](file://算法/399.evaluate-division.js#L51-L91)

### Network Delay (DFS with Arrival-Time Tracking)
- Problem: Compute minimum time for signal to reach all nodes from a source
- Technique: DFS with arrival-time pruning
- Key ideas:
  - Track earliest arrival time to each node
  - Skip if current time exceeds known best
  - Traverse neighbors adding edge weights

```mermaid
flowchart TD
S(["Start DFS at K with time 0"]) --> Init["Initialize min_time map"]
Init --> Visit["For each neighbor N with weight W"]
Visit --> NewTime["new_time = min_time + W"]
NewTime --> Better{"new_time < min_time[N]?"}
Better --> |Yes| Update["min_time[N] = new_time"]
Update --> Recurse["DFS(N, new_time)"]
Better --> |No| Skip["Prune"]
Recurse --> Back["Backtrack"]
Skip --> Back
Back --> Done(["Return max(min_time) if all nodes covered else -1"])
```

**Diagram sources**
- [743.network-delay-time.js:18-55](file://算法/743.network-delay-time.js#L18-L55)

**Section sources**
- [743.network-delay-time.js:18-55](file://算法/743.network-delay-time.js#L18-L55)

### Shortest Path in Binary Matrix (BFS with Obstacles)
- Problem: Shortest path in binary matrix with 8-direction moves and blocked cells
- Technique: BFS level-by-level with visited marking
- Key ideas:
  - Enqueue neighbors only if in bounds, unvisited, and cell is 0
  - Mark visited to prevent revisiting
  - Return steps when destination reached

```mermaid
flowchart TD
Start(["Start BFS at (0,0)"]) --> CheckStart{"grid[0][0]==1 or dest blocked?"}
CheckStart --> |Yes| Fail["Return -1"]
CheckStart --> |No| Init["Mark (0,0) visited and enqueue (0,0)"]
Init --> Loop{"Queue not empty?"}
Loop --> |Yes| Expand["Pop all nodes at current level"]
Expand --> ForEach["For each neighbor (i±1,j±1)"]
ForEach --> Valid{"In bounds and grid==0 and not visited?"}
Valid --> |Yes| Mark["Mark visited and enqueue"]
Valid --> |No| Next["Skip"]
Mark --> Loop
Next --> Loop
Loop --> |No| Done["Return -1"]
Done --> Dest{"Reached (n-1,n-1)?"}
Dest --> |Yes| Ans["Return steps"]
Dest --> |No| Loop
```

**Diagram sources**
- [1091.shortest-path-in-binary-matrix.js:16-65](file://算法/1091.shortest-path-in-binary-matrix.js#L16-L65)

**Section sources**
- [1091.shortest-path-in-binary-matrix.js:16-65](file://算法/1091.shortest-path-in-binary-matrix.js#L16-L65)

### Graph Clone (Visited Map and Adjacency Traversal)
- Problem: Clone a connected undirected graph with node values and edges
- Technique: DFS/BFS with visited map storing original-to-cloned node mapping
- Key ideas:
  - Use a visited map to avoid duplication
  - Recursively connect cloned neighbors to cloned node

```mermaid
flowchart TD
Start(["Start DFS on original node"]) --> Seen{"Node in visited?"}
Seen --> |Yes| ReturnClone["Return existing clone"]
Seen --> |No| MakeClone["Create clone node"]
MakeClone --> Map["visited[original] = clone"]
Map --> ForEach["For each neighbor of original"]
ForEach --> Recurse["DFS(neighbor)"]
Recurse --> Link["Attach clone neighbor to clone node"]
Link --> ReturnClone
```

**Diagram sources**
- [133.clone-graph.js](file://算法/133.clone-graph.js)

**Section sources**
- [133.clone-graph.js](file://算法/133.clone-graph.js)

### Lexicographically Smallest Equivalent String (Union-Find Inspired)
- Problem: Given equivalences, find lexicographically smallest representative for each character
- Technique: Union-Find or equivalence-class merge with lexicographic root selection
- Key ideas:
  - Merge equivalent characters into groups
  - Choose smallest character as canonical representative
  - Answer queries by returning canonical of each character

```mermaid
flowchart TD
Build(["Build unions from equivalences"]) --> Union["Union(a,b)"]
Union --> Find["FindRoot(x)"]
Find --> Canonical["Canonical = min of group"]
Canonical --> Answer["Answer queries via FindRoot"]
```

**Diagram sources**
- [1061.lexicographically-smallest-equivalent-string.js](file://算法/1061.lexicographically-smallest-equivalent-string.js)

**Section sources**
- [1061.lexicographically-smallest-equivalent-string.js](file://算法/1061.lexicographically-smallest-equivalent-string.js)

### Lexicographical Numbers (DFS Ordering)
- Problem: Generate numbers 1..n in lexicographical order
- Technique: DFS preorder traversal with digit extension
- Key ideas:
  - Start from 1..9
  - Extend by appending 0..9 while staying within n
  - Collect results in traversal order

```mermaid
flowchart TD
Start(["DFS from 1..9"]) --> Extend["Extend by appending 0..9"]
Extend --> Within{"Value <= n?"}
Within --> |Yes| Add["Add to result"]
Within --> |No| Stop["Prune"]
Add --> Recurse["Recurse on new value"]
Recurse --> Extend
Stop --> Extend
```

**Diagram sources**
- [386.lexicographical-numbers.js](file://算法/386.lexicographical-numbers.js)

**Section sources**
- [386.lexicographical-numbers.js](file://算法/386.lexicographical-numbers.js)

## Dependency Analysis
- Path enumeration depends on adjacency representation and recursion stack
- Memoized DFS relies on adjacency map and cache structure
- BFS shortest path depends on queue and visited marking
- Graph clone depends on visited map and adjacency traversal
- Equivalence transforms depend on union operations and canonical selection

```mermaid
graph LR
Adj["Adjacency Map"] --> DFS["DFS/Memo"]
Adj --> BFS["BFS Grid"]
Visited["Visited Map/Set"] --> DFS
Visited --> BFS
Visited --> Clone["Graph Clone"]
Equiv["Union Operations"] --> Lex["Lexicographic Ordering"]
```

**Diagram sources**
- [399.evaluate-division.js:51-91](file://算法/399.evaluate-division.js#L51-L91)
- [1091.shortest-path-in-binary-matrix.js:16-65](file://算法/1091.shortest-path-in-binary-matrix.js#L16-L65)
- [133.clone-graph.js](file://算法/133.clone-graph.js)
- [1061.lexicographically-smallest-equivalent-string.js](file://算法/1061.lexicographically-smallest-equivalent-string.js)

**Section sources**
- [399.evaluate-division.js:51-91](file://算法/399.evaluate-division.js#L51-L91)
- [1091.shortest-path-in-binary-matrix.js:16-65](file://算法/1091.shortest-path-in-binary-matrix.js#L16-L65)
- [133.clone-graph.js](file://算法/133.clone-graph.js)
- [1061.lexicographically-smallest-equivalent-string.js](file://算法/1061.lexicographically-smallest-equivalent-string.js)

## Performance Considerations
- DFS/backtracking pruning: Stop early upon reaching target to reduce branching
- Memoization: Cache results keyed by (start, end) to avoid recomputation
- BFS level-order: Guarantees shortest path in unweighted graphs; mark visited to prevent redundant work
- Graph clone: Use visited map to avoid duplicating nodes
- Union-Find: Keep roots minimal to reduce query cost

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common pitfalls and remedies:
- DFS without pruning: Excessive recomputation; add pruning at target or visited checks
- Missing cache keys: Incorrect memoization; ensure composite keys (e.g., (start, end))
- BFS visited misuse: Over-marking or missing marking leads to timeouts or wrong answers
- Graph clone not handling cycles: Ensure visited map keyed by original node identity
- Union-Find without canonical selection: Incorrect representatives; choose minimal character as root

**Section sources**
- [797.all-paths-from-source-to-target.js:16-44](file://算法/797.all-paths-from-source-to-target.js#L16-L44)
- [399.evaluate-division.js:51-91](file://算法/399.evaluate-division.js#L51-L91)
- [1091.shortest-path-in-binary-matrix.js:16-65](file://算法/1091.shortest-path-in-binary-matrix.js#L16-L65)
- [133.clone-graph.js](file://算法/133.clone-graph.js)
- [1061.lexicographically-smallest-equivalent-string.js](file://算法/1061.lexicographically-smallest-equivalent-string.js)

## Conclusion
The repository showcases robust graph techniques:
- DFS/backtracking with pruning for exhaustive exploration
- Memoized recursion for efficient query evaluation
- BFS for shortest path in grids and unweighted graphs
- Graph cloning and equivalence transformations for advanced problem modeling

These patterns generalize to competitive programming and real-world systems requiring efficient graph traversal, shortest path computation, and state-space reasoning.