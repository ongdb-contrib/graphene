'use strict';

/**
 * @param date
 * @returns {*}
 * @private
 */
function _formatDate(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'minutes = minutes < 10 ? (`0${minutes}`) : minutes;
  return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
}

export default _formatDate;
