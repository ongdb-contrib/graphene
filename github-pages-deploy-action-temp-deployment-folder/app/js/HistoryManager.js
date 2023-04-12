'use strict';

import createId from './utils/id';
import DataManager from './DataManager';

/**
 * @type {number}
 */
const MAX_HISTORY_STEPS = 200;

/**
 * @type {number}
 */
let _historyIndex;

/**
 * @type {Array}
 * @private
 */
const _history = [];

/**
 * @private
 */
let _onUpdateCallbackHandler = () => null;

/**
 * @type {{pushState: Function, undo: Function, redo: Function, onChange: Function}}
 */
const History = {
  /**
   * @param updateData
   */
  pushState: (updateData) => {
    // prevent history events to be recorded again
    if (updateData.event === 'history') {
      return;
    }

    _history.unshift(updateData);

    // set the undo index to the last item in the history
    _historyIndex = _history.length - 1;

    // limit the size of the history
    if (_history.length >= MAX_HISTORY_STEPS) {
      _history.pop();
    }

    _onUpdateCallbackHandler(_history);
  },

  /**
   * Load a previous history entry in the DataManager
   */
  undo: () => {
    const index = _historyIndex === 0 ? _historyIndex : --_historyIndex;
    DataManager.loadData(_history[index].data, true);

    _onUpdateCallbackHandler(_history);
  },

  /**
   * Load the next history entry in the DataManager
   */
  redo: () => {
    const index = _historyIndex === _history.length - 1 ? _historyIndex : ++_historyIndex;
    DataManager.loadData(_history[index].data, true);

    _onUpdateCallbackHandler(_history);
  },

  /**
   * @param fn
   */
  onChange: (fn) => _onUpdateCallbackHandler = fn
};

export default History;