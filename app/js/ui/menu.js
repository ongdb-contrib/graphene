'use strict';
/** @jsx h */

import { h, Component } from 'preact';

import DataManager from '../DataManager';
import HistoryManager from '../HistoryManager';
import NotificationManager from '../NotificationManager';

import codeMirror from 'codemirror';
import graphql from '../utils/graphql/index';

import Dialog from './dialog';
import CONST from '../enums/CONST';

class MenuPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMenuOpen: false,
      isSchemaOpen: false
    };
  }

  componentDidMount() {
    const codeEditorSchema = codeMirror(document.querySelector('#graphql-schema'), {
      lineNumbers: true,
      readOnly: true,
      undoDepth: 0,
      mode: 'yaml',
      lineWrapping: true,
      value: ''
    });

    const codeEditorJS = codeMirror(document.querySelector('#jshandlers-schema'), {
      lineNumbers: true,
      readOnly: true,
      undoDepth: 0,
      mode: 'javascript',
      lineWrapping: true,
      value: ''
    });

    DataManager.onChange(function () {
      codeEditorSchema.setValue(graphql.getFullSchema());
      codeEditorJS.setValue(graphql.getAllResolvers());
    }.bind(this));

    d3.select('body').on('keydown.menu', () => {
      const l = 76;
      const s = 83;
      const y = 89;
      const z = 90;

      if (d3.event.ctrlKey || d3.event.metaKey) {
        switch (d3.event.keyCode) {
          case s:
            this.save();
            break;
          case l:
            this.load();
            break;
          case z:
            this.undo();
            break;
          case y:
            this.redo();
            break;
          default:
            break;
        }
      }
    });
  }

  toggleMenuOpen() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
      isSchemaOpen: false
    });
  }

  toggleGraphqlView() {
    this.setState({
      isMenuOpen: false,
      isSchemaOpen: !this.state.isSchemaOpen
    });
  }

  closeAll() {
    this.setState({
      isMenuOpen: false,
      isSchemaOpen: false
    });
  }

  deleteAll() {
    if (window.confirm('Are you sure you want to delete all nodes and edges?')) {
      DataManager.clear();
      NotificationManager.error('All nodes and edges have been deleted. (Hint: Ctrl+Z to undo)');
    }

    this.closeAll();
  }

  save() {
    Dialog.open(true, CONST.MENU_SAVE);
    this.closeAll();
  }

  load() {
    Dialog.open(false, CONST.MENU_LOAD);
    this.closeAll();
  }

  task() {
    Dialog.open(false, CONST.MENU_TASK);
    this.closeAll();
  }

  export() {
    Dialog.open(false, CONST.MENU_EXPORT);
    this.closeAll();
  }

  import() {
    Dialog.open(false, CONST.MENU_IMPORT);
    this.closeAll();
  }

  database() {
    Dialog.open(false, CONST.MENU_DATABASE);
    this.closeAll();
  }

  download() {
    svgDownloadAll(d3.select('svg').node(), '.entities-group');
    // svgDownload(d3.select('svg').node());
  }

  svgStyleAdjust() {
    Dialog.open(false, CONST.MENU_SVG_STYLE);
    this.closeAll();
  }

  undo() {
    HistoryManager.undo();
    this.closeAll();
  }

  redo() {
    HistoryManager.redo();
    this.closeAll();
  }

  render(props, state) {
    return <menu className="top-menu" id="top-menu">
      <span className={ 'toggle-button' + (state.isMenuOpen ? ' open' : '') } onClick={ this.toggleMenuOpen.bind(this) }>&#9776;</span>
      <section className={ 'drop-down-menu content' + (state.isMenuOpen ? ' open' : '') }>
        <ul>
          <li className="menu-save-btn" onClick={ this.save.bind(this) }>&#128190; Save <small>(ctrl+s)</small></li>
          <li className="menu-load-btn" onClick={ this.load.bind(this) }>&#128194; Load <small>(ctrl+l)</small></li>
          <li className="menu-task-btn" onClick={ this.task.bind(this) }>&#128083; Task <small>(task)</small></li>
          <li className="menu-export-btn" onClick={ this.export.bind(this) }>&#128228; Export<small>(export)</small></li>
          <li className="menu-import-btn" onClick={ this.import.bind(this) }>&#128229; Import<small>(import)</small></li>
          <li className="menu-database-btn" onClick={ this.database.bind(this) }>&#128170; Database<small>(database)</small></li>
          <li className="menu-download-btn" onClick={ this.download.bind(this) }>&#x270d; Download<small>(download)</small></li>
          <li className="menu-style-adjust-btn" onClick={ this.svgStyleAdjust.bind(this) }>🙉 Style<small>(style)</small></li>
          <li className="menu-undo-btn" onClick={ this.undo.bind(this) }>&#8617; Undo <small>(ctrl+z)</small></li>
          <li className="menu-redo-btn" onClick={ this.redo.bind(this) }>&#8618; Redo <small>(ctrl+y)</small></li>
          <li className="menu-delete-all-btn" onClick={ this.deleteAll.bind(this) }>&#10005; Delete all</li>
        </ul>
      </section>

      <span className={ 'toggle-button' + (state.isSchemaOpen ? ' open' : '') } onClick={ this.toggleGraphqlView.bind(this) }>ஃ</span>
      <section className={ 'graphql-schema content' + (state.isSchemaOpen ? ' open' : '') }>
        <section id="graphql-schema" />
        <section id="jshandlers-schema" />
      </section>

      { (this.state.isMenuOpen || this.state.isSchemaOpen) &&
      <overlay className="top-menu-overlay" onClick={ this.closeAll.bind(this) } />
      }
    </menu>;
  }
}

