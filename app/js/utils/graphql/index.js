import fullSchema from './fullSchema';
import allResolvers from './allResolvers';

import nodes from './nodes';
import edges from './edges';

export default {
  getFullSchema: fullSchema,
  getNodeSchema: nodes.schema.getNodeSchema,
  getEdgeSchema: edges.schema.getEdgeSchema,
  getAllResolvers: allResolvers,
  getNodeResolver: nodes.resolvers.getNodeResolver,
  getEdgeResolver: edges.resolvers.getEdgeResolver
};
