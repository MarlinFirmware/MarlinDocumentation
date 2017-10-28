/**
 * U8Glib bitmap converter
 * Copyright (C) 2016 João Brázio [https://github.com/jbrazio]
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
head.ready(function() {

  var canvas = document.getElementById('preview');

  if (canvas.getContext) {

  var img     = new Image(),
      ctx     = canvas.getContext('2d'),
      input   = document.getElementById('file-input'),
      output  = document.getElementById('output'),
      tohex   = function(b) { return '0x' + ('0' + (b & 0xFF).toString(16)).slice(-2); },
      dosel = function() { this.select(); };

    output.addEventListener('focus', dosel, true);
    output.addEventListener('click', dosel, true);

    input.addEventListener('change', function() {

      var file = input.files[0],
          reader = new FileReader();

      if (!file) {
        console.log("Error opening file.");
        return;
      }

      reader.addEventListener('load', function() {
        img.src = reader.result;

        img.addEventListener('load', function() {

          if (img.width > 128 || img.height > 64) {
            console.log("Image dimensions too big for processing.")
            return;
          }

          ctx.canvas.width  = img.width;
          ctx.canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          var buffer = ctx.getImageData(0, 0, canvas.width, canvas.height).data,
              out = [],
              bytewidth = Math.ceil(ctx.canvas.width /8),
              bytesused = bytewidth * canvas.height,
              padding   = bytewidth * 8 - ctx.canvas.width,
              name = Math.random().toString(36).substring(7),
              j = 0;

          for (var i = 0; i < buffer.length; i += 4) {
            var lum = buffer[i] * 0.3 + buffer[i+1] * 0.59 + buffer[i+2] * 0.11,
                bit = (lum < 127) ? 1 : 0;
            out.push(bit);
          }

          output.value =  '// Width: ' + ctx.canvas.width + ', Height: ' + ctx.canvas.height + '\n' +
                          'const unsigned char ' + name + '[' + bytesused + '] PROGMEM = {' + '\n' +
                          '  ';

          var k = 0, byte = null;
          for (var i = 0; i < out.length; i++) {
            if (i > 0 && i % img.width == 0) {
              output.value += tohex(byte) + ', \n  ';
              byte = null;
              k = 0;
            }
            if (k > 7) {
              output.value += tohex(byte) + ', ';
              byte = null;
              k = 0;
            }
            byte += (out[i] << (7 - k)); k++;
          }

          output.value += tohex(byte) + ', \n};';

        }, false); // img load
  
      }, false); // reader load

      reader.readAsDataURL(file);

    }, false);
  }
});
