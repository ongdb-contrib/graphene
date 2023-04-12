import GraphEditor from './js/GraphEditor';

import './styles/styles.css';
import '../node_modules/codemirror/lib/codemirror.css';

/**
 * Global string method
 * @returns {string}
 */
String.prototype.toCamelCase = function () {
  return this.replace(/\b(\w+)/g, function (m, p) {
    return p[0].toUpperCase() + p.substr(1).toLowerCase();
  });
};

const localStorageItem = 'nma.grad3ph';
const localStorageItemSaves = 'nma.grad3ph.saves';
const graphEditor = new GraphEditor('body');

graphEditor.onChange(updateEvent => {
  localStorage.setItem(localStorageItem, JSON.stringify(updateEvent.data));
  localStorage.setItem(localStorageItemSaves, JSON.stringify(updateEvent.saves));
});

const dataFromLocalStorage = localStorage.getItem(localStorageItem);
const dataFromLocalStorageSaves = localStorage.getItem(localStorageItemSaves);

graphEditor.loadData({
  data: JSON.parse(dataFromLocalStorage),
  saves: JSON.parse(dataFromLocalStorageSaves)
});
