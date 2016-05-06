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
  var img = null;
  var ctx = null;

  var input  = document.getElementById('file-input');
  var canvas = document.getElementById('preview');

  if (canvas.getContext) {
    img = new Image();
    ctx = canvas.getContext('2d');

    input.addEventListener('change', function() {
      var file = input.files[0];
      var reader = new FileReader();

      if (!file) {
        console.log("Error opening file.");
        return;
      }

      reader.addEventListener("load", function () {
        img.src = reader.result;

        if (img.width > 128 || img.height > 64) {
          console.log("Image dimensions too big for processing.")
          return;
        }

        ctx.canvas.width  = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        var buffer = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        var out = [];

        var bytewidth = Math.ceil(ctx.canvas.width /8);
        var bytesused = bytewidth * canvas.height;
        var padding   = bytewidth * 8 - ctx.canvas.width;

        var name = Math.random().toString(36).substring(7);

        var j = 0;
        for (var i = 0; i < buffer.length; i += 4) {
          var lum = buffer[i] * 0.3 + buffer[i+1] * 0.59 + buffer[i+2] * 0.11;
          var bit = (lum < 127) ? 1 : 0;
          out.push(bit);
        }

        document.getElementById('output').innerHTML
          = '// Width: ' + ctx.canvas.width + ', Height: ' + ctx.canvas.height + '<br />';

        document.getElementById('output').innerHTML
          += 'const unsigned char ' + name + '[' + bytesused + '] PROGMEM = {' + '<br />'

        document.getElementById('output').innerHTML
          += '&nbsp;&nbsp';

        var k = 0;
        var byte = null;
        for (var i = 0; i < out.length; i++) {
          if (i > 0 && i % img.width == 0) {
            // Padding
            for(;k < 8; k++) byte += (0 << (7-k));

            document.getElementById('output').innerHTML += '0x'
              + ('0' + (byte & 0xFF).toString(16)).slice(-2) + ', ';

            document.getElementById('output').innerHTML
              += '<br/>' + '&nbsp;&nbsp';

            byte = null;
            k = 0;
          }

          if (k > 7) {
            document.getElementById('output').innerHTML += '0x'
              + ('0' + (byte & 0xFF).toString(16)).slice(-2) + ', ';
            byte = null;
            k = 0;
          }

          byte += (out[i] << (7-k)); k++;
        }

        // Padding
        for(;k < 8; k++) byte += (0 << (7-k));

        document.getElementById('output').innerHTML += '0x'
          + ('0' + (byte & 0xFF).toString(16)).slice(-2) + ', ';

        document.getElementById('output').innerHTML
          += '<br />' + '};';
      }, false);

      reader.readAsDataURL(file);
    }, false);
  }
});
