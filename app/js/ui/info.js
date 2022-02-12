'use strict';

import createDomElementInContainer from '../utils/dom';
import CONST from '../enums/CONST';

import DataManager from '../DataManager';
import PropertiesManager from '../PropertiesManager';

/**
 * @param parentDomContainer
 * @constructor
 */
const UI = (parentDomContainer) => {
  const info = createDomElementInContainer(`#${parentDomContainer.id}`, 'div', CONST.INFO_ID, CONST.INFO_CLASS);
  // make it focusable so the help panel is toggable when the dom element is in focus
  info.setAttribute('tabindex', 0);
  info.setAttribute('title', 'Summary Information.');

  UI.infoPanel = createDomElementInContainer(`#${info.id}`, 'div', CONST.INFO_PANEL_ID, CONST.INFO_PANEL_CLASS);

  d3.select(`#${info.id}`)
    .on('mouseover', () => {
      const element = d3.event.target;

      if (element.classList.contains('entity')) {
        const id = element.attributes['entity-id'].value;
        DataManager.selectEntity(id);
      }
    })
    .on('click', () => {
      const element = d3.event.target;

      if (element.classList.contains('entity')) {
        const id = element.attributes['entity-id'].value;
        const entity = DataManager.getNode(id) || DataManager.getEdge(id);
        const position = entity.isNode ? [entity.x + 20, entity.y + 15] : [entity.middlePointWithOffset[0] + 10, entity.middlePointWithOffset[1] + 10];

        PropertiesManager.open(position, entity);
      }
    });
};

UI.render = () => {
  let infoPanelHTML = ``;
  const nodes = DataManager.getAllNodes();
  const edges = DataManager.getAllEdges();
  function _generateColHTML(entities) {
    if (entities.length === 0) {
      return;
    }

    infoPanelHTML += `<div class='col'><h1>${entities.length} ${entities[0].isNode ? 'Nodes' : 'Edges'}</h1>`;
    entities.forEach(e => {
      infoPanelHTML += `<div class="entity" entity-id="${e.id}"><strong><span class="color" style="background-color: ${e.color}"></span> ${e.label} (${e.properties.length})</strong>`;

      if (e.properties.length) {
        infoPanelHTML += `<ul>`;
        e.properties.forEach(p => {
          infoPanelHTML += `
                <li>
                  <b>${p.key}</b> (${p.type.toLowerCase()}${p.isRequired ? ', required' : ''}${p.defaultValue ? ', with Default Value' : ''}${p.hasLimit ? ', limited' : ''})
                </li>
              `;
        });
        infoPanelHTML += `</ul>`;
      }

      infoPanelHTML += `</div>`;
    });
    infoPanelHTML += '</div>';
  }

  _generateColHTML(nodes);
  _generateColHTML(edges);

  UI.infoPanel.innerHTML = infoPanelHTML;
}

export default UI;
