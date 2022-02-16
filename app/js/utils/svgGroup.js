'use strict';

/**
 *
 * @param {string} svgSelector
 * @param {string} id
 * @param {string} className
 * @returns {Node}
 */
function createGroupInSvg(svgSelector, id, className) {
  const NS = 'http://www.w3.org/2000/svg';
  const g = document.createElementNS(NS, 'g');

  g.setAttribute('id', id);
  g.setAttribute('class', className);

  return document.querySelector(svgSelector).appendChild(g);
}

export default createGroupInSvg;
