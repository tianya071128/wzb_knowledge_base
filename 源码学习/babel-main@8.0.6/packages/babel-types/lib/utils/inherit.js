export default function inherit(key, child, parent) {
  if (child && parent) {
    const parentVal = parent[key];
    if (!parentVal) return;
    const childVal = child[key];
    child[key] = Array.from(childVal ? new Set([...childVal, ...parentVal].filter(Boolean)) : parentVal);
  }
}