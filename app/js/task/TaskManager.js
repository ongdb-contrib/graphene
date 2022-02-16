'use strict';

import jsonview from 'jquery-jsonview';
import Dialog from '../ui/dialog';
import overlayOperationDialogBodySpan from '../utils/dialog/domSpan';
import SaveManager from '../SaveManager';
import wrapRequest from '../utils/http/GraphHttp';
import DataManager from '../DataManager';
import createDomElementInContainer from '../utils/dom';
import CONST from '../enums/CONST';

let httpUrl;
let username;
let password;
let graphDatabaseType;
let responseData;

/**
 * @description 获取当前正在操作的数据
 */
const _dataToSave = {
  data: {
    nodes: DataManager.getAllNodes(),
    edges: DataManager.getAllEdges()
  }
};

/** ====================================================================================================================
 * @type {Object}
 ==================================================================================================================== */
const TaskManager = {

  /**
   * @description 生成图数据模型和图数据任务的映射
   * @returns {Object}
   */
  mapping: () => {

    const vl = document.getElementById('overlay-operation-dialog-body-span-id');

    if (vl !== null) {
      Dialog.open(false, CONST.MENU_TASK);
    } else {
      document.querySelector('.overlay-dialog.opened .dialog .body .saves-list').remove();
      // 创建用来中间跳转的span
      overlayOperationDialogBodySpan();
      // 图数据模型转换为数据任务之间的映射
    }
  }
};

export default TaskManager;
