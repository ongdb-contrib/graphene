'use strict';

import CONST from '../enums/CONST';

/**
 * Check if the nodes are outside of the visible area and repositioned them to be visible
 * @param _nodes
 */
export default (_nodes) => {
  const nodes = Array.from(_nodes);

  // reposition the nodes if they are outside of the visible area
  const $editor = document.querySelector(`#${CONST.EDITOR_ID}`);
  const editorWidth = $editor.clientWidth;
  const editorHeight = $editor.clientHeight;

  const margin = 25;

  const minValX = Math.min.apply(null, nodes.map(node => node.x));
  const maxValX = Math.max.apply(null, nodes.map(node => node.x));
  const minValY = Math.min.apply(null, nodes.map(node => node.y));
  const maxValY = Math.max.apply(null, nodes.map(node => node.y));

  const moveRight = minValX < 0 ? Math.abs(minValX) + margin : 0;
  const moveLeft = maxValX - editorWidth + margin * 4;
  const moveDown = minValY < 0 ? Math.abs(minValY) + margin : 0;
  const moveUp = maxValY - editorHeight + margin;

  nodes.map(n => {
    if (moveRight > 0) { n.x += moveRight; }
    if (moveLeft > 0) { n.x -= moveLeft; }
    if (moveDown > 0) { n.y += moveDown; }
    if (moveUp > 0) { n.y -= moveUp;}

    return n;
  });

  // TODO: improve this functionality
  // case not covered: when the visible area is too small and there nodes outside in more then 1 direction (top and bottom)

  return nodes;
};
