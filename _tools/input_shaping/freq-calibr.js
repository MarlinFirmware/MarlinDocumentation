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
const SETTINGS_VERSION = '1.0';

function genGcode() {

  // get the values from the HTML elements
  var PRINTER = $('#PRINTER').val(),
      FILAMENT_DIAMETER = parseFloat($('#FILAMENT_DIAMETER').val()),
      NOZZLE_DIAMETER = parseFloat($('#NOZZLE_DIAMETER').val()),
      NOZZLE_TEMP = parseInt($('#NOZZLE_TEMP').val()),
      BED_TEMP = parseInt($('#BED_TEMP').val()),
      LAYER_HEIGHT = parseFloat($('#LAYER_HEIGHT').val()),
      FAN_SPEED = parseFloat($('#FAN_SPEED').val()),
      PRINT_SPEED = parseInt($('#PRINT_SPEED').val()),
      TRAVEL_SPEED = parseInt($('#TRAVEL_SPEED').val()),
      BEDSIZE_X = parseInt($('#BEDSIZE_X').val()),
      BEDSIZE_Y = parseInt($('#BEDSIZE_Y').val()),
      MAX_FREQ_X = parseInt($('#MAX_FREQ_X').val()),
      MAX_FREQ_Y = parseInt($('#MAX_FREQ_Y').val()),
      Z_OFFSET = parseFloat($('#Z_OFFSET').val()),
      BED_LEVELING = $('#BED_LEVELING').val(),
      EXTRUSION_MULT = parseFloat($('#EXTRUSION_MULT').val()),
      Z_ALIGNMENT = $('#Z_ALIGNMENT').prop('checked');

  var LINE_WIDTH = 0.5,            // (mm)
      Z_SPEED = 10.0,              // (mm/s) Z movement speed
      
      WAVELENGTH = 2.0,            // (mm) the width of one ful zig-zag
      AMPLITUDE = 0.5,             // (mm) the peak to peak size of the zig-zag pattern
      DECEL = 1000;                // (mm/s^2) rate of deceleration at the end of the pattern
      
  var gcodeOut = document.getElementById('freq-gcode-out');
  var zeta_x_gcodeOut = document.getElementById('zeta-x-gcode-out');
  var zeta_y_gcodeOut = document.getElementById('zeta-y-gcode-out');

  var settings = {
    'filament_diameter': FILAMENT_DIAMETER,
    'nozzle_diameter': NOZZLE_DIAMETER,
    'height_layer': LAYER_HEIGHT,
    'bed_x': BEDSIZE_X,
    'bed_y': BEDSIZE_Y,
    'ext_mult': EXTRUSION_MULT,
    'top_freq_x': MAX_FREQ_X,
    'top_freq_y': MAX_FREQ_Y,
    'z_offset': Z_OFFSET,
    'line_width': LINE_WIDTH,
    'z_speed': Z_SPEED,
    'travel_speed': TRAVEL_SPEED,
    'anchor_line_speed': PRINT_SPEED,
    'wavelength': WAVELENGTH,
    'amplitude': AMPLITUDE,
    'decel': DECEL
  }

  // Start G-code for pattern
  var start_script =  '; -------------------------------------------\n' +
                  ';\n' +
                  '; Printer: ' + PRINTER + '\n' +
                  '; Created: ' + new Date() + '\n' +
                  ';\n' +
                  '; Settings Printer:\n' +
                  '; Filament Diameter = ' + FILAMENT_DIAMETER + ' mm\n' +
                  '; Nozzle Diameter = ' + NOZZLE_DIAMETER + ' mm\n' +
                  '; Nozzle Temperature = ' + NOZZLE_TEMP + ' °C\n' +
                  '; Bed Temperature = ' + BED_TEMP + ' °C\n' +
                  '; Layer Height = ' + LAYER_HEIGHT + ' mm\n' +
                  '; Fan Speed = ' + FAN_SPEED + ' %\n' +
                  '; Z-axis Offset = ' + Z_OFFSET + ' mm\n' +
                  ';\n' +
                  '; Settings Print Bed:\n' +
                  '; Bed Size X = ' + BEDSIZE_X + ' mm\n' +
                  '; Bed Size Y = ' + BEDSIZE_Y + ' mm\n' +
                  ';\n' +
                  '; Settings Speed:\n' +
                  '; Printing Speed = ' + PRINT_SPEED+ ' mm/s\n' +
                  '; Movement Speed = ' + TRAVEL_SPEED + ' mm/s\n' +
                  ';\n' +
                  '; Settings Pattern:\n' +
                  '; Max X Frequency = ' + MAX_FREQ_X + ' Hz\n' +
                  '; Max Y Frequency = ' + MAX_FREQ_Y + ' Hz\n' +
                  ';\n' +
                  '; Settings Advance:\n' +
                  '; Bed leveling = ' + BED_LEVELING + '\n' +
                  '; Extrusion Multiplier = ' + EXTRUSION_MULT + '\n' +
                  ';\n' +
                  '; prepare printing\n' +
                  ';\n' +
                  'M501 ; Load settings from EEPROM\n' +
                  'M205 S0 T0           ; minimum extruding and travel feed rate\n' +
                  'G21 ; Millimeter units\n' +
                  'G90 ; Absolute XYZ\n' +
                  'G28 ; Home all axes\n' +
                  (Z_ALIGNMENT ? 'G34 ; Align Z\n' : '') +
                  'G1 Z10 F100 ; Z raise\n' +
                  'M104 S' + NOZZLE_TEMP + ' ; Set nozzle temperature (no wait)\n' +
                  'M190 S' + BED_TEMP + ' ; Set bed temperature (wait)\n' +
                  'M109 S' + NOZZLE_TEMP + ' ; Wait for nozzle temp\n' +
                  (BED_LEVELING !== '0' ? BED_LEVELING + '; Activate bed leveling compensation\n' : '') +
                  'G92 E0 ; Reset extruder distance\n' +
                  'M900 K0 ; Linear advance off\n' +
                  'M106 S' + Math.round(FAN_SPEED * 2.55) + ' ; Fan speed \n';

  var end_script = ';\n' +
                  '; FINISH\n' +
                  ';\n' +
                  'M107 ; Turn off fan\n' +
                  'M400 ; Finish moving\n' +
                  'M104 S0 ; Turn off hotend\n' +
                  'M140 S0 ; Turn off bed\n' +
                  'G1 Z30 X0 Y' + BEDSIZE_Y + ' F' + TRAVEL_SPEED + ' ; Move away from the print\n' +
                  'M84 ; Disable motors\n' +
                  'G92 E0 ; Reset extruder distance\n' +
                  'M501 ; Load settings from EEPROM\n' +
                  ';';

  try {
    let lines = generatePattern(settings);

    let freq = '; ### Marlin IS Calibration Damping Frequency Pattern ###\n' +
              start_script + 
              'M593 F0 ; input shaping off\n' +
              lines['freq'] + end_script;
    let zeta_x_script = '; ### Marlin IS Calibration Zeta/Damping Factor X Pattern ###\n' +
              start_script + lines['zeta_x'] + end_script;
    let zeta_y_script = '; ### Marlin IS Calibration Zeta/Damping Factor X Pattern ###\n' +
              start_script + lines['zeta_y'] + end_script;

    gcodeOut.value = freq;
    zeta_x_gcodeOut.value = zeta_x_script;
    zeta_y_gcodeOut.value = zeta_y_script;

  } catch (error) {
    console.error(error);
    // Expected output: ReferenceError: nonExistentFunction is not defined
    // (Note: the exact output may be browser-dependent)
  }
}

