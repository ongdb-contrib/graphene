'use strict';

import CONST from '../enums/CONST';
import createDomElementInContainer from '../utils/dom';

import SaveManager from '../SaveManager';
import DataManager from '../DataManager';
import ExportManager from '../export/ExportManager';
import ImportManager from '../import/ImportManager';
import NotificationManager from '../NotificationManager';
import CqlManager from '../cql/CqlManager';

/**
 * @type {string} The Id of the selected save entry
 */
let _selectedSaveId;

let _menuType;

/**
 * @param {string} id
 * @private
 */
const _selectSave = (id) => {
  _selectedSaveId = id;
  Dialog.render();
};

const _createNewSave = () => {
  const dataToSave = {
    data: {
      nodes: DataManager.getAllNodes(),
      edges: DataManager.getAllEdges()
    }
  };
  const name = document.querySelector('.new-save-name-input').value;
  SaveManager.save(dataToSave, name);
};

/**
 * @param saves
 * @private
 */
const _getHTML = (saves) => `
     <div class="dialog">
        <div class="header">
          <span class="span">Saved graphs</span>
          <button class="export-all-json left" style="display: none">All Json</button>
          <button class="export-current-json left" style="display: none">Current Json</button>
          <button class="upload-json-file left" style="display: none">Upload Json File</button>
          <button class="import-from-json left" style="display: none">Import From Json</button>
          <button class="import-from-arrows left" style="display: none">Import From Arrows</button>
          <button class="download-json-file left" style="display: none">Download Json File</button>
          <button class="associate-with-graph-databases left" style="display: none">Graph Databases</button>
        </div>
        <div id="set_file_name" class="sub-header">
          <span>Save graph as:</span>
          <input type="text" maxlength="20" placeholder="Name of the save you wanna save." class="new-save-name-input" value="${ SaveManager.currentName() }" />
          <button class="save-btn">Save</button>
        </div>
        <div class="body">
          <ul class="saves-list">${_getSavesHTML(saves)}</ul>
        </div>
        <div class="footer">
          <button class="new-save-btn left" style="display: none">New Save</button>
          <button class="delete-btn" style="${!_selectedSaveId && 'display: none;'}">Delete</button>
          <button class="load-btn" style="${!_selectedSaveId && 'display: none;'}">Load</button>
          <button class="delete-btn-indb" style="display: none">Delete</button>
          <button class="download-btn" style="display: none">Download</button>
          <button class="close-dialog-btn">Close</button>
        </div>
      </div>`;

/**
 * @param saves
 * @returns {string}
 * @private
 */
