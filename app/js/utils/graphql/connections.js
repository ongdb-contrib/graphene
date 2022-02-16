
import tools from './shared/tools';

/**
 *
 * @param edge
 * @returns {string}
 * @private
 */

const getConnectionSchema = (edge) => `
# Connection for ${edge.label.toCamelCase()}
type ${tools.getName(edge, 'Connection')} implements Connection {
  nodes: [${edge.startNode.label.toCamelCase()}]
  edges: [${tools.getName(edge, 'Edge')}]
  pageInfo: PageInfo
  totalCount: Int!
}
`;

export default {
  schema: {
    getConnectionSchema
  },
  resolvers: {}
};