function generatePattern(settings) {
  var extrusion_ratio = settings['line_width'] * settings['height_layer'] / (Math.pow(settings['filament_diameter'] / 2, 2) * Math.PI) * settings['ext_mult'];
  // generate accelerating zigzag and end coast patterns
  var zigzags_x = [],
      zigzags_y = [];
  var seg_length = Math.sqrt(Math.pow(settings['amplitude'], 2) + Math.pow(settings['wavelength'], 2) / 4.0);
  var idx = 0;
  for (i = 0; i < settings['top_freq_x']; i++) {
    zigzags_x[idx] = []
    zigzags_x[idx][0] = settings['wavelength'] * (i + 0.5);
    zigzags_x[idx][1] = settings['amplitude']
    zigzags_x[idx][2] = seg_length * 2 * (i + 0.5);
    idx++;
    zigzags_x[idx] = []
    zigzags_x[idx][0] = settings['wavelength'] * (i + 1.0);
    zigzags_x[idx][1] = 0
    zigzags_x[idx][2] = seg_length * 2 * (i + 1.0);
    idx++;
  }
  let max_x_speed = settings['wavelength'] * settings['top_freq_x'];
  let coast_dist_x = Math.pow(max_x_speed, 2) / 2 / settings['decel'];
  let max_y_size = settings['top_freq_x'] * settings['wavelength'] + coast_dist_x + 5;

  idx = 0;
  for (i = 0; i < settings['top_freq_y']; i++) {
    zigzags_y[idx] = []
    zigzags_y[idx][0] = settings['wavelength'] * (i + 0.5);
    zigzags_y[idx][1] = settings['amplitude']
    zigzags_y[idx][2] = seg_length * 2 * (i + 0.5);
    idx++;
    zigzags_y[idx] = []
    zigzags_y[idx][0] = settings['wavelength'] * (i + 1.0);
    zigzags_y[idx][1] = 0
    zigzags_y[idx][2] = seg_length * 2 * (i + 1.0);
    idx++;
  }
  let max_y_speed = settings['wavelength'] * settings['top_freq_y'];
  let coast_dist_y = Math.pow(max_y_speed, 2) / 2 / settings['decel'];
  let max_x_size = settings['top_freq_y'] * settings['wavelength'] + coast_dist_y + 5;

  let min_x = (settings['bed_x'] - max_x_size) / 2;
  let max_x = (settings['bed_x'] + max_x_size) / 2;

  let min_y = (settings['bed_y'] - max_y_size) / 2;
  let max_y = (settings['bed_y'] + max_y_size) / 2;

  if (max_x_size > settings['bed_x'] && max_y_size > settings['bed_y']) {
    alert('Pattern does not fit to bed. Reduce Max X and Max Y Frequency');
    return;
  } else if (max_x_size > settings['bed_x']) {
    alert('Pattern does not fit to bed. Reduce Max Y Frequency');
    return;
  } else if (max_y_size > settings['bed_y']) {
    alert('Pattern does not fit to bed. Reduce Max X Frequency');
    return;
  }

  // initial positions
  var x = 0.0,
      y = 0.0,
      z = 0.0,
      e = 0.0;

  function go_to(new_x, new_y, new_z, f = null) {
    x = new_x;
    y = new_y;
    z = new_z;
    var gcode = `G0 X${x.toFixed(2)} Y${y.toFixed(2)} Z${z.toFixed(2)} E${e.toFixed(2)}`;
    if (f != null) gcode += ` F${(f * 60).toFixed(1)}`;
    gcode += '\n';
    return gcode;
  }

function line_to(new_x, new_y, new_z, f = null) {
    e += extrusion_ratio * Math.sqrt(Math.pow(new_x - x, 2) + Math.pow(new_y - y, 2) + Math.pow(new_z - z, 2));
    x = new_x;
    y = new_y;
    z = new_z;
    var gcode = `G1 X${x.toFixed(2)} Y${y.toFixed(2)} Z${z.toFixed(2)} E${e.toFixed(2)}`;
    if (f != null) gcode += ` F${(f * 60).toFixed(1)}`;
    gcode += '\n';
    return gcode;
  }

  function zip(arr1, arr2, arr3) {
    return arr1.map((element, index) => [element, arr2[index], arr3[index]]);
  }

  function draw_y_zigzags(zigzags, coast_dist) {
    var gcode = 'M201 X10000 Y10000\n';

    let start_x = x;
    let start_y = y;
    for (let i = 0; i < zigzags.length; i++) {
      let x_offs = zigzags[i][0];
      let y_offs = zigzags[i][1];
      let f = zigzags[i][2];
      gcode += line_to(start_x + x_offs, start_y + y_offs, z, f)
    }

    // go back to resonable acceleration limits
    gcode += `M201 X${settings['decel']} Y${settings['decel']}\n`

    // coast down to stop
    gcode += line_to(x + coast_dist, y, z);

    return gcode += '\n';
  }

  function draw_y_zigzags_rev(zigzags, coast_dist) {
    // ramp up to speed
    var gcode = line_to(x - coast_dist, y, z, zigzags[zigzags.length-1][2]);

    gcode += 'M201 X10000 Y10000\n';

    let start_x = x - zigzags[zigzags.length-1][0];
    let start_y = y - zigzags[zigzags.length-1][1];
    let x_offsets = [], y_offsets = [], fs = [];

    for (let i = 0; i < zigzags.length; i++) {
      x_offsets.push(zigzags[i][0]);
      y_offsets.push(zigzags[i][1]);
      fs.push(zigzags[i][2]);
    }
    x_offsets.unshift(0); // Add 0 to the beginning
    x_offsets.pop();     // Remove the last element
    y_offsets.unshift(0); // Add 0 to the beginning
    y_offsets.pop();     // Remove the last element
    zigzags = zip(x_offsets, y_offsets, fs).reverse();

    for (let i = 0; i < zigzags.length; i++) {
      let x_offs = zigzags[i][0];
      let y_offs = zigzags[i][1];
      let f = zigzags[i][2];
      gcode += line_to(start_x + x_offs, start_y + y_offs, z, f)
    }

    // go back to resonable acceleration limits
    gcode += `M201 X${settings['decel']} Y${settings['decel']}\n\n`;

    return gcode;
  }

  function draw_x_zigzags(zigzags, coast_dist) {
    var gcode = 'M201 X10000 Y10000\n';

    let start_x = x;
    let start_y = y;
    for (let i = 0; i < zigzags.length; i++) {
      let x_offs = zigzags[i][1];
      let y_offs = zigzags[i][0];
      let f = zigzags[i][2];
      gcode += line_to(start_x + x_offs, start_y + y_offs, z, f);
    }

    // go back to resonable acceleration limits
    gcode += `M201 X${settings['decel']} Y${settings['decel']}\n`

    // coast down to stop
    gcode += line_to(x, y + coast_dist, z);

    return gcode + '\n';
  }

  function draw_x_zigzags_rev(zigzags, coast_dist) {
    // ramp up to speed
    var gcode = line_to(x, y - coast_dist, z, zigzags[zigzags.length-1][2])

    gcode += 'M201 X10000 Y10000\n'

    let start_x = x - zigzags[zigzags.length-1][1]
    let start_y = y - zigzags[zigzags.length-1][0]
    let x_offsets = [], y_offsets = [], fs = [];

    for (let i = 0; i < zigzags.length; i++) {
      x_offsets.push(zigzags[i][1]);
      y_offsets.push(zigzags[i][0]);
      fs.push(zigzags[i][2]);
    }
    x_offsets.unshift(0); // Add 0 to the beginning
    x_offsets.pop();     // Remove the last element
    y_offsets.unshift(0); // Add 0 to the beginning
    y_offsets.pop();     // Remove the last element
    zigzags = zip(y_offsets, x_offsets, fs).reverse();

    for (let i = 0; i < zigzags.length; i++) {
      let x_offs = zigzags[i][1];
      let y_offs = zigzags[i][0];
      let f = zigzags[i][2];
      gcode += line_to(start_x + x_offs, start_y + y_offs, z, f)
    }

    // go back to resonable acceleration limits
    gcode +=  `M201 X${settings['decel']} Y${settings['decel']}\n\n`

    return gcode;
  }

  

  function draw_anchor_line() {
    var gcode =  '; draw anchor lines\n';
    gcode += go_to(max_x, max_y, 2.0, settings['travel_speed']);
    gcode += go_to(x, y, settings['height_layer'] + settings['z_offset'], settings['z_speed']);
    gcode += line_to(min_x, max_y, z, settings['anchor_line_speed']);
    gcode += line_to(min_x, min_y, z, settings['anchor_line_speed']);

    return gcode + '\n';
  }

  var unlimits = 'M203 X500 Y500 ; maximum feedrates\n' +
                'M204 P10000 ; print acceleration\n' +
                'M205 X500.00 Y500.00 ; jerk limits very high\n' +
                'M205 J0.3 ; junction deviation maximum\n\n';

  var freq_script = '';
  var zeta_x_script = '';
  var zeta_y_script = '';

  // Damping frequency pattern --------------------------
  x = 0.0, y = 0.0, z = 0.0, e = 0.0;
  freq_script += draw_anchor_line() + unlimits;
  freq_script += draw_y_zigzags(zigzags_y, coast_dist_y);
  freq_script += draw_x_zigzags(zigzags_x, coast_dist_x);


  // Zeta/Damping factor X pattern ----------------------
  x = 0.0, y = 0.0, z = 0.0, e = 0.0;
  zeta_x_script += draw_anchor_line() + unlimits;

  // move a little away from the anchor line
  zeta_x_script += line_to(x + 5, y, z)

  // draw alternating X zigzags at constant Y acceleration
  var zeta = 0.0
  for (var i = 0; i < 10; i++) {
    zeta += 0.05;
    zeta_x_script += `M593 X D${zeta.toFixed(2)}\n`;
    zeta_x_script += draw_x_zigzags(zigzags_x, coast_dist_y);
    zeta_x_script += go_to(x + 5, y, z, settings['travel_speed']);
    zeta += 0.05;
    zeta_x_script += `M593 X D${zeta.toFixed(2)}\n`;
    zeta_x_script += draw_x_zigzags_rev(zigzags_x, coast_dist_y);
    zeta_x_script += go_to(x + 5, y, z, settings['travel_speed']);
  }

  // Zeta/Damping factor Y pattern ----------------------
  x = 0.0, y = 0.0, z = 0.0, e = 0.0;
  zeta_y_script += draw_anchor_line() + unlimits;

  // move a little away from the anchor line
  zeta_y_script += line_to(x + 5, y, z)

  // draw alternating Y zigzags at constant X acceleration
  zeta = 0.0
  for (var i = 0; i < 10; i++) {
    zeta += 0.05;
    zeta_y_script += `M593 Y D${zeta.toFixed(2)}\n`;
    zeta_y_script += draw_y_zigzags(zigzags_y, coast_dist_y);
    zeta_y_script += go_to(x, y + 5, z, settings['travel_speed']);
    zeta += 0.05;
    zeta_y_script += `M593 Y D${zeta.toFixed(2)}\n`;
    zeta_y_script += draw_y_zigzags_rev(zigzags_y, coast_dist_y);
    zeta_y_script += go_to(x, y + 5, z, settings['travel_speed']);
  }

  return {'freq': freq_script, 'zeta_x': zeta_x_script, 'zeta_y': zeta_y_script}

}

