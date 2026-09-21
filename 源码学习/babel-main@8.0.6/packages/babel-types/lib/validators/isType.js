import { FLIPPED_ALIAS_KEYS, ALIAS_KEYS } from "../definitions/index.js";
export default function isType(nodeType, targetType) {
  if (nodeType === targetType) return true;
  if (nodeType == null) return false;
  if (ALIAS_KEYS[targetType]) return false;
  const aliases = FLIPPED_ALIAS_KEYS[targetType];
  if (aliases?.includes(nodeType)) return true;
  return false;
}