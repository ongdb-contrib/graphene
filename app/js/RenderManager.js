'use strict';

import Edge from './do/Edge';
import DataManager from './DataManager';
import InteractionManager from './InteractionManager';
import geometry from './utils/geometry';
import d3 from 'd3';

/**
 * Private variables/consts
 */
const TRANSITION_DURATION = 100;

/**
 * @param entity
 * @returns {number}
 */
const _getOpacityForEntity = (entity) => {
  if (entity.isNode) {
    const allSelectedEdges = DataManager.getAllEdges().filter(e => e.isSelected);

    for (let i = 0; i < allSelectedEdges.length; i++) {
      const nodeIsConnectedToSelectedEdge = [allSelectedEdges[i].endNodeId, allSelectedEdges[i].startNodeId].indexOf(entity.id) !== -1;

      if (nodeIsConnectedToSelectedEdge) {
        return 1;
      }
    }
  }

  if (entity.isSelected) {
    return 1;
  }

  // if the edge is starting from a selected node
  if (entity.isEdge && entity.startNode.isSelected) {
    return 1;
  }

  // if there is no selected node nor edge
  if (!DataManager.isEntitySelected()) {
    return 1;
  }

  return 0.15;
};

// each edge need to have it's own arrow for pointing,
// so you can set different colors and opacity when selecting nodes and the edge itself
/**
 * @param edge
 */
const _createOrUpdateArrowForEdge = (edge) => {
  const edgeColor = edge.color;
  const arrowId = `end-arrow-${edge.id}`;

  // create an arrow
  if (document.querySelector(`#${arrowId}`) === null) {
    d3.select('defs')
      .append('marker').attr({
        id: arrowId
      })
      .append('path').attr({
        d: `M0,-5L10,0L0,5`
      });
  }

  // update an arrow
  d3.select(`#${arrowId}`).attr({
    fill: edgeColor,
    viewBox: '0 -5 10 10',
    refX: 20,
    markerWidth: 6,
    markerHeight: 6,
    orient: 'auto',
    opacity: _getOpacityForEntity(edge)
  });
};

/**
 * @param {object} d3Element
 * @param {array} nodesData
 * @private
 */
const _renderNodes = (d3Element, nodesData) => {
  const nodes = d3Element.selectAll('.node').data(nodesData, (d) => d.id);
  // create svg element on item enter
  const nodesGroups = nodes.enter()
    .append('g')
    .classed('node', true)
    .attr('tabindex', 0)
    .each(node => InteractionManager.bindEvents(node));

  const initialNodeAttr = {
    fill: '#ebebeb',
    stroke: '#ebebeb',
    r: 5
  };

  // initial attributes are needed because of animation
  nodesGroups.append('circle').attr(initialNodeAttr);
  nodesGroups.append('text').attr('fill', '#ebebeb');

  // remove svg element on data change/remove
  nodes.exit()
    .transition()
    .duration(TRANSITION_DURATION)
    .attr(initialNodeAttr).remove();

  // update node groups
  nodes.attr({ id: node => node.id });

  nodes.select('circle')
    .attr({
      cx: node => node.x,
      cy: node => node.y
    })
    .transition()
    .duration(TRANSITION_DURATION)
    .attr({
      r: 12,
      stroke: node => node.color,
      fill: node => node.isSelected ? node.color : '#ebebeb',
      'stroke-opacity': (node) => _getOpacityForEntity(node)
    });

  nodes.select('text')
    .attr({
      x: node => node.x + 20,
      y: node => node.y + 5
    })
    .transition()
    .duration(TRANSITION_DURATION)
    .text(node => `${node.label} (${node.properties.length})`)
    .attr({
      fill: node => node.color,
      opacity: (node) => _getOpacityForEntity(node)
    });
};

/**
 * @param {object} d3Element
 * @param {array} edgesData
 * @private
 */
