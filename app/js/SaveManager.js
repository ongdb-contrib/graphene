'use strict';

import createId from './utils/id';
import _formatDate from './utils/date';
import DataManager from './DataManager';
import NotificationManager from './NotificationManager';

let _saves = [];
const _onUpdateCallbackHandlers = [];
let _currentName = null;

const _dispatchEvent = (payload) => {
  _onUpdateCallbackHandlers.forEach(callbackHandler => {
    callbackHandler(payload);
  });
};

/**
 * Save Manager Object
 */
const SM = {
  /**
   * @param data
   */
  loadSaves: (data) => {
    _saves = data;
    _dispatchEvent(_saves);
  },

  /**
   * @returns {Array} saves
   */
  getSaves: () => _saves,

  /**
   * @param {Object} data - data to be saved
   * @param {Array} data.nodes - all nodes
   * @param {Array} data.edges - all edges
   * @param {string} name - the new save name
   */
  save: (data, name) => {
    _saves.unshift(Object.assign({
      id: createId(),
      date: _formatDate(new Date()),
      name
    }, data));

    _dispatchEvent(_saves);
  },

  /**
   * @param id
   */
  load: (id) => {
    const save = _saves.filter(s => s.id === id)[0];
    _currentName = save.name;
    DataManager.loadData(save.data);
    NotificationManager.success('Save successfully loaded.');
  },

  /**
   * @description 获取当前操作的模型名称
   */
  currentName: () => {
    return (_currentName === null) ? '' : _currentName;
  },

  /**
   * @param name
   * @description 设置当前操作的模型名称
   */
  setCurrentName: (name) => {
    _currentName = name;
  },

  /**
   * @param id
   */
  remove: (id) => {
    _saves = _saves.reduce((acc, s) => {
      if (s.id !== id) {
        acc.push(s);
      }

      return acc;
    }, []);

    _dispatchEvent(_saves);
  },

  /**
   * @param fn
   */
  onChange: (fn) => {
    _onUpdateCallbackHandlers.push(fn);
  }
};

export default SM;
