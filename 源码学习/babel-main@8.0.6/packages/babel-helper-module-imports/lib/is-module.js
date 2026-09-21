export default function isModule(path) {
  return path.node.sourceType === "module";
}