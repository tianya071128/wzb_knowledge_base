# Interval and Range Problems

<cite>
**Referenced Files in This Document**
- [435.non-overlapping-intervals.js](file://算法/435.non-overlapping-intervals.js)
- [56.merge-intervals.js](file://算法/56.merge-intervals.js)
- [57.insert-interval.js](file://算法/57.insert-interval.js)
- [729.my-calendar-i.js](file://算法/729.my-calendar-i.js)
- [1353.maximum-number-of-events-that-can-be-attended.js](file://算法/1353.maximum-number-of-events-that-can-be-attended.js)
- [300.longest-increasing-subsequence.js](file://算法/300.longest-increasing-subsequence.js)
- [491.non-decreasing-subsequences.js](file://算法/491.non-decreasing-subsequences.js)
- [873.length-of-longest-fibonacci-subsequence.js](file://算法/873.length-of-longest-fibonacci-subsequence.js)
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
This document focuses on interval-based dynamic programming and greedy problems. It consolidates practical implementations for:
- Interval scheduling and calendar booking
- Merge intervals and insert intervals
- Activity selection and event attendance
- Envelope/Russian doll problems via LIS-like transformations
- Sorting strategies and greedy-DP hybrid approaches
- State definitions for interval relationships and dependency chains
- Advanced techniques for overlapping intervals, weight maximization, and multi-dimensional constraints

The goal is to help you recognize optimal substructure, transform interval problems into LIS-like structures, and apply efficient DP or greedy strategies.

## Project Structure
The repository includes multiple interval and LIS-related implementations under the algorithm directory. The selected files demonstrate classic interval operations and LIS-derived transformations.

```mermaid
graph TB
subgraph "Algorithms"
A["Merge Intervals<br/>56.merge-intervals.js"]
B["Insert Interval<br/>57.insert-interval.js"]
C["Non-overlapping Intervals<br/>435.non-overlapping-intervals.js"]
D["My Calendar I<br/>729.my-calendar-i.js"]
E["Maximum Events Attended<br/>1353.maximum-number-of-events-that-can-be-attended.js"]
F["Longest Increasing Subsequence<br/>300.longest-increasing-subsequence.js"]
G["Non-decreasing Subsequences<br/>491.non-decreasing-subsequences.js"]
H["Length of Longest Fibonacci Subsequence<br/>873.length-of-longest-fibonacci-subsequence.js"]
end
A --> C
B --> A
D --> A
E --> A
F --> G
F --> H
```

**Diagram sources**
- [56.merge-intervals.js:16-40](file://算法/56.merge-intervals.js#L16-L40)
- [57.insert-interval.js:17-45](file://算法/57.insert-interval.js#L17-L45)
- [435.non-overlapping-intervals.js:16-37](file://算法/435.non-overlapping-intervals.js#L16-L37)
- [729.my-calendar-i.js:13-43](file://算法/729.my-calendar-i.js#L13-L43)
- [1353.maximum-number-of-events-that-can-be-attended.js:16-25](file://算法/1353.maximum-number-of-events-that-can-be-attended.js#L16-L25)
- [300.longest-increasing-subsequence.js:16-37](file://算法/300.longest-increasing-subsequence.js#L16-L37)
- [491.non-decreasing-subsequences.js:16-45](file://算法/491.non-decreasing-subsequences.js#L16-L45)
- [873.length-of-longest-fibonacci-subsequence.js:16-38](file://算法/873.length-of-longest-fibonacci-subsequence.js#L16-L38)

**Section sources**
- [56.merge-intervals.js:16-40](file://算法/56.merge-intervals.js#L16-L40)
- [57.insert-interval.js:17-45](file://算法/57.insert-interval.js#L17-L45)
- [435.non-overlapping-intervals.js:16-37](file://算法/435.non-overlapping-intervals.js#L16-L37)
- [729.my-calendar-i.js:13-43](file://算法/729.my-calendar-i.js#L13-L43)
- [1353.maximum-number-of-events-that-can-be-attended.js:16-25](file://算法/1353.maximum-number-of-events-that-can-be-attended.js#L16-L25)
- [300.longest-increasing-subsequence.js:16-37](file://算法/300.longest-increasing-subsequence.js#L16-L37)
- [491.non-decreasing-subsequences.js:16-45](file://算法/491.non-decreasing-subsequences.js#L16-L45)
- [873.length-of-longest-fibonacci-subsequence.js:16-38](file://算法/873.length-of-longest-fibonacci-subsequence.js#L16-L38)

## Core Components
- Merge intervals: Linear scan after sorting by start time; merge overlapping segments.
- Insert interval: Locate insertion position and merge intersecting intervals.
- Non-overlapping intervals: Greedy removal strategy minimizing overlaps by keeping the interval that ends latest.
- Calendar booking: Maintain sorted list and binary-search-like insertion to detect overlap.
- Event attendance: Greedy by end time to maximize count.
- LIS and LIS-like transforms: Recognizing envelopes as LIS over width and height pairs.

Key implementation references:
- Merge intervals: [merge:16-40](file://算法/56.merge-intervals.js#L16-L40)
- Insert interval: [insert:17-45](file://算法/57.insert-interval.js#L17-L45)
- Non-overlapping intervals: [eraseOverlapIntervals:16-37](file://算法/435.non-overlapping-intervals.js#L16-L37)
- Calendar booking: [MyCalendar.book:23-43](file://算法/729.my-calendar-i.js#L23-L43)
- Event attendance: [maxEvents:16-25](file://算法/1353.maximum-number-of-events-that-can-be-attended.js#L16-L25)
- LIS: [lengthOfLIS:16-37](file://算法/300.longest-increasing-subsequence.js#L16-L37)
- Non-decreasing subsequences: [findSubsequences:16-45](file://算法/491.non-decreasing-subsequences.js#L16-L45)
- Fibonacci subsequence: [lenLongestFibSubseq:16-38](file://算法/873.length-of-longest-fibonacci-subsequence.js#L16-L38)

**Section sources**
- [56.merge-intervals.js:16-40](file://算法/56.merge-intervals.js#L16-L40)
- [57.insert-interval.js:17-45](file://算法/57.insert-interval.js#L17-L45)
- [435.non-overlapping-intervals.js:16-37](file://算法/435.non-overlapping-intervals.js#L16-L37)
- [729.my-calendar-i.js:13-43](file://算法/729.my-calendar-i.js#L13-L43)
- [1353.maximum-number-of-events-that-can-be-attended.js:16-25](file://算法/1353.maximum-number-of-events-that-can-be-attended.js#L16-L25)
- [300.longest-increasing-subsequence.js:16-37](file://算法/300.longest-increasing-subsequence.js#L16-L37)
- [491.non-decreasing-subsequences.js:16-45](file://算法/491.non-decreasing-subsequences.js#L16-L45)
- [873.length-of-longest-fibonacci-subsequence.js:16-38](file://算法/873.length-of-longest-fibonacci-subsequence.js#L16-L38)

## Architecture Overview
The interval family shares a common pipeline:
- Normalize intervals (sort by start, then by end when needed)
- Greedy decisions or DP transitions based on ordering
- Optional auxiliary data structures (priority queues, sets, maps)

```mermaid
flowchart TD
Start(["Input Intervals"]) --> Sort["Sort by start time<br/>and tie-break by end"]
Sort --> Decide{"Greedy vs DP?"}
Decide --> |Greedy| GreedyPath["Select next compatible interval<br/>by earliest end or earliest start"]
Decide --> |DP| DPPath["Define state f[i]<br/>transition by previous compatible j"]
GreedyPath --> Output["Result Count/Selection"]
DPPath --> Output
```

[No sources needed since this diagram shows conceptual workflow, not actual code structure]

## Detailed Component Analysis

### Merge Intervals
- Strategy: Sort by start time; iterate and merge when overlap exists.
- Complexity: O(n log n) for sort plus O(n) scan.

```mermaid
flowchart TD
A["Sort intervals by start"] --> B["Initialize current interval"]
B --> C{"Current overlaps with next?"}
C --> |Yes| D["Merge: keep min(start), max(end)"] --> C
C --> |No| E["Add current to result"] --> F["Set current = next"] --> C
C --> |End| G["Add final current"]
```

**Diagram sources**
- [56.merge-intervals.js:16-40](file://算法/56.merge-intervals.js#L16-L40)

**Section sources**
- [56.merge-intervals.js:16-40](file://算法/56.merge-intervals.js#L16-L40)

### Insert Interval
- Strategy: Find insertion index respecting order; merge intersecting intervals greedily.

```mermaid
flowchart TD
A["Locate insert position<br/>before overlap"] --> B{"Overlaps with current?"}
B --> |No| C["Insert new interval"] --> D["Done"]
B --> |Yes| E["Merge with current<br/>update new interval"] --> B
B --> |End| F["Append merged interval"] --> D
```

**Diagram sources**
- [57.insert-interval.js:17-45](file://算法/57.insert-interval.js#L17-L45)

**Section sources**
- [57.insert-interval.js:17-45](file://算法/57.insert-interval.js#L17-L45)

### Non-overlapping Intervals (Removal Minimization)
- Strategy: Greedily keep the interval that ends latest among overlapping candidates.

```mermaid
flowchart TD
A["Sort by start"] --> B["Track rightmost end"]
B --> C{"Current start < rightmost end?"}
C --> |Yes| D["Remove current (increment count)"] --> E["Update rightmost end=min(end, rightmost)"] --> B
C --> |No| F["Keep current"] --> B
B --> G["Return total removed"]
```

**Diagram sources**
- [435.non-overlapping-intervals.js:16-37](file://算法/435.non-overlapping-intervals.js#L16-L37)

**Section sources**
- [435.non-overlapping-intervals.js:16-37](file://算法/435.non-overlapping-intervals.js#L16-L37)

### My Calendar I
- Strategy: Maintain a sorted list; locate insertion point and check neighbors for overlap.

```mermaid
flowchart TD
A["Find index i<br/>where start >= list[i].end"] --> B{"At conflict with list[i]?"}
B --> |Yes| C["Return false"]
B --> |No| D{"End <= list[i].start?"}
D --> |Yes| E["Insert at i"] --> F["Return true"]
D --> |No| B
```

**Diagram sources**
- [729.my-calendar-i.js:23-43](file://算法/729.my-calendar-i.js#L23-L43)

**Section sources**
- [729.my-calendar-i.js:13-43](file://算法/729.my-calendar-i.js#L13-L43)

### Maximum Number of Events That Can Be Attended
- Strategy: Greedy by end time; use a priority queue to track latest end times.

```mermaid
flowchart TD
A["Sort events by start time"] --> B["Initialize day = min start"]
B --> C["Add all events with start <= day to PQ (min-heap by end)"]
C --> D{"Pop outdated (end < day)"}
D --> E["Take earliest-ending event (greedy)"]
E --> F["day = day + 1"] --> B
```

**Diagram sources**
- [1353.maximum-number-of-events-that-can-be-attended.js:16-25](file://算法/1353.maximum-number-of-events-that-can-be-attended.js#L16-L25)

**Section sources**
- [1353.maximum-number-of-events-that-can-be-attended.js:16-25](file://算法/1353.maximum-number-of-events-that-can-be-attended.js#L16-L25)

### LIS and LIS-like Transforms
- Longest Increasing Subsequence: Classic DP with O(n^2) or optimized with patience sorting.
- Non-decreasing subsequences: Backtracking with pruning and deduplication.
- Fibonacci subsequence: Enumerate first two elements and extend while lookup succeeds.

```mermaid
flowchart TD
A["Envelopes problem"] --> B["Sort by width asc,<br/>height desc to break ties"]
B --> C["LIS on heights"]
C --> D["Answer = LIS length"]
```

**Diagram sources**
- [300.longest-increasing-subsequence.js:16-37](file://算法/300.longest-increasing-subsequence.js#L16-L37)
- [491.non-decreasing-subsequences.js:16-45](file://算法/491.non-decreasing-subsequences.js#L16-L45)
- [873.length-of-longest-fibonacci-subsequence.js:16-38](file://算法/873.length-of-longest-fibonacci-subsequence.js#L16-L38)

**Section sources**
- [300.longest-increasing-subsequence.js:16-37](file://算法/300.longest-increasing-subsequence.js#L16-L37)
- [491.non-decreasing-subsequences.js:16-45](file://算法/491.non-decreasing-subsequences.js#L16-L45)
- [873.length-of-longest-fibonacci-subsequence.js:16-38](file://算法/873.length-of-longest-fibonacci-subsequence.js#L16-L38)

## Dependency Analysis
- Merge intervals is foundational for insert and non-overlapping removal.
- Calendar booking relies on ordered storage and neighbor checks.
- Event attendance builds on merge-like ordering and greedy selection.
- LIS-based transforms generalize envelope problems.

```mermaid
graph LR
Merge["Merge Intervals"] --> Insert["Insert Interval"]
Merge --> NonOverlap["Non-overlapping Intervals"]
Merge --> Calendar["My Calendar I"]
Merge --> Events["Maximum Events Attended"]
LIS["LIS"] --> Envelope["Envelope/Russian Doll"]
```

[No sources needed since this diagram shows conceptual relationships, not specific code structure]

## Performance Considerations
- Sorting dominates complexity for most interval problems; ensure O(n log n) sort and linear passes.
- Use greedy strategies when applicable to avoid O(n^2) DP.
- For LIS variants, consider patience sorting or coordinate compression to reduce dimensionality.
- Maintain auxiliary structures (e.g., heaps) carefully to avoid extra overhead.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common pitfalls and remedies:
- Off-by-one errors in interval comparisons (start vs end).
- Incorrect tie-breaking when sorting by start time; consider secondary sort by end.
- For greedy removal, always keep the interval ending latest among conflicts.
- In calendar booking, remember to compare against both predecessor and successor intervals.
- For LIS transforms, ensure stable sorting to break ties correctly (width ascending, height descending).

**Section sources**
- [56.merge-intervals.js:16-40](file://算法/56.merge-intervals.js#L16-L40)
- [57.insert-interval.js:17-45](file://算法/57.insert-interval.js#L17-L45)
- [435.non-overlapping-intervals.js:16-37](file://算法/435.non-overlapping-intervals.js#L16-L37)
- [729.my-calendar-i.js:23-43](file://算法/729.my-calendar-i.js#L23-L43)
- [1353.maximum-number-of-events-that-can-be-attended.js:16-25](file://算法/1353.maximum-number-of-events-that-can-be-attended.js#L16-L25)
- [300.longest-increasing-subsequence.js:16-37](file://算法/300.longest-increasing-subsequence.js#L16-L37)

## Conclusion
Interval and range problems frequently reduce to:
- Ordering and greedy selection (merge, insert, remove overlap, calendar booking, event attendance)
- LIS-like structures (envelope/Russian dolls)
Mastering these patterns and their state definitions enables robust solutions across diverse constraints and objectives.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices
- State definitions:
  - f[i]: LIS ending at i
  - rightmost_end: greedy tracker for non-overlapping removal
  - PQ of ends: greedy event attendance
- Dependency chains:
  - Merge → Insert → Non-overlapping Removal
  - Merge → Calendar Booking
  - Merge → Event Attendance
  - LIS → Envelope/Russian Doll

[No sources needed since this section provides general guidance]