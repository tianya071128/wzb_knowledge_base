import * as generatorFunctions from "./generators/index.js";
const generatorInfosMap = new Map();
let index = 0;
for (const key of Object.keys(generatorFunctions).sort()) {
  if (key.startsWith("_")) continue;
  generatorInfosMap.set(key, [generatorFunctions[key], index++, undefined]);
}
export { generatorInfosMap };