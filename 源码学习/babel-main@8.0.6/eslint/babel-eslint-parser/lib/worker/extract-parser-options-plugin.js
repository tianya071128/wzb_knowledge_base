export default function extractParserOptionsPlugin() {
  return {
    parserOverride(code, opts) {
      return opts;
    }
  };
}