const _renderEdges = (d3Element, edgesData) => {
  const edges = d3Element.selectAll('.edge').data(edgesData, (e) => e.id);

  const edgesGroups = edges.enter().append('g').classed('edge', true);

  const initialEdgesAttr = { stroke: '#ebebeb' };

  edgesGroups.append('path').attr(initialEdgesAttr);
  edgesGroups.append('text')
    .classed('path-text', true)
    .attr('tabindex', 0)
    .each(edge => InteractionManager.bindEvents(edge));

  edges.exit()
    .transition()
    .duration(TRANSITION_DURATION)
    .attr(initialEdgesAttr)
    .remove();

  // set edges id
  edges.attr({ id: data => data.id });
  edges.select('text').attr({
    x: edge => edge.middlePointWithOffset[0] + 10,
    y: edge => edge.middlePointWithOffset[1],
    fill: edge => edge.color,
    opacity: edge => _getOpacityForEntity(edge)
  }).text(e => `${e.label} (${e.properties.length})`);

  // Helper function to draw paths
  const __lineFunction = (edge) => {
    const line = d3.svg.line()
      .x(d => d[0])
      .y(d => d[1])
      .interpolate(edge.startNodeId === edge.endNodeId ? 'basis' : 'cardinal');

    if (edge.startNodeId === edge.endNodeId) {
      const node = edge.startNode;

      const rotatedLeft = geometry.quadWay(geometry.rotatePoint(node, edge.middlePointWithOffset, true), edge.middlePointWithOffset);
      const rotatedRight = geometry.quadWay(geometry.rotatePoint(node, edge.middlePointWithOffset, false), edge.middlePointWithOffset);

      return `M ${node.x} ${node.y}
        Q ${rotatedLeft[0]} ${rotatedLeft[1]}
        ${edge.middlePointWithOffset[0]} ${edge.middlePointWithOffset[1]}
        Q ${rotatedRight[0]} ${rotatedRight[1]}
        ${node.x} ${node.y}`;
    } else {
      return line([
        [edge.startNode.x, edge.startNode.y],
        edge.middlePointWithOffset,
        [edge.endNode.x, edge.endNode.y]
      ]);
    }
  };

  edges.select('path')
    .attr({
      d: (edge) => __lineFunction(edge)
    })
    .transition()
    .duration(TRANSITION_DURATION)
    .attr({
      stroke: (edge) => {
        _createOrUpdateArrowForEdge(edge);
        return edge.color;
      },
      'stroke-opacity': edge => _getOpacityForEntity(edge),
      style: (edge) => `marker-end: url(#end-arrow-${edge.id})`
    });
};

const _init = (d3Element) => {
  if (!_init.isDown) {
    _init.isDown = true;

    RM.d3Element = d3Element;

    // a wrapper for path arrows
    RM.d3Element.append('defs').classed('defs');

    // a wrapper for temporal drawed paths
    RM.d3Element.append('g').classed('tempPaths', true);

    // define arrow marker for leading arrow when creating new rel;
    RM.d3Element.select('defs')
      .append('marker').attr({
        id: 'mark-end-arrow',
        viewBox: '0 -5 10 10',
        refX: 7,
        markerWidth: 6,
        markerHeight: 6,
        orient: 'auto'
      })
      .append('path').attr({
        d: 'M0,-5L10,0L0,5'
      });

    // a wrapper for all paths
    RM.d3GroupForEdges = RM.d3Element.append('g').classed('edges', true);

    // a wrapper for all nodes
    RM.d3GroupForNodes = RM.d3Element.append('g').classed('nodes', true);

    // drag line, add this svg to the parent svg so line can be drawen outside the global g
    RM.d3Element.select('.tempPaths').append('path')
      .attr('class', 'dragLine hidden')
      .attr({
        d: 'M0,0L0,0'
      })
      .style('marker-end', 'url(#mark-end-arrow)');
  }
};

/** ====================================================================================================================
 * Render Manager Class
 ==================================================================================================================== */
const RM = {
  /**
   *
   * @param data
   */
  prepareForRenderLine: (data) => {
    const source = data.source;

    d3.select('#mark-end-arrow').select('path').attr({
      fill: source.color
    });

    d3.select('.dragLine')
      .classed('hidden', false)
      .attr({
        stroke: source.color,
        d: ''
      });

    d3.select('body').classed('no-cursor', true);
  },

  /**
   * @param data
   */
  renderLine: (data) => {
    const start = [data.source.x, data.source.y];
    const end = data.end;

    d3.select('.dragLine')
      .attr({
        d: () => `M${start[0]},${start[1]}L${end[0]},${end[1]}`
      });
  },

  /**
   *
   */
  removeTempLine: () => {
    d3.select('.dragLine').classed('hidden', true);
    d3.select('body').classed('no-cursor', false);
  },

  /**
   * @param data
   * @param container
   */
  render: (data, container) => {
    _init(container);
    _renderEdges(RM.d3GroupForEdges, data.edges);
    _renderNodes(RM.d3GroupForNodes, data.nodes);
  }
};

export default RM;
