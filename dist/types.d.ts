export type BBox = [minX: number, minY: number, maxX: number, maxY: number];

/**
 * Compute bounding boxes of SVG paths.
 * @param {String} d SVG path for which their bounding box will be computed.
 * @returns {BBox}
 */
declare function svgPathBbox(d: string): BBox;
export = svgPathBbox;
