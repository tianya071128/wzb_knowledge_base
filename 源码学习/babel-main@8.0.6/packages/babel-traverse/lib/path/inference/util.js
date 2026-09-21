import * as _t from "@babel/types";
const {
  createFlowUnionType,
  createTSUnionType,
  isFlowType,
  isTSType
} = _t;
export function createUnionType(types) {
  if (types.every(v => isFlowType(v))) {
    return createFlowUnionType(types);
  }
  if (types.every(v => isTSType(v))) {
    return createTSUnionType(types);
  }
}