import { GenMapping, maybeAddMapping, setSourceContent, allMappings, toEncodedMap, toDecodedMap } from "@jridgewell/gen-mapping";
import { originalPositionFor, TraceMap } from "@jridgewell/trace-mapping";
export default class SourceMap {
  _map;
  _rawMappings;
  _sourceFileName;
  _lastGenLine = 0;
  _lastSourceLine = 0;
  _lastSourceColumn = 0;
  _inputMap = null;
  constructor(opts, code) {
    const map = this._map = new GenMapping({
      sourceRoot: opts.sourceRoot
    });
    this._sourceFileName = opts.sourceFileName?.replace(/\\/g, "/");
    this._rawMappings = undefined;
    if (opts.inputSourceMap) {
      this._inputMap = new TraceMap(opts.inputSourceMap);
      const resolvedSources = this._inputMap.resolvedSources;
      if (resolvedSources.length) {
        for (let i = 0; i < resolvedSources.length; i++) {
          setSourceContent(map, resolvedSources[i], this._inputMap.sourcesContent?.[i]);
        }
      }
    }
    if (typeof code === "string" && !opts.inputSourceMap) {
      setSourceContent(map, this._sourceFileName, code);
    } else if (typeof code === "object") {
      for (const sourceFileName of Object.keys(code)) {
        setSourceContent(map, sourceFileName.replace(/\\/g, "/"), code[sourceFileName]);
      }
    }
  }
  get() {
    const encoded = toEncodedMap(this._map);
    encoded.ignoreList ??= [];
    return encoded;
  }
  getDecoded() {
    const decoded = toDecodedMap(this._map);
    decoded.ignoreList ??= [];
    return decoded;
  }
  getRawMappings() {
    return this._rawMappings ||= allMappings(this._map);
  }
  mark(generated, generatedIdentifierName, line, column, identifierName, identifierNamePos, filename) {
    this._rawMappings = undefined;
    let originalMapping;
    if (line != null) {
      if (this._inputMap) {
        originalMapping = originalPositionFor(this._inputMap, {
          line,
          column: column
        });
        if (originalMapping.name && (identifierNamePos || identifierName != null && originalMapping.column === column)) {
          identifierName = originalMapping.name;
        } else if (identifierNamePos) {
          const originalIdentifierMapping = originalPositionFor(this._inputMap, identifierNamePos);
          if (originalIdentifierMapping.name) {
            identifierName = originalIdentifierMapping.name;
          }
        }
      } else {
        originalMapping = {
          name: null,
          source: filename?.replace(/\\/g, "/") || this._sourceFileName,
          line: line,
          column: column
        };
      }
    }
    if (identifierName != null && identifierName === generatedIdentifierName) {
      identifierName = null;
    }
    maybeAddMapping(this._map, {
      name: identifierName,
      generated,
      source: originalMapping?.source,
      original: originalMapping
    });
  }
}