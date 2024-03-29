'use strict';

import createId from '../utils/id';
import color from '../utils/color';

import Property from './Property';
import PROPERTY_TYPES from '../enums/PROPERTY_TYPES';
import StyleManager from '../style/StyleManager';

/**
 *缓存有颜色设置时，颜色设置顺序如下：
 * 1.数据
 * 2.缓存
 * 3.随机
 * **/
function setColor(options) {
  if (options.color !== undefined && options.color !== '' && options.color !== null) {
    return options.color;
  }
  const localColor = StyleManager.getNodeColor();
  if (localColor !== undefined && localColor !== '' && localColor !== null && localColor.indexOf('#') !== -1) {
    return localColor;
  }
  return color();
}

class Node {
  /**
   * @param {object} options
   * @param {number} options.x
   * @param {number} options.y
   * @param {string} options.color
   * @param {string} options.label
   * @param {array} options.properties
   * @param {string} options.id
   * @constructor
   */
  constructor(options = {}) {
    const idPropertyConfig = { key: 'id', isRequired: true, type: PROPERTY_TYPES.ID, isAutoGenerated: true, isSystem: true };
    const idProperty = new Property(idPropertyConfig);

    const indexesPropertyConfig = { key: 'schema-indexes', isRequired: false, type: PROPERTY_TYPES.STRING, isAutoGenerated: false, isSystem: false, defaultValue: '//CONSTRAINT AND INDEX：\n' +
          '//CONSTRAINT:CREATE CONSTRAINT ON (n:Label) ASSERT n.code IS UNIQUE;\n' +
          '//CONSTRAINT:CREATE CONSTRAINT ON (n:Label) ASSERT (n.name,n.code) IS NODE KEY;\n' +
          '//INDEX:CREATE INDEX ON :Label(name);\n' +
          '//INDEX:CREATE INDEX ON :Label(name,hupdatetime);\n' +
          '//DROP:DROP CONSTRAINT ON (n:Label) ASSERT (n.name,n.code) IS NODE KEY;\n' +
          '//DROP:DROP INDEX ON :Label(name)' };
    const indexesProperty = new Property(indexesPropertyConfig);

    this.x = options.x;
    this.y = options.y;
    this.color = setColor(options);
    // 取消默认转小写操作
    // this.label = (options.label || 'new').toLowerCase();
    this.label = (options.label || 'new');
    this.properties = options.properties || [idProperty, indexesProperty];
    this.id = options.id || createId();
    this.isSelected = options.isSelected || false;
    this.isNode = true;
  }

  get copy() {
    return new Node((JSON.parse(JSON.stringify(this))));
  }
}

export default Node;
