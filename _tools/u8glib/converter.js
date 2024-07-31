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
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

"use strict";

/**
 * By : @jbrazio
 *      @thinkyhead
 *      @shitcreek
 *      @dust
 * Todo:
 * - Composite status image from logo, nozzle, bed, fan
 * - Slider for threshold (jQuery.ui)
 * - Buttons to shift the image
 * - Show preview image in B/W converted
 * - Show original image (float right)
 *
 */

var bitmap_converter = () => {

  // Extend jQuery.event.fix for copy/paste to fix clipboardData
  $.event.fix = ((originalFix) => {
    return function(e) { // Must be function to get (this, arguments)
      e = originalFix.apply(this, arguments); // this == e.target
      if (e.type.indexOf('copy') === 0 || e.type.indexOf('paste') === 0) {
        e.clipboardData = e.originalEvent.clipboardData;
      }
      return e;
    };
  })($.event.fix);

  var paste_message = 'Paste image or C/C++ here.',
      preview_scale = 4,
      max_size = [ 128, 64 ],
      pix_on  = [   0,   0,   0, 255 ],
      pix_off = [ 255, 255, 255,   0 ],
      lcd_off = [   0,  30, 253, 255 ],
      lcd_on  = [ 116, 241, 255, 255 ];

  if (typeof $('canvas')[0].getContext == 'undefined') return;

  var $img        = $('<img/>'),
      $large      = $('#preview-lg'),
      $small      = $('#preview-sm'),
      cnv         = $large[0],
      cnv_sm      = $small[0],
      ctx         = cnv.getContext('2d'),
      ctx_sm      = cnv_sm.getContext('2d'),
      $filein     = $('#file-input'),
      $err        = $('#err-box'),
      $outdiv     = $('#cpp-container'),
      $output     = $('#output'),
      $lit        = $('#lit-on'),
      $invert     = $('#inv-on'),
      $binary     = $('#bin-on'),
      $ascii      = $('#ascii-on'),
      $skinny     = $('#skinny-on'),
      $hotends    = $('#hotends'),
      $compact    = $('#compact-on'),
      $rj         = $('#rj-on'),
      $bed        = $('#bed-on'),
      $fan        = $('#fan-on'),
      $vers       = $('input[name=marlin-ver]'),
      $type       = $('input[name=bitmap-type]'),
      $bootop     = $('#boot-sub'),
      $statop     = $('#stat-sub'),
      $pasted     = $('#pasted'),
      $field_arr  = $('#bin-on, #ascii-on, #skinny-on, #hotends, #compact-on, #rj-on, #bed-on, #fan-on, input[name=marlin-ver], input[name=bitmap-type]'),
      tobytes     = (n) => { return Math.ceil(n / 8); },
      tohex       = (b) => { return '0x' + ('0' + (b & 0xFF).toString(16)).toUpperCase().slice(-2); },
      tobin       = (b) => { return 'B' + ('0000000' + (b & 0xFF).toString(2)).slice(-8); },
      random_name = (prefix) => { return (prefix||'') + Math.random().toString(36).substring(7); },
      grayscale   = (rgb) => { return rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11; },
      rnd_name, data_source,

      error_message = (msg) => {
        $err.text(msg).show(); console.log(msg);
      },

      restore_pasted_cpp_field = () => {
        $pasted.val(paste_message).css('color', '');
      },

      /**
       * Set the image src to some new data.
       * On $img.load it will call generate_cpp.
       */
      load_url_into_image = (data_url, w, h) => {
        $img = $('<img/>');

        if (w) $img.width(w);
        if (h) $img.height(h);

        $img.one('load', generate_cpp)      // Generate when the image loads
            .attr('src', data_url);         // Start loading image data

        $field_arr.change((e) => { generate_cpp(e, true); });
        $lit.change(generate_cpp);
        $invert.change(generate_cpp);

        rnd_name = random_name();           // A new bitmap name on each file load
      },

      /**
       * Read a Blob of image data given a file reference
       *
       * Called by:
       * - File input field, passing the first selected file.
       * - Image pasted directly into a textfield.
       */
      load_file_into_image = (fileref) => {
        var reader = new FileReader();
        $(reader).one('load', (e) => { load_url_into_image(e.target.result); });
        // Load from the given source 'file'
        reader.readAsDataURL(fileref);
      },

    /**
      * Bitwise RLE (run length) encoding
      * Convert data from raw mono bitmap to a bitwise run-length-encoded format.
      * - The first nybble is the starting bit state. Changing this nybble inverts the bitmap.
      * - The following bytes provide the runs for alternating on/off bits.
      *   - A value of 0-14 encodes a run of 1-15.
      *   - A value of 16 indicates a run of 16-270 calculated using the next two bytes.
      */
      bitwise_rle_encode = (data) => {
        function get_bit(data, n) {
          return (data[Math.floor(n / 8)] & (0x80 >> (n % 8))) ? 1 : 0;
        }

        function try_encode(data, isext) {
          const bitslen = data.length * 8;
          let bitstate = get_bit(data, 0);
          const rledata = [bitstate];
          const bigrun = isext ? 256 : 272;
          let medrun = false;

          let i = 0;
          let runlen = -1;
          while (i <= bitslen) {
            const b = i < bitslen ? get_bit(data, i) : null;
            runlen += 1;
            if (bitstate !== b || i === bitslen) {
              if (runlen >= bigrun) {
                isext = true;
                if (medrun) return [
                  [], isext
                ];
                const rem = runlen & 0xFF;
                rledata.push(15, 15, Math.floor(rem / 16), rem % 16);
              } else if (runlen >= 16) {
                rledata.push(15, Math.floor(runlen / 16) - 1, runlen % 16);
                if (runlen >= 256) medrun = true;
              } else {
                rledata.push(runlen - 1);
              }
              bitstate ^= 1;
              runlen = 0;
            }
            i += 1;
          }

          const encoded = [];
          let ri = 0;
          const rlen = rledata.length;
          while (ri < rlen) {
            let v = rledata[ri] << 4;
            if (ri < rlen - 1) v |= rledata[ri + 1];
            encoded.push(v);
            ri += 2;
          }

          return [encoded, isext];
        }

        // Try to encode with the original isext flag
        //const warn = data.length > 300000 ? "This may take a while" : "";
        //console.log("Compressing image data...", warn);
        let isext = false;
        let encoded = [];
        [encoded, isext] = try_encode(data, isext);
        if (encoded.length === 0) {
          [encoded, isext] = try_encode(data, true);
        }
        return [encoded, isext];
      },

      /**
       * Draw the given image into one or both canvases.
       */
      render_image_into_canvases = ($i, notsmall, notlarge) => {
        var img = $i[0], iw = img.width, ih = img.height;

        // The small image needs no update if not changing
        if (!notsmall) {
          // Prepare the small hidden canvas to receive the image
          ctx_sm.canvas.width  = iw;
          ctx_sm.canvas.height = ih;
          ctx_sm.drawImage(img, 0, 0, ctx_sm.canvas.width, ctx_sm.canvas.height);
        }

        // The large image needs no update if not changing
        if (!notlarge) {
          // Scaled view so you can actually see the pixels
          ctx.canvas.width  = iw * preview_scale;
          ctx.canvas.height = ih * preview_scale;
          //ctx.mozImageSmoothingEnabled = false;
          ctx.imageSmoothingQuality = 'medium';
          ctx.webkitImageSmoothingEnabled = false;
          ctx.msImageSmoothingEnabled = false;
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }
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
      generate_cpp = (e, no_render) => {

        // Get the image width and height in pixels.
        var iw = $img[0].width, ih = $img[0].height;

        // Reject images that are too big
        // TODO: Scale images down if needed
        // TODO: Threshold sliders for luminance range to capture.
        if (iw > max_size[0] || ih > max_size[1])
          return error_message('Image too large for display. Maximum ' + max_size[0] + ' x ' + max_size[1] + '.');

        var bytewidth = tobytes(iw),                          // Bytes wide is important

            type = $type.filter(':checked').val(),            // The selected output type
            vers = $vers.filter(':checked').val(),
            name = type == 'boot' ? 'custom_start_bmp' :
                   type == 'stat' ? 'status_logo_bmp' :
                   'bitmap_' + rnd_name,

            is_bin = $binary[0].checked,                      // Flags for binary, ascii, and narrow ascii

            tobase = is_bin ? tobin : tohex,

            is_inv = $invert[0].checked,
            zero = is_inv ? (is_bin ? 'B11111111' : '0xFF') : (is_bin ? 'B00000000' : '0x00'),

            is_asc = $ascii[0].checked,                       // Include ASCII version of the bitmap?
            is_thin = $skinny[0].checked,                     // A skinny ASCII output with blocks.

            is_compact = $compact[0].checked && vers == 2 && type == 'boot',    // Display compact data for marlin 2.0 only with bootscreen

            is_stat = type == 'stat',                         // "Status" has extra options
            is_lpad = is_stat && !$rj[0].checked,             // Right justify?

            rjust_add = tobytes(max_size[0]) - bytewidth;

        /**
         * Convert to grayscale, perform threshold.
         *
         * Dark and light solid pixels are counted to determine
         * whether the 'Light' checkbox should be hard-set or
         * should be changeable.
         */

        // Render the last-loaded image into the Source canvas.
        // Render Preview only if the image won't be modified.
        render_image_into_canvases($img, false, no_render);

        // A reference to the Source canvas image data
        var data = ctx_sm.getImageData(0, 0, iw, ih).data;

        // Count up solid light and dark pixels.
        var lite = 0, dark = 0;
        for (var i = 0; i < data.length; i += 4) {
          if (data[i+3] > 63) {
            var islit = 127 < grayscale(data.slice(i, i+3));
            lite += islit; dark += !islit;
          }
        }

        // Set and disable 'Light' checkbox if
        // only one setting produces an image.
        var is_lit = $lit[0].checked;
        if (lite) { if (!dark) is_lit = true; }
        else if (dark) is_lit = false;
        $lit.prop('checked', is_lit)
            .prop('disabled', !lite != !dark);

        // Temporary canvas and related vars
        var $tcnv, tctx, tref, tdat = [];

        // Need to re-render the Preview?
        if (!no_render) {
          // Make a new offscreen Canvas for the modified Source image.
          $tcnv = $('<canvas/>').attr({ 'width':iw, 'height':ih });
          tctx = $tcnv[0].getContext('2d');
          tref = tctx.createImageData(iw, ih);
          tdat = tref.data;
        }

        //
        // Convert the image to B/W by threshold.
        // If rendering also update the ImageData.data.
        //

        var lo_thr = 127, hi_thr = 127;
        for (var i = 0; i < data.length; i += 4) {
          var gray = grayscale(data.slice(i, i+3));
          if (gray < lo_thr) lo_thr = gray;
          if (gray > hi_thr) hi_thr = gray;
        }
        var mid_thr = (lo_thr + hi_thr) / 2;

        var out = [];
        for (var i = 0; i < data.length; i += 4) {
          var gray = grayscale(data.slice(i, i+3)),
              pixon = data[i+3] > 63 && is_lit == (gray > mid_thr),
              pixel = is_inv != pixon,
              c = pixel ? lcd_on : lcd_off;
          out.push(pixel);
          if (!no_render) {
            tdat[i  ] = c[0]; tdat[i+1] = c[1];
            tdat[i+2] = c[2]; tdat[i+3] = c[3];
          }
        }

        if (!no_render) {
          // Render the modified Preview Image
          tctx.putImageData(tref, 0, 0);
          var $vimg = $('<img/>').width(iw).height(ih)
                        .one('load', (e) => { render_image_into_canvases($(e.target), true, false); })
                        .attr('src', $tcnv[0].toDataURL('image/png'));
        }

        //
        // Convert the B/W image to C++ suitable for Marlin
        //

        if (data_source == 'paste')
          data_source = iw + 'x' + ih + ' pasted image';

        var cpp = '/**\n'
                + ' * Made with Marlin Bitmap Converter\n'
                + ' * https://marlinfw.org/tools/u8glib/converter.html\n'
                + ' *\n'
                + ' * This bitmap from ' + data_source + '\n'
                + ' */\n'
                + '#pragma once\n\n';

        if (is_stat) {
          if (!is_lpad && rjust_add)  // Right-justified and not full width
            cpp += '#define STATUS_SCREEN_X ' + (rjust_add * 8) + '\n';
          cpp += '#define ' + (vers == 2 ? 'STATUS_LOGO_WIDTH' : 'STATUS_SCREENWIDTH') + ' ' + (bytewidth * 8) + '\n';
        }
        else if (type == 'boot') {
          cpp += '#define CUSTOM_BOOTSCREEN_BMPWIDTH  ' + iw + '\n';
          if (vers != 2) cpp += '#define CUSTOM_BOOTSCREEN_BMPHEIGHT ' + ih + '\n';
        }
        else {
          var rn = rnd_name.toUpperCase();
          cpp += '#define ' + rn + '_BMPWIDTH  ' + iw + '\n';
          if (vers != 2) cpp += '#define ' + rn + '_BMPHEIGHT ' + ih + '\n';
        }

        cpp += '\nconst unsigned char ' + name + '[] PROGMEM = {\n';

        const bitmap_data = [];                     // keep a copy of the bitmapdata

        /**
         * Print the data as hex or binary,
         * appending ASCII art if selected.
         */
        var lastx = (iw - 1) - ((iw + 7) % 8);      // last item in each line

        for (var y = 0; y < ih; y++) {              // loop Y
          var bitline = ' // ';
          cpp += '  ';
          var xx = 0;                               // pixel X
          for (var x = 0; x < iw; x += 8) {         // loop the width, step by 8
            var byte = 0;
            for (var b = 0; b < 8; b++) {           // loop 8 bits
              var i = y * iw + xx,                  // pixel index in the bitmap data
                  bb = xx < iw ? out[i] : is_inv;   // a set bit?
              byte = (byte << 1) | bb;              // add to the byte
              bitline += is_thin
                         ? b % 2 ? ['·','▐','▌','█'][byte & 3] : ''
                         : bb ? '#' : '.';
              xx++;
            }
            // Append the byte and optional comma or space
            bitmap_data.push(byte);                // populate the bitmap data
            cpp += tobase(byte) + (y != ih - 1 || x < lastx ? ',' : is_asc ? ' ' : '');
          }

          // Append ASCII art comment, if any
          cpp += (is_asc ? bitline : '') + '\n';
        }

        cpp += '};\n';

        if (is_compact) {
          const [rledata, isext] = bitwise_rle_encode(bitmap_data);

          function rle_emit(rledata, rawsize, isext) {
            let outstr = '';
            const rows = rledata.reduce((acc, val, i) => {
                if (i % 16 === 0) acc.push([]);
                acc[acc.length - 1].push(`0x${val.toString(16).padStart(2, '0').toUpperCase()}`);
                return acc;
            }, []);
            for (let i = 0; i < rows.length; i++) {
                outstr += `  ${rows[i].join(', ')},\n`;
            }

            outstr = outstr.slice(0, -2);
            const size = rledata.length;
            const defname = isext ? 'COMPACT_CUSTOM_BOOTSCREEN_EXT' : 'COMPACT_CUSTOM_BOOTSCREEN';
            return `\n// Saves ${rawsize - size} bytes\n#define ${defname}\nconst unsigned char custom_start_bmp_rle[${size}] PROGMEM = {\n${outstr}\n};\n`;
          }

          cpp += rle_emit(rledata, bitmap_data.length, isext);
        }

        /*
        if (is_stat)
          if ($fan[0].checked)
            cpp += '\n// TODO: Add a second array with FAN FRAME 2 included.\n'
          else
            cpp += '\nconst unsigned char *status_screen1_bmp = status_screen0_bmp;\n'
        */

        /**
         * Set the output value.
         * Make the field tall enough to show all lines.
         * Show the preview image and output fields.
         */
        $output.val(cpp)
               .attr('rows', (cpp.match(/\n/g)||[]).length + 1);
        $outdiv.show();
        $large.css('display','block');

        // Show the appropriate text above the output
        $('#where').html(
          type == 'boot' ? '<strong><tt>_Bootscreen.h</tt></strong>' :
          type == 'stat' ? '<strong><tt>_Statusscreen.h</tt></strong>' :
          'program'
        );

        return false;
      },

      /**
       * Get ready to evaluate incoming data
       */
      prepare_for_new_image = () => {
        $err.hide();

        function bootop_update() {
          const v = $vers.filter(':checked').val();
          if ($vers.filter(':checked').val() == '2' && $type.filter(':checked').val() == 'boot')
            $bootop.show();
          else
            $bootop.hide();
        }

        /**
         * Kill most form actions until an image exists.
         *
         * Since the previous image isn't cleared until
         * the final step after loading successfully,
         * this may not be needed.
         */
        $img.off();
        $lit.off();
        $invert.off();
        $field_arr.off();
        bootop_update();

        // Restore cosmetic 'ASCII Art' behavior
        $ascii.change((e) => { $skinny.prop('disabled', !$(e.target).is(':checked')); return false; });

        // Remove 'Compact' option for Marlin 1.x
        $vers.change(bootop_update);

        // Restore cosmetic 'Status' behavior
        $type.change(() => {
          bootop_update();
          if ($type.filter(':checked').val() == 'stat') $statop.show(); else $statop.hide();
        });
      },

      /**
       * Convert C++ text representation back into an image.
       *
       * Finds the correct line-length before scanning for data.
       * Does well screening out most extraneous text.
       */
      process_pasted_cpp = (cpp) => {

        prepare_for_new_image();
        restore_pasted_cpp_field();

        // Get the split up bytes on all lines
        var lens = [], mostlens = [];
        $.each(cpp.split('\n'), (i,s) => {
          var pw = 0;
          $.each(s.replace(/[ \t]/g,'').split(','), (i,s) => {
            if (s.match(/0x[0-9a-f]+/i) || s.match(/0b[01]+/) || s.match(/B[01]+/) || s.match(/[0-9]+/))
              ++pw;
          });
          lens.push(pw);
          mostlens[pw] = 0;
        });

        var wide = 0, high = 0;

        // Find the length with the most instances
        var most_so_far = 0;
        mostlens.fill(0);
        $.each(lens, (i,v) => {
          if (++mostlens[v] > most_so_far) {
            most_so_far = mostlens[v];
            wide = v * 8;
          }
        });

        if (!wide) return error_message("No bitmap found in pasted text.");

        // Split up lines and iterate
        var bitmap = [], bitstr = '';
        $.each(cpp.split('\n'), (i,s) => {
          s = s.replace(/[ \t]/g,'');
          // Split up bytes and iterate
          var byteline = [], len = 0;
          $.each(s.split(','), (i,s) => {
            var b;
            if (s.match(/0x[0-9a-f]+/i))          // Hex
              b = parseInt(s.substring(2), 16);
            else if (s.match(/0b[01]+/))          // Binary
              b = parseInt(s.substring(2), 2);
            else if (s.match(/B[01]+/))           // Binary
              b = parseInt(s.substring(1), 2);
            else if (s.match(/[0-9]+/))           // Decimal
              b = s * 1;
            else
              return true;                        // Skip this item

            for (var i = 0; i < 8; i++) {
              Array.prototype.push.apply(byteline, b & 0x80 ? pix_on : pix_off);
              b <<= 1;
            }
            len += 8;
          });
          if (len == wide) {
            Array.prototype.push.apply(bitmap, byteline);
            high++;
          }
        });

        if (high < 4) return true;

        // Make a shiny new imagedata for the pasted CPP
        ctx_sm.canvas.width  = wide;
        ctx_sm.canvas.height = high;
        var image_data = ctx_sm.createImageData(wide, high);
        for (var i = 0; i < bitmap.length; i++)
          image_data.data[i] = bitmap[i];
        ctx_sm.putImageData(image_data, 0, 0);

        data_source = wide + 'x' + high + ' C/C++ data';
        load_url_into_image(cnv_sm.toDataURL('image/png'), wide, high);
        $filein.val('');
      },

      /**
       * Prep the form for a pasted image.
       * Call to load and process the image data.
       */
      process_pasted_image = (fileref) => {
        $invert.prop('checked', 0);
        $filein.val('');

        prepare_for_new_image();

        data_source = 'paste';
        // if (typeof fileref == 'string')
        //   load_url_into_image(fileref);
        // else
          load_file_into_image(fileref);
      },

      /**
       * Handle a paste into the code/image input field.
       * May be C++ code or a pasted image.
       * For image data call process_pasted_image to process it.
       * Call process_pasted_cpp to parse the code into an image.
       */
      convert_clipboard_to_image = (e) => {
        var clipboardData = e.clipboardData || window.clipboardData,
            items = clipboardData.items,
            found, data;

        // If the browser supports "items" then use it
        if (items) {
          $.each(items, (n,v) => {
            switch (v.kind) {
              case 'string':
                found = 'text';
                return false;
              case 'file':
                found = 'image';
                data = v;
                return false;
            }
          });
        }
        else {
          // Try the 'types' array for Safari / Webkit
          $.each(clipboardData.types, (i, type) => {
            switch (type) {
              case 'text/plain':
                found = type;
                return false;
              case 'image/png':
                found = 'webkit';
                //data = clipboardData.getData(type);
                //console.log('Got ' + (typeof data) + ' for ' + type + ' with length ' + data.length);
                //$('<img/>').attr('src', 'blob:'+clipboardData.types[i-1]);
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
          default: error_message("Couldn't processed pasted " + found + " data!");
        }

      };

  /**
   * File Input Change Event
   *
   * If the file input value changes try to read the data from the file.
   * The reader.load() handler will fire on successful load.
   */
  $filein.change(() => {

    prepare_for_new_image();

    var fileref = $filein[0].files[0];
    if (fileref) {
      $invert.prop('checked', 0);
      data_source = "the file '" + fileref.name + "'";
      load_file_into_image(fileref);
    }
    else
      error_message("Error opening file.");

    //return false; // No default handler
  });

  // Enable standard form field events
  prepare_for_new_image();

  // Set a friendly message for C++ data paste
  restore_pasted_cpp_field();

  // If the output is clicked, select all
  $output
    .on('mousedown mouseup', () => { return false; })
    .on('focus click', (e) => { e.target.select(); return false; });

  // Paste old C++ code to see the image and reformat
  $pasted
    .focus((e) => {
      var $this = $(e.target);
      $this
        .val('')
        .css('color', '#F80')
        .one('blur', restore_pasted_cpp_field)
        .one('paste', (e) => {
          $this.css('color', '#FFFFFF00');
          convert_clipboard_to_image(e);
          $this.trigger('blur');
          return false;
        });
    })
    .keyup((e) => { $(e.target).val(''); return false; })
    .keydown((e) => { $(e.target).val(''); });
};

head.ready(bitmap_converter);
