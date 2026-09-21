export class Position {
  constructor(line, col, index) {
    this.line = undefined;
    this.column = undefined;
    if (index !== undefined) this.index = undefined;
    this.line = line;
    this.column = col;
    if (index !== undefined) this.index = index;
  }
}
export class SourceLocation {
  start;
  end;
  filename;
  identifierName;
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}
export function createPositionWithColumnOffset(position, columnOffset) {
  const {
    line,
    column,
    index
  } = position;
  return new Position(line, column + columnOffset, index + columnOffset);
}