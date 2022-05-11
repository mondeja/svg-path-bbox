import { jest } from "@jest/globals";
import { linealCases, pathologicalCases } from "./cases/bbox";
import type { BBox } from "../src";

jest.retryTimes(3);
jest.setTimeout(2000);

const rounding = 5;

const round = (num: number): number => {
  const result = parseFloat(num.toFixed(rounding));
  return result == 0 ? 0 : result;
};

describe("Consistency with browser's element.getBBox()", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:8080");
  });

  const cases = [...linealCases, ...pathologicalCases];

  test.each(cases)(
    "browserSvgPathBbox(%p) ⇢ %p",
    async (d: string, libBbox: BBox) => {
      const browserBbox = await page.evaluate(
        (d, rounding) => {
          const round = (num: number): number =>
            parseFloat(num.toFixed(rounding));

          document.body.innerHTML =
            `<svg width="800" height='800'>` +
            `<path fill='black' d="${d}"/></svg>`;
          const bbox = (
            document.querySelector("path") as SVGPathElement
          ).getBBox();
          return [
            round(bbox.x),
            round(bbox.y),
            round(bbox.x + bbox.width),
            round(bbox.y + bbox.height),
          ];
        },
        d,
        rounding
      );
      expect(browserBbox).toEqual(libBbox.map((num) => round(num)));
    }
  );
});
