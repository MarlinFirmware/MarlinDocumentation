/**
 * RGB565 image converter, 2023 Peter Ellens [https://github.com/ellensp]
 * Original U8Glib bitmap converter, Copyright (C) 2016 João Brázio [https://github.com/jbrazio]
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
"use strict";

/**
 * By : @dust
 *
 * Heavily based on original u8glib converter.js
 * By : @jbrazio
 *    : @thinkyhead
 *    : @shitcreek
 */

var bitmap_converter = function() {

  // Extend jQuery.event.fix for copy/paste to fix clipboardData
  $.event.fix = (function(originalFix) {
    return function(e) {
      e = originalFix.apply(this, arguments);
      if (e.type.indexOf('copy') === 0 || e.type.indexOf('paste') === 0) {
        e.clipboardData = e.originalEvent.clipboardData;
      }
      return e;
    };
  })($.event.fix);

  var paste_message = 'Paste image or C/C++ here.';

  if (typeof $('canvas')[0].getContext == 'undefined') return;

  var $img = $('<img/>'),
    $large = $('#preview-lg'),
    cnv = $large[0],
    ctx = cnv.getContext('2d', {
      willReadFrequently: true
    }),
    $filein = $('#file-input'),
    $err = $('#err-box'),
    $rle16 = $('#rle16-on'),
    $outdiv = $('#cpp-container'),
    $output = $('#output'),
    $pasted = $('#pasted'),
    $field_arr = $('#rle16-on'),
    tobytes = function(n) {
      return Math.ceil(n / 8);
    },
    tohex = function(b) {
      return '0x' + ('0000' + (b & 0xFFFF).toString(16)).toUpperCase().slice(-4);
    },
    data_source,

    error_message = function(msg) {
      $err.text(msg).show();
      console.log(msg);
    },

    restore_pasted_cpp_field = function() {
      $pasted.val(paste_message).css('color', '');
    },

    /**
     * Set the image src to some new data.
     * On $img.load it will call generate_cpp.
     */
    load_url_into_image = function(data_url, w, h) {
      $img = $('<img/>');

      if (w) $img.width(w);
      if (h) $img.height(h);

      $img.one('load', generate_cpp) // Generate when the image loads
        .attr('src', data_url); // Start loading image data

      $field_arr.change(function(e) {
        generate_cpp(e, true);
      });
    },

    /**
     * Read a Blob of image data given a file reference
     *
     * Called by:
     * - File input field, passing the first selected file.
     * - Image pasted directly into a textfield.
     */
    load_file_into_image = function(fileref) {
      var reader = new FileReader();
      $(reader).one('load', function() {
        load_url_into_image(this.result);
      });
      // Load from the given source 'file'
      reader.readAsDataURL(fileref);
    },

    /**
     * Draw the given image into one or both canvases.
     */
    render_image_into_canvases = function($i, notlarge) {
      var img = $i[0],
        iw = img.width,
        ih = img.height;

      // The large image needs no update if not changing
      if (!notlarge) {
        // Scaled view so you can actually see the pixels
        ctx.canvas.width = iw;
        ctx.canvas.height = ih;
        //ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingQuality = 'medium';
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    },


    /**
     * RLE16 (run length 16) encoding
     * Convert data from from raw RGB565 to a simple run-length-encoded format for each word of data.
     * - Each sequence begins with a count byte N.
     *   - If the high bit is set in N the run contains N & 0x7F + 1 unique words.
     *   - Otherwise it repeats the following word N + 1 times.
     * - Each RGB565 word is stored in MSB / LSB order.
     */
    rle_encode = function(data) {
      var distinct, i, nr, rledata, rsize, v;
      rledata = [];
      distinct = [];
      i = 0;
      while ((i < data.length)) {
        v = data[i];
        i += 1;
        rsize = 1;
        for (var j = i, _pj_a = data.length;
          (j < _pj_a); j += 1) {
          if ((v !== data[j])) {
            break;
          }
          i += 1;
          rsize += 1;
          if ((rsize >= 128)) {
            break;
          }
        }
        if ((rsize === 1)) {
          distinct.push(v);
        }
        nr = distinct.length;
        if ((nr && (((nr >= 128) || (rsize > 1)) || (i >= data.length)))) {
          rledata.push((nr - 1) | 128);
          for (var d = 0; d < nr; d += 1) rledata.push(distinct[d]);
          distinct = [];
        }
        if ((rsize > 1)) {

          rledata.push(rsize - 1);
          rledata.push(v);
        }
      }
      return rledata;
    },

    rle_decode = function(rle_data) {
      var decoded = [];
      var color = 0;
      var done = false;
      var offset = 0;
      while (!done) {
        var count = rle_data[0 + offset];
        var uniq = Boolean(count & 0x80);
        count = (count & 0x7F) + 1;
        var getcol = true;
        while (count--) {
          if (getcol) {
            getcol = uniq;
            var msb = rle_data[1 + offset];
            var lsb = rle_data[2 + offset];
            color = (msb << 8) | lsb;
            offset += 2;
            //if (color === 0x0001) color = COLOR_BACKGROUND;
          }
          decoded.push(color);
        }
        offset += 1;
        if (offset >= rle_data.length) done = true;
      }
      return decoded;
    },

    splitRGB = function(raw565_data) {

      var arrayLength = raw565_data.length;
      var bitmap = [];
      for (var i = 0; i < arrayLength; i++) {
        var wordline = [];
        var r_data = (raw565_data[i] & 0xF800) >> 6 + 5 - 3;
        var g_data = (raw565_data[i] & 0x07E0) >> 5 - 2;
        var b_data = (raw565_data[i] & 0x001F) << 3;

        Array.prototype.push.apply(wordline, [r_data, g_data, b_data, 0xFF]);
        Array.prototype.push.apply(bitmap, wordline);
      }
      return bitmap
    },

    /**
     * When anything changes the C++ is regenerated here.
     * Use no_render to indicate the preview won't change.
     *
     * - Draw the original $img into the source canvas.
     * - Draw the converted image into the Preview canvas.
     * - Convert the image data into C text.
     * - Display the image and converted text.
     */
    generate_cpp = function(e, no_render) {

      // Get the image width and height in pixels.
      var iw = $img[0].width,
        ih = $img[0].height;

      var bytewidth = tobytes(iw), // Bytes wide is important
        tobase = tohex;

      // Render the last-loaded image into the Source canvas.
      // Render Preview only if the image won't be modified.
      render_image_into_canvases($img, no_render);

      // A reference to the Source canvas image data
      var data = ctx.getImageData(0, 0, iw, ih).data;

      // Temporary canvas and related vars
      var $tcnv, tctx, tref, tdat = [];

      // Need to re-render the Preview?
      if (!no_render) {
        // Make a new offscreen Canvas for the modified Source image.
        $tcnv = $('<canvas/>').attr({
          'width': iw,
          'height': ih
        });
        tctx = $tcnv[0].getContext('2d');
        tref = tctx.createImageData(iw, ih);
        tdat = tref.data;
      }

      //
      // Convert the image to C++ suitable for Marlin
      //

      if (data_source == 'paste')
        data_source = iw + 'x' + ih + ' pasted image';

      var cpp = '/**\n' +
        ' * Made with Marlin RGB565 Converter\n' +
        ' * https://marlinfw.org/tools/rgb565/converter.html\n' +
        ' *\n' +
        ' * This bitmap from ' + data_source + '\n' +
        ' */\n' +
        '#include "../../../inc/MarlinConfigPre.h"\n\n' +
        '#if HAS_GRAPHICAL_TFT\n\n';

      cpp += 'extern const uint16_t image_data_' + iw + 'x' + ih + 'x16[' + iw * ih + '] = {\n';

      /**
       * Print the data as hex.
       */

      const rgb565_data = []; // keep a copy of the rgb565 data

      for (var y = 0; y < ih; y++) { // loop Y
        for (var x = 0; x < iw * 4; x += 4) { // loop the width
          var i = y * iw * 4 + x;
          var r_data = data[i] >> 3;
          var g_data = data[i + 1] >> 2;
          var b_data = data[i + 2] >> 3;
          var word = (r_data << 11) | (g_data << 5) | b_data;
          //cpp += tobase(word) + ',';
          rgb565_data.push(word);
          cpp += tobase(word) + (y != ih - 1 || x < (iw * 4) - 4 ? ',' : '');
        }
        cpp += '\n';
      }

      cpp += '};\n\n';

      /**
       * This implementation removes whitespace from the right side
       * of the input string.
       */
      function rtrim(x) {
        return x.replace(/\s+$/gm, '');
      }

      function to_hex(x) {
        var chars = "0123456789ABCDEF";
        var n = Math.max(0, x);
        n = Math.min(n, 255); /*  w w w.j  av  a2 s. c o m*/
        n = Math.round(n);
        return chars.charAt((n - n % 16) / 16) + chars.charAt(n % 16);
      }

      function append_byte(data, mybyte, cols = 240) {
        if (data === "") data = "  ";
        data += "0x" + to_hex(mybyte) + ", ";
        if (data.length % (cols * 6 + 2) === 0) data = rtrim(data) + "\n  ";
        return data;
      }

      if ($rle16[0].checked) { // is rle16 checked?
        var rledata = rle_encode(rgb565_data);

        var col, count, i, outstr, rval, size;
        col = 0;
        i = 0;
        outstr = "";
        size = 0;
        while (i < rledata.length) {
          rval = rledata[i];
          i += 1;
          if (rval & 128) {
            count = (rval & 127) + 1;
            outstr = append_byte(outstr, rval);
            size += 1;
            for (var j = 0, _pj_a = count; j < _pj_a; j += 1) {
              outstr = append_byte(outstr, rledata[i + j] >> 8);
              outstr = append_byte(outstr, rledata[i + j] & 255);
              size += 2;
            }
            i += count;
          } else {
            outstr = append_byte(outstr, rval);
            outstr = append_byte(outstr, rledata[i] >> 8);
            outstr = append_byte(outstr, rledata[i] & 255);
            i += 1;
            size += 3;
          }
        }
        cpp += 'extern const uint8_t image_data_' + iw + 'x' + ih + 'x16_rle16[' + size + '] = {\n';
        cpp += rtrim(outstr).slice(0, -1);
        cpp += '\n};\n\n';
      }

      cpp += '#endif // HAS_GRAPHICAL_TFT\n';

      /**
       * Set the output value.
       * Make the field tall enough to show all lines.
       * Show the preview image and output fields.
       */
      $output.val(cpp)
        .attr('rows', (cpp.match(/\n/g) || []).length + 1);
      $outdiv.show();
      $large.css('display', 'block');

      return false;
    },

    /**
     * Get ready to evaluate incoming data
     */
    prepare_for_new_image = function() {
      $err.hide();

      /**
       * Kill most form actions until an image exists.
       *
       * Since the previous image isn't cleared until
       * the final step after loading successfully,
       * this may not be needed.
       */
      $img.off();
    },

    /**
     * Convert C++ text representation back into an image.
     *
     * Finds the correct line-length before scanning for data.
     * Does well screening out most extraneous text.
     */
    process_pasted_cpp = function(cpp) {

      prepare_for_new_image();
      restore_pasted_cpp_field();

      // Get the split up bytes on all lines
      var lens = [],
        mostlens = [],
        contains_rle16 = false,
        pasted_tablename;
      $.each(cpp.split('\n'), function(i, s) {
        var pw = 0;
        $.each(s.replace(/[ \t]/g, '').split(','), function(i, s) {
          if (s.match("_rle16")) {
            contains_rle16 = true;
            pasted_tablename = s.slice(s.search("uint8_t") + 7, s.search("\\["));
          }
          if (s.match(/0x[0-9a-f]+/i) || s.match(/[0-9]+/))
            ++pw;
        });
        lens.push(pw);
        mostlens[pw] = 0;
      });

      var wide = 0,
        high = 0;

      // Find the length with the most instances
      var most_so_far = 0;
      mostlens.fill(0);
      $.each(lens, function(i, v) {
        if (++mostlens[v] > most_so_far) {
          most_so_far = mostlens[v];
          wide = v;
        }
      });

      if (!wide) return error_message("No bitmap found in pasted text.");

      // Split up lines and iterate
      var bitmap = [],
        rledata = [],
        bitstr = '';
      $.each(cpp.split('\n'), function(i, s) {
        s = s.replace(/[ \t]/g, '');
        // Split up bytes and iterate
        var wordline = [],
          len = 0;
        $.each(s.split(','), function(i, s) {
          //console.log("s value:",s);
          var b;
          if (s.match(/\b0x[0-9a-f]+/i)) { // Hex
            b = parseInt(s.substring(2), 16);
            if (contains_rle16) rledata.push(b);
          } else if (s.match(/[0-9]+/)) // Decimal
            b = s * 1;
          else
            return true; // Skip this item

          if (!contains_rle16) {
            var r_data = (b & 0xF800) >> 6 + 5 - 3;
            var g_data = (b & 0x07E0) >> 5 - 2;
            var b_data = (b & 0x001F) << 3;

            Array.prototype.push.apply(wordline, [r_data, g_data, b_data, 0xFF]);
            len += 1;
          }
        });
        if (len == wide && !contains_rle16) {
          Array.prototype.push.apply(bitmap, wordline);
          high++;
        }
      });

      if (contains_rle16) {
        var sizeEnd = pasted_tablename.lastIndexOf('x');
        var sizeMid = pasted_tablename.lastIndexOf('x', pasted_tablename.lastIndexOf('x') - 1);
        var sizeStart = pasted_tablename.lastIndexOf('_', pasted_tablename.lastIndexOf('_') - 1);

        wide = parseInt(pasted_tablename.substring(sizeStart + 1, sizeMid));
        high = parseInt(pasted_tablename.substring(sizeMid + 1, sizeEnd));

        bitmap = splitRGB(rle_decode(rledata));
      }

      if (high < 4) return true;

      // Make a shiny new imagedata for the pasted CPP
      ctx.canvas.width = wide;
      ctx.canvas.height = high;
      var image_data = ctx.createImageData(wide, high);
      for (var i = 0; i < bitmap.length; i++)
        image_data.data[i] = bitmap[i];
      ctx.putImageData(image_data, 0, 0);

      data_source = wide + 'x' + high + ' C/C++ data';
      load_url_into_image(cnv.toDataURL('image/png'), wide, high);
      $filein.val('');
    },

    /**
     * Prep the form for a pasted image.
     * Call to load and process the image data.
     */
    process_pasted_image = function(fileref) {
      $filein.val('');

      prepare_for_new_image();

      data_source = 'paste';
      load_file_into_image(fileref);
    },

    /**
     * Handle a paste into the code/image input field.
     * May be C++ code or a pasted image.
     * For image data call process_pasted_image to process it.
     * Call process_pasted_cpp to parse the code into an image.
     */
    convert_clipboard_to_image = function(e) {
      var clipboardData = e.clipboardData || window.clipboardData,
        items = clipboardData.items,
        found, data;

      // If the browser supports "items" then use it
      if (items) {
        $.each(items, function() {
          switch (this.kind) {
            case 'string':
              found = 'text';
              return false;
            case 'file':
              found = 'image';
              data = this;
              return false;
          }
        });
      } else {
        // Try the 'types' array for Safari / Webkit
        $.each(clipboardData.types, function(i, type) {
          switch (type) {
            case 'text/plain':
              found = type;
              return false;
            case 'image/png':
              found = 'webkit';
              return false;
          }
        });
      }

      switch (found) {
        case 'text/plain':
        case 'text':
          process_pasted_cpp(clipboardData.getData(found));
          break;
        case 'image':
          process_pasted_image(data.getAsFile()); // blob
          break;
          //case 'image/png':
          //  process_pasted_image(data);
          //  break;
        case 'webkit':
          error_message("No image paste in this browser.");
          break;
        default:
          error_message("Couldn't processed pasted " + found + " data!");
      }
    };

  /**
   * File Input Change Event
   *
   * If the file input value changes try to read the data from the file.
   * The reader.load() handler will fire on successful load.
   */
  $filein.change(function() {

    prepare_for_new_image();

    var fileref = $filein[0].files[0];
    if (fileref) {
      data_source = "the file '" + fileref.name + "'";
      load_file_into_image(fileref);
    } else
      error_message("Error opening file.");

    //return false; // No default handler
  });

  // Enable standard form field events
  prepare_for_new_image();

  // Set a friendly message for C++ data paste
  restore_pasted_cpp_field();

  // If the output is clicked, select all
  $output
    .on('mousedown mouseup', function() {
      return false;
    })
    .on('focus click', function(e) {
      this.select();
      return false;
    });

  // Paste old C++ code to see the image and reformat
  $pasted
    .focus(function() {
      var $this = $(this);
      $this
        .val('')
        .css('color', '#F80')
        .one('blur', restore_pasted_cpp_field)
        .one('paste', function(e) {
          $this.css('color', '#FFFFFF00');
          convert_clipboard_to_image(e);
          $this.trigger('blur');
          return false;
        });
    })
    .keyup(function() {
      $(this).val('');
      return false;
    })
    .keydown(function() {
      $(this).val('');
    });
};

head.ready(bitmap_converter);