// Save content of textarea to file using
// https://github.com/eligrey/FileSaver.js
function saveTextAsFile(type) {
  switch(type) {
    case 1:
      var gcodeText = document.getElementById('zeta-x-gcode-out').value,
          textFileAsBlob = new Blob([gcodeText], {type: 'text/plain'}),
          usersFilename = document.getElementById('FILENAME').value,
          filename = usersFilename || '',
          fileNameToSaveAs = filename + 'zeta-x.gcode';
      if (gcodeText) {
        saveAs(textFileAsBlob, fileNameToSaveAs);
      } else {
        alert('Generate G-code first');
        return;
      }
    break;

    case 2:
      var gcodeText = document.getElementById('zeta-y-gcode-out').value,
          textFileAsBlob = new Blob([gcodeText], {type: 'text/plain'}),
          usersFilename = document.getElementById('FILENAME').value,
          filename = usersFilename || '',
          fileNameToSaveAs = filename + 'zeta-y.gcode';
      if (gcodeText) {
        saveAs(textFileAsBlob, fileNameToSaveAs);
      } else {
        alert('Generate G-code first');
        return;
      }
    break;

    default:
      var gcodeText = document.getElementById('freq-gcode-out').value,
          textFileAsBlob = new Blob([gcodeText], {type: 'text/plain'}),
          usersFilename = document.getElementById('FILENAME').value,
          filename = usersFilename || '',
          fileNameToSaveAs = filename + 'freq.gcode';
      if (gcodeText) {
        saveAs(textFileAsBlob, fileNameToSaveAs);
      } else {
        alert('Generate G-code first');
        return;
      }
  }
  
}

