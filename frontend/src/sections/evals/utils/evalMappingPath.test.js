import { describe, it, expect } from "vitest";
import {
  INVALID_MAPPING_LABEL,
  isMappingPath,
  mappingChipLabel,
  mappingPathLabel,
} from "./evalMappingPath";

describe("isMappingPath", () => {
  it("accepts an attribute path string", () => {
    expect(isMappingPath("output.value")).toBe(true);
    expect(isMappingPath("input")).toBe(true);
  });

  it("rejects the object and array shapes a saved mapping can carry", () => {
    expect(isMappingPath({ value: "output.value" })).toBe(false);
    expect(isMappingPath(["output", "value"])).toBe(false);
    expect(isMappingPath(42)).toBe(false);
    expect(isMappingPath(true)).toBe(false);
  });

  it("rejects unset and empty values", () => {
    expect(isMappingPath(null)).toBe(false);
    expect(isMappingPath(undefined)).toBe(false);
    expect(isMappingPath("")).toBe(false);
  });
});

describe("mappingPathLabel", () => {
  it("returns the path itself for an attribute path string", () => {
    expect(mappingPathLabel("output.value")).toBe("output.value");
  });

  it("returns a string label instead of the value for a non-string mapping", () => {
    const label = mappingPathLabel({ value: "output.value" });
    expect(typeof label).toBe("string");
    expect(label).toBe(INVALID_MAPPING_LABEL);
    expect(mappingPathLabel(["output", "value"])).toBe(INVALID_MAPPING_LABEL);
    expect(mappingPathLabel(42)).toBe(INVALID_MAPPING_LABEL);
  });

  it("returns an empty label for an unmapped variable", () => {
    expect(mappingPathLabel(null)).toBe("");
    expect(mappingPathLabel(undefined)).toBe("");
    expect(mappingPathLabel("")).toBe("");
  });
});

describe("mappingChipLabel", () => {
  it("renders the variable and its attribute path", () => {
    expect(mappingChipLabel("input", "output.value")).toBe(
      "input → output.value",
    );
  });

  it("never stringifies a non-string mapping into the chip", () => {
    const label = mappingChipLabel("input", { value: "output.value" });
    expect(label).toBe(`input → ${INVALID_MAPPING_LABEL}`);
    expect(label).not.toContain("[object Object]");
  });

  it("renders a bare variable for an unmapped value", () => {
    expect(mappingChipLabel("input", null)).toBe("input → ");
  });
});
