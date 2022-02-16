export default {
  getName: (edge, suffix) => `${edge.startNode.label.toCamelCase()}${edge.label.toCamelCase()}${edge.endNode.label.toCamelCase()}${suffix}`
}