// sanity checks for pattern / bed size
function validateInput() {
  var testNaN = {
      // do not use parseInt or parseFloat for validating, since both
      // functions will have special parsing characteristics leading to
      // false numeric validation

      BEDSIZE_X: $('#BEDSIZE_X').val(),
      BEDSIZE_Y: $('#BEDSIZE_Y').val(),
      MAX_FREQ_X: $('#MAX_FREQ_X').val(),
      MAX_FREQ_Y: $('#MAX_FREQ_Y').val(),
      PRINT_SPEED: $('#PRINT_SPEED').val(),
      TRAVEL_SPEED: $('#TRAVEL_SPEED').val(),
      FILAMENT_DIAMETER: $('#FILAMENT_DIAMETER').val(),
      NOZZLE_DIAMETER: $('#NOZZLE_DIAMETER').val(),
      LAYER_HEIGHT: $('#LAYER_HEIGHT').val(),
      FAN_SPEED: $('#FAN_SPEED').val(),
      EXTRUSION_MULT: $('#EXTRUSION_MULT').val(),
      Z_OFFSET: $('#Z_OFFSET').val(),
      NOZZLE_TEMP: $('#NOZZLE_TEMP').val(),
      BED_TEMP: $('#BED_TEMP').val(),
    },
    invalidDiv = 0;

  // Start clean
  $('#BEDSIZE_X,#BEDSIZE_Y,#MAX_FREQ_X,#MAX_FREQ_Y,#PRINT_SPEED,#TRAVEL_SPEED,#FILAMENT_DIAMETER,' + 
  '#NOZZLE_DIAMETER,#LAYER_HEIGHT,#FAN_SPEED,#EXTRUSION_MULT,#Z_OFFSET,#NOZZLE_TEMP,#BED_TEMP').each((i,t) => {
    t.setCustomValidity('');
    const tid = $(t).attr('id');
    $(`label[for=${tid}]`).removeClass();
  });
  $('#warning1').hide();
  $('#warning2').hide();
  $('#warning3').hide();
  $('#button').prop('disabled', false);

  // Check for proper numerical values
  Object.keys(testNaN).forEach((k) => {
    if ((isNaN(testNaN[k]) && !isFinite(testNaN[k])) || testNaN[k].trim().length === 0) {
      $('label[for=' + k + ']').addClass('invalidNumber');
      $('#' + k)[0].setCustomValidity('The value is not a proper number.');
      $('#warning3').text('Some values are not proper numbers. Check highlighted Settings.');
      $('#warning3').addClass('invalidNumber');
      $('#warning3').show();
      $('#button').prop('disabled', true);
    }
  });
}

