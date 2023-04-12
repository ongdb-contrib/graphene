'use strict';

import CONST from './enums/CONST';
import createDomElementInContainer from './utils/dom';

/**
 * @private
 */
const _setupNotificationManager = () => {
  if (_setupNotificationManager.isDone) {
    return;
  }

  NM.notificationLager = createDomElementInContainer(`#${CONST.EDITOR_ID}`,
    'div',
    'notification-layer',
    'notification-layer'
  );

  NM.notificationLager = createDomElementInContainer(`#${NM.notificationLager.id}`,
    'ul',
    'notifications',
    'notifications'
  );

  _setupNotificationManager.isDone = true;
};

const NM = {
  notify: (event = '', className = '') => {
    _setupNotificationManager();

    const NOTIFICATION_REMOVE_DELAY = 3000; // in ms
    const notification = createDomElementInContainer(`#${NM.notificationLager.id}`, 'li', 'notification', 'notification');
    notification.classList.add(className);
    notification.innerHTML = event;

    setTimeout(() => {
      notification.classList.add('open');
    }, 0);

    setTimeout(() => {
      notification.classList.add('closed');
      setTimeout(() => { notification.parentNode.removeChild(notification); }, 250);
    }, NOTIFICATION_REMOVE_DELAY);
  },
  success: (event) => {
    NM.notify(event, 'success');
  },
  error: (event) => {
    NM.notify(event, 'error');
  },
  warning: (event) => {
    NM.notify(event, 'warning');
  },
  info: (event) => {
    NM.notify(event, 'information');
  }
};

export default NM;