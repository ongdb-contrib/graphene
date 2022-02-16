
import tools from './shared/tools';
import propertySpec from './properties';
import connection from './connections';

/**
 *
 * @param edge
 * @returns {string}
 */
const getEdgeSchema = (edge) => {
  const properties = edge.properties.map(propertySpec).join('');
  const endNodeLabel = edge.endNode.label.toCamelCase();

  return `
# Edge description
type ${tools.getName(edge, 'Edge')} implements Edge {
  node: ${endNodeLabel}
  ${properties}
}

${connection.schema.getConnectionSchema(edge)}
`;
};

export default {
  schema: {
    getEdgeSchema
  },
  resolvers: {
    getEdgeResolver: () => 'Edges does not have resolvers on their own.'
  }
};