// save current settings as localStorage object
function setLocalStorage() {
  var PRINTER = $('#PRINTER').val(),
    FILAMENT_DIAMETER = parseFloat($('#FILAMENT_DIAMETER').val()),
    NOZZLE_DIAMETER = parseFloat($('#NOZZLE_DIAMETER').val()),
    NOZZLE_TEMP = parseInt($('#NOZZLE_TEMP').val()),
    BED_TEMP = parseInt($('#BED_TEMP').val()),
    LAYER_HEIGHT = parseFloat($('#LAYER_HEIGHT').val()),
    FAN_SPEED = parseFloat($('#FAN_SPEED').val()),
    PRINT_SPEED = parseInt($('#PRINT_SPEED').val()),
    TRAVEL_SPEED = parseInt($('#TRAVEL_SPEED').val()),
    BEDSIZE_X = parseInt($('#BEDSIZE_X').val()),
    BEDSIZE_Y = parseInt($('#BEDSIZE_Y').val()),
    MAX_FREQ_X = parseInt($('#MAX_FREQ_X').val()),
    MAX_FREQ_Y = parseInt($('#MAX_FREQ_Y').val()),
    Z_OFFSET = parseFloat($('#Z_OFFSET').val()),
    BED_LEVELING = $('#BED_LEVELING').val(),
    EXTRUSION_MULT = parseFloat($('#EXTRUSION_MULT').val()),
    Z_ALIGNMENT = $('#Z_ALIGNMENT').prop('checked');

  var settings = {
    'Version' : SETTINGS_VERSION,
    'FILAMENT_DIAMETER': FILAMENT_DIAMETER,
    'NOZZLE_DIAMETER': NOZZLE_DIAMETER,
    'NOZZLE_TEMP': NOZZLE_TEMP,
    'BED_TEMP': BED_TEMP,
    'LAYER_HEIGHT': LAYER_HEIGHT,
    'FAN_SPEED': FAN_SPEED,
    'PRINT_SPEED': PRINT_SPEED,
    'TRAVEL_SPEED': TRAVEL_SPEED,
    'BEDSIZE_X': BEDSIZE_X,
    'BEDSIZE_Y': BEDSIZE_Y,
    'MAX_FREQ_X': MAX_FREQ_X,
    'MAX_FREQ_Y': MAX_FREQ_Y,
    'Z_OFFSET': Z_OFFSET,
    'BED_LEVELING': BED_LEVELING,
    'EXTRUSION_MULT': EXTRUSION_MULT,
    'Z_ALIGNMENT': Z_ALIGNMENT
  };

  const lsSettings = JSON.stringify(settings);
  window.localStorage.setItem('IS_ZV_SETTINGS', lsSettings);
}

