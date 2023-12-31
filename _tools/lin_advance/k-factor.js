/**
 * K-Factor Calibration Pattern
 * Copyright (C) 2019 Sineos [https://github.com/Sineos]
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
'use strict';

// Settings version of localStorage
// Increase if default settings are changed / amended
const SETTINGS_VERSION = '1.2';

function genGcode() {

  // get the values from the HTML elements
  var PRINTER = $('#PRINTER').val(),
      FILAMENT = $('#FILAMENT').val(),
      FILENAME = $('#FILENAME').val(),
      FILAMENT_DIAMETER = parseFloat($('#FILAMENT_DIAMETER').val()),
      NOZZLE_DIAMETER = parseFloat($('#NOZZLE_DIAMETER').val()),
      NOZZLE_TEMP = parseInt($('#NOZZLE_TEMP').val()),
      NOZZLE_LINE_RATIO = parseFloat($('#NOZZLE_LINE_RATIO').val()),
      BED_TEMP = parseInt($('#BED_TEMP').val()),
      SPEED_SLOW = parseInt($('#SPEED_SLOW').val()),
      SPEED_FAST = parseInt($('#SPEED_FAST').val()),
      SPEED_MOVE = parseInt($('#SPEED_MOVE').val()),
      SPEED_RETRACT = parseInt($('#SPEED_RETRACT').val()),
      UNRETRACT_SPEED = parseInt($('#UNRETRACT_SPEED').val()),
      ACCELERATION = parseInt($('#ACCELERATION').val()),
      RETRACTION = parseFloat($('#RETRACTION').val()),
      BED_SHAPE = $('#BED_SHAPE').val(),
      BEDSIZE_X = parseInt($('#BEDSIZE_X').val()),
      BEDSIZE_Y = parseInt($('#BEDSIZE_Y').val()),
      CENTER_NULL = $('#CENTER_NULL').prop('checked'),
      LAYER_HEIGHT = parseFloat($('#LAYER_HEIGHT').val()),
      TOOL_INDEX = parseFloat($('#TOOL_INDEX').val()),
      FAN_SPEED = parseFloat($('#FAN_SPEED').val()),
      EXTRUSION_MULT = parseFloat($('#EXTRUSION_MULT').val()),
      LIN_VERSION = $('#LIN_VERSION').val(),
      TYPE_PATTERN = $('#TYPE_PATTERN').val(),
      K_START = parseFloat($('#K_START').val()),
      K_END = parseFloat($('#K_END').val()),
      K_STEP = parseFloat($('#K_STEP').val()),
      X_JERK = parseFloat($('#X_JERK').val()),
      Y_JERK = parseFloat($('#Y_JERK').val()),
      Z_JERK = parseFloat($('#Z_JERK').val()),
      E_JERK = parseFloat($('#E_JERK').val()),
      DIR_PRINT = $('#DIR_PRINT').val(),
      SPACE_LINE = parseFloat($('#SPACE_LINE').val()),
      USE_FRAME = $('#USE_FRAME').prop('checked'),
      USE_PRIME = $('#USE_PRIME').prop('checked'),
      BED_LEVELING = $('#BED_LEVELING').val(),
      USE_MMS = $('#USE_MMS').prop('checked'),
      USE_FWR = $('#USE_FWR').prop('checked'),
      PRIME_EXT = parseFloat($('#PRIME_EXT').val()),
      SPEED_PRIME = parseFloat($('#SPEED_PRIME').val()),
      DWELL_PRIME = parseFloat($('#DWELL_PRIME').val()),
      SLOW_LENGTH = parseFloat($('#SLOW_LENGTH').val()),
      FAST_LENGTH = parseFloat($('#FAST_LENGTH').val()),
      OFFSET_Z = parseFloat($('#OFFSET_Z').val()),
      USE_LINE_NUM = $('#USE_LINE_NUM').prop('checked'),
      DO_Z_ALIGNMENT = $('#DO_Z_ALIGNMENT').prop('checked');

  if (BED_SHAPE === 'Round') BEDSIZE_Y = BEDSIZE_X;

  if (USE_MMS) {
    SPEED_SLOW *= 60;
    SPEED_FAST *= 60;
    SPEED_MOVE *= 60;
    SPEED_PRIME *= 60;
    SPEED_RETRACT *= 60;
    UNRETRACT_SPEED *= 60;
  }

  var RANGE_K = K_END - K_START,
      PRINT_SIZE_Y = (RANGE_K / K_STEP * SPACE_LINE) + 25, // +25 with ref marking
      PRINT_SIZE_X = (2 * SLOW_LENGTH) + FAST_LENGTH + (USE_PRIME ? 10 : 0) + (USE_LINE_NUM ? 8 : 0),
      CENTER_X = (CENTER_NULL ? 0 : BEDSIZE_X / 2),
      CENTER_Y = (CENTER_NULL ? 0 : BEDSIZE_Y / 2),
      PAT_START_X = CENTER_X - (0.5 * FAST_LENGTH) - SLOW_LENGTH + (USE_PRIME ? 5 : 0) - (USE_LINE_NUM ? 4 : 0),
      PAT_START_Y = CENTER_Y - (PRINT_SIZE_Y / 2),
      LINE_WIDTH = NOZZLE_DIAMETER * NOZZLE_LINE_RATIO,
      EXTRUSION_RATIO = LINE_WIDTH * LAYER_HEIGHT / (Math.pow(FILAMENT_DIAMETER / 2, 2) * Math.PI),
      printDirRad = DIR_PRINT * Math.PI / 180,
      FIT_WIDTH = Math.abs(PRINT_SIZE_X * Math.cos(printDirRad)) + Math.abs(PRINT_SIZE_Y * Math.sin(printDirRad)),
      FIT_HEIGHT = Math.abs(PRINT_SIZE_X * Math.sin(printDirRad)) + Math.abs(PRINT_SIZE_Y * Math.cos(printDirRad)),
      gcodeOut = document.getElementById('gcode-out');

  var basicSettings = {
    'slow': SPEED_SLOW,
    'fast': SPEED_FAST,
    'move': SPEED_MOVE,
    'centerX': CENTER_X,
    'centerY': CENTER_Y,
    'printDir': DIR_PRINT,
    'lineWidth': LINE_WIDTH,
    'extRatio': EXTRUSION_RATIO,
    'extMult': EXTRUSION_MULT,
    'extMultPrime': PRIME_EXT,
    'retractDist': RETRACTION,
    'retractSpeed': SPEED_RETRACT,
    'unretractSpeed': UNRETRACT_SPEED,
    'fwRetract': USE_FWR
  };

  var patSettings = {
    'lengthSlow': SLOW_LENGTH,
    'lengthFast': FAST_LENGTH,
    'kStart': K_START,
    'kEnd': K_END,
    'kStep': K_STEP,
    'lineSpacing': SPACE_LINE
  };

  // Start G-code for pattern
  var k_script = `; ### Marlin K-Factor Calibration Pattern ###
; -------------------------------------------
;
; Printer: ${PRINTER}
; Filament: ${FILAMENT}
; Created: ${new Date()}
;
; Settings Printer:
; Filament Diameter = ${FILAMENT_DIAMETER} mm
; Nozzle Diameter = ${NOZZLE_DIAMETER} mm
; Nozzle Temperature = ${NOZZLE_TEMP} °C
; Bed Temperature = ${BED_TEMP} °C
; Retraction Distance = ${RETRACTION} mm
; Layer Height = ${LAYER_HEIGHT} mm
; Extruder = ${TOOL_INDEX}
; Fan Speed = ${FAN_SPEED} %
; Z-axis Offset = ${OFFSET_Z} mm
;
; Settings Print Bed:
; Bed Shape = ${BED_SHAPE}
${BED_SHAPE === 'Round' ? `; Bed Diameter = ${BEDSIZE_X} mm` : `; Bed Size X = ${BEDSIZE_X} mm
; Bed Size Y = ${BEDSIZE_Y} mm`}
; Origin Bed Center = ${CENTER_NULL ? 'true' : 'false'}
;
; Settings Speed:
; Slow Printing Speed = ${SPEED_SLOW} mm/min
; Fast Printing Speed = ${SPEED_FAST} mm/min
; Movement Speed = ${SPEED_MOVE} mm/min
; Retract Speed = ${SPEED_RETRACT} mm/min
; Unretract Speed = ${UNRETRACT_SPEED} mm/min
; Printing Acceleration = ${ACCELERATION} mm/s^2
; Jerk X-axis = ${X_JERK !== -1 ? X_JERK : ' firmware default'}
; Jerk Y-axis = ${Y_JERK !== -1 ? Y_JERK : ' firmware default'}
; Jerk Z-axis = ${Z_JERK !== -1 ? Z_JERK : ' firmware default'}
; Jerk Extruder = ${E_JERK !== -1 ? E_JERK : ' firmware default'}
;
; Settings Pattern:
; Linear Advance Version = ${LIN_VERSION}
; Starting Value Factor = ${K_START}
; Ending Value Factor = ${K_END}
; Factor Stepping = ${K_STEP}
; Test Line Spacing = ${SPACE_LINE} mm
; Test Line Length Slow = ${SLOW_LENGTH} mm
; Test Line Length Fast = ${FAST_LENGTH} mm
; Print Pattern = ${TYPE_PATTERN === 'alt' ? 'Alternate' : 'Standard'}
; Print Frame = ${USE_FRAME ? 'true' : 'false'}
; Number Lines = ${USE_LINE_NUM ? 'true' : 'false'}
; Print Size X = ${FIT_WIDTH} mm
; Print Size Y = ${FIT_HEIGHT} mm
; Print Rotation = ${DIR_PRINT} degree
;
; Settings Advance:
; Nozzle / Line Ratio = ${NOZZLE_LINE_RATIO}
; Bed leveling = ${BED_LEVELING}
; Use FWRETRACT = ${USE_FWR ? 'true' : 'false'}
; Extrusion Multiplier = ${EXTRUSION_MULT}
; Prime Nozzle = ${USE_PRIME ? 'true' : 'false'}
; Prime Extrusion Multiplier = ${PRIME_EXT}
; Prime Speed = ${SPEED_PRIME}
; Dwell Time = ${DWELL_PRIME} s
;
; prepare printing
;
G21 ; Millimeter units
G90 ; Absolute XYZ
M83 ; Relative E
G28 ; Home all axes
${DO_Z_ALIGNMENT ? 'G34 ; Align Z' : ''}
T${TOOL_INDEX} ; Switch to tool ${TOOL_INDEX}
G1 Z10 F100 ; Z raise
M104 S${NOZZLE_TEMP} ; Set nozzle temperature (no wait)
M190 S${BED_TEMP} ; Set bed temperature (wait)
M109 S${NOZZLE_TEMP} ; Wait for nozzle temp
${BED_LEVELING !== '0' ? BED_LEVELING + '; Activate bed leveling compensation' : ''}
M204 P${ACCELERATION} ; Acceleration
${X_JERK !== -1 ? `M205 X${X_JERK} ; X Jerk` : ''}
${Y_JERK !== -1 ? `M205 Y${Y_JERK} ; Y Jerk` : ''}
${Z_JERK !== -1 ? `M205 Z${Z_JERK} ; Z Jerk` : ''}
${E_JERK !== -1 ? `M205 E${E_JERK} ; E Jerk` : ''}
G92 E0 ; Reset extruder distance
M106 P${TOOL_INDEX} S${Math.round(FAN_SPEED * 2.55)}

${moveTo(CENTER_X, CENTER_Y, basicSettings)}
G1 Z${LAYER_HEIGHT + OFFSET_Z} F${SPEED_SLOW} ; Move to layer height
`;

  // Prime nozzle if activated
  if (USE_PRIME) {
    var primeStartX = CENTER_X - SLOW_LENGTH - (0.5 * FAST_LENGTH) - (USE_LINE_NUM ? 4 : 0) - 5,
        primeStartY = CENTER_Y - (PRINT_SIZE_Y / 2);

    k_script += ';\n' +
                '; prime nozzle\n' +
                ';\n' +
                moveTo(primeStartX, primeStartY, basicSettings) +
                createLine(primeStartX, primeStartY + PRINT_SIZE_Y, PRINT_SIZE_Y, basicSettings, {'extMult': PRIME_EXT, 'speed': SPEED_PRIME}) +
                moveTo(primeStartX + (LINE_WIDTH * 1.5), primeStartY + PRINT_SIZE_Y, basicSettings) +
                createLine(primeStartX + (LINE_WIDTH * 1.5), primeStartY, -PRINT_SIZE_Y, basicSettings, {'extMult': PRIME_EXT, 'speed': SPEED_PRIME}) +
                doEfeed('-', basicSettings, (USE_FWR ? 'FWR' : 'STD'));
  }

  // if selected, print an anchor frame around test line start and end points
  if (USE_FRAME) {
    var frameStartX1 = PAT_START_X,
        frameStartX2 = PAT_START_X + (2 * SLOW_LENGTH) + FAST_LENGTH,
        frameStartY = PAT_START_Y - 3,
        frameLength = PRINT_SIZE_Y - 19;

    k_script += ';\n' +
                '; print anchor frame\n' +
                ';\n' +
                moveTo(frameStartX1, frameStartY, basicSettings) +
                (USE_PRIME ? doEfeed('+', basicSettings, (USE_FWR ? 'FWR' : 'STD')) : '') +
                createLine(frameStartX1, frameStartY + frameLength, frameLength, basicSettings, {'extMult': EXTRUSION_MULT * 1.1}) +
                moveTo(frameStartX1 + LINE_WIDTH, frameStartY + frameLength, basicSettings) +
                createLine(frameStartX1 + LINE_WIDTH, frameStartY, -frameLength, basicSettings, {'extMult': EXTRUSION_MULT * 1.1}) +
                doEfeed('-', basicSettings, (USE_FWR ? 'FWR' : 'STD')) +
                moveTo(frameStartX2, frameStartY, basicSettings) +
                doEfeed('+', basicSettings, (USE_FWR ? 'FWR' : 'STD')) +
                createLine(frameStartX2, frameStartY + frameLength, frameLength, basicSettings, {'extMult': EXTRUSION_MULT * 1.1}) +
                moveTo(frameStartX2 - LINE_WIDTH, frameStartY + frameLength, basicSettings) +
                createLine(frameStartX2 - LINE_WIDTH, frameStartY, -frameLength, basicSettings, {'extMult': EXTRUSION_MULT * 1.1}) +
                doEfeed('-', basicSettings, (USE_FWR ? 'FWR' : 'STD'));
  }

  // insert a retract if no prime and no frame
  if (!USE_PRIME && !USE_FRAME)
    k_script += doEfeed('-', basicSettings, (USE_FWR ? 'FWR' : 'STD'));

  // generate the k-factor Test pattern
  k_script += ';\n' +
              '; start the Test pattern\n' +
              ';\n' +
              (DWELL_PRIME ? 'G4 P' + (DWELL_PRIME * 1000) + ' ; Pause (dwell) for 2 seconds\n' : '') +
              moveTo(PAT_START_X, PAT_START_Y, basicSettings);

  if (TYPE_PATTERN === 'std')
    k_script += createStdPattern(PAT_START_X, PAT_START_Y, basicSettings, patSettings);
  else if (TYPE_PATTERN === 'alt')
    k_script += createAltPattern(PAT_START_X, PAT_START_Y, basicSettings, patSettings);

  // mark area of speed changes
  var refStartX1 = CENTER_X - (0.5 * FAST_LENGTH) + (USE_PRIME ? 5 : 0) - (USE_LINE_NUM ? 4 : 0),
      refStartX2 = CENTER_X + (0.5 * FAST_LENGTH) + (USE_PRIME ? 5 : 0) - (USE_LINE_NUM ? 4 : 0),
      refStartY = CENTER_Y + (PRINT_SIZE_Y / 2) - 20;

  k_script += ';\n' +
              '; Mark the test area for reference\n' +
              'M117 K0\n' +
              'M900 K0 ; Set K-factor 0\n' +
              moveTo(refStartX1, refStartY, basicSettings) +
              doEfeed('+', basicSettings, (USE_FWR ? 'FWR' : 'STD')) +
              createLine(refStartX1, refStartY + 20, 20, basicSettings) +
              doEfeed('-', basicSettings, (USE_FWR ? 'FWR' : 'STD')) +
              moveTo(refStartX2, refStartY, basicSettings) +
              doEfeed('+', basicSettings, (USE_FWR ? 'FWR' : 'STD')) +
              createLine(refStartX2, refStartY + 20, 20, basicSettings) +
              doEfeed('-', basicSettings, (USE_FWR ? 'FWR' : 'STD')) +
              zHop((LAYER_HEIGHT + OFFSET_Z) + 0.1, basicSettings);

  // print K values beside the test lines
  if (USE_LINE_NUM) {
    var numStartX = CENTER_X + (0.5 * FAST_LENGTH) + SLOW_LENGTH + (USE_PRIME ? 5 : 0) - 2,
        numStartY = PAT_START_Y - 2,
        stepping = 0;

    k_script += ';\n' +
                '; print K-values\n' +
                ';\n';

    for (var i = K_START; i <= K_END; i += K_STEP) {
      if (stepping % 2 === 0) {
        k_script += moveTo(numStartX, numStartY + (stepping * SPACE_LINE), basicSettings) +
                    zHop((LAYER_HEIGHT + OFFSET_Z), basicSettings) +
                    doEfeed('+', basicSettings, (USE_FWR ? 'FWR' : 'STD')) +
                    createGlyphs(numStartX, numStartY + (stepping * SPACE_LINE), basicSettings, Math.round10(i, -3)) +
                    doEfeed('-', basicSettings, (USE_FWR ? 'FWR' : 'STD')) +
                    zHop((LAYER_HEIGHT + OFFSET_Z) + 0.1, basicSettings);
      }
      stepping += 1;
    }
  }

  k_script += ';\n' +
              '; FINISH\n' +
              ';\n' +
              'M107 ; Turn off fan\n' +
              'M400 ; Finish moving\n' +
              'M104 S0 ; Turn off hotend\n' +
              'M140 S0 ; Turn off bed\n' +
              'G1 Z30 X' + (CENTER_NULL ? 0 : BEDSIZE_X) + ' Y' + (CENTER_NULL ? 0 : BEDSIZE_Y) + ' F' + SPEED_MOVE + ' ; Move away from the print\n' +
              'M84 ; Disable motors\n' +
              'M501 ; Load settings from EEPROM\n' +
              ';';

  gcodeOut.value = k_script;
}

// Save content of textarea to file using
// https://github.com/eligrey/FileSaver.js
function saveTextAsFile() {
  var gcodeText = document.getElementById('gcode-out').value,
      textFileAsBlob = new Blob([gcodeText], {type: 'text/plain'}),
      usersFilename = document.getElementById('FILENAME').value,
      filename = usersFilename || '',
      fileNameToSaveAs = filename + 'kfactor.gcode';
  if (gcodeText) {
    saveAs(textFileAsBlob, fileNameToSaveAs);
  } else {
    alert('Generate G-code first');
    return;
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
(function() {

  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */

  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || Number(exp) === 0) return Math[type](value);

    value = Number(value);
    exp = Number(exp);
    // If the value is not a number or the exp is not an integer...
    if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
      return NaN;

    // If the value is negative...
    if (value < 0) return -decimalAdjust(type, -value, exp);

    // Shift
    value = value.toString().split('e');
    value = Math[type](Number(value[0] + 'e' + (value[1] ? (Number(value[1]) - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return Number(value[0] + 'e' + (value[1] ? (Number(value[1]) + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
}());

// get the number of decimal places of a float
function getDecimals(num) {
  let match = (String(num)).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) return num;
  return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? Number(match[2]) : 0));
}

// print a line between current position and target
function createLine(coordX, coordY, length, basicSettings, optional) {
  var ext = 0, gcode = '';

  //handle optional function arguements passed as object
  var defaults = {
    speed: basicSettings['slow'],
    extMult: basicSettings['extMult'],
    comment: ' ; print line\n'
  };
  var optArgs = $.extend({}, defaults, optional);

  ext = Math.round10(basicSettings['extRatio'] * optArgs['extMult'] * Math.abs(length), -4);

  gcode += 'G1 X' + Math.round10(rotateX(coordX, basicSettings['centerX'], coordY, basicSettings['centerY'], basicSettings['printDir']), -4) +
             ' Y' + Math.round10(rotateY(coordX, basicSettings['centerX'], coordY, basicSettings['centerY'], basicSettings['printDir']), -4) +
             ' E' + ext + ' F' + optArgs['speed'] + optArgs['comment'];

  return gcode;
}

// move print head to coordinates
function moveTo(coordX, coordY, basicSettings) {
  var gcode = '';

  gcode += 'G1 X' + Math.round10(rotateX(coordX, basicSettings['centerX'], coordY, basicSettings['centerY'], basicSettings['printDir']), -4) +
             ' Y' + Math.round10(rotateY(coordX, basicSettings['centerX'], coordY, basicSettings['centerY'], basicSettings['printDir']), -4) +
             ' F' + basicSettings['move'] + ' ; move to start\n';
  return gcode;
}

// create retract / un-retract gcode
function doEfeed(dir, basicSettings, type) {
  var gcode = '';

  switch (true) {
  case (type === 'STD' && dir === '+'):
    gcode += 'G1 E' + basicSettings['retractDist'] + ' F' + basicSettings['unretractSpeed'] + ' ; un-retract\n';
    break;
  case (type === 'STD' && dir === '-'):
    gcode += 'G1 E-' + basicSettings['retractDist'] + ' F' + basicSettings['retractSpeed'] + ' ; retract\n';
    break;
  case (type === 'FWR' && dir === '+'):
    gcode += 'G11 ; un-retract\n';
    break;
  case (type === 'FWR' && dir === '-'):
    gcode += 'G10 ; retract\n';
    break;
  }

  return gcode;
}

// create alternat test pattern
function createAltPattern(startX, startY, basicSettings, patSettings) {
  var j = 0,
      k = 0,
      gcode = '';

  gcode += doEfeed('+', basicSettings, (basicSettings['fwRetract'] ? 'FWR' : 'STD'));

  for (var i = patSettings['kStart']; i <= patSettings['kEnd']; i += patSettings['kStep']) {
    if (k % 2 === 0) {
      gcode += 'M900 K' + Math.round10(i, -3) + ' ; set K-factor\n' +
               'M117 K' + Math.round10(i, -3) + ' ; \n' +
               createLine(startX + patSettings['lengthSlow'], startY + j, patSettings['lengthSlow'], basicSettings, {'speed': basicSettings['slow']}) +
               createLine(startX + patSettings['lengthSlow'] + patSettings['lengthFast'], startY + j, patSettings['lengthFast'], basicSettings, {'speed': basicSettings['fast']}) +
               createLine(startX + (2 * patSettings['lengthSlow']) + patSettings['lengthFast'], startY + j, patSettings['lengthSlow'], basicSettings, {'speed': basicSettings['slow']}) +
               createLine(startX + (2 * patSettings['lengthSlow']) + patSettings['lengthFast'], startY + j + patSettings['lineSpacing'], patSettings['lineSpacing'], basicSettings, {'speed': basicSettings['fast']});
      j += patSettings['lineSpacing'];
      k += 1;
    } else if (k % 2 !== 0) {
      gcode += 'M900 K' + Math.round10(i, -3) + ' ; set K-factor\n' +
               'M117 K' + Math.round10(i, -3) + ' ; \n' +
               createLine(startX + patSettings['lengthSlow'] + patSettings['lengthFast'], startY + j, patSettings['lengthSlow'], basicSettings, {'speed': basicSettings['slow']}) +
               createLine(startX + patSettings['lengthSlow'], startY + j, patSettings['lengthFast'], basicSettings, {'speed': basicSettings['fast']}) +
               createLine(startX, startY + j, patSettings['lengthSlow'], basicSettings, {'speed': basicSettings['slow']}) +
               createLine(startX, startY + j + patSettings['lineSpacing'], patSettings['lineSpacing'], basicSettings, {'speed': basicSettings['fast']});
      j += patSettings['lineSpacing'];
      k += 1;
    }
  }
  gcode += doEfeed('-', basicSettings, (basicSettings['fwRetract'] ? 'FWR' : 'STD'));
  return gcode;
}

// create standard test pattern
function createStdPattern(startX, startY, basicSettings, patSettings) {
  var j = 0,
      gcode = '';

  for (var i = patSettings['kStart']; i <= patSettings['kEnd']; i += patSettings['kStep']) {
    gcode += 'M900 K' + Math.round10(i, -3) + ' ; set K-factor\n' +
             'M117 K' + Math.round10(i, -3) + ' ; \n' +
             doEfeed('+', basicSettings, (basicSettings['fwRetract'] ? 'FWR' : 'STD')) +
             createLine(startX + patSettings['lengthSlow'], startY + j, patSettings['lengthSlow'], basicSettings, {'speed': basicSettings['slow']}) +
             createLine(startX + patSettings['lengthSlow'] + patSettings['lengthFast'], startY + j, patSettings['lengthFast'], basicSettings, {'speed': basicSettings['fast']}) +
             createLine(startX + (2 * patSettings['lengthSlow']) + patSettings['lengthFast'], startY + j, patSettings['lengthSlow'], basicSettings, {'speed': basicSettings['slow']}) +
             doEfeed('-', basicSettings, (basicSettings['fwRetract'] ? 'FWR' : 'STD')) +
             (i !== patSettings['kEnd'] ? moveTo(startX, startY + j + patSettings['lineSpacing'], basicSettings) : '');
    j += patSettings['lineSpacing'];
  }
  return gcode;
}

// create digits for K line numbering
function createGlyphs(startX, startY, basicSettings, value) {
  var glyphSegHeight = 2,
      glyphSegHeight2 = 0.4,
      glyphSpacing = 3.0,
      glyphString = '',
      xCount = 0,
      yCount = 0,
      sNumber = value.toString(),
      glyphSeg = {
        '1': ['up', 'up'],
        '2': ['mup', 'mup', 'right', 'down', 'left', 'down', 'right'],
        '3': ['mup', 'mup', 'right', 'down', 'down', 'left', 'mup', 'right'],
        '4': ['mup', 'mup', 'down', 'right', 'mup', 'down', 'down'],
        '5': ['right', 'up', 'left', 'up', 'right'],
        '6': ['mup', 'right', 'down', 'left', 'up', 'up', 'right'],
        '7': ['mup', 'mup', 'right', 'down', 'down'],
        '8': ['mup', 'right', 'down', 'left', 'up', 'up', 'right', 'down'],
        '9': ['right', 'up', 'left', 'up', 'right', 'down'],
        '0': ['right', 'up', 'up', 'left', 'down', 'down'],
        '.': ['dot']
      };

  for (var i = 0, len = sNumber.length; i < len; i += 1) {
    for (var key in glyphSeg[sNumber.charAt(i)]) {
      if(glyphSeg[sNumber.charAt(i)].hasOwnProperty(key)) {
        var up = createLine(startX + (xCount * glyphSegHeight), startY + (yCount * glyphSegHeight) + glyphSegHeight, glyphSegHeight, basicSettings, {'speed': basicSettings['slow'], 'comment': ' ; ' + sNumber.charAt(i) + '\n'}),
            down = createLine(startX + (xCount * glyphSegHeight), startY + (yCount * glyphSegHeight) - glyphSegHeight, glyphSegHeight, basicSettings, {'speed': basicSettings['slow'], 'comment': ' ; ' + sNumber.charAt(i) + '\n'}),
            right = createLine(startX + (xCount * glyphSegHeight) + glyphSegHeight, startY + (yCount * glyphSegHeight), glyphSegHeight, basicSettings, {'speed': basicSettings['slow'], 'comment': ' ; ' + sNumber.charAt(i) + '\n'}),
            left = createLine(startX + (xCount * glyphSegHeight) - glyphSegHeight, startY + (yCount * glyphSegHeight), glyphSegHeight, basicSettings, {'speed': basicSettings['slow'], 'comment': ' ; ' + sNumber.charAt(i) + '\n'}),
            mup = moveTo(startX + (xCount * glyphSegHeight), startY + (yCount * glyphSegHeight) + glyphSegHeight, basicSettings),
            dot = createLine(startX, startY + glyphSegHeight2, glyphSegHeight2, basicSettings, {speed: basicSettings['slow'], comment: ' ; dot\n'});
        if (glyphSeg[sNumber.charAt(i)][key] === 'up') {
          glyphString += up;
          yCount += 1;
        } else if (glyphSeg[sNumber.charAt(i)][key] === 'down') {
          glyphString += down;
          yCount -= 1;
        } else if (glyphSeg[sNumber.charAt(i)][key] === 'right') {
          glyphString += right;
          xCount += 1;
        } else if (glyphSeg[sNumber.charAt(i)][key] === 'left') {
          glyphString += left;
          xCount -= 1;
        } else if (glyphSeg[sNumber.charAt(i)][key] === 'mup') {
          glyphString += mup;
          yCount += 1;
        } else if (glyphSeg[sNumber.charAt(i)][key] === 'dot') {
          glyphString += dot;
        }
      }
    }
    if (sNumber.charAt(i) === '1' || sNumber.charAt(i) === '.') {
      startX += 1;
    } else {
      startX += glyphSpacing;
    }
    if (i !== sNumber.length - 1) {
      glyphString += doEfeed('-', basicSettings, (basicSettings['fwRetract'] ? 'FWR' : 'STD')) +
                     moveTo(startX, startY, basicSettings) +
                     doEfeed('+', basicSettings, (basicSettings['fwRetract'] ? 'FWR' : 'STD'));
    }
    yCount = 0;
    xCount = 0;
  }
  return glyphString;
}

// gcode for small z hop
function zHop(hop, basicSettings) {
  var gcode = '';

  gcode += 'G1 Z' + Math.round10(hop, -3) + ' F' + basicSettings['slow'] + ' ; zHop\n';

  return gcode;
}

// rotate x around a defined center xm, ym
function rotateX(x, xm, y, ym, a) {
  a = a * Math.PI / 180; // Convert to radians
  var cos = Math.cos(a),
      sin = Math.sin(a);

  // Subtract midpoints, so that midpoint is translated to origin
  // and add it in the end again
  //var xr = (x - xm) * cos - (y - ym) * sin + xm; //CCW
  var xr = (cos * (x - xm)) + (sin * (y - ym)) + xm; //CW
  return xr;
}

// rotate y around a defined center xm, ym
function rotateY(x, xm, y, ym, a) {
  a = a * Math.PI / 180; // Convert to radians
  var cos = Math.cos(a),
      sin = Math.sin(a);

  // Subtract midpoints, so that midpoint is translated to origin
  // and add it in the end again
  //var yr = (x - xm) * sin + (y - ym) * cos + ym; //CCW
  var yr = (cos * (y - ym)) - (sin * (x - xm)) + ym; //CW
  return yr;
}

// save current settings as localStorage object
function setLocalStorage() {
  let FILAMENT_DIAMETER = parseFloat($('#FILAMENT_DIAMETER').val()),
      NOZZLE_DIAMETER = parseFloat($('#NOZZLE_DIAMETER').val()),
      NOZZLE_TEMP = parseInt($('#NOZZLE_TEMP').val()),
      NOZZLE_LINE_RATIO = parseFloat($('#NOZZLE_LINE_RATIO').val()),
      BED_TEMP = parseInt($('#BED_TEMP').val()),
      SPEED_SLOW = parseInt($('#SPEED_SLOW').val()),
      SPEED_FAST = parseInt($('#SPEED_FAST').val()),
      SPEED_MOVE = parseInt($('#SPEED_MOVE').val()),
      SPEED_RETRACT = parseInt($('#SPEED_RETRACT').val()),
      ACCELERATION = parseInt($('#ACCELERATION').val()),
      RETRACTION = parseFloat($('#RETRACTION').val()),
      BED_SHAPE = $('#BED_SHAPE').val(),
      BEDSIZE_X = parseInt($('#BEDSIZE_X').val()),
      BEDSIZE_Y = parseInt($('#BEDSIZE_Y').val()),
      CENTER_NULL = $('#CENTER_NULL').prop('checked'),
      LAYER_HEIGHT = parseFloat($('#LAYER_HEIGHT').val()),
      TOOL_INDEX = parseFloat($('#TOOL_INDEX').val()),
      FAN_SPEED = parseFloat($('#FAN_SPEED').val()),
      EXTRUSION_MULT = parseFloat($('#EXTRUSION_MULT').val()),
      LIN_VERSION = $('#LIN_VERSION').val(),
      TYPE_PATTERN = $('#TYPE_PATTERN').val(),
      K_START = parseFloat($('#K_START').val()),
      K_END = parseFloat($('#K_END').val()),
      K_STEP = parseFloat($('#K_STEP').val()),
      X_JERK = parseFloat($('#X_JERK').val()),
      Y_JERK = parseFloat($('#Y_JERK').val()),
      Z_JERK = parseFloat($('#Z_JERK').val()),
      E_JERK = parseFloat($('#E_JERK').val()),
      DIR_PRINT = $('#DIR_PRINT').val(),
      SPACE_LINE = parseFloat($('#SPACE_LINE').val()),
      USE_FRAME = $('#USE_FRAME').prop('checked'),
      USE_PRIME = $('#USE_PRIME').prop('checked'),
      PRIME_EXT = parseFloat($('#PRIME_EXT').val()),
      SPEED_PRIME = parseFloat($('#SPEED_PRIME').val()),
      DWELL_PRIME = parseFloat($('#DWELL_PRIME').val()),
      SLOW_LENGTH = parseFloat($('#SLOW_LENGTH').val()),
      FAST_LENGTH = parseFloat($('#FAST_LENGTH').val()),
      OFFSET_Z = parseFloat($('#OFFSET_Z').val()),
      USE_FWR = $('#USE_FWR').prop('checked'),
      USE_MMS = $('#USE_MMS').prop('checked'),
      USE_LINE_NUM = $('#USE_LINE_NUM').prop('checked');

  let settings = {
    'Version': SETTINGS_VERSION,
    'FILAMENT_DIAMETER': FILAMENT_DIAMETER,
    'NOZZLE_DIAMETER': NOZZLE_DIAMETER,
    'NOZZLE_TEMP': NOZZLE_TEMP,
    'NOZZLE_LINE_RATIO': NOZZLE_LINE_RATIO,
    'BED_TEMP': BED_TEMP,
    'SPEED_SLOW': SPEED_SLOW,
    'SPEED_FAST': SPEED_FAST,
    'SPEED_MOVE': SPEED_MOVE,
    'SPEED_RETRACT': SPEED_RETRACT,
    'ACCELERATION': ACCELERATION,
    'RETRACTION': RETRACTION,
    'BED_SHAPE': BED_SHAPE,
    'BEDSIZE_X': BEDSIZE_X,
    'BEDSIZE_Y': BEDSIZE_Y,
    'CENTER_NULL': CENTER_NULL,
    'LAYER_HEIGHT': LAYER_HEIGHT,
    'TOOL_INDEX': TOOL_INDEX,
    'FAN_SPEED': FAN_SPEED,
    'EXTRUSION_MULT': EXTRUSION_MULT,
    'LIN_VERSION': LIN_VERSION,
    'TYPE_PATTERN': TYPE_PATTERN,
    'K_START': K_START,
    'K_END': K_END,
    'K_STEP': K_STEP,
    'X_JERK': X_JERK,
    'Y_JERK': Y_JERK,
    'Z_JERK': Z_JERK,
    'E_JERK': E_JERK,
    'DIR_PRINT': DIR_PRINT,
    'SPACE_LINE': SPACE_LINE,
    'USE_FRAME': USE_FRAME,
    'USE_PRIME': USE_PRIME,
    'PRIME_EXT': PRIME_EXT,
    'SPEED_PRIME': SPEED_PRIME,
    'DWELL_PRIME': DWELL_PRIME,
    'SLOW_LENGTH': SLOW_LENGTH,
    'FAST_LENGTH': FAST_LENGTH,
    'OFFSET_Z': OFFSET_Z,
    'USE_FWR': USE_FWR,
    'USE_MMS': USE_MMS,
    'USE_LINE_NUM': USE_LINE_NUM
  };

  const lsSettings = JSON.stringify(settings);
  window.localStorage.setItem('LIN_SETTINGS', lsSettings);
}

// toggle between mm/s and mm/min speed settings
function speedToggle() {
  let SPEED_SLOW = $('#SPEED_SLOW').val(),
      SPEED_FAST = $('#SPEED_FAST').val(),
      SPEED_MOVE = $('#SPEED_MOVE').val(),
      SPEED_RETRACT = $('#SPEED_RETRACT').val(),
      SPEED_PRIME = $('#SPEED_PRIME').val();
  if ($('#USE_MMS').is(':checked')) {
    SPEED_SLOW = $('#SPEED_SLOW').val();
    SPEED_FAST = $('#SPEED_FAST').val();
    SPEED_MOVE = $('#SPEED_MOVE').val();
    SPEED_RETRACT = $('#SPEED_RETRACT').val();
    SPEED_PRIME = $('#SPEED_PRIME').val();
    $('#SPEED_SLOW').val(SPEED_SLOW / 60);
    $('#SPEED_FAST').val(SPEED_FAST / 60);
    $('#SPEED_MOVE').val(SPEED_MOVE / 60);
    $('#SPEED_RETRACT').val(SPEED_RETRACT / 60);
    $('#SPEED_PRIME').val(SPEED_PRIME / 60);
  } else {
    SPEED_SLOW = $('#SPEED_SLOW').val();
    SPEED_FAST = $('#SPEED_FAST').val();
    SPEED_MOVE = $('#SPEED_MOVE').val();
    SPEED_RETRACT = $('#SPEED_RETRACT').val();
    SPEED_PRIME = $('#SPEED_PRIME').val();
    $('#SPEED_SLOW').val(SPEED_SLOW * 60);
    $('#SPEED_FAST').val(SPEED_FAST * 60);
    $('#SPEED_MOVE').val(SPEED_MOVE * 60);
    $('#SPEED_RETRACT').val(SPEED_RETRACT * 60);
    $('#SPEED_PRIME').val(SPEED_PRIME * 60);
  }
}

// toggle between round and rectangular bed shape
function toggleBedShape() {
  if ($('#BED_SHAPE').val() === 'Round') {
    $('label[for=\'BEDSIZE_X\']').text('Bed Diameter:');
    $('#shape').text('Diameter (mm) of the bed');
    $('#BEDSIZE_Y').prop('disabled', true);
    $('label[for=BEDSIZE_Y]').css({opacity: 0.5});
    if (!$('#CENTER_NULL').is(':checked')) {
      $('#CENTER_NULL').prop('checked', !$('#CENTER_NULL').prop('checked'));
    }
  } else {
    $('label[for=\'BEDSIZE_X\']').text('Bed Size X:');
    $('#shape').text('Size (mm) of the bed in X');
    $('#BEDSIZE_Y').prop('disabled', false);
    $('label[for=BEDSIZE_Y]').css({opacity: 1});
  }
}

// toggle between standard and alternate pattern type
function patternType() {
  if ($('#TYPE_PATTERN').val() === 'alt') {
    if ($('#USE_FRAME').is(':checked')) {
      $('#USE_FRAME').prop('checked', false).prop('disabled', true);
      $('label[for=USE_FRAME]').css({opacity: 0.5});
    } else {
      $('#USE_FRAME').prop('disabled', true);
      $('label[for=USE_FRAME]').css({opacity: 0.5});
    }
  } else if ($('#TYPE_PATTERN').val() === 'std') {
    $('#USE_FRAME').prop('disabled', false);
    $('label[for=USE_FRAME]').css({opacity: 1});
  }
}

// toggle prime relevant options
function togglePrime() {
  const ch = $('#USE_PRIME').is(':checked');
  $('#PRIME_EXT').prop('disabled', !ch);
  $('label[for=PRIME_EXT]').css({opacity: ch ? 1 : 0.5});
}

// toggle options for LIN_ADVANCE v1.0 and v1.5
function toggleVersion() {
  if ($('#LIN_VERSION').val() === '1.5') {
    $('#K_START').attr('step', 'any').val('0');
    $('#K_END').attr('step', 'any').val('2');
    $('#K_STEP').attr('step', 'any').val('0.2');
    $('#start_factor').text('Starting value for the K-factor');
    $('#end_factor').text('Ending value of the K-factor');
    $('#step_factor').text('Stepping of the K-factor in the test pattern. Needs to be an exact divisor of the K-factor Range (End - Start)');
  } else {
    $('#K_START').attr('step', '1').val('0');
    $('#K_END').attr('step', '1').val('100');
    $('#K_STEP').attr({ step: '1', value: '5' }).val('5');
    $('#start_factor').text('Starting value for the K-factor. Usually 0 but for bowden setups you might want to start higher, e.g. 30');
    $('#end_factor').text('Ending value of the K-factor. Bowden setups may be higher than 100');
    $('#step_factor').text('Stepping of the K-factor in the test pattern. Needs to be an exact divisor of the K-factor Range (End - Start)');
  }
}

// toggle between standard and firmware retract
function toggleRetract() {
  if ($('#USE_FWR').is(':checked')) {
    $('#SPEED_RETRACT').prop('disabled', true);
    $('label[for=SPEED_RETRACT]').css({opacity: 0.5});
  } else {
    $('#SPEED_RETRACT').prop('disabled', false);
    $('label[for=SPEED_RETRACT]').css({opacity: 1.0});
  }
}

// sanity checks for pattern / bed size
function validateInput() {
  // Don't use parseInt or parseFloat for validating, since both
  // functions will have special parsing characteristics leading to
  // false numeric validation
  const nanfields = [ 'BEDSIZE_X', 'BEDSIZE_Y', 'K_START', 'K_END', 'K_STEP', 'SPACE_LINE',
                      'SPEED_SLOW', 'SPEED_FAST', 'SLOW_LENGTH', 'FAST_LENGTH', 'FILAMENT_DIAMETER',
                      'NOZZLE_DIAMETER', 'NOZZLE_LINE_RATIO', 'LAYER_HEIGHT', 'FAN_SPEED', 'EXTRUSION_MULT',
                      'PRIME_EXT', 'OFFSET_Z', 'X_JERK', 'Y_JERK', 'Z_JERK', 'E_JERK',
                      'NOZZLE_TEMP', 'BED_TEMP', 'SPEED_MOVE', 'SPEED_RETRACT', 'ACCELERATION',
                      'RETRACTION', 'SPEED_PRIME', 'DWELL_PRIME' ];
  var testNaN = {};
  for (let f of nanfields) testNaN[f] = $(`#${f}`).val();

  var selectShape = $('#BED_SHAPE'),
      bedShape = selectShape.val(),
      selectDir = $('#DIR_PRINT'),
      printDir = selectDir.val(),
      usePrime = $('#USE_PRIME').prop('checked'),
      useLineNo = $('#USE_LINE_NUM').prop('checked'),
      kspan = parseFloat(testNaN['K_END']) - parseFloat(testNaN['K_START']),
      sizeY = (kspan / parseFloat(testNaN['K_STEP']) * parseFloat(testNaN['SPACE_LINE'])) + 25, // +25 with ref marking
      sizeX = (2 * parseFloat(testNaN['SLOW_LENGTH'])) + parseFloat(testNaN['FAST_LENGTH']) + (usePrime ? 10 : 0) + (useLineNo ? 8 : 0),
      printDirRad = printDir * Math.PI / 180,
      fitWidth = Math.round10(Math.abs(sizeX * Math.cos(printDirRad)) + Math.abs(sizeY * Math.sin(printDirRad)), 0),
      fitHeight = Math.round10(Math.abs(sizeX * Math.sin(printDirRad)) + Math.abs(sizeY * Math.cos(printDirRad)), 0),
      decimals = getDecimals(parseFloat(testNaN['K_STEP'])),
      invalidDiv = 0;

  // Start clean
  const clean = [ 'K_START', 'K_END', 'K_STEP', 'SPACE_LINE', 'SLOW_LENGTH', 'FAST_LENGTH', 'FILAMENT_DIAMETER',
                  'NOZZLE_DIAMETER', 'LAYER_HEIGHT', 'EXTRUSION_MULT', 'PRIME_EXT', 'OFFSET_Z', 'NOZZLE_LINE_RATIO',
                  'NOZZLE_TEMP', 'BED_TEMP', 'SPEED_MOVE', 'SPEED_RETRACT', 'UNRETRACT_SPEED', 'ACCELERATION', 'RETRACTION',
                  'SPEED_PRIME', 'DWELL_PRIME', 'SPEED_FAST', 'SPEED_SLOW', 'X_JERK', 'Y_JERK', 'Z_JERK', 'E_JERK' ];
  $('#' + clean.join(',#')).each((i,t) => {
    t.setCustomValidity('');
    $(`label[for=${$(t).attr('id')}]`).removeClass();
  });
  $('#warning1, #warning2, #warning3').hide();
  $('input.tool').removeAttr('disabled');

  function warn(num, type, msg, elems, emsg) {
    $(`#warning${num}`).text(`${msg} Fix the highlighted fields.`).show();
    if (emsg === undefined) emsg = msg;
    if (elems) {
      if (emsg) $('#' + elems.join(',#')).each((i,t) => { t.setCustomValidity(emsg); });
      $('label[for=' + elems.join('],label[for=') + ']').addClass(type);
    }
    $('input.tool').prop('disabled', true);
  }

  // Check for proper numerical values
  Object.keys(testNaN).forEach((k) => {
    if ((isNaN(testNaN[k]) && !isFinite(testNaN[k])) || testNaN[k].trim() === '') {
      warn(3, 'invalidNumber', 'Some values are not proper numbers.', [k], 'Value is not a proper number.');
    }
  });

  // Check if K-Factor Stepping is a multiple of the K-Factor Range
  const exp = Math.pow(10, decimals);
  if (parseInt(Math.round10(kspan, -3) * exp) % parseInt(parseFloat(testNaN['K_STEP']) * exp) !== 0) {
    warn(1, 'invalidDiv', 'K-Factor range cannot be cleanly divided.', ['K_START','K_END','K_STEP']);
    invalidDiv = 1;
  }

  // Check if pattern settings exceed bed size
  if (bedShape === 'Round') {
    const wnum = invalidDiv ? 2 : 1;
    if ((Math.sqrt(Math.pow(fitWidth, 2) + Math.pow(fitHeight, 2)) > (parseInt(testNaN['BEDSIZE_X']) - 5)) && fitHeight > fitWidth)
      warn(wnum, 'invalidSize', `Pattern size (x: ${fitWidth} y: ${fitHeight}) exceeds the bed diameter.`, ['K_START','K_END','K_STEP','SPACE_LINE']);
    if ((Math.sqrt(Math.pow(fitWidth, 2) + Math.pow(fitHeight, 2)) > (parseInt(testNaN['BEDSIZE_X']) - 5)) && fitWidth > fitHeight)
      warn(wnum, 'invalidSize', `Pattern size (x: ${fitWidth} y: ${fitHeight}) exceeds the bed diameter.`, ['SLOW_LENGTH','FAST_LENGTH']);
  }
  else if (bedShape === 'Rect') {
    if (fitWidth > (parseInt(testNaN['BEDSIZE_X']) - 5))
      warn(invalidDiv ? 2 : 1, 'invalidSize', `Pattern size (x: ${fitWidth} y: ${fitHeight}) exceeds the X bed size.`, ['SLOW_LENGTH','FAST_LENGTH']);
    if (fitHeight > (parseInt(testNaN['BEDSIZE_Y']) - 5))
      warn(invalidDiv ? 2 : 1, 'invalidSize', `Pattern size (x: ${fitWidth} y: ${fitHeight}) exceeds the Y bed size.`, ['K_START','K_END','K_STEP','SPACE_LINE']);
  }
}

$(() => {
  // create tab index dynamically
  $(':input:not(:hidden)').each((i) => { $(this).attr('tabindex', i + 1); });

  // Add fields validation according to class
  $('.vblur').on('blur', validateInput);
  $('.vchange').on('change', validateInput);

  // Get localStorage data
  var lsSettings = window.localStorage.getItem('LIN_SETTINGS');

  if (lsSettings) {
    var settings = jQuery.parseJSON(lsSettings);
    if (!settings.Version || settings.Version != SETTINGS_VERSION) {
      window.localStorage.removeItem('LIN_SETTINGS');
      alert('Script settings have been updated. Saved settings are reset to default values');
    }
    else {
      const vfields = [ 'FILAMENT_DIAMETER', 'NOZZLE_DIAMETER', 'NOZZLE_TEMP', 'NOZZLE_LINE_RATIO', 'BED_TEMP',
                        'SPEED_SLOW', 'SPEED_FAST', 'SPEED_MOVE', 'SPEED_RETRACT', 'ACCELERATION', 'RETRACTION',
                        'BED_SHAPE', 'BEDSIZE_X', 'BEDSIZE_Y', 'LAYER_HEIGHT', 'TOOL_INDEX', 'FAN_SPEED',
                        'EXTRUSION_MULT', 'LIN_VERSION', 'TYPE_PATTERN', 'K_START', 'K_END', 'K_STEP', 'X_JERK',
                        'Y_JERK', 'Z_JERK', 'E_JERK', 'DIR_PRINT', 'SPACE_LINE', 'PRIME_EXT', 'SPEED_PRIME',
                        'DWELL_PRIME', 'SLOW_LENGTH', 'FAST_LENGTH', 'OFFSET_Z' ];
      const cfields = [ 'CENTER_NULL', 'USE_FRAME', 'USE_PRIME', 'USE_FWR', 'USE_MMS', 'USE_LINE_NUM' ];
      for (let f of vfields) $(`#${f}`).val(settings[f]);
      for (let f of cfields) $(`#${f}`).prop('checked', settings[f]);

      //toggleBedShape();
      //patternType();
      //togglePrime();
      //toggleVersion();
      //toggleRetract();
    }
  }

  // toggle between mm/s and mm/min speeds
  $('#USE_MMS').change(speedToggle);

  // Toggle Bed Shape
  $('#BED_SHAPE').change(() => {
    toggleBedShape();
    validateInput();
  });

  // toggle prime relevant html elements
  $('#USE_PRIME').change(togglePrime);

  // frame and alternate pattern are mutually exclusive
  $('#TYPE_PATTERN').change(patternType);

  // Change factor type
  $('#LIN_VERSION').change(() => {
    toggleVersion();
    validateInput();
  });

  // Change retract type
  $('#USE_FWR').change(toggleRetract);

  // Focus the first field
  $('#tool input:first').focus();

});
