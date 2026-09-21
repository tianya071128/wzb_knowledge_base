import { getInclusionReasons } from "@babel/helper-compilation-targets";
export const logPlugin = (item, targetVersions, list) => {
  const filteredList = getInclusionReasons(item, targetVersions, list);
  const support = list[item];
  if (!support) {
    console.log(`  ${item}`);
    return;
  }
  let formattedTargets = `{`;
  let first = true;
  for (const target of Object.keys(filteredList)) {
    if (!first) formattedTargets += `,`;
    first = false;
    formattedTargets += ` ${target}`;
    if (support[target]) formattedTargets += ` < ${support[target]}`;
  }
  formattedTargets += ` }`;
  console.log(`  ${item} ${formattedTargets}`);
};