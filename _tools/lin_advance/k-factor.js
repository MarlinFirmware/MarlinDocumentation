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
function gengcode(form1) {
    
    var FILAMENT_DIAMETER = parseFloat(document.forms['form1']['FIL_DIA'].value),
        NOZZLE_DIAMETER = parseFloat(document.forms['form1']['NOZ_DIA'].value),
        NOZZLE_TEMP = parseInt(document.forms['form1']['NOZZLE_TEMP'].value),
        NOZZLE_LINE_RATIO = parseFloat(document.forms['form1']['NOZ_LIN_R'].value),
        BED_TEMP = parseInt(document.forms['form1']['BED_TEMP'].value),
        SPEED_SLOW = parseInt(document.forms['form1']['SLOW_SPEED'].value),
        SPEED_FAST = parseInt(document.forms['form1']['FAST_SPEED'].value),
        SPEED_MOVE = parseInt(document.forms['form1']['MOVE_SPEED'].value),
        RETRACT_DIST = parseFloat(document.forms['form1']['RETRACTION'].value),
        BED_X = parseInt(document.forms['form1']['BEDSIZE_X'].value),
        BED_Y = parseInt(document.forms['form1']['BEDSIZE_Y'].value),
        HEIGHT_LAYER = parseFloat(document.forms['form1']['LAYER_HEIGHT'].value),
        EXT_MULT = parseFloat(document.forms['form1']['EXTRUSION_MULT'].value),
        START_K = parseInt(document.forms['form1']['K_START'].value),
        END_K = parseInt(document.forms['form1']['K_END'].value),
        STEP_K = parseFloat(document.forms['form1']['K_STEP'].value);

    // Check if K-Factor Stepping is a multiple of the K-Factor Range
    var RANGE_K =  END_K - START_K;
    if (RANGE_K % STEP_K != 0) {
      alert("Your K-Factor range cannot be cleanly divided. Check Start / End / Steps for the K-Factor");
      document.forms['form1']['textarea'].value = '';
      return;
    }   
    // Check if the Test Pattern size does not exceed the Y Bed Size
    var PRINT_SIZE_Y = RANGE_K / STEP_K * 5 + 25;
    if (PRINT_SIZE_Y > BED_Y - 20) {
      alert("Your K-Factor settings exceed your Y bed size. Check Start / End / Steps for the K-Factor");
      document.forms['form1']['textarea'].value = '';
      return;
    }
    var START_Y = (BED_Y - PRINT_SIZE_Y) / 2;   

    // Convert speeds from mm/s to mm/min if needed
    var MM_S = document.getElementById('MM_S');
    if (MM_S === null || !MM_S.checked) {
      SPEED_SLOW *= 60;
      SPEED_FAST *= 60;
      SPEED_MOVE *= 60;
    }

    //Set the extrusion parameters
    var EXTRUSION_RATIO = NOZZLE_DIAMETER * NOZZLE_LINE_RATIO * HEIGHT_LAYER / (Math.pow(FILAMENT_DIAMETER / 2,2) * Math.PI),
        EXT_20 = roundNumber(EXTRUSION_RATIO * EXT_MULT * 20, 5),
        EXT_40 = roundNumber(EXTRUSION_RATIO * EXT_MULT * 40, 5);
    
    document.forms['form1']['textarea'].value = '';
    document.forms['form1']['textarea'].value = '; K-Factor Test\n' +
                                                ';\n' +
                                                '; Created: ' + new Date() + '\n' +
                                                '; Settings:\n' +
                                                '; Filament Diameter = ' + FILAMENT_DIAMETER + '\n' +
                                                '; Nozzle Diameter = ' + NOZZLE_DIAMETER + '\n' +
                                                '; Nozzle Temperature = ' + NOZZLE_TEMP + '\n' +
                                                '; Nozzle / Line Ratio = ' + NOZZLE_LINE_RATIO + '\n' +
                                                '; Bed Temperature = ' +BED_TEMP + '\n' +
                                                '; Slow Printing Speed = ' + SPEED_SLOW + '\n' +
                                                '; Fast Printing Speed = ' + SPEED_FAST + '\n' +
                                                '; Movement Speed = ' + SPEED_MOVE + '\n' +
                                                '; Use UBL = ' + (document.getElementById('USE_BL').checked ? "true" : "false") + '\n' +
                                                '; Retraction Distance = ' + RETRACT_DIST + '\n' +
                                                '; Bed Size X = ' + BED_X + '\n' +
                                                '; Bed Size Y = ' + BED_Y + '\n' +
                                                '; Layer Height = ' + HEIGHT_LAYER + '\n' +
                                                '; Extrusion Multiplier = ' + EXT_MULT + '\n' +
                                                '; Starting Value K-Factor = ' + START_K + '\n' +
                                                '; Ending value K-Factor = ' + END_K + '\n' +
                                                '; K-Factor Stepping = ' + STEP_K + '\n' +
                                                ';\n' +
                                                'G28 ; home all axes\n' +                                                   
                                                'M190 S' + BED_TEMP + ' ; set and wait for bed temp\n' +
                                                'M104 S' + NOZZLE_TEMP + ' ; set nozzle temp and continue\n';

    if (document.getElementById('USE_BL').checked)
      document.forms['form1']['textarea'].value += 'G29 ; Do Auto Bed Leveling compensation\n';
    
    document.forms['form1']['textarea'].value += 'M109 S' + NOZZLE_TEMP + ' ; block waiting for nozzle temp\n' +
                                                 'G21 ; set units to millimetres\n' +
                                                 'M204 S500 ; lower acceleration to 500mm/s2 during the test\n' +
                                                 'G90 ; use absolute coordinates\n' +
                                                 'M83 ; use relative distances for extrusion\n' + 
                                                 ';\n' +
                                                 '; go to layer height and prime nozzle on a line to the left\n' +
                                                 ';\n' +
                                                 'G1 X' + ((BED_X - 120) / 2) + ' Y' + START_Y + ' F' + SPEED_MOVE + '\n' +
                                                 'G1 Z' + HEIGHT_LAYER + ' F' + SPEED_SLOW + '\n' +
                                                 'G1 X' + ((BED_X - 120) / 2) + ' Y' + (START_Y + 100) + ' E10' + ' F' + SPEED_SLOW + ' ; extrude some to start clean\n' +
                                                 'G1 E-' + RETRACT_DIST + '\n' +
                                                 ';\n' +
                                                 '; start the test (all values are relative coordinates)\n' +
                                                 ';\n' +
                                                 'G1 X' + ((BED_X - 80) / 2) + ' Y' + START_Y + ' F' + SPEED_MOVE + ' ; move to pattern start\n' +
                                                 'G91 ; use relative coordinates\n';
    
    
    for (i = START_K; i <= END_K; i = i + STEP_K)
        document.forms['form1']['textarea'].value += 'M900 K' + i + ' ; set K-factor\n' +
                                                     'G1 E' + RETRACT_DIST + '\n' +
                                                     'G1 X20 Y0 E' + EXT_20 + ' F' + SPEED_SLOW + '\n' +
                                                     'G1 X40 Y0 E' + EXT_40 + ' F' + SPEED_FAST + '\n' +
                                                     'G1 X20 Y0 E' + EXT_20 + ' F' + SPEED_SLOW + '\n' +
                                                     'G1 E-' + RETRACT_DIST + '\n' +
                                                     'G1 X-80 Y5 F' + SPEED_MOVE + '\n';
    
    document.forms['form1']['textarea'].value += ';\n' +
                                                 '; mark the test area for reference\n' +
                                                 ';\n' +
                                                 'G1 X20 Y0 F' + SPEED_MOVE + '\n' +
                                                 'G1 E' + RETRACT_DIST + '\n' +
                                                 'G1 X0 Y20 E' + EXT_20 + ' F' + SPEED_SLOW + '\n' +
                                                 'G1 E-' + RETRACT_DIST + '\n' +
                                                 'G1 X40 Y-20 F' + SPEED_MOVE + '\n' +
                                                 'G1 E' + RETRACT_DIST + '\n' +
                                                 'G1 X0 Y20 E' + EXT_20 + ' F' + SPEED_SLOW + '\n' +
                                                 'G1 E-' + RETRACT_DIST + '\n' +
                                                 ';\n' +
                                                 '; finish\n' +
                                                 ';\n' +
                                                 'G4 ; wait\n' +
                                                 'M104 S0 ; turn off hotend\n' +
                                                 'M140 S0 ; turn off bed\n' +
                                                 'G90 ; use absolute coordinates\n' +
                                                 'G1 Z30 Y200 F' + SPEED_MOVE + ' ; move away from the print\n' +
                                                 'M84 ; disable motors\n' +
                                                 'M502 ; resets parameters from ROM (for those who do not have an EEPROM)\n' +
                                                 'M501 ; resets parameters from EEPROM (preferably)\n' +
                                                 ';';
}

// https://stackoverflow.com/questions/21479107/saving-html5-textarea-contents-to-file
function saveTextAsFile(form) {
    var textToWrite = document.getElementById('textarea').value,
        textFileAsBlob = new Blob([ textToWrite ], { type: 'text/plain' }),
        fileNameToSaveAs = "kfactor.gcode";

    var downloadLink = document.createElement("a");
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

// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
function roundNumber(num, scale) {
  if (!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if (+arr[1] + scale > 0) sig = "+";
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}
