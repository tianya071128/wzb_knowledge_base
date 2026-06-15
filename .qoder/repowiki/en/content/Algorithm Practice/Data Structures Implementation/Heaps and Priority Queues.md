# Heaps and Priority Queues

<cite>
**Referenced Files in This Document**
- [1046.last-stone-weight.js](file://算法/1046.last-stone-weight.js)
- [1054.distant-barcodes.js](file://算法/1054.distant-barcodes.js)
- [1337.the-k-weakest-rows-in-a-matrix.js](file://算法/1337.the-k-weakest-rows-in-a-matrix.js)
- [23.merge-k-sorted-lists.js](file://算法/23.merge-k-sorted-lists.js)
- [215.kth-largest-element-in-an-array.js](file://算法/215.kth-largest-element-in-an-array.js)
- [703.kth-largest-element-in-a-stream.js](file://算法/703.kth-largest-element-in-a-stream.js)
- [1353.maximum-number-of-events-that-can-be-attended.js](file://算法/1353.maximum-number-of-events-that-can-be-attended.js)
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
10. [Appendices](#appendices)

## Introduction
This document explains heap data structures with a focus on max-heaps and min-heaps, covering heap property maintenance, insertion and extraction via heapify algorithms, and practical applications such as priority queues, heap sort, and k-largest/smallest element problems. It also includes real-world scenarios like median finding, merging k sorted arrays, and event scheduling. Finally, it compares heaps to balanced binary search trees (BSTs) in terms of performance and trade-offs.

## Project Structure
The repository includes several JavaScript implementations that demonstrate heap-based solutions:
- Max-heap with sift-up and sift-down for maintaining heap order
- Priority queue built atop a heap for efficient extract-max and insert
- Applications: last stone weight, k-weakest rows, merging k sorted lists, stream k-th largest, and event scheduling

```mermaid
graph TB
subgraph "Heap Implementations"
HS["Heap (Max-Heap)"]
HS --> SI["siftUp()"]
HS --> SD["siftDown()"]
HS --> PE["peek()"]
HS --> PU["push()"]
HS --> PO["pop()"]
end
subgraph "Applications"
PQ["Priority Queue"]
HK["K-Largest/K-Smallest"]
MK["Merge K Sorted Lists"]
ST["Stone Weight Reduction"]
EV["Event Scheduling"]
end
HS --> PQ
PQ --> HK
PQ --> MK
PQ --> ST
PQ --> EV
```

**Diagram sources**
- [1046.last-stone-weight.js:50-146](file://算法/1046.last-stone-weight.js#L50-L146)
- [1054.distant-barcodes.js:63-149](file://算法/1054.distant-barcodes.js#L63-L149)
- [1337.the-k-weakest-rows-in-a-matrix.js:59-150](file://算法/1337.the-k-weakest-rows-in-a-matrix.js#L59-L150)
- [23.merge-k-sorted-lists.js:66-212](file://算法/23.merge-k-sorted-lists.js#L66-L212)

**Section sources**
- [1046.last-stone-weight.js:50-146](file://算法/1046.last-stone-weight.js#L50-L146)
- [1054.distant-barcodes.js:63-149](file://算法/1054.distant-barcodes.js#L63-L149)
- [1337.the-k-weakest-rows-in-a-matrix.js:59-150](file://算法/1337.the-k-weakest-rows-in-a-matrix.js#L59-L150)
- [23.merge-k-sorted-lists.js:66-212](file://算法/23.merge-k-sorted-lists.js#L66-L212)

## Core Components
- Heap (Max-Heap) with array-backed storage
  - Indexing: parent(i) = floor((i - 1) / 2), left child = 2i + 1, right child = 2i + 2
  - Operations:
    - push(val): append to bottom, siftUp to restore heap property
    - pop(): swap root with bottom, pop, siftDown to restore heap property
    - peek(): return root element
    - size(): number of elements
    - isEmpty(): check emptiness
- Priority Queue built on top of the heap
  - Typical min-heap for priority queues; max-heap used here for demonstration
  - Supports enqueue/dequeue with O(log n) cost

```mermaid
classDiagram
class Heap {
-Array maxHeap
-compareFn
+constructor(nums, compareFn)
+peek()
+push(val)
+pop()
+size()
+isEmpty()
-parent(i)
-left(i)
-right(i)
-swap(i, j)
-siftUp(i)
-siftDown(i)
}
```

**Diagram sources**
- [1046.last-stone-weight.js:50-146](file://算法/1046.last-stone-weight.js#L50-L146)
- [1054.distant-barcodes.js:63-149](file://算法/1054.distant-barcodes.js#L63-L149)
- [1337.the-k-weakest-rows-in-a-matrix.js:59-150](file://算法/1337.the-k-weakest-rows-in-a-matrix.js#L59-L150)
- [23.merge-k-sorted-lists.js:66-212](file://算法/23.merge-k-sorted-lists.js#L66-L212)

**Section sources**
- [1046.last-stone-weight.js:50-146](file://算法/1046.last-stone-weight.js#L50-L146)
- [1054.distant-barcodes.js:63-149](file://算法/1054.distant-barcodes.js#L63-L149)
- [1337.the-k-weakest-rows-in-a-matrix.js:59-150](file://算法/1337.the-k-weakest-rows-in-a-matrix.js#L59-L150)
- [23.merge-k-sorted-lists.js:66-212](file://算法/23.merge-k-sorted-lists.js#L66-L212)

## Architecture Overview
The heap serves as the foundational data structure for multiple higher-level algorithms:
- Priority queue abstraction around heap operations
- K-selection problems solved by maintaining a small heap of size k
- Streaming k-th largest using a bounded heap
- Event scheduling by ordering by deadlines/endpoints

```mermaid
graph LR
A["Input Data"] --> B["Build/Use Heap"]
B --> C["Priority Queue Ops"]
C --> D["K-Largest/Smallest"]
C --> E["Stream K-th Largest"]
C --> F["Merge K Sorted Lists"]
C --> G["Event Scheduling"]
```

**Diagram sources**
- [703.kth-largest-element-in-a-stream.js:1-75](file://算法/703.kth-largest-element-in-a-stream.js#L1-L75)
- [23.merge-k-sorted-lists.js:23-51](file://算法/23.merge-k-sorted-lists.js#L23-L51)
- [1353.maximum-number-of-events-that-can-be-attended.js:1-37](file://算法/1353.maximum-number-of-events-that-can-be-attended.js#L1-L37)

**Section sources**
- [703.kth-largest-element-in-a-stream.js:1-75](file://算法/703.kth-largest-element-in-a-stream.js#L1-L75)
- [23.merge-k-sorted-lists.js:23-51](file://算法/23.merge-k-sorted-lists.js#L23-L51)
- [1353.maximum-number-of-events-that-can-be-attended.js:1-37](file://算法/1353.maximum-number-of-events-that-can-be-attended.js#L1-L37)

## Detailed Component Analysis

### Heap Property Maintenance and Heapify Algorithms
- Sift-Up (heapify-up): after insertion, compare with parent and swap upward until heap property holds
- Sift-Down (heapify-down): after extraction, swap root with last element, then bubble down by swapping with the better child until heap property holds
- Build Heap: iterate from last non-leaf to root, siftDown each node

```mermaid
flowchart TD
Start(["Start siftDown at index i"]) --> Children["Compute left/right children"]
Children --> Choose["Choose target: i or larger of left/right (based on comparator)"]
Choose --> Compare{"target == i?"}
Compare --> |Yes| End(["Stop"])
Compare --> |No| Swap["Swap arr[i] with arr[target]"]
Swap --> Next["i = target"]
Next --> Children
```

**Diagram sources**
- [1046.last-stone-weight.js:140-195](file://算法/1046.last-stone-weight.js#L140-L195)
- [23.merge-k-sorted-lists.js:170-195](file://算法/23.merge-k-sorted-lists.js#L170-L195)

**Section sources**
- [1046.last-stone-weight.js:127-195](file://算法/1046.last-stone-weight.js#L127-L195)
- [23.merge-k-sorted-lists.js:157-195](file://算法/23.merge-k-sorted-lists.js#L157-L195)

### Priority Queue Implementation Using Heaps
- A priority queue supports:
  - Insert with priority
  - Extract-max (or extract-min for min-heap)
  - Peek at highest priority
- Implemented using heap operations:
  - Insert -> push
  - Extract -> pop
  - Peek -> peek

```mermaid
sequenceDiagram
participant Client as "Client"
participant PQ as "PriorityQueue"
participant H as "Heap"
Client->>PQ : insert(priority, item)
PQ->>H : push(item)
H-->>PQ : ok
Client->>PQ : extract()
PQ->>H : pop()
H-->>PQ : maxItem
PQ-->>Client : maxItem
```

**Diagram sources**
- [1046.last-stone-weight.js:91-118](file://算法/1046.last-stone-weight.js#L91-L118)
- [1054.distant-barcodes.js:117-143](file://算法/1054.distant-barcodes.js#L117-L143)

**Section sources**
- [1046.last-stone-weight.js:91-143](file://算法/1046.last-stone-weight.js#L91-L143)
- [1054.distant-barcodes.js:117-143](file://算法/1054.distant-barcodes.js#L117-L143)

### Heap Sort Algorithm
- Build a max-heap from the array
- Repeatedly extract the maximum (root) and place it at the end
- Restore heap property after each extraction
- Time: O(n log n), Space: O(1) in-place

```mermaid
flowchart TD
A["Array"] --> B["Build Max-Heap"]
B --> C["Repeat n times"]
C --> D["Swap root with last element"]
D --> E["Reduce heap size by 1"]
E --> F["siftDown(root)"]
F --> C
C --> G["Sorted Array (descending)"]
```

[No sources needed since this diagram shows conceptual workflow, not actual code structure]

### K-Largest/K-Smallest Elements
- Keep a min-heap of size k for “top-k largest” or a max-heap for “top-k smallest”
- For each new element:
  - If heap size < k, push
  - Else if replacement improves the heap, push/pop
- Time: O(n log k), Space: O(k)

```mermaid
flowchart TD
Start(["For each x in stream"]) --> Check{"size < k?"}
Check --> |Yes| Push["push(x)"]
Check --> |No| Better{"x better than worst?"}
Better --> |Yes| PopPush["pop() then push(x)"]
Better --> |No| Skip["skip"]
Push --> Next(["Next x"])
PopPush --> Next
Skip --> Next
Next --> End(["After processing all x"])
```

**Diagram sources**
- [703.kth-largest-element-in-a-stream.js:28-52](file://算法/703.kth-largest-element-in-a-stream.js#L28-L52)

**Section sources**
- [703.kth-largest-element-in-a-stream.js:1-75](file://算法/703.kth-largest-element-in-a-stream.js#L1-L75)

### Median Finding (Two Heaps)
- Maintain a max-heap for lower half and a min-heap for upper half
- Balance sizes so that either heaps are equal or max-heap has one extra
- Median is either the max of lower half or average of roots

```mermaid
flowchart TD
A["New number x"] --> Decide{"x <= max-heap root?"}
Decide --> |Yes| LPush["push x to lower (max-heap)"]
Decide --> |No| RPush["push x to upper (min-heap)"]
LPush --> BalanceL["balance sizes"]
RPush --> BalanceR["balance sizes"]
BalanceL --> Done(["Ready for median"])
BalanceR --> Done
```

[No sources needed since this diagram shows conceptual workflow, not actual code structure]

### Merge K Sorted Arrays/Lists
- Use a min-heap to track the next smallest candidate from each list
- Initialize heap with the first element from each non-empty list
- Repeat: pop minimum, append to result, push next element from the same list

```mermaid
sequenceDiagram
participant Client as "Client"
participant PQ as "Min-Heap"
participant Lists as "K Sorted Lists"
Client->>PQ : push(first element of each non-empty list)
loop Until PQ empty
PQ-->>Client : min
Client->>Client : append to result
Client->>PQ : push(next element from same list)
end
```

**Diagram sources**
- [23.merge-k-sorted-lists.js:23-51](file://算法/23.merge-k-sorted-lists.js#L23-L51)

**Section sources**
- [23.merge-k-sorted-lists.js:23-51](file://算法/23.merge-k-sorted-lists.js#L23-L51)

### Event Scheduling
- Order events by deadline/end time
- Use a min-heap keyed by end time to greedily pick earliest-ending events first
- Increment current day as events are scheduled

```mermaid
flowchart TD
A["Sort events by start time"] --> B["Initialize min-heap by end time"]
B --> C["day = earliest start"]
C --> D["While heap not empty"]
D --> E{"heap top ends <= day?"}
E --> |Yes| Pick["Schedule event (pop)"]
E --> |No| Advance["Advance day to min(end time, next start)"]
Pick --> D
Advance --> D
```

**Diagram sources**
- [1353.maximum-number-of-events-that-can-be-attended.js:16-25](file://算法/1353.maximum-number-of-events-that-can-be-attended.js#L16-L25)

**Section sources**
- [1353.maximum-number-of-events-that-can-be-attended.js:1-37](file://算法/1353.maximum-number-of-events-that-can-be-attended.js#L1-L37)

### Practical Examples from Repository
- Last Stone Weight: repeatedly extract two heaviest stones, smash, and insert the resulting stone until one remains
- K Weakest Rows: maintain a max-heap of row scores to keep the k weakest rows
- Distant Barcodes: arrange barcodes so no two adjacent positions have the same value using frequency counts and heap ordering
- Stream K-th Largest: maintain a min-heap of size k to support online queries

**Section sources**
- [1046.last-stone-weight.js:1-146](file://算法/1046.last-stone-weight.js#L1-L146)
- [1337.the-k-weakest-rows-in-a-matrix.js:1-150](file://算法/1337.the-k-weakest-rows-in-a-matrix.js#L1-L150)
- [1054.distant-barcodes.js:1-149](file://算法/1054.distant-barcodes.js#L1-L149)
- [703.kth-largest-element-in-a-stream.js:1-75](file://算法/703.kth-largest-element-in-a-stream.js#L1-L75)

## Dependency Analysis
- Heap is the core dependency for all heap-based applications
- Priority queue depends on heap operations
- K-selection and streaming k-th largest depend on heap size constraints
- Merge k sorted lists depends on a comparator to choose the next smallest element
- Event scheduling depends on sorting and a min-heap keyed by end time

```mermaid
graph TB
Heap["Heap (siftUp/siftDown)"] --> PQ["Priority Queue"]
PQ --> KSel["K-Largest/Smallest"]
PQ --> StreamK["Stream K-th Largest"]
PQ --> MergeK["Merge K Sorted Lists"]
PQ --> Events["Event Scheduling"]
```

**Diagram sources**
- [1046.last-stone-weight.js:50-146](file://算法/1046.last-stone-weight.js#L50-L146)
- [23.merge-k-sorted-lists.js:66-212](file://算法/23.merge-k-sorted-lists.js#L66-L212)
- [703.kth-largest-element-in-a-stream.js:1-75](file://算法/703.kth-largest-element-in-a-stream.js#L1-L75)
- [1353.maximum-number-of-events-that-can-be-attended.js:1-37](file://算法/1353.maximum-number-of-events-that-can-be-attended.js#L1-L37)

**Section sources**
- [1046.last-stone-weight.js:50-146](file://算法/1046.last-stone-weight.js#L50-L146)
- [23.merge-k-sorted-lists.js:66-212](file://算法/23.merge-k-sorted-lists.js#L66-L212)
- [703.kth-largest-element-in-a-stream.js:1-75](file://算法/703.kth-largest-element-in-a-stream.js#L1-L75)
- [1353.maximum-number-of-events-that-can-be-attended.js:1-37](file://算法/1353.maximum-number-of-events-that-can-be-attended.js#L1-L37)

## Performance Considerations
- Heap operations:
  - push/pop/peek: O(log n)
  - build heap: O(n)
- K-selection:
  - Min-heap of size k: O(n log k)
- Merge k sorted lists:
  - Heap of size k with n total elements: O(n log k)
- Event scheduling:
  - Sorting + heap: O(n log n)
- Memory:
  - Array-backed heap: contiguous memory, cache-friendly
  - Indexing: parent/children formulas enable O(1) pointer-free navigation
- Comparison with balanced BST:
  - Heaps: simpler, O(log n) ops, no balancing rotations
  - BSTs: ordered traversal, range queries, but more complex to maintain balance

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Off-by-one errors in heap indices:
  - Verify parent/child formulas and boundary checks
- Comparator misuse:
  - Ensure compareFn aligns with intended heap order (max vs min)
- Heap underflow:
  - Guard pop() when heap is empty
- Memory leaks:
  - Avoid retaining references to removed nodes in external structures

**Section sources**
- [1046.last-stone-weight.js:104-118](file://算法/1046.last-stone-weight.js#L104-L118)
- [23.merge-k-sorted-lists.js:128-148](file://算法/23.merge-k-sorted-lists.js#L128-L148)

## Conclusion
Heaps provide an efficient foundation for priority-driven algorithms. With simple array-backed storage and well-defined heapify procedures, they enable fast insertion, extraction, and maintenance of ordering. The repository demonstrates practical applications ranging from streaming analytics to scheduling and merging sorted sequences. While heaps are straightforward and efficient, balanced BSTs offer richer operations like ordered iteration and range queries, making the choice dependent on problem requirements.

## Appendices
- Additional k-largest/smallest references:
  - [215.kth-largest-element-in-an-array.js:1-53](file://算法/215.kth-largest-element-in-an-array.js#L1-L53)

**Section sources**
- [215.kth-largest-element-in-an-array.js:1-53](file://算法/215.kth-largest-element-in-an-array.js#L1-L53)