import pirates from "pirates";
import sourceMapSupport from "@cspotcode/source-map-support";
let piratesRevert;
const maps = Object.create(null);
let sourceMapSupportInstalled = false;
function installSourceMapSupport() {
  if (sourceMapSupportInstalled) return;
  sourceMapSupport.install({
    handleUncaughtExceptions: false,
    environment: "node",
    retrieveSourceMap(filename) {
      const map = maps?.[filename];
      if (map) {
        return {
          url: null,
          map: map
        };
      } else {
        return null;
      }
    }
  });
  sourceMapSupportInstalled = true;
}
function compile(client, inputCode, filename) {
  const result = client.transform(inputCode, filename);
  if (result == null) return inputCode;
  const {
    code,
    map
  } = result;
  if (map) {
    maps[filename] = map;
    installSourceMapSupport();
  }
  return code;
}
function register(client, opts = {}) {
  if (piratesRevert) piratesRevert();
  piratesRevert = pirates.addHook(compile.bind(null, client), {
    exts: opts.extensions ?? client.getDefaultExtensions(),
    ignoreNodeModules: false,
    matcher(filename) {
      return !client.isFileIgnored(filename);
    }
  });
  client.setOptions(opts);
}
function revert() {
  if (piratesRevert) piratesRevert();
  if (sourceMapSupportInstalled) {
    sourceMapSupport.uninstall();
    sourceMapSupportInstalled = false;
  }
}
export { register, revert };