import { TraceMap, eachMapping } from "@jridgewell/trace-mapping";
const CONTEXT_SIZE = 4;
const LOC_SIZE = 12;
const MAX_CONTENT_SIZE = 24;
function simpleCodeFramePoint(lines, line, col) {
  const start = Math.max(col - CONTEXT_SIZE, 0);
  const end = Math.min(col + 1 + CONTEXT_SIZE, lines[line - 1].length);
  const code = lines[line - 1].slice(start, end).trimEnd();
  const loc = `(${line}:${col})`.padStart(LOC_SIZE, " ");
  return loc + " " + code + "\n" + " ".repeat(loc.length + 1 + (col - start)) + "^";
}
function simpleCodeFrameRange(lines, line, colStart, colEnd) {
  colEnd = Math.min(colEnd, lines[line - 1].length);
  const start = Math.max(colStart - CONTEXT_SIZE, 0);
  const end = Math.min(colEnd + CONTEXT_SIZE, lines[line - 1].length);
  const markerSize = colEnd - colStart;
  const marker = markerSize === 0 ? "><" : " " + "^".repeat(markerSize);
  const markerPadding = colStart - start - 1;
  const code = lines[line - 1].slice(start, end);
  const loc = `(${line}:${colStart}-${colEnd}) `.padStart(LOC_SIZE, " ");
  return loc + code + "\n" + " ".repeat(markerPadding + loc.length) + marker;
}
function joinMultiline(left, right, leftLen) {
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");
  leftLen ??= leftLines.reduce((len, line) => Math.max(len, line.length), 0);
  const linesCount = Math.max(leftLines.length, rightLines.length);
  let res = "";
  for (let i = 0; i < linesCount; i++) {
    if (res !== "") res += "\n";
    if (i < leftLines.length) res += leftLines[i].padEnd(leftLen, " ");else res += " ".repeat(leftLen);
    if (i < rightLines.length) res += rightLines[i];
  }
  return res;
}
export default function visualize(output, map) {
  const sourcesLines = new Map(map.sources.map((source, index) => [source, map.sourcesContent[index].split("\n")]));
  const outputLines = output.split("\n");
  const ranges = [];
  let prev = null;
  eachMapping(new TraceMap(map), mapping => {
    if (prev === null) {
      prev = mapping;
      return;
    }
    const original = {
      from: {
        line: prev.originalLine,
        column: prev.originalColumn
      },
      to: {
        line: prev.originalLine,
        column: prev.originalColumn + 1
      }
    };
    const generated = {
      from: {
        line: prev.generatedLine,
        column: prev.generatedColumn
      },
      to: {
        line: prev.generatedLine,
        column: prev.generatedColumn + 1
      }
    };
    if (original.from.line !== original.to.line) {
      original.to.line = original.from.line;
      original.to.column = Infinity;
    } else if (original.to.column < original.from.column) {
      original.to.column = original.from.column;
    }
    if (generated.from.line !== generated.to.line) {
      generated.to.line = generated.from.line;
      generated.to.column = Infinity;
    } else if (generated.to.column < generated.from.column) {
      generated.to.column = generated.from.column;
    }
    ranges.push({
      original,
      generated,
      source: prev.source
    });
    prev = mapping;
  });
  if (prev.originalLine) {
    ranges.push({
      original: {
        from: {
          line: prev.originalLine,
          column: prev.originalColumn
        },
        to: {
          line: prev.originalLine,
          column: prev.originalColumn + 1
        }
      },
      generated: {
        from: {
          line: prev.generatedLine,
          column: prev.generatedColumn
        },
        to: {
          line: prev.generatedLine,
          column: prev.generatedColumn + 1
        }
      },
      source: prev.source
    });
  }
  const res = ranges.map(({
    original,
    generated,
    source
  }) => {
    const input = simpleCodeFramePoint(sourcesLines.get(source), original.from.line, original.from.column);
    const output = simpleCodeFramePoint(outputLines, generated.from.line, generated.from.column);
    return joinMultiline(joinMultiline(input, " <--  ", LOC_SIZE + 1 + MAX_CONTENT_SIZE), output);
  });
  return res.join("\n\n");
}