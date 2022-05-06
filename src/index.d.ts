import svgPathBbox from ".";
import "./BBox";

declare module "svg-path-bbox" {
  export default svgPathBbox;
  export type { BBox } from "./BBox";
}
