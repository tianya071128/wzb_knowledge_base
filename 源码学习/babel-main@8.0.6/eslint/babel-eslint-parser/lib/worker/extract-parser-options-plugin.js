export default function extractParserOptionsPlugin() {
  return {
    parserOverride(code, opts) {
      return opts;
    }
  };
}
//# sourceMappingURL=extract-parser-options-plugin.js.map