const _getSavesHTML = (saves) => {
  let html = ``;

  saves.forEach(save => {
    html += `
    <li class="save-entry ${_selectedSaveId === save.id && 'selected'}" title="文件名称：${save.name} \n节点关系：${save.data.nodes.length} nodes, ${save.data.edges.length} edges \n创建时间：${save.date}" id="${save.id}">
<!--      <div class="icon">&#128196;</div>-->
      <div class="icon"><img src="./img/document-cover.png" height="90%" width="100%" title="显示的文件封面"/></div>
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
const _setupDialog = () => {
  if (_setupDialog.isDone) {
    return;
  }

  Dialog.dialogLayer = createDomElementInContainer(`#${CONST.EDITOR_ID}`,
    'div',
    'overlay-dialog',
    'overlay-dialog'
  );

  SaveManager.onChange(data => {
    _selectedSaveId = null;
    Dialog.render(data);
  });

  d3.select('body').on('keydown', () => {
    const enterKey = 13;
    const esc = 27;
    const focusedElement = document.activeElement;

    // load the selected save
    if ((d3.event.keyCode === enterKey) && _selectedSaveId) {
      SaveManager.load(_selectedSaveId);
      Dialog.close();
      d3.event.preventDefault();
      d3.event.stopPropagation();
    }

    // create new save with the string in the input field
    if (d3.event.keyCode === enterKey && focusedElement && focusedElement.classList.contains('new-save-name-input')) {
      if (document.querySelector('.new-save-name-input').value.length > 0) {
        _createNewSave();
        d3.event.preventDefault();
        d3.event.stopPropagation();
      }
    }

    if (d3.event.keyCode === esc) {
      Dialog.close();
      d3.event.preventDefault();
      d3.event.stopPropagation();
    }
  });

  let _lastClickedElementId;
  const DOUBLE_CLICK_SPEED = 400; // in ms

  Dialog.dialogLayer.addEventListener('click', (e) => {
    const target = e.target;
    const className = target.classList[0];

    switch (className) {
      case 'close-dialog-btn':
        Dialog.close();
        break;
      case 'new-save-btn':
        Dialog.open(true, CONST.MENU_SAVE);
        break;
      case 'save-btn':
        _createNewSave();
        break;
      case 'load-btn':
        if (_selectedSaveId === null) {
          try {
            DataManager.loadData(ImportManager.getInputJsonData());
            NotificationManager.success('Save successfully loaded.');
            Dialog.close();
          } catch (e) {
            console.log(ImportManager.getDemoJson());
            alert('【请参考样例数据】\n【数据格式需要一致，样例数据已经打印到F12控制台】\n请输入标准的JSON格式：' + ImportManager.getDemoJson());
          }
        } else {
          SaveManager.load(_selectedSaveId);
          Dialog.close();
        }
        break;
      case 'delete-btn':
        window.confirm('Are you sure you want to delete all saved nodes and edges?') && SaveManager.remove(_selectedSaveId);
        break;
      case 'save-entry':
        _selectSave(target.id);
        // if the same element is clicked in the last DOUBLE_CLICK_SPEED ms
        if (_lastClickedElementId === _selectedSaveId) {
          SaveManager.load(_selectedSaveId);
          Dialog.close();
        }
        break;
      case 'export-all-json':
        ExportManager.all();
        break;
      case 'export-current-json':
        ExportManager.current();
        break;
      case 'upload-json-file':
        ExportManager.uploadJson();
        break;
      case 'import-from-json':
        ImportManager.singleModelGraphJson();
        break;
      case 'import-from-arrows':
        ImportManager.singleModelGraphArrows();
        break;
      case 'download-json-file':
        ImportManager.downloadJsonFromOS();
        break;
      case 'associate-with-graph-databases':
        CqlManager.cql();
        break;
      default:
        break;
    }

    _lastClickedElementId = target.id;

    // reset the last selected element so the dbclick click need to happen in DOUBLE_CLICK_SPEED ms
    setTimeout(() => {
      _lastClickedElementId = null;
    }, DOUBLE_CLICK_SPEED);
  });

  _setupDialog.isDone = true;
};

/**
 * @description 不同类型对话框展示不同的功能按钮
 */
const _showWhich = (forSave) => {
  function isShowDeleteBtn(isShow) {
    document.querySelector('.dialog .footer .delete-btn').style.display = 'none';
  }

  switch (_menuType) {
    case CONST.MENU_SAVE:
      document.querySelector('.dialog .footer .new-save-btn').style.display = 'inline';
      document.getElementById('set_file_name').style.display = forSave ? 'flex' : 'none';
      document.querySelector('.dialog .sub-header .new-save-name-input').focus();
      break;
    case CONST.MENU_LOAD:
      document.querySelector('.dialog .header .span').innerHTML = 'Load Graphs';
      isShowDeleteBtn(false);
      break;
    case CONST.MENU_TASK:
      document.querySelector('.dialog .header .span').innerHTML = 'Task Mappings:';
      isShowDeleteBtn(false);
      break;
    case CONST.MENU_EXPORT:
      document.querySelector('.dialog .header .span').innerHTML = 'Export Graphs:';
      document.querySelector('.dialog .header .export-all-json').style.display = 'inline';
      document.querySelector('.dialog .header .export-current-json').style.display = 'inline';
      document.querySelector('.dialog .header .upload-json-file').style.display = 'inline';
      isShowDeleteBtn(false);
      break;
    case CONST.MENU_IMPORT:
      document.querySelector('.dialog .header .span').innerHTML = 'Import Graphs:';
      document.querySelector('.dialog .header .import-from-json').style.display = 'inline';
      document.querySelector('.dialog .header .import-from-arrows').style.display = 'inline';
      document.querySelector('.dialog .header .download-json-file').style.display = 'inline';
      isShowDeleteBtn(false);
      break;
    case CONST.MENU_DATABASE:
      document.querySelector('.dialog .header .span').innerHTML = 'Associate:';
      document.querySelector('.dialog .header .associate-with-graph-databases').style.display = 'inline';
      isShowDeleteBtn(false);
      break;
    default:
      break;
  }
};

/**
 * @type {{render: Function, open: Function, close: Function}}
 */
const Dialog = {

  /**
   * render the dialog
   */
  render: () => {
    const saves = SaveManager.getSaves();
    Dialog.dialogLayer.innerHTML = _getHTML(saves);
    _showWhich(_menuType);
  },

  /**
   * @param {boolean} forSave is the open for save or load action
   * @param menuType
   */
  open: (forSave, menuType) => {
    _menuType = menuType;

    _setupDialog();
    // reset the selected
    _selectedSaveId = null;

    Dialog.render();

    // hide header for just loading
    // document.querySelector('.dialog .sub-header').style.display = forSave ? 'flex' : 'none';
    _showWhich(forSave);
    document.querySelector(`#${CONST.SVGROOT_ID}`).classList.add('blurred');

    // set opened class later on so there will be open-transition
    setTimeout(() => {
      Dialog.dialogLayer.classList.add('opened');
    }, 0);
  },

  /**
   *
   */
  close: () => {
    _setupDialog();
    document.querySelector(`#${CONST.SVGROOT_ID}`).classList.remove('blurred');
    Dialog.dialogLayer.classList.remove('opened');
  }
};

export default Dialog;
