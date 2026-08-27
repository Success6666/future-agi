// An eval mapping value is an attribute path. A non-string reaches neither a
// path walker nor a React child, so both questions are answered here only.
export const INVALID_MAPPING_LABEL = "invalid mapping";

export function isMappingPath(value) {
  return typeof value === "string" && value !== "";
}

export function mappingPathLabel(value) {
  if (isMappingPath(value)) return value;
  return value == null || value === "" ? "" : INVALID_MAPPING_LABEL;
}

export function mappingChipLabel(key, value) {
  return `${key} → ${mappingPathLabel(value)}`;
}
