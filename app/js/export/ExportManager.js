'use strict';

import jsonview from 'jquery-jsonview';
import Dialog from '../ui/dialog';
import overlayOperationDialogBodySpan from '../utils/dialog/domSpan';
import SaveManager from '../SaveManager';
import DataManager from '../DataManager';
import CONST from '../enums/CONST';
import Http from '../utils/http/Http';
import NotificationManager from '../NotificationManager';
import createId from '../utils/id';
import _formatDate from '../utils/date';

let _downloadId;

const _administratorKey = 'a399f5a3-8751-491a-bd69-be7c94ec39e2';

/** ====================================================================================================================
 * @type {Object}
 ==================================================================================================================== */
const ExportManager = {

  /**
   * @description 生成JSON数据
   * @returns {Object}
   */
  all: () => {
    const data = SaveManager.getSaves();

    const vl = document.getElementById('overlay-operation-dialog-body-span-id');
    if (vl !== null) {
      Dialog.open(false, CONST.MENU_EXPORT);
    } else {
      $('.overlay-dialog.opened .dialog .body').JSONView(data);
      const comElement = overlayOperationDialogBodySpan();
      comElement.innerHTML = ['JSON字符串：', JSON.stringify(data)].join('');
    }
  },

  /**
   * @description 生成JSON数据
   * @returns {Object}
   */
  current: () => {
    const data = {
      data: {
        nodes: DataManager.getAllNodes(),
        edges: DataManager.getAllEdges()
      }
    };
    const vl = document.getElementById('overlay-operation-dialog-body-span-id');
    if (vl !== null) {
      Dialog.open(false, CONST.MENU_EXPORT);
    } else {
      $('.overlay-dialog.opened .dialog .body').JSONView(data);
      const comElement = overlayOperationDialogBodySpan();
      comElement.innerHTML = ['JSON字符串：', JSON.stringify(data)].join('');
    }
  },

  /**
   * @description 上传JSON文件到服务器
   * @returns {Object}
   */
  uploadJson: () => {
    const vl = document.getElementById('overlay-operation-dialog-body-span-id');
    if (vl !== null) {
      Dialog.open(false, CONST.MENU_EXPORT);
    } else {
      // 创建用来中间跳转的span
      overlayOperationDialogBodySpan();
      // 设置输入框，输入文件名，并设置上传按钮
      document.querySelector('.overlay-dialog.opened .dialog .sub-header')
          .innerHTML = _getHTML();
      document.getElementById('set_file_name').style.display = 'flex';
      document.querySelector('.dialog .sub-header .new-save-name-input-upload').focus();
      document.querySelector('.dialog .sub-header .new-save-name-input-upload').value = SaveManager.currentName();

      // 读取服务器建模JSON文件到内存【多人协作分享建模文件】
      Http.loadJsonFileList();
      // 展示服务器文件列表
      const element = document.querySelector('.overlay-dialog.opened .dialog .body .saves-list');
      element.innerHTML = _getSavesHTML(Http.getJsonDataList());
      // 绑定upload上传点击事件
      _setupUpload();
      // 绑定选择文件点击事件
      _setupDownloadId();
      // 绑定download点击事件
      _setupDownload();
      // 绑定delete点击事件
      _setupDelete();
    }
  }
};

/**
 * @private
 */
const _setupDownloadId = () => {
  document.querySelector('.overlay-dialog.opened .dialog .body .saves-list').addEventListener('click', (e) => {
    const target = e.target;
    // 生成下载ID
    _downloadId = target.id.replace('save-entry-json-os-', '');
    // 重置其它已选中效果
    document.querySelector('.overlay-dialog.opened .dialog .body .saves-list').innerHTML = _getSavesHTML(Http.getJsonDataList());
    // 设置选中效果
    const downloadEle = document.querySelector('.dialog .footer .download-btn');
    const downloadInDbEle = document.querySelector('.dialog .footer .delete-btn-indb');
    const element = document.getElementById(target.id);
    if (element !== null) {
      downloadEle.style.display = 'inline';
      downloadInDbEle.style.display = 'inline';
      const ele = element.style;
      ele.background = '#fafafa';
      ele.border = '#eee';
    } else {
      downloadEle.style.display = 'none';
      downloadInDbEle.style.display = 'none';
    }
  });
};

/**
 * @private
 */
const _setupDownload = () => {
  document.querySelector('.overlay-dialog.opened .dialog .footer .download-btn').addEventListener('click', () => {
    const dataPack = Http.getJsonDataMap()[_downloadId];
    SaveManager.setCurrentName(dataPack.name);
    DataManager.loadData(dataPack.data);
    NotificationManager.success('Save successfully loaded.');
    Dialog.close();
  });
};

/**
 * @private
 */
const _setupDelete = () => {
  document.querySelector('.overlay-dialog.opened .dialog .footer .delete-btn-indb').addEventListener('click', () => {
    const key = prompt("Administrator's key:", 'Please ask the administrator');
    if (key === _administratorKey) {
      window.confirm('Are you sure you want to delete all saved nodes and edges?') && Http.deleteJsonFile(_downloadId);
      refresh();
    } else {
      alert('Permission denied!!!');
    }
  });
};

/**
 * @param saves
 * @returns {string}
 * @private
 */
const _getSavesHTML = (saves) => {
  let html = ``;

  saves.forEach(save => {
    html += `
<li id="save-entry-json-os-${save.id}" class="save-entry-json-os" title="文件名称：${save.name} \n节点关系：${save.data.nodes.length} nodes, ${save.data.edges.length} edges \n创建时间：${save.date}">
      <div class="icon">&#128196;</div>
      <div class="name">${save.name}
        <small>${save.date}</small>
      </div>
    </li>`;
  });

  return html;
};

/**
 * @private
 */
const _setupUpload = () => {
  document.getElementById('upload-json-file-new-save-commit-btn').addEventListener('click', () => {
    const fileName = document.querySelector('.overlay-dialog.opened .dialog .sub-header .new-save-name-input-upload').value;

    // 获取当前正在操作的数据
    const dataToSave = {
      data: {
        nodes: DataManager.getAllNodes(),
        edges: DataManager.getAllEdges()
      }
    };
    const data = Object.assign({
      id: createId(),
      date: _formatDate(new Date()),
      name: fileName
    }, dataToSave);

    window.confirm('Are you sure you want to upload all saved nodes and edges?') && Http.uploadJsonFile(data, fileName);

    refresh();
  });
};

function refresh() {
  // 刷新saves-list
  // 展示服务器文件列表
  const element = document.querySelector('.overlay-dialog.opened .dialog .body .saves-list');
  Http.refreshJsonFileList();
  element.innerHTML = _getSavesHTML(Http.getJsonDataList());
}

/**
 * @private style='height: 256px; width: 512px;'
 */
const _getHTML = () => `
            <span>Save graph as:</span>
            <input type="text" maxLength="20" placeholder="Name of the save you wanna upload." class="new-save-name-input-upload"/>
            <button id='upload-json-file-new-save-commit-btn'>Upload</button>`;

export default ExportManager;
