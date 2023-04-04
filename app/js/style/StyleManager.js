'use strict';

import Dialog from '../ui/dialog';
import overlayOperationDialogBodySpan from '../utils/dialog/domSpan';
import CONST from '../enums/CONST';

const svgStylePathStrokeDasharray = 'nma.grad3ph.svg.style.path.stroke.dasharray';
const svgStylePathStrokeDasharrayBtnId = 'nma.grad3ph.svg.style.path.stroke.dasharray.id';

/**
 * @param {String} value
 * @returns {String}
 */
function setPathStrokeDasharray(value) {
  localStorage.setItem(svgStylePathStrokeDasharray, value);
}

    /**
     * @param {String} value
     * @returns {String}
     */
function setBtnId(value) {
  localStorage.setItem(svgStylePathStrokeDasharrayBtnId, value);
}

/** ====================================================================================================================
 * @type {Object}
 ==================================================================================================================== */
const StyleManager = {

  /**
   * @returns {String}
  */
  getPathStrokeDasharray: () => {
    return localStorage.getItem(svgStylePathStrokeDasharray) || 'none';
  },
  /**
   * @returns {String}
   */
  getBtnId: () => {
    return localStorage.getItem(svgStylePathStrokeDasharrayBtnId) || 'svg-style-relation';
  },

  /**
   * @param {String} type
   * @returns {Object}
   */
  style: (type) => {
    const vl = document.getElementById('overlay-operation-dialog-body-span-id');

    if (vl !== null) {
      Dialog.open(false, CONST.MENU_SVG_STYLE);
    } else {
      document.querySelector('.overlay-dialog.opened .dialog .body .saves-list').remove();
      // 创建用来中间跳转的span
      overlayOperationDialogBodySpan();
      // 展示stroke-dasharray参数，和样例图片
      switch (type) {
        case CONST.SVG_STYLE_RELATION:
          setPathStrokeDasharray('none');
          setBtnId('svg-style-relation');
          document.querySelector('.dialog .header .svg-style-relation').style.background = '#bbb';
          document.querySelector('.dialog .header .svg-style-type-links').style.removeProperty('background');
          document.querySelector('.dialog .header .svg-style-meta-relation').style.removeProperty('background');
          document.querySelector('.overlay-dialog.opened .dialog .body')
                    .insertAdjacentHTML('beforeend', _getRelationHTML());
          break;
        case CONST.SVG_STYLE_TYPE_LINKS:
          setPathStrokeDasharray('2 5');
          setBtnId('svg-style-type-links');
          document.querySelector('.dialog .header .svg-style-type-links').style.background = '#bbb';
          document.querySelector('.dialog .header .svg-style-relation').style.removeProperty('background');
          document.querySelector('.dialog .header .svg-style-meta-relation').style.removeProperty('background');
          document.querySelector('.overlay-dialog.opened .dialog .body')
                    .insertAdjacentHTML('beforeend', _getTypeLinksHTML());
          break;
        case CONST.SVG_STYLE_META_RELATION:
          setPathStrokeDasharray('15 5');
          setBtnId('svg-style-meta-relation');
          document.querySelector('.dialog .header .svg-style-meta-relation').style.background = '#bbb';
          document.querySelector('.dialog .header .svg-style-relation').style.removeProperty('background');
          document.querySelector('.dialog .header .svg-style-type-links').style.removeProperty('background');
          document.querySelector('.overlay-dialog.opened .dialog .body')
                    .insertAdjacentHTML('beforeend', _getMetaRelationHTML());
          break;
        default:
          break;
      }
    }
  }
};

const _getRelationHTML = () => `
   <div style="position:relative;">
    <div>Relation</div>
    <svg>
      <polyline
        class="shap"
        points="20,20 40,25 60,40 80,120 120,140 200,180"
        stroke-dasharray="none"
        style="fill:none;stroke:#db1212;stroke-width:2.05px;"
      />
    </svg>
  </div>`;

const _getTypeLinksHTML = () => `
   <div style="position:relative;">
    <div>Type Links</div>
    <svg>
      <polyline
        class="shap"
        points="20,20 40,25 60,40 80,120 120,140 200,180"
        stroke-dasharray="2 5"
        style="fill:none;stroke:#db1212;stroke-width:2.05px;"
      />
    </svg>
  </div>`;

const _getMetaRelationHTML = () => `
   <div style="position:relative;">
    <div>Meta Relation</div>
    <svg>
      <polyline
        class="shap"
        points="20,20 40,25 60,40 80,120 120,140 200,180"
        stroke-dasharray="15 5"
        style="fill:none;stroke:#db1212;stroke-width:2.05px;"
      />
    </svg>
  </div>`;

export default StyleManager;
