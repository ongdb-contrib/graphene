
import tools from './shared/tools';
import propertySpec from './properties';
import DataManager from '../../DataManager';


const getNodeMutation = (node) => {
  const label = node.label.toCamelCase();
  const edges = DataManager.getEdgesForStartNode(node.id);

  const edgesConnections = edges.map((edge) => {
    const startNodeLabel = edge.startNode.label.toCamelCase();
    const endNodeLabel = edge.endNode.label.toCamelCase();
    const schema = `${tools.getName(edge, '')}(${startNodeLabel}Id: ID!, ${endNodeLabel}: ID!):${tools.getName(edge, 'Connection')}`;

    return `
add${schema}
remove${schema}
`;
  });

  return `
create${label}(${label}:${label}Input): ${label}
update${label}(${label}:${label}Input, id: ID!): ${label}
delete${label}(id: ID!):${label}
${edgesConnections.join('')}
`;
};


/**
 *
 * @param node
 * @returns {string}
 */
const getNodeSchema = (node) => {
  const label = node.label.toCamelCase();
  const edges = DataManager.getEdgesForStartNode(node.id);

  const properties = node.properties.map(propertySpec).join('');
  const inputProperties = node.properties.filter((p) => !p.isAutoGenerated).map(propertySpec).join('');

  const connections = edges.map((e) => `
  ${e.label}: ${tools.getName(e, 'Connection')}`).join('');

  const nodeSpec = `
# Node description
type ${label} implements Node {
  ${properties}
  ${connections}
}
`;

  const nodeInputSpec = `
# Input for ${label}
input ${label}Input {
  ${inputProperties}
}
`;

  return `
${nodeSpec}
${nodeInputSpec}
`;
};

/**
 *
 * @param node
 * @returns {string}
 */
const getNodeResolver = (node) => {

  const properties = {
    all: node.properties.map(prop => prop.key),
    system: node.properties.filter(prop => prop.isSystem).map(property => property.key),
    userDefined: node.properties.filter(prop => !prop.isSystem).map(property => property.key)
  };

  const label = node.label.toCamelCase();

  const edges = DataManager.getEdgesForStartNode(node.id);
  const connections = edges.map(edge => {
    const edgeLabel = edge.label.toCamelCase();
    const startNodeLabel = edge.startNode.label.toCamelCase();
    const endNodeLabel = edge.endNode.label.toCamelCase();
    const connectionName = `${startNodeLabel}${edgeLabel}${endNodeLabel}`;

    return `
add${connectionName}(${startNodeLabel}Id, ${endNodeLabel}Id) {
  //add connection depending on the node (type)
  // return connection
  return {
    nodes: []
    edges: []
    pageInfo: {
      endCursor: ''
      hasNextPage: ''
      hasPreviousPage: ''
      startCursor: ''
    }
    totalCount: 0
  }
}

delete${connectionName}((${startNodeLabel}Id, ${endNodeLabel}Id)) {
  //delete connection depending on ${startNodeLabel}Id, ${endNodeLabel}Id
  // return connection
  return {
    nodes: []
    edges: []
    pageInfo: {
      endCursor: ''
      hasNextPage: ''
      hasPreviousPage: ''
      startCursor: ''
    }
    totalCount: 0
  }
}
`;
  }).join('');


  return `
class ${label} {
  constructor(${properties.system.join(',')}, {${properties.userDefined.join(',')}}) {
    ${properties.all.map(prop => `this.${prop} = ${prop};`).join('\n    ')}
  }
}

get${label}({id}) {
  // get and return ${label} by id
  return new ${label}(id, {});
},

create${label}({input}) {
  // create ${label} from input
  var id = Math.random();
  return new ${label}(id, input);
},

update${label}({id, input}) {
  // update ${label} with id
  return new ${label}(id, input);
}

delete${label}({id}) {
  // find and return ${label} by id
  return {};
}

${connections}
`;
};


export default {
  schema: {
    getNodeSchema,
    getNodeMutation
  },
  resolvers: {
    getNodeResolver
  }
};
