'use strict';

/**
 * Generate unique ID
 * @return {number} UID
 */
function getID() {
  let date = window.performance.now(); // use high-precision timer if available
  // the id should start with a letter so it can be used for query selector
  return 'axyxxxyx'.replace(/[xy]/g, (charToReplace) => {
    const rand = (date + Math.random() * 16) % 16 | 0;
    date = Math.floor(date / 16);
    return (charToReplace === 'x' ? rand : (rand & 0x3 | 0x8)).toString(16);
  });
}

export default getID;
