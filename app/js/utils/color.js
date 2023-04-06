'use strict';

/**
 * Returns hex color
 * @returns {string}
 */

/**
 * @returns {string}
 */
function color() {
  const allColors = [
    '0048BA', 'B0BF1A', '7CB9E8', '00308F', 'AF002A', '84DE02', 'E32636', 'C46210', 'E52B50', 'AB274F', '3B7A57',
    'FF7E00', 'FF033E', '665D1E', '915C83', '841B2D', '3B444B', '0087BD', 'CC5500', 'BD33A4', '006B3C', 'D70040',
    '56A0D3', 'A0785A', 'FF4040', '58427C', '006400', '00416A', '50C878', '6C3082', '1B4D3E'
  ];

  if (color.index === undefined) {
    color.index = parseInt(Math.random() * allColors.length, 10);
  } else if (color.index === allColors.length - 1) {
    color.index = 0;
  } else {
    color.index += 1;
  }

  return `#${allColors[color.index]}`;
}

export default color;
