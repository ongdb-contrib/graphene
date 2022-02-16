'use strict';

import CONST from './enums/CONST';
import ACTION from './enums/ACTION';
import createDomElementInContainer from './utils/dom';

let onActionHandlerFunction = () => null;

/**
 * @type {{init: CM.init, onAction: CM.onAction, open: CM.open, close: CM.close, getContextMenuHTML: CM.getContextMenuHTML}}
 */
const CM = {
  /**
   * @param containerSelector
   * @returns {Object}
   */
  init: (containerSelector) => {
    // create and attach a contextMenuLayer
    const contextMenuLayer = createDomElementInContainer(containerSelector, 'div', CONST.CONTEXT_MENU_LAYER_ID, CONST.CONTEXT_MENU_LAYER_CLASS);

    // create a context menu
    CM.contextMenuElement = createDomElementInContainer(`#${contextMenuLayer.id}`, 'ul', CONST.CONTEXT_MENU_ID, CONST.CONTEXT_MENU_CLASS);

    CM.openedPosition = {};
    CM.targetedEntity = {};

    /**
     * @param e
     */
    CM.contextMenuElement.onclick = (e) => {
      const action = e.target.attributes.action.value;
      if (action) {
        onActionHandlerFunction({
          position: {
            x: CM.openedPosition[0],
            y: CM.openedPosition[1]
          },
          type: action,
          target: CM.targetedEntity
        });
      }

      // close the menu once an action is fired
      CM.close();
    };

    return CM;
  },

  /**
   * @param {function} fn
   */
  onAction: (fn) => onActionHandlerFunction = fn,

  /**
   * @param position
   * @param entity
   */
  open: (position, entity) => {
    CM.contextMenuElement.innerHTML = CM.getContextMenuHTML(entity);

    CM.openedPosition = position;
    CM.targetedEntity = entity;

    CM.contextMenuElement.style.left = `${position[0]}px`;
    CM.contextMenuElement.style.top = `${position[1]}px`;
    CM.contextMenuElement.classList.add('opened');
  },

  /**
   */
  close: () => {
    CM.contextMenuElement.classList.remove('opened');
  },

  /**
   * @param {Object} entity
   * @returns {string} HTML
   */
  getContextMenuHTML: (entity) => {
    if (entity.isNode) {
      return `
        <li action="${ACTION.CREATE_EDGE}">Create Edge from <b>"${entity.label}"</b></li>
        <li action="${ACTION.DELETE_NODE}">Delete Node <b>"${entity.label}"</b></li>
      `;
    }
    if (entity.isEdge) {
      return `
        <li id='svg_action_delete_edge' action="${ACTION.DELETE_EDGE}">Delete Edge <b>"${entity.label}"</b></li>
      `;
    }

    if (entity.id === CONST.SVGROOT_ID) {
      return `<li action="${ACTION.CREATE_NODE}">New Node</li>`;
    }

    return '';
  }
};

export default CM;
