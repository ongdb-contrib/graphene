'use strict';

import createDomElementInContainer from '../dom';

/**
 *
 * @description 【对话body操作span】
 */
function overlayOperationDialogBodySpan() {
  return createDomElementInContainer('.overlay-dialog.opened .dialog .body',
      'span',
      'overlay-operation-dialog-body-span-id',
      'overlay-operation-dialog-body-span'
  );
}

export default overlayOperationDialogBodySpan;