$(window).load(() => {
  // create tab index dynamically
  $(':input:not(:hidden)').each(function(i) {
    $(this).attr('tabindex', i + 1);
  });

  // Get localStorage data
  var lsSettings = window.localStorage.getItem('IS_ZV_SETTINGS');

  if (lsSettings) {
    var settings = jQuery.parseJSON(lsSettings);
    if (!settings['Version'] || settings['Version'] != SETTINGS_VERSION) {
      window.localStorage.removeItem('IS_ZV_SETTINGS');
      alert('Script settings have been updated. Saved settings are reset to default values');
    }
    else {

      $('#FILAMENT_DIAMETER').val(settings['FILAMENT_DIAMETER']);
      $('#NOZZLE_DIAMETER').val(settings['NOZZLE_DIAMETER']);
      $('#NOZZLE_TEMP').val(settings['NOZZLE_TEMP']);
      $('#BED_TEMP').val(settings['BED_TEMP']);
      $('#LAYER_HEIGHT').val(settings['LAYER_HEIGHT']);
      $('#FAN_SPEED').val(settings['FAN_SPEED']);
      $('#PRINT_SPEED').val(settings['PRINT_SPEED']);
      $('#TRAVEL_SPEED').val(settings['TRAVEL_SPEED']);
      $('#BEDSIZE_X').val(settings['BEDSIZE_X']);
      $('#BEDSIZE_Y').val(settings['BEDSIZE_Y']);
      $('#MAX_FREQ_X').val(settings['MAX_FREQ_X']);
      $('#MAX_FREQ_Y').val(settings['MAX_FREQ_Y']);
      $('#Z_OFFSET').val(settings['Z_OFFSET']);
      $('#BED_LEVELING').val(settings['BED_LEVELING']);
      $('#EXTRUSION_MULT').val(settings['EXTRUSION_MULT']);
      $('#Z_ALIGNMENT').prop('checked', settings['Z_ALIGNMENT']);
    }
  }

  // Focus the first field
  $('#kfactor input:first').focus();

});
