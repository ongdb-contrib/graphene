'use strict';

import DataManager from '../../DataManager';
import customTypes from './shared/customTypes';
import nodeSchemes from './nodes';

/**
 *
 * @returns {string}
 */
const getAllResolvers = () => {
  const nodes = DataManager.getAllNodes();
  const nodesHandlers = nodes.map(nodeSchemes.resolvers.getNodeResolver).join('\n');

  return `
    ${customTypes.javascript}
    ${nodesHandlers}
  `;
};

export default getAllResolvers;

