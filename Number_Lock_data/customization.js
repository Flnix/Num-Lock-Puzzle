/* variables and default values */

var HowToPlay = false; // if true, game will show 'How To Play' page

const TRIED_LEFT = 10; // the default amount of tries left
const TIMER = 60; // the default game timer by seconds.

// numpad values and positions
const NUMPAD = [
  {value:1, x:0, y:0},
  {value:2, x:1, y:0},
  {value:3, x:2, y:0},
  {value:4, x:0, y:1},
  {value:5, x:1, y:1},
  {value:6, x:2, y:1},
  {value:7, x:0, y:2},
  {value:8, x:1, y:2},
  {value:9, x:2, y:2},
  {value:0, x:1, y:3},
];

// numpad start draw positions + width/height and borders
const NUMPAD_X = 485; // start draw X position
const NUMPAD_Y = 180; // start draw Y position
const NUMPAD_W = 120; // width
const NUMPAD_H = 100; // height
const NUMPAD_PADDING_W = NUMPAD_W + 10; // horizontal borders.. The space between the numpad buttons
const NUMPAD_PADDING_H = NUMPAD_H + 10; // vertical borders.. The space between the numpad buttons

/// Screen code numbers colors
const COLOR_DEFAULT = 'white'; // number not included in the secret code
const COLOR_FIND = '#7FFF00'; // number in the secret code in the current place.
const COLOR_EXIST = 'yellow'; // number in the secret code but not in the current place.

// full screen button
const FS_X = 825; // X draw position of full screen button
const FS_Y = 65; // Y draw position of full screen button
const FS_W = 70; // full screen button width
const FS_H = 70; // full screen button height

// sound on/off button
const SN_X = FS_X-80; // X draw position of sound button
const SN_Y = FS_Y; // Y draw position of sound button
const SN_W = 70; // sound button width
const SN_H = 70; // sound button height

// "how to play" button
const HTP_X = FS_X-160; // X draw position of "how to play" button
const HTP_Y = FS_Y; // Y draw position of "how to play" button
const HTP_W = 70; // "how to play" button width
const HTP_H = 70; // "how to play" button height

// reset button
const RT_X = 95; // X draw position of reset button
const RT_Y = FS_Y; // Y draw position of reset button
const RT_W = 140; // reset button width
const RT_H = 70; // reset button height

// "top screen box" button
const TSB_X = 420; // X draw position of "top screen box" button
const TSB_Y = FS_Y; // Y draw position of "top screen box" button
const TSB_W = 160; // "top screen box" button width
const TSB_H = 70; // "top screen box" button height
