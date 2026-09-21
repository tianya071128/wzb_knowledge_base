let pathsCache = new WeakMap();
export { pathsCache as path };
export let scope = new WeakMap();
export function clear() {
  clearPath();
  clearScope();
}
export function clearPath() {
  pathsCache = new WeakMap();
}
export function clearScope() {
  scope = new WeakMap();
}
export function getCachedPaths(path) {
  const {
    parent,
    parentPath
  } = path;
  return parentPath ? parentPath._store : pathsCache.get(parent);
}
export function getOrCreateCachedPaths(node, parentPath) {
  if (parentPath) {
    return parentPath._store ||= new Map();
  }
  let paths = pathsCache.get(node);
  if (!paths) pathsCache.set(node, paths = new Map());
  return paths;
}