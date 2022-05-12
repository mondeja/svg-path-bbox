import cases from "./cases/bbox";
import type { BBox } from "../src";

describe("Consistency with browser's element.getBBox()", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:8080");
  });

  test.each(cases)(
    "browserSvgPathBbox(%p) ⇢ %p",
    async (d: string, libBbox: BBox) => {
      const browserBbox = await page.evaluate((d) => {
        document.body.innerHTML = `<svg width="800" height="800"><path d="${d}"/></svg>`;
        const bbox = (
          document.querySelector("path") as SVGPathElement
        ).getBBox();
        return [bbox.x, bbox.y, bbox.x + bbox.width, bbox.y + bbox.height];
      }, d);

      expect(browserBbox[0]).toBeCloseTo(libBbox[0], 3);
      expect(browserBbox[1]).toBeCloseTo(libBbox[1], 3);
      expect(browserBbox[2]).toBeCloseTo(libBbox[2], 3);
      expect(browserBbox[3]).toBeCloseTo(libBbox[3], 3);
    }
  );
});
