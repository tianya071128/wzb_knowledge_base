import { isRequired } from "@babel/helper-compilation-targets";
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
const isRequiredOptions = {
  compatData: {
    webIMR: {
      chrome: "105.0.0",
      edge: "105.0.0",
      firefox: "106.0.0",
      opera: "91.0.0",
      safari: "16.4.0",
      opera_mobile: "72.0.0",
      ios: "16.4.0",
      samsung: "20.0",
      deno: "1.24.0"
    },
    nodeIMR: {
      node: "20.6.0"
    },
    nodeFSP: {
      node: "10.0.0"
    }
  }
};
const SUPPORT_CACHE = new WeakMap();
export default function getSupport(targets) {
  if (SUPPORT_CACHE.has(targets)) return SUPPORT_CACHE.get(targets);
  const {
    node: nodeTarget,
    ...webTargets
  } = targets;
  const emptyNodeTarget = nodeTarget == null;
  const emptyWebTargets = isEmpty(webTargets);
  const needsNodeSupport = !emptyNodeTarget || emptyWebTargets;
  const needsWebSupport = !emptyWebTargets || emptyNodeTarget;
  const webSupportsIMR = !emptyWebTargets && !isRequired("webIMR", webTargets, isRequiredOptions);
  const nodeSupportsIMR = !emptyNodeTarget && !isRequired("nodeIMR", {
    node: nodeTarget
  }, isRequiredOptions);
  const nodeSupportsFsPromises = !emptyNodeTarget && !isRequired("nodeFSP", {
    node: nodeTarget
  }, isRequiredOptions);
  const result = {
    needsNodeSupport,
    needsWebSupport,
    nodeSupportsIMR,
    webSupportsIMR,
    nodeSupportsFsPromises
  };
  SUPPORT_CACHE.set(targets, result);
  return result;
}