function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
}

function downloadFile(fileName, blob) {
  const aLink = document.createElement('a');
  const evt = document.createEvent('MouseEvents');
  evt.initEvent('click', false, false);
  // 下载文件名
  aLink.download = fileName;
  // 根据二进制文件生成对象
  aLink.href = URL.createObjectURL(blob);
  // 触发点击
  aLink.dispatchEvent(evt);
}

const downloadSvgFn = function (svg) {
  const serializer = new XMLSerializer();
  const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svg);

  const image = new Image();
  image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);

  image.onload = function () {
    const width = this.naturalWidth,
      height = this.naturalHeight;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.rect(0, 0, width, height);
    context.fillStyle = '#fff';
    context.fill();
    context.drawImage(image, 0, 0);

    const imgSrc = canvas.toDataURL('image/jpg', 1);
    const blob = dataURLtoBlob(imgSrc);
    downloadFile('svg.jpg', blob);
  };
};

// 无视缩放，下载整个svg
function svgDownloadAll(svg, zoomClassName) {
  let zoomObj;
// 得到svg的真实大小
  let box = svg.getBBox(),
    x = box.x,
    y = box.y,
    width = box.width,
    height = box.height;

  if (zoomClassName) {
    // 查找zoomObj
    zoomObj = svg.getElementsByClassName(zoomClassName.replace(/\./g, ''))[0];
    if (!zoomObj) {
      window.alert('zoomObj不存在');
      return false;
    }
    // 这里是处理svg缩放的
    const transformMath = zoomObj.getAttribute('transform');
    const scaleMath = zoomObj.getAttribute('transform');
    if (transformMath || scaleMath) {
      const transformObj = transformMath.match(/translate\(([^,]*),([^,)]*)\)/);
      const scaleObj = scaleMath.match(/scale\((.*)\)/);
      if (transformObj || scaleObj) { // 匹配到缩放
        const translateX = transformObj[1];
        const translateY = transformObj[2];
        const scale = scaleObj[1];
        x = (x - translateX) / scale;
        y = (y - translateY) / scale;
        width = width / scale;
        height = height / scale;
      }
    }
    /*----------------------------------*/
  }

  // 克隆svg
  const node = svg.cloneNode(true);

  // 重新设置svg的width,height,viewbox
  node.setAttribute('width', width + 256);
  node.setAttribute('height', height + 64);
  node.setAttribute('viewBox', [x, y, width, height]);

  if (zoomClassName) {
    zoomObj = node.getElementsByClassName(zoomClassName.replace(/\./g, ''))[0];
    // 清除缩放元素的缩放
    zoomObj.setAttribute('transform', 'translate(0,0) scale(1)');
  }

  downloadSvgFn(node);
}

// 根据缩放，下载当前svg
function svgDownload(svg) {
  const node = svg.cloneNode(true);
  downloadSvgFn(node);
}

export default MenuPanel;
