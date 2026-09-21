import { NODE_FIELDS, NODE_PARENT_VALIDATIONS } from "../definitions/index.js";
export default function validate(node, key, val) {
  if (!node) return;
  const fields = NODE_FIELDS[node.type];
  if (!fields) return;
  const field = fields[key];
  validateField(node, key, val, field);
  validateChild(node, key, val);
}
export function validateInternal(field, node, key, val, maybeNode) {
  if (!field?.validate) return;
  if (field.optional && val == null) return;
  field.validate(node, key, val);
  if (maybeNode) {
    const type = val.type;
    if (type == null) return;
    NODE_PARENT_VALIDATIONS[type]?.(node, key, val);
  }
}
export function validateField(node, key, val, field) {
  if (!field?.validate) return;
  if (field.optional && val == null) return;
  field.validate(node, key, val);
}
export function validateChild(node, key, val) {
  const type = val?.type;
  if (type == null) return;
  NODE_PARENT_VALIDATIONS[type]?.(node, key, val);
}