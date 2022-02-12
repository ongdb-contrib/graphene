'use strict';

import jsonview from 'jquery-jsonview';
import Dialog from '../ui/dialog';
import overlayOperationDialogBodySpan from '../utils/dialog/domSpan';
import wrapRequest from '../utils/http/GraphHttp';
import DataManager from '../DataManager';
import CONST from '../enums/CONST';

let httpUrl;
let username;
let password;
let graphDatabaseType;
let responseData;

/** ====================================================================================================================
 * @type {Object}
 ==================================================================================================================== */
const CqlManager = {

  /**
   * @param {Object} rawData
   * @param {array} rawData.nodes - An Array of nodes
   * @param {array} rawData.edges - An Array of edges
   * @param {boolean} isFromHistory - if the load is from history or save no savable event should be fired
   * @returns {Object}
   */
  cql: () => {
    const vl = document.getElementById('overlay-operation-dialog-body-span-id');

    if (vl !== null) {
      Dialog.open(false, CONST.MENU_DATABASE);
    } else {
      document.querySelector('.overlay-dialog.opened .dialog .body .saves-list').remove();
      // 创建用来中间跳转的span
      overlayOperationDialogBodySpan();
      // 创建Neo4j、ONgDB图数据库按钮，并在点击时生成cql
      document.querySelector('.overlay-dialog.opened .dialog .body')
          .insertAdjacentHTML('beforeend', _getHTML());
      // 绑定点击事件
      _setupDialogWithGraphDatabase();
    }
  }
};

/**
 * @private
 */
const _setupDialogWithGraphDatabase = () => {
  document.querySelector('.overlay-dialog.opened .dialog .body').addEventListener('click', (e) => {
    const target = e.target;
    const className = target.classList[0];

    /**
     * @description 获取当前正在操作的数据
     */
    const _dataToSave = {
      data: {
        nodes: DataManager.getAllNodes(),
        edges: DataManager.getAllEdges()
      }
    };

    switch (className) {
      case 'neo4j-cql':
        _clearInput();
        graphDatabaseType = 'neo4j';
        document.querySelector('.dialog .body .graph-database-http').style.display = 'grid';
        document.querySelector('.dialog .body .graph-database-http .text-input').setAttribute('placeholder', 'Neo4j[Http]:localhost:7474');
        break;

      case 'ongdb-cql':
        _clearInput();
        graphDatabaseType = 'ongdb';
        document.querySelector('.dialog .body .graph-database-http').style.display = 'grid';
        document.querySelector('.dialog .body .graph-database-http .text-input').setAttribute('placeholder', 'ONgDB[Http]:localhost:7474');
        break;

      case 'view-cql':
        // 从当前操作的图数据生成Merge和Match语句，并封装为JSON
        // 显示CQL语句
        const element = document.querySelector('.dialog .body .view-div');
        const mk = element.style.display;
        if (mk === 'none' || mk === '') {
          element.style.display = 'grid';
        } else {
          element.style.display = 'none';
        }
        $('.overlay-dialog.opened .dialog .body .view-div').JSONView(_dataToSave, { collapsed: true, nl2br: true, recursive_collapser: true });
        break;

      case 'http-url-commit-btn':
        httpUrl = document.getElementById('cql-http-text-input').value;
        username = document.getElementById('cql-http-text-input-un').value;
        password = document.getElementById('cql-http-text-input-pw').value;
        // 返回封装好的创建图数据的CQL语句，包含构建索引、节点、关系的CQL
        responseData = wrapRequest(httpUrl, username, password, graphDatabaseType, _dataToSave);
        break;
      default:
        break;
    }
  });
};

/**
 * @param saves
 * @private style='height: 256px; width: 512px;'
 */
const _getHTML = () => `
       <button class="neo4j-cql left">Neo4j</button>
       <button class="ongdb-cql left">ONgDB</button>
       <button class="view-cql right">View CQL</button>
       <div class="graph-database-http">
          <input id='cql-http-text-input' type="text" maxlength="20" placeholder="http://localhost:7474/db/data/transaction/commit" class="text-input" />
          <input id='cql-http-text-input-un' type="tel" maxlength="20" placeholder="username" class="text-input" />
          <input id='cql-http-text-input-pw' type="password" maxlength="20" placeholder="password" class="text-input" />
          <button class="http-url-commit-btn">save schema</button>
       </div>
       <div class="view-div"></div>`;

/**
 * @description 清除输入框内容
 */
const _clearInput = () => {
  document.getElementById('cql-http-text-input').value = null;
  document.getElementById('cql-http-text-input-un').value = null;
  document.getElementById('cql-http-text-input-pw').value = null;
};

export default CqlManager;
