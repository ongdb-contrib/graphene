'use strict';

/**
 *
 * @param {string} containerSelector CSS/DOM selector
 * @param {string} domType 'div', 'ul' ...
 * @param {string} id
 * @param {string} className
 * @returns {Element}
 */
function createDomElementInContainer(containerSelector, domType, id, className) {
  const comElement = document.createElement(domType);

  id && comElement.setAttribute('id', id);
  className && comElement.setAttribute('class', className);

  document.querySelector(containerSelector).appendChild(comElement);
  return comElement;
}

export default createDomElementInContainer;
