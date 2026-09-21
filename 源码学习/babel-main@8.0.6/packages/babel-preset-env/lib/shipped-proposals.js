const proposalPlugins = new Set([]);
const proposalSyntaxPlugins = [];
const pluginSyntaxObject = {};
const pluginSyntaxEntries = Object.keys(pluginSyntaxObject).map(function (key) {
  return [key, pluginSyntaxObject[key]];
});
const pluginSyntaxMap = new Map(pluginSyntaxEntries);
export { proposalPlugins, proposalSyntaxPlugins, pluginSyntaxMap };