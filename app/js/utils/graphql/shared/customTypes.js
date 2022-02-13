export default {
  schema: `
# Datetime scalar description
scalar Datetime

# Email scalar description
scalar Email

# Url scalar description
scalar Url

# Password scalar description
scalar Password

input GeoPointInput {
  lat: Float!
  lng: Float!
}

# GeoPoint description
type GeoPoint {
  lat: Float!
  lng: Float!
}

interface Node {
  id: ID!
}

interface Edge {
  id: ID!
  node: Node
}

interface Connection {
  nodes: [Node]
  edges: [Edge]
  pageInfo: PageInfo
  totalCount: Int!
}

# page info object - an object to hold the paging and cursors information. github like
type PageInfo {
  endCursor: String
  hasNextPage: String
  hasPreviousPage: String
  startCursor: String
}
`,
  javascript: `
Date: {
  __parseValue(value) {
    return new Date(value); // value from the client
  },
  __serialize(value) {
    return value; // value sent to the client
  },
  __parseLiteral(ast) {
    return ast.toString();
  }
},
Email: {
  __parseValue(value) {
    var formatRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!formatRegex.test(value)) {
      throw new graphql.GraphQLError('Email Validation error.');
    }

    return value;
  },
  __serialize(value) {
    return value;
  },
  __parseLiteral(ast) {
    return value;
  }
},
Password: {
  __parseValue(value) {
    return value;
  },
  __serialize(value) {
    return value;
  },
  __parseLiteral(ast) {
    return value;
  }
},
Url: {
  __parseValue(value) {
    return value;
  },
  __serialize(value) {
    return value;
  },
  __parseLiteral(ast) {
    return value;
  }
},
GeoPoint: {
  __parseValue(value) {
    return value;
  },
  __serialize(value) {
    return value;
  },
  __parseLiteral(ast) {
    return value;
  }
}`
};