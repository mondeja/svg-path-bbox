const ML = `{
          if (min[0] > seg[1]) {
            min[0] = seg[1];
          }
          if (min[1] > seg[2]) {
            min[1] = seg[2];
          }
          if (max[0] < seg[1]) {
            max[0] = seg[1];
          }
          if (max[1] < seg[2]) {
            max[1] = seg[2];
          }
          break;
        }`;

export default {
  M: ML,
  L: ML,
  H: `{
          if (min[0] > seg[1]) {
            min[0] = seg[1];
          }
          if (max[0] < seg[1]) {
            max[0] = seg[1];
          }
          break;
        }`,
  V: `{
          if (min[1] > seg[1]) {
            min[1] = seg[1];
          }
          if (max[1] < seg[1]) {
            max[1] = seg[1];
          }
          break;
        }`,
  C: `{
          const cxMinMax = minmaxC([x, seg[1], seg[3], seg[5]]);
          if (min[0] > cxMinMax[0]) {
            min[0] = cxMinMax[0];
          }
          if (max[0] < cxMinMax[1]) {
            max[0] = cxMinMax[1];
          }

          const cyMinMax = minmaxC([y, seg[2], seg[4], seg[6]]);
          if (min[1] > cyMinMax[0]) {
            min[1] = cyMinMax[0];
          }
          if (max[1] < cyMinMax[1]) {
            max[1] = cyMinMax[1];
          }
          break;
        }`,
  Q: `{
          const qxMinMax = minmaxQ([x, seg[1], seg[3]]);
          if (min[0] > qxMinMax[0]) {
            min[0] = qxMinMax[0];
          }
          if (max[0] < qxMinMax[1]) {
            max[0] = qxMinMax[1];
          }

          const qyMinMax = minmaxQ([y, seg[2], seg[4]]);
          if (min[1] > qyMinMax[0]) {
            min[1] = qyMinMax[0];
          }
          if (max[1] < qyMinMax[1]) {
            max[1] = qyMinMax[1];
          }
          break;
        }`,
}
