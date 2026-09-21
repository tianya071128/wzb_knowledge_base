import { PLACEHOLDERS_ALIAS } from "../definitions/index.js";
export default function isPlaceholderType(placeholderType, targetType) {
  if (placeholderType === targetType) return true;
  const aliases = PLACEHOLDERS_ALIAS[placeholderType];
  if (aliases?.includes(targetType)) return true;
  return false;
}