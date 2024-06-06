import { svgPathBbox } from "../src";
import { linealCases, pathologicalCases } from "./cases/bbox";

describe("svgPathBbox(d) [Lineal cases]", () => {
  test.each(linealCases)("svgPathBbox(%p) ⇢ %p", (d, bbox) => {
    expect(svgPathBbox(d)).toEqual(bbox);
  });
});

describe("svgPathBbox(d) [Pathological cases]", () => {
  test.each(pathologicalCases)("svgPathBbox(%p) ⇢ %p", (d, bbox) => {
    expect(svgPathBbox(d)).toEqual(bbox);
  });
});
