import { svgPathBbox } from "../src";
import * as SvgPath from "svgpath";
import { linealCases, pathologicalCases } from "./cases/bbox";

describe("svgPathBbox(d) [Lineal cases]", () => {
  test.each(linealCases)("svgPathBbox(%p) ⇢ %p", (d, bbox) => {
    expect(svgPathBbox(d)).toEqual(bbox);
  });
});

describe("svgPathBbox(SvgPath(d)) [Lineal cases]", () => {
  test.each(linealCases)("svgPathBbox(SvgPath(%p)) ⇢ %p", (d, bbox) => {
    expect(svgPathBbox(new SvgPath(d))).toEqual(bbox);
  });
});

describe("svgPathBbox(d) [Pathological cases]", () => {
  test.each(pathologicalCases)("svgPathBbox(%p) ⇢ %p", (d, bbox) => {
    expect(svgPathBbox(d)).toEqual(bbox);
  });
});

describe("svgPathBbox(SvgPath(d)) [Pathological cases]", () => {
  test.each(pathologicalCases)("svgPathBbox(SvgPath(%p)) ⇢ %p", (d, bbox) => {
    expect(svgPathBbox(new SvgPath(d))).toEqual(bbox);
  });
});
