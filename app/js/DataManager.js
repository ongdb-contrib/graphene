'use strict';

import Edge from './do/Edge';
import Node from './do/Node';
import Property from './do/Property';

import HistoryManager from './HistoryManager';

import SaveManager from './SaveManager';

import reposition from './utils/reposition';

let _nodes = [];
let _edges = [];

const _updateCallbacks = new Set();

/**
 * @param {Object} rawData
 * @private
 */
const _replaceData = (rawData) => {
  if (!rawData) {
    return DataManager;
  }

  const data = {
    nodes: rawData.nodes.map(nodeData => {
      const node = new Node(nodeData);
      node.properties = node.properties.map(data => new Property(data));
      return node;
    }),
    edges: rawData.edges.map(edgeData => {
      const edge = new Edge(edgeData);
      edge.properties = edge.properties.map(data => new Property(data));
      return edge;
    })
  };

  // reposition nodes if some of them is outside of the visible area
  _nodes = reposition(data.nodes) || _nodes;
  _edges = data.edges || _edges;

  return data;
};

/**
 * @param {string} eventType - is mostly use for loging
 * @param {string} target
 * @param {Object} data
 * @private
 */
const _dispatchUpdate = (eventType, target, data) => {
  // prevent some updates
  // console.log(eventType, target, data, '');
  const fn = _dispatchUpdate;
  const updateEvent = {
    event: eventType,
    target,
    change: data,
    saves: SaveManager.getSaves(),
    data: {
      nodes: _nodes,
      edges: _edges
    }
  };

  // if node is updated
  // last and current targets as strings with removed x and y properties
  const lastTargetStr = JSON.stringify(fn.lastTarget || {}).replace(/\"x"\:.*,"y":.*,"color/, '"color,');
  const currentTargetStr = JSON.stringify(data).replace(/\"x"\:.*,"y":.*,"color/, '"color,');

  if (eventType === 'update' && target === 'node' && fn.lastTarget && fn.lastTarget.id === data.id && lastTargetStr === currentTargetStr) {
    // skip all update if the node is just moved
  } else {
    HistoryManager.pushState(updateEvent);
  }

  // save the last target to be able to prevent multiple updates of the same kind. example: update
  fn.lastTarget = data;

  _updateCallbacks.forEach(callback => callback(updateEvent, eventType));
};

/**
 * @param id
 * @private
 */
const _getEdge = (id) => _edges.filter(edge => edge.id === id)[0];

/**
 * @param id
 * @private
 */
const _getNode = (id) => _nodes.filter(node => node.id === id)[0];


// On SaveChanges fire an update event so the external data can be updated
SaveManager.onChange(data => {
  _dispatchUpdate('saves updated', {}, data);
});

/** ====================================================================================================================
 * @type {Object}
 ==================================================================================================================== */
const DataManager = {

  dispatchUpdate: _dispatchUpdate,

  /**
   * @returns {boolean}
   */
  isEntitySelected: () => (_nodes.some(n => n.isSelected) || _edges.some(e => e.isSelected)),

  /**
   * @returns {Object}
   */
  getSelectedEntity: () => {
    const selectedEntity = _nodes.filter(n => n.isSelected)[0] || _edges.filter(e => e.isSelected)[0];

    if (selectedEntity && selectedEntity.id) {
      return DataManager.getNode(selectedEntity.id) || DataManager.getEdge(selectedEntity.id);
    }
  },

  /**
   * @param id
   */
  selectEntity: (id) => {
    const entity = _getNode(id) || _getEdge(id);

    if (entity && !entity.isSelected) {
      DataManager.deselectAllEntities();
      entity.isSelected = true;
      _dispatchUpdate('select', entity.isNode ? 'node' : 'edge', entity);
    }

    return DataManager;
  },

  /**
   * @param forceRender
   */
  deselectAllEntities: (forceRender) => {
    _nodes.forEach(_node => {
      if (_node.isSelected) {
        _node.isSelected = false;
      }
    });

    _edges.forEach(_edge => {
      if (_edge.isSelected) {
        _edge.isSelected = false;
      }
    });

    if (forceRender) {
      _dispatchUpdate('deselect', 'all', {});
    }

    return DataManager;
  },

  /**
   * @param node
   * @returns {Object}
   */
  addNode: (node) => {
    _nodes.push(node);

    _dispatchUpdate('add', 'node', node);
    return DataManager;
  },

  /**
   * @param {Object} rawData
   * @param {array} rawData.nodes - An Array of nodes
   * @param {array} rawData.edges - An Array of edges
   * @param {boolean} isFromHistory - if the load is from history or save no savable event should be fired
   * @returns {Object}
   */
  loadData: (rawData, isFromHistory) => {
    const data = _replaceData(rawData);
    const eventType = isFromHistory ? 'history' : 'load';
    _dispatchUpdate(eventType, 'data', data);

    // dispatch selected if any
    if (DataManager.isEntitySelected()) {
      const selectedEntity = DataManager.getSelectedEntity();
      _dispatchUpdate('select', selectedEntity.isNode ? 'node' : 'edge', selectedEntity);
    }

    return DataManager;
  },

  /**
   *
   */
  clear: () => {
    _edges = [];
    _nodes = [];
    _dispatchUpdate('clear', 'data', []);
  },

  /**
   * @param node
   * @returns {Object}
   */
  updateNode: (node) => {
    _nodes = _nodes.map(_node => _node.id === node.id ? node : _node);
    _dispatchUpdate('update', 'node', node);
    return DataManager;
  },

  /**
   * @param node
   * @returns {Object}
   */
  deleteNode: (node) => {
    _nodes = _nodes.reduce((acc, n) => {
      if (node.id !== n.id) {
        acc.push(n);
      }

      return acc;
    }, []);

    _edges = _edges.reduce((acc, e) => {
      if (e.startNodeId !== node.id && e.endNodeId !== node.id) {
        acc.push(e);
      }

      return acc;
    }, []);

    _dispatchUpdate('delete', 'node', node);
    return DataManager;
  },

  /**
   * @param id
   * @returns {Object}
   */
  getNode: (id) => {
    if (_nodes.filter(n => n.id === id).length) {
      return _getNode(id).copy;
    }
  },

    /**
     * @returns {Array}
     */
  getAllNodes: () => _nodes.map(n => n.copy),

  // TODO The data is not copied deeply all properties will not be saved in history on in a save entry

  /**
   * @param nodes
   */
  setAllNodes: (nodes) => {
    _nodes = nodes;
    _dispatchUpdate('set', 'nodes', _nodes);
  },

  /**
   * @param edge
   * @returns {Object}
   */
  addEdge: (edge) => {
    _edges.push(edge);
    _dispatchUpdate('add', 'edge', edge);
    return DataManager;
  },

  /**
   * @param edges
   */
  setAllEdges: (edges) => {
    _edges = edges;
    _dispatchUpdate('set', 'edges', _edges);
  },

  /**
   * @param edge
   * @returns {Object}
   */
  updateEdge: (edge) => {
    _edges = _edges.map(_edge => _edge.id === edge.id ? edge : _edge);
    _dispatchUpdate('update', 'edge', edge);
    return DataManager;
  },

  /**
   * @param edge
   * @return {Object}
   */
  deleteEdge: (edge) => {
    _edges = _edges.reduce((acc, _edge) => {
      if (edge.id !== _edge.id) {
        acc.push(_edge);
      }

      return acc;
    }, []);

    _dispatchUpdate('delete', 'edge', edge);
    return DataManager;
  },

  /**
   * @param id
   * @returns {Array}
   */
  getEdge: (id) => _getEdge(id).copy, // create edge from edge class to keep the methods

  /**
   * @returns {Array}
   */
  getAllEdges: () => _edges.map(e => e.copy),

  /**
   * @param {string} nodeId
   * @returns {Array} nodes
   */
  getEdgesForStartNode: (nodeId) => DataManager.getAllEdges().filter((edge) => edge.startNodeId === nodeId),

  /**
   * @param {function} fn
   */
  onChange: (fn) => _updateCallbacks.add(fn)
};

export default DataManager;
