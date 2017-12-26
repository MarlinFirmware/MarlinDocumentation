/**
 * K-Factor Calibration Pattern
 * Copyright (C) 2017 Sineos [https://github.com/Sineos]
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
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";

function genGcode() {

  // get the values from the HTML elements
  var FILAMENT_DIAMETER = parseFloat(document.getElementById('FIL_DIA').value),
      NOZZLE_DIAMETER = parseFloat(document.getElementById('NOZ_DIA').value),
      NOZZLE_TEMP = parseInt(document.getElementById('NOZZLE_TEMP').value),
      NOZZLE_LINE_RATIO = parseFloat(document.getElementById('NOZ_LIN_R').value),
      BED_TEMP = parseInt(document.getElementById('BED_TEMP').value),
      SPEED_SLOW = parseInt(document.getElementById('SLOW_SPEED').value),
      SPEED_FAST = parseInt(document.getElementById('FAST_SPEED').value),
      SPEED_MOVE = parseInt(document.getElementById('MOVE_SPEED').value),
      RETRACT_DIST = parseFloat(document.getElementById('RETRACTION').value),
      BED_X = parseInt(document.getElementById('BEDSIZE_X').value),
      BED_Y = parseInt(document.getElementById('BEDSIZE_Y').value),
      HEIGHT_LAYER = parseFloat(document.getElementById('LAYER_HEIGHT').value),
      EXT_MULT = parseFloat(document.getElementById('EXTRUSION_MULT').value),
      START_K = parseInt(document.getElementById('K_START').value),
      END_K = parseInt(document.getElementById('K_END').value),
      STEP_K = parseFloat(document.getElementById('K_STEP').value),
      SELECT_DIR = document.getElementById('DIR_PRINT'),
      PRINT_DIR = SELECT_DIR.options[SELECT_DIR.selectedIndex].value,
      LINE_SPACING = parseFloat(document.getElementById('SPACE_LINE').value),
      ALT_PATTERN = document.getElementById("PAT_ALT").checked,
      USE_FRAME = document.getElementById('FRAME').checked,
      USE_PRIME = document.getElementById('PRIME').checked,
      EXT_MULT_PRIME = parseFloat(document.getElementById('PRIME_EXT').value),
      PRIME_DWELL = parseFloat(document.getElementById('DWELL_PRIME').value),
      LENGTH_SLOW = parseFloat(document.getElementById('SLOW_LENGTH').value),
      LENGTH_FAST = parseFloat(document.getElementById('FAST_LENGTH').value);

  // calculate some values for later use
  var RANGE_K = END_K - START_K,
      LINE_WIDTH = NOZZLE_DIAMETER * NOZZLE_LINE_RATIO,
      PRINT_SIZE_Y = (RANGE_K / STEP_K * LINE_SPACING) + 25,
      PRINT_SIZE_X = (2 * LENGTH_SLOW) + LENGTH_FAST + 10,
      CENTER_X = BED_X / 2,
      CENTER_Y = BED_Y / 2,
      PRIME_START_X = CENTER_X - LENGTH_SLOW - (0.5 * LENGTH_FAST) - 5,
      PRIME_START_Y = CENTER_Y - (PRINT_SIZE_Y / 2),
      PRIME_END_X = PRIME_START_X,
      PRIME_END_Y = CENTER_Y + (PRINT_SIZE_Y / 2),
      REF1_START_X = CENTER_X - (0.5 * LENGTH_FAST) + 5,
      REF2_START_X = CENTER_X + (0.5 * LENGTH_FAST) + 5,
      REF_START_Y = (PRINT_SIZE_Y / 2) + CENTER_Y - 20,
      REF_END_Y = (PRINT_SIZE_Y / 2) + CENTER_Y,
      PAT_START_X = CENTER_X - (0.5 * LENGTH_FAST) - LENGTH_SLOW + 5,
      PAT_START_Y = CENTER_Y - (PRINT_SIZE_Y / 2);


  // Check if K-Factor Stepping is a multiple of the K-Factor Range
  if (RANGE_K % STEP_K != 0) {
    alert("Your K-Factor range cannot be cleanly divided. Check Start / End / Steps for the K-Factor");
    document.getElementById('textarea').value = '';
    return;
  }

  // Calculate a straight (non rotated) least fit rectangle around the entire test pattern
  var PRINT_DIR_RAD = PRINT_DIR * Math.PI / 180,
      FIT_WIDTH = Math.abs(PRINT_SIZE_X * Math.cos(PRINT_DIR_RAD)) + Math.abs(PRINT_SIZE_Y * Math.sin(PRINT_DIR_RAD)),
      FIT_HEIGHT = Math.abs(PRINT_SIZE_X * Math.sin(PRINT_DIR_RAD)) + Math.abs(PRINT_SIZE_Y * Math.cos(PRINT_DIR_RAD));

  // Compare the fit rectangle with the bed size. Safety margin 5 mm
  if (FIT_WIDTH > BED_X - 5) {
    if (!confirm('Your K-Factor settings exceed your X bed size. Check Start / End / Steps for the K-Factor. \n OK to continue, Cancel to return')) {
      document.getElementById('textarea').value = '';
      return;
    }
  } else if (FIT_HEIGHT > BED_Y - 5) {
    if (!confirm('Your K-Factor settings exceed your Y bed size. Check Start / End / Steps for the K-Factor. \n OK to continue, Cancel to return')) {
      document.getElementById('textarea').value = '';
      return;
    }
  }

  // Convert speeds from mm/s to mm/min if needed
  if (document.getElementById('MM_S').checked) {
    SPEED_SLOW *= 60;
    SPEED_FAST *= 60;
    SPEED_MOVE *= 60;
  }

  // Set the extrusion parameters
  var EXTRUSION_RATIO = LINE_WIDTH * HEIGHT_LAYER / (Math.pow(FILAMENT_DIAMETER / 2, 2) * Math.PI),
      EXT_PRIME1 = Math.round10(EXTRUSION_RATIO * EXT_MULT_PRIME * (PRIME_END_Y - PRIME_START_Y), -4),
      EXT_PRIME2 = Math.round10(EXTRUSION_RATIO * EXT_MULT_PRIME * LINE_WIDTH * 1.5, -4),
      EXT_SLOW = Math.round10(EXTRUSION_RATIO * EXT_MULT * LENGTH_SLOW, -4),
      EXT_FAST = Math.round10(EXTRUSION_RATIO * EXT_MULT * LENGTH_FAST, -4),
      EXT_ALT = Math.round10(EXTRUSION_RATIO * EXT_MULT * LINE_SPACING, -4),
      EXT_FRAME1 = Math.round10(EXTRUSION_RATIO * EXT_MULT * (PRINT_SIZE_Y - 19), -4),
      EXT_FRAME2 = Math.round10(EXTRUSION_RATIO * EXT_MULT * LINE_WIDTH, -4);

  // Start G-code for test pattern
  document.getElementById('textarea').value = '';
  document.getElementById('textarea').value = '; ### Marlin K-Factor Calibration Pattern ###\n' +
                                              '; -------------------------------------------\n' +
                                              ';\n' +
                                              '; Created: ' + new Date() + '\n' +
                                              '; Settings:\n' +
                                              '; Print Size X = ' + PRINT_SIZE_X + ' mm\n' +
                                              '; Print Size Y = ' + PRINT_SIZE_Y + ' mm\n' +
                                              '; Print Rotation = ' + PRINT_DIR + ' degree\n' +
                                              '; Print Pattern = ' + (ALT_PATTERN ? "Alternate" : "Standard") + '\n' +
                                              '; Print Frame = ' + (USE_FRAME ? "true" : "false") + '\n' +
                                              '; Prime Nozzle = ' + (USE_PRIME ? "true" : "false") + '\n' +
                                              '; Prime Extrusion Multiplier = ' + EXT_MULT_PRIME + '\n' +
                                              '; Dwell Time = ' + PRIME_DWELL + ' s\n' +
                                              '; Filament Diameter = ' + FILAMENT_DIAMETER + ' mm\n' +
                                              '; Nozzle Diameter = ' + NOZZLE_DIAMETER + ' mm\n' +
                                              '; Nozzle Temperature = ' + NOZZLE_TEMP + ' °C\n' +
                                              '; Nozzle / Line Ratio = ' + NOZZLE_LINE_RATIO + '\n' +
                                              '; Bed Temperature = ' +BED_TEMP + ' °C\n' +
                                              '; Slow Printing Speed = ' + SPEED_SLOW + ' mm/min\n' +
                                              '; Fast Printing Speed = ' + SPEED_FAST + ' mm/min\n' +
                                              '; Movement Speed = ' + SPEED_MOVE + ' mm/min\n' +
                                              '; Use BL = ' + (document.getElementById('USE_BL').checked ? "true" : "false") + '\n' +
                                              '; Retraction Distance = ' + RETRACT_DIST + ' mm\n' +
                                              '; Bed Size X = ' + BED_X + ' mm\n' +
                                              '; Bed Size Y = ' + BED_Y + ' mm\n' +
                                              '; Layer Height = ' + HEIGHT_LAYER + ' mm\n' +
                                              '; Extrusion Multiplier = ' + EXT_MULT + '\n' +
                                              '; Starting Value K-Factor = ' + START_K + '\n' +
                                              '; Ending value K-Factor = ' + END_K + '\n' +
                                              '; K-Factor Stepping = ' + STEP_K + '\n' +
                                              '; Test Line Spacing = ' + STEP_K + ' mm\n' +
                                              '; Test Line Length Slow = ' + LENGTH_SLOW + ' mm\n' +
                                              '; Test Line Length Fast = ' + LENGTH_FAST + ' mm\n' +
                                              ';\n' +
                                              '; prepare printing\n' +
                                              ';\n' +
                                              'G28 ; home all axes\n' +
                                              'M190 S' + BED_TEMP + ' ; set and wait for bed temp\n' +
                                              'M104 S' + NOZZLE_TEMP + ' ; set nozzle temp and continue\n';

  // Use bed leveling if activated
  if (document.getElementById('USE_BL').checked) {
    document.getElementById('textarea').value += 'G29 ; execute bed automatic leveling compensation\n';
  }

  document.getElementById('textarea').value += 'M109 S' + NOZZLE_TEMP + ' ; block waiting for nozzle temp\n' +
                                               'G21 ; set units to millimeters\n' +
                                               'M204 P500 ; lower acceleration to 500mm/s2\n' +
                                               'G90 ; use absolute coordinates\n' +
                                               'M83 ; use relative distances for extrusion\n' +
                                               ';\n' +
                                               '; reset extruder and go to layer height\n' +
                                               ';\n' +
                                               'G92 E0 ; reset extruder distance\n' +
                                               'G1 Z' + HEIGHT_LAYER + ' F' + SPEED_SLOW + '\n' +
                                               ';\n';
  // Prime nozzle if activated
  if (USE_PRIME) {
    document.getElementById('textarea').value += '; prime nozzle\n' +
                                                 ';\n' +
                                                 'G1 X' + Math.round10(rotateX(PRIME_START_X, CENTER_X, PRIME_START_Y, CENTER_Y, PRINT_DIR), -4) +
                                                   ' Y' + Math.round10(rotateY(PRIME_START_X, CENTER_X, PRIME_START_Y, CENTER_Y, PRINT_DIR), -4) +
                                                   ' F' + SPEED_MOVE + '\n' +
                                                 'G1 X' + Math.round10(rotateX(PRIME_END_X, CENTER_X, PRIME_END_Y, CENTER_Y, PRINT_DIR), -4) +
                                                   ' Y' + Math.round10(rotateY(PRIME_END_X, CENTER_X, PRIME_END_Y, CENTER_Y, PRINT_DIR), -4) +
                                                   ' E' + EXT_PRIME1 + ' F' + SPEED_SLOW + ' ; prime nozzle\n' +
                                                 'G1 X' + Math.round10(rotateX(PRIME_END_X + (LINE_WIDTH * 1.5), CENTER_X, PRIME_END_Y, CENTER_Y, PRINT_DIR), -4) +
                                                   ' Y' + Math.round10(rotateY(PRIME_END_X + (LINE_WIDTH * 1.5), CENTER_X, PRIME_END_Y, CENTER_Y, PRINT_DIR), -4) +
                                                   ' E' + EXT_PRIME2 + ' F' + SPEED_SLOW + ' ; prime nozzle\n' +
                                                 'G1 X' + Math.round10(rotateX(PRIME_END_X + (LINE_WIDTH * 1.5), CENTER_X, PRIME_START_Y, CENTER_Y, PRINT_DIR), -4) +
                                                   ' Y' + Math.round10(rotateY(PRIME_END_X + (LINE_WIDTH * 1.5), CENTER_X, PRIME_START_Y, CENTER_Y, PRINT_DIR), -4) +
                                                   ' E' + EXT_PRIME1 + ' F' + SPEED_SLOW + ' ; prime nozzle\n' +
                                                 'G1 E-' + RETRACT_DIST + '\n';
  }

  // if selected, print an anchor frame around test line start and end points
  if (USE_FRAME) {
    document.getElementById('textarea').value += ';\n' +
                                                 '; print anchor frame\n' +
                                                 ';\n' +
                                                 'G1 X' + Math.round10(rotateX(PAT_START_X - LINE_WIDTH, CENTER_X, PAT_START_Y - 3, CENTER_Y, PRINT_DIR), -4) +
                                                   ' Y' + Math.round10(rotateY(PAT_START_X - LINE_WIDTH, CENTER_X, PAT_START_Y - 3, CENTER_Y, PRINT_DIR), -4) +
                                                   ' F' + SPEED_MOVE + ' ; move to frame start\n' +
                                                 (USE_PRIME ? 'G1 E' + RETRACT_DIST + '\n' : '') +
                                                 'G1 X' + Math.round10(rotateX(PAT_START_X - LINE_WIDTH, CENTER_X, PAT_START_Y + PRINT_SIZE_Y - 22, CENTER_Y, PRINT_DIR), -4) +
                                                   ' Y' + Math.round10(rotateY(PAT_START_X - LINE_WIDTH, CENTER_X, PAT_START_Y + PRINT_SIZE_Y - 22, CENTER_Y, PRINT_DIR), -4) +
                                                   ' E' + EXT_FRAME1 + ' F' + SPEED_SLOW + '\n' +
                                                 'G1 X' + Math.round10(rotateX(PAT_START_X, CENTER_X, PAT_START_Y + PRINT_SIZE_Y - 22, CENTER_Y, PRINT_DIR), -4) +
                                                   ' Y' + Math.round10(rotateY(PAT_START_X, CENTER_X, PAT_START_Y + PRINT_SIZE_Y - 22, CENTER_Y, PRINT_DIR), -4) +
                                                   ' E' + EXT_FRAME2 + ' F' + SPEED_SLOW + '\n' +
                                                 'G1 X' + Math.round10(rotateX(PAT_START_X, CENTER_X, PAT_START_Y - 3, CENTER_Y, PRINT_DIR), -4) +
                                                   ' Y' + Math.round10(rotateY(PAT_START_X, CENTER_X, PAT_START_Y - 3, CENTER_Y, PRINT_DIR), -4) +
                                                   ' E' + EXT_FRAME1 + ' F' + SPEED_SLOW + '\n' +
                                                 'G1 E-' + RETRACT_DIST + '\n' +
                                                 'G1 X' + Math.round10(rotateX(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST, CENTER_X, PAT_START_Y - 3, CENTER_Y, PRINT_DIR), -4) +
                                                   ' Y' + Math.round10(rotateY(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST, CENTER_X, PAT_START_Y - 3, CENTER_Y, PRINT_DIR), -4) +
                                                   ' F' + SPEED_MOVE + ' ; move to frame start\n' +
                                                 'G1 E' + RETRACT_DIST + '\n' +
                                                 'G1 X' + Math.round10(rotateX(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST, CENTER_X, PAT_START_Y + PRINT_SIZE_Y - 22, CENTER_Y, PRINT_DIR), -4) +
                                                   ' Y' + Math.round10(rotateY(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST, CENTER_X, PAT_START_Y + PRINT_SIZE_Y - 22, CENTER_Y, PRINT_DIR), -4) +
                                                   ' E' + EXT_FRAME1 + ' F' + SPEED_SLOW + '\n' +
                                                 'G1 X' + Math.round10(rotateX(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST + LINE_WIDTH, CENTER_X, PAT_START_Y + PRINT_SIZE_Y - 22, CENTER_Y, PRINT_DIR), -4) +
                                                   ' Y' + Math.round10(rotateY(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST + LINE_WIDTH, CENTER_X, PAT_START_Y + PRINT_SIZE_Y - 22, CENTER_Y, PRINT_DIR), -4) +
                                                   ' E' + EXT_FRAME2 + ' F' + SPEED_SLOW + '\n' +
                                                 'G1 X' + Math.round10(rotateX(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST + LINE_WIDTH, CENTER_X, PAT_START_Y - 3, CENTER_Y, PRINT_DIR), -4) +
                                                   ' Y' + Math.round10(rotateY(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST + LINE_WIDTH, CENTER_X, PAT_START_Y - 3, CENTER_Y, PRINT_DIR), -4) +
                                                   ' E' + EXT_FRAME1 + ' F' + SPEED_SLOW + '\n' +
                                                 'G1 E-' + RETRACT_DIST + '\n';
  }

  // insert a retract if no prime and no frame
  (!USE_PRIME && !USE_FRAME ? document.getElementById('textarea').value += 'G1 E-' + RETRACT_DIST + '\n' : '');

  // generate the k-factor test pattern
  document.getElementById('textarea').value += ';\n' +
                                               '; start the test pattern\n' +
                                               ';\n' +
                                               (PRIME_DWELL ? 'G4 P' + (PRIME_DWELL * 1000) + ' ; Pause (dwell) for 2 seconds\n' : '') +
                                               'G1 X' + Math.round10(rotateX(PAT_START_X, CENTER_X, PAT_START_Y, CENTER_Y, PRINT_DIR), -4) +
                                                 ' Y' + Math.round10(rotateY(PAT_START_X, CENTER_X, PAT_START_Y, CENTER_Y, PRINT_DIR), -4) +
                                                 ' F' + SPEED_MOVE + ' ; move to pattern start\n';
  var j = 0,
      k = 0;
  for (var i = START_K; i <= END_K; i += STEP_K) {
    if (ALT_PATTERN && (k % 2 == 0)) {
      document.getElementById('textarea').value += 'M900 K' + i + ' ; set K-factor\n' +
                                                   'G1 E' + RETRACT_DIST + '\n' +
                                                   'G1 X' + Math.round10(rotateX(PAT_START_X + LENGTH_SLOW, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' Y' + Math.round10(rotateY(PAT_START_X + LENGTH_SLOW, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' E' + EXT_SLOW + ' F' + SPEED_SLOW + '\n' +
                                                   'G1 X' + Math.round10(rotateX(PAT_START_X + LENGTH_SLOW + LENGTH_FAST, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' Y' + Math.round10(rotateY(PAT_START_X + LENGTH_SLOW + LENGTH_FAST, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' E' + EXT_FAST + ' F' + SPEED_FAST + '\n' +
                                                   'G1 X' + Math.round10(rotateX(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' Y' + Math.round10(rotateY(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' E' + EXT_SLOW + ' F' + SPEED_SLOW + '\n' +
                                                   'G1 X' + Math.round10(rotateX(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST, CENTER_X, PAT_START_Y + j + LINE_SPACING, CENTER_Y, PRINT_DIR), -4) +
                                                     ' Y' + Math.round10(rotateY(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST, CENTER_X, PAT_START_Y + j + LINE_SPACING, CENTER_Y, PRINT_DIR), -4) +
                                                     ' E' + EXT_ALT + ' F' + SPEED_FAST + '\n';
      j += LINE_SPACING;
      k += 1;
    } else if (ALT_PATTERN && (k % 2 != 0)) {
      document.getElementById('textarea').value += 'M900 K' + i + ' ; set K-factor\n' +
                                                   'G1 E' + RETRACT_DIST + '\n' +
                                                   'G1 X' + Math.round10(rotateX(PAT_START_X + LENGTH_SLOW + LENGTH_FAST, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' Y' + Math.round10(rotateY(PAT_START_X + LENGTH_SLOW + LENGTH_FAST, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' E' + EXT_SLOW + ' F' + SPEED_SLOW + '\n' +
                                                   'G1 X' + Math.round10(rotateX(PAT_START_X + LENGTH_SLOW, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' Y' + Math.round10(rotateY(PAT_START_X + LENGTH_SLOW, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' E' + EXT_FAST + ' F' + SPEED_FAST + '\n' +
                                                   'G1 X' + Math.round10(rotateX(PAT_START_X, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' Y' + Math.round10(rotateY(PAT_START_X, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' E' + EXT_SLOW + ' F' + SPEED_SLOW + '\n' +
                                                   'G1 X' + Math.round10(rotateX(PAT_START_X, CENTER_X, PAT_START_Y + j + LINE_SPACING, CENTER_Y, PRINT_DIR), -4) +
                                                     ' Y' + Math.round10(rotateY(PAT_START_X, CENTER_X, PAT_START_Y + j + LINE_SPACING, CENTER_Y, PRINT_DIR), -4) +
                                                     ' E' + EXT_ALT + ' F' + SPEED_FAST + '\n';
      j += LINE_SPACING;
      k += 1;
    } else {
      document.getElementById('textarea').value += 'M900 K' + i + ' ; set K-factor\n' +
                                                   'G1 E' + RETRACT_DIST + '\n' +
                                                   'G1 X' + Math.round10(rotateX(PAT_START_X + LENGTH_SLOW, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' Y' + Math.round10(rotateY(PAT_START_X + LENGTH_SLOW, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' E' + EXT_SLOW + ' F' + SPEED_SLOW + '\n' +
                                                   'G1 X' + Math.round10(rotateX(PAT_START_X + LENGTH_SLOW + LENGTH_FAST, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' Y' + Math.round10(rotateY(PAT_START_X + LENGTH_SLOW + LENGTH_FAST, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' E' + EXT_FAST + ' F' + SPEED_FAST + '\n' +
                                                   'G1 X' + Math.round10(rotateX(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' Y' + Math.round10(rotateY(PAT_START_X + (2 * LENGTH_SLOW) + LENGTH_FAST, CENTER_X, PAT_START_Y + j, CENTER_Y, PRINT_DIR), -4) +
                                                     ' E' + EXT_SLOW + ' F' + SPEED_SLOW + '\n' +
                                                   'G1 E-' + RETRACT_DIST + '\n' +
                                                   (i != END_K ? 'G1 X' + Math.round10(rotateX(PAT_START_X, CENTER_X, PAT_START_Y + j + LINE_SPACING, CENTER_Y, PRINT_DIR), -4) +
                                                     ' Y' + Math.round10(rotateY(PAT_START_X, CENTER_X, PAT_START_Y + j + LINE_SPACING, CENTER_Y, PRINT_DIR), -4) +
                                                     ' F' + SPEED_MOVE + '\n' : '');
      j += LINE_SPACING;
    }
  }
  // mark area of speed changes and close G-code
  document.getElementById('textarea').value += ';\n' +
                                               '; mark the test area for reference\n' +
                                               ';\n' +
                                               (ALT_PATTERN ? 'G1 E-' + RETRACT_DIST + '\n' : '') +
                                               'G1 X' + Math.round10(rotateX(REF1_START_X, CENTER_X, REF_START_Y, CENTER_Y, PRINT_DIR), -4) +
                                                 ' Y' + Math.round10(rotateY(REF1_START_X, CENTER_X, REF_START_Y, CENTER_Y, PRINT_DIR), -4) +
                                                 ' F' + SPEED_MOVE + '\n' +
                                               'G1 E' + RETRACT_DIST + '\n' +
                                               'G1 X' + Math.round10(rotateX(REF1_START_X, CENTER_X, REF_END_Y, CENTER_Y, PRINT_DIR), -4) +
                                                 ' Y' + Math.round10(rotateY(REF1_START_X, CENTER_X, REF_END_Y, CENTER_Y, PRINT_DIR), -4) +
                                                 ' E' + EXT_SLOW + ' F' + SPEED_SLOW + '\n' +
                                               'G1 E-' + RETRACT_DIST + '\n' +
                                               'G1 X' + Math.round10(rotateX(REF2_START_X, CENTER_X, REF_START_Y, CENTER_Y, PRINT_DIR), -4) +
                                                 ' Y' + Math.round10(rotateY(REF2_START_X, CENTER_X, REF_START_Y, CENTER_Y, PRINT_DIR), -4) +
                                                 ' F' + SPEED_MOVE + '\n' +
                                               'G1 E' + RETRACT_DIST + '\n' +
                                               'G1 X' + Math.round10(rotateX(REF2_START_X, CENTER_X, REF_END_Y, CENTER_Y, PRINT_DIR), -4) +
                                                 ' Y' + Math.round10(rotateY(REF2_START_X, CENTER_X, REF_END_Y, CENTER_Y, PRINT_DIR), -4) +
                                                 ' E' + EXT_SLOW + ' F' + SPEED_SLOW + '\n' +
                                               'G1 E-' + RETRACT_DIST + '\n' +
                                               ';\n' +
                                               '; finish\n' +
                                               ';\n' +
                                               'M104 S0 ; turn off hotend\n' +
                                               'M140 S0 ; turn off bed\n' +
                                               'G1 Z30 Y200 F' + SPEED_MOVE + ' ; move away from the print\n' +
                                               'M84 ; disable motors\n' +
                                               'M502 ; resets parameters from ROM (for those who do not have an EEPROM)\n' +
                                               'M501 ; resets parameters from EEPROM (preferably)\n' +
                                               ';';
}

// https://stackoverflow.com/questions/21479107/saving-html5-textarea-contents-to-file
function saveTextAsFile() {
  var textToWrite = document.getElementById('textarea').value,
      textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'}),
      fileNameToSaveAs = "kfactor.gcode",
      downloadLink = document.createElement("a");

  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
}

function destroyClickedElement(event) {
  // remove the link from the DOM
  document.body.removeChild(event.target);
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
    if (typeof exp === 'undefined' || Number(exp) === 0) {
      return Math[type](value);
    }
    value = Number(value);
    exp = Number(exp);
    // If the value is not a number or the exp is not an integer...
    if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // If the value is negative...
    if (value < 0) {
      return -decimalAdjust(type, -value, exp);
    }
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

// toggle html elements
$(document).ready(function() {
  // toggle between mm/s and mm/min speeds
  $('#MM_S').change(function() {
    var SPEED_SLOW = $('#SLOW_SPEED').val(),
        SPEED_FAST = $('#FAST_SPEED').val(),
        SPEED_MOVE = $('#MOVE_SPEED').val();
    if($(this).is(":checked")) {
      SPEED_SLOW = $('#SLOW_SPEED').val();
      SPEED_FAST = $('#FAST_SPEED').val();
      SPEED_MOVE = $('#MOVE_SPEED').val();
      $('#SLOW_SPEED').val(SPEED_SLOW / 60);
      $('#FAST_SPEED').val(SPEED_FAST / 60);
      $('#MOVE_SPEED').val(SPEED_MOVE / 60);
    } else {
      SPEED_SLOW = $('#SLOW_SPEED').val();
      SPEED_FAST = $('#FAST_SPEED').val();
      SPEED_MOVE = $('#MOVE_SPEED').val();
      $('#SLOW_SPEED').val(SPEED_SLOW * 60);
      $('#FAST_SPEED').val(SPEED_FAST * 60);
      $('#MOVE_SPEED').val(SPEED_MOVE * 60);
    }
  });
  // toggle prime relevant html elements
  $('#PRIME').change(function() {
    if($(this).is(":checked")) {
      $("#PRIME_EXT").prop('disabled', false);
      $('label[for=PRIME_EXT]').css({opacity: 1});
    } else {
      $("#PRIME_EXT").prop('disabled', true);
      $('label[for=PRIME_EXT]').css({opacity: 0.5});
    }
  });
  // frame and alternate pattern are mutually exclusive
  $('#PAT_ALT').change(function() {
    if($(this).is(":checked")) {
      $("#FRAME").prop('checked', false);
      $("#FRAME").prop('disabled', true);
      $('label[for=FRAME]').css({opacity: 0.5});
    } else {
      $("#FRAME").prop('disabled', false);
      $('label[for=FRAME]').css({opacity: 1});
    }
  });
  $('#FRAME').change(function() {
    if($(this).is(":checked")) {
      $("#PAT_ALT").prop('checked', false);
      $("#PAT_ALT").prop('disabled', true);
      $('label[for=PAT_ALT]').css({opacity: 0.5});
    } else {
      $("#PAT_ALT").prop('disabled', false);
      $('label[for=PAT_ALT]').css({opacity: 1});
    }
  });
});
