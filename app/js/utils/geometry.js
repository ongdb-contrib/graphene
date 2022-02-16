'use strict';

const geometry = {

  /**
   * @param start
   * @param end
   * @returns {[]}
   */
  middlePoint: (start, end) => [(start.x + end.x) / 2, (start.y + end.y) / 2],

  /**
   * @param start
   * @param end
   * @returns {[]}
   */
  halfWay: (start, end) => [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2],

  /**
   * @param start
   * @param end
   * @returns {[]}
   */
  quadWay: (start, end) => {
    return geometry.halfWay(geometry.halfWay(start, end), end);
  },

  /**
   * @param point
   * @param center
   * @param {boolean} rotateCCW
   * @returns {[x, y]}
   */
  rotatePoint: (point, center, rotateCCW) => {
    // move the point to coordinate system where tne 'center' is the [0, 0] of the coordinate system
    const rotationCenter = [point.x - center[0], point.y - center[1]];

    // rotate by 90deg. and return the point to the position
    const rotatedLeft = [-rotationCenter[1] + center[0], rotationCenter[0] + center[1]];
    const rotatedRight = [rotationCenter[1] + center[0], -rotationCenter[0] + center[1]];

    return rotateCCW ? rotatedLeft : rotatedRight;
  }
};

export default geometry;
