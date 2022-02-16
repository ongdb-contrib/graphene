'use strict';

/**
 *
 * @param {string} containerSelector
 * @param {string} id
 * @param className
 * @returns {Node}
 */
function createSVGInContainer(containerSelector, id, className) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');

  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('id', id);
  svg.setAttribute('class', className);

  return document.querySelector(containerSelector).appendChild(svg);
}

export default createSVGInContainer;
