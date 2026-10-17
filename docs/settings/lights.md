---
title: Lights
parent: Settings
layout: setting
section: lights
settings:
- name: TEMP_STAT_LEDS
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    Temperature status LEDs that display the hotend and bed temperature. If all hotend and bed temperature set-point are < 54C then the BLUE led is on. Otherwise the RED led is on. There is 1C hysteresis.

    Adds a simple temperature status indicators using LEDs.
  comment: Temperature status LEDs that display the hotend and bed temperature. If all hotends, bed temperature, and target temperature are under 54C the BLUE led is on. Otherwise the RED led is on. (1C hysteresis)
- name: BLINKM
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    ![LED Lights](/assets/images/config/led-lights.jpg){: .float-right .framed }

    Marlin currently supplies two options for RGB-addressable color indicators. In both cases the color is set using [`M150`](/docs/gcode/M150.html) `Rr Ug Bb` to specify RGB components from 0 to 255.

    The [BLINKM board](//thingm.com/products/blinkm/) supplies the backlighting for some LCD controllers. Its color is set using I2C messages.
  comment: Support for BlinkM/CyzRgb
- name: PCA9632
  file: Configuration.h
  type: switch
  disabled: true
  long: The [Philips PCA9632](//www.digchip.com/datasheets/3286493-pca9632.html) is a common PWM LED driver, controlled (like BlinkM) using I2C.
  comment: Support for PCA9632 PWM LED driver
- name: PCA9533
  file: Configuration.h
  type: switch
  disabled: true
  comment: Support for PCA9533 PWM LED driver
- name: RGB_LED
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    Enable support for an RGB(W) LED connected to 5 V digital pins, or an RGB(W) Strip connected to MOSFETs controlled by digital pins. An inexpensive RGB LED can be used simply by assigning digital pins for each component. If the pins are able to do hardware PWM then a wide range of colors will be available. With simple digital pins only 7 colors are possible.

    Adds the [`M150`](/docs/gcode/M150.html) command to set the LED (or LED strip) color. If pins are PWM capable (e.g., 4, 5, 6, 11) then a range of luminance values can be set from 0 to 255.

    {: .warning }
    > LED Strips require a MOFSET Chip between PWM lines and LEDs, as the Arduino cannot handle the current the LEDs will require. Failure to follow this precaution can destroy your Arduino!
  comment: 'LED Type. Enable only one of the following two options:'
- name: RGBW_LED
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: 'LED Type. Enable only one of the following two options:'
- name: RGB_LED_R_PIN
  file: Configuration.h
  type: int
  default: 34
  disabled: true
  requires: ANY(RGB_LED, RGBW_LED)
- name: RGB_LED_G_PIN
  file: Configuration.h
  type: int
  default: 43
  disabled: true
  requires: ANY(RGB_LED, RGBW_LED)
- name: RGB_LED_B_PIN
  file: Configuration.h
  type: int
  default: 35
  disabled: true
  requires: ANY(RGB_LED, RGBW_LED)
- name: RGB_LED_W_PIN
  file: Configuration.h
  type: int
  default: -1
  disabled: true
  requires: ANY(RGB_LED, RGBW_LED)
- name: RGB_STARTUP_TEST
  file: Configuration.h
  type: switch
  disabled: true
  requires: ANY(RGB_LED, RGBW_LED, PCA9632)
  comment: For PWM pins, fade between all colors
- name: RGB_STARTUP_TEST_INNER_MS
  file: Configuration.h
  type: int
  default: 10
  units: ms
  requires: ANY(RGB_LED, RGBW_LED, PCA9632) && RGB_STARTUP_TEST
  comment: (ms) Reduce or increase fading speed
- name: NEOPIXEL_LED
  file: Configuration.h
  type: switch
  disabled: true
  long: '[NEOPIXELS](//www.adafruit.com/category/168)'
  comment: Support for Adafruit NeoPixel LED driver
- name: NEOPIXEL_TYPE
  file: Configuration.h
  type: enum
  default: NEO_GRBW
  requires: NEOPIXEL_LED
  comment: NEO_GRBW, NEO_RGBW, NEO_GRB, NEO_RBG, etc. See https://github.com/adafruit/Adafruit_NeoPixel/blob/master/Adafruit_NeoPixel.h
- name: NEOPIXEL_PIN
  file: Configuration.h
  type: int
  default: 4
  disabled: true
  requires: NEOPIXEL_LED
  comment: LED driving pin
- name: NEOPIXEL2_TYPE
  file: Configuration.h
  type: enum
  default: NEOPIXEL_TYPE
  disabled: true
  requires: NEOPIXEL_LED
- name: NEOPIXEL2_PIN
  file: Configuration.h
  type: int
  default: 5
  disabled: true
  requires: NEOPIXEL_LED
- name: NEOPIXEL_PIXELS
  file: Configuration.h
  type: int
  default: 30
  requires: NEOPIXEL_LED
  comment: Number of LEDs in the strip. (Longest strip when `NEOPIXEL2_SEPARATE` is disabled.)
- name: NEOPIXEL_IS_SEQUENTIAL
  file: Configuration.h
  type: switch
  requires: NEOPIXEL_LED
  comment: Sequential display for temperature change - LED by LED. Disable to change all LEDs at once.
- name: NEOPIXEL_BRIGHTNESS
  file: Configuration.h
  type: int
  default: 127
  requires: NEOPIXEL_LED
  comment: Initial brightness (0-255)
- name: NEOPIXEL_STARTUP_TEST
  file: Configuration.h
  type: switch
  disabled: true
  requires: NEOPIXEL_LED
  comment: Cycle through colors at startup
- name: NEOPIXEL2_SEPARATE
  file: Configuration.h
  type: switch
  disabled: true
  requires: NEOPIXEL_LED
  comment: Support for second Adafruit NeoPixel LED driver controlled with M150 S1 ...
- name: NEOPIXEL2_PIXELS
  file: Configuration.h
  type: int
  default: 15
  requires: NEOPIXEL_LED && NEOPIXEL2_SEPARATE
  comment: Number of LEDs in the second strip
- name: NEOPIXEL2_BRIGHTNESS
  file: Configuration.h
  type: int
  default: 127
  requires: NEOPIXEL_LED && NEOPIXEL2_SEPARATE
  comment: Initial brightness (0-255)
- name: NEOPIXEL2_STARTUP_TEST
  file: Configuration.h
  type: switch
  requires: NEOPIXEL_LED && NEOPIXEL2_SEPARATE
  comment: Cycle through colors at startup
- name: NEOPIXEL_M150_DEFAULT
  file: Configuration.h
  type: int
  default: -1
  requires: NEOPIXEL_LED && NEOPIXEL2_SEPARATE
  comment: Default strip for M150 without 'S'. Use -1 to set all by default.
- name: NEOPIXEL2_INSERIES
  file: Configuration.h
  type: switch
  disabled: true
  requires: NEOPIXEL_LED
  block_clause: '!NEOPIXEL2_SEPARATE'
  comment: Default behavior is NeoPixel 2 in parallel
- name: NEOPIXEL_BKGD_INDEX_FIRST
  file: Configuration.h
  type: int
  default: 0
  disabled: true
  requires: NEOPIXEL_LED
  comment: Use some of the NeoPixel LEDs for static (background) lighting
- name: NEOPIXEL_BKGD_INDEX_LAST
  file: Configuration.h
  type: int
  default: 5
  disabled: true
  requires: NEOPIXEL_LED
  comment: Index of the last background LED
- name: NEOPIXEL_BKGD_COLOR
  file: Configuration.h
  type: int[]
  default: '{ 255, 255, 255, 0 }'
  disabled: true
  requires: NEOPIXEL_LED
  comment: R, G, B, W
- name: NEOPIXEL_BKGD_TIMEOUT_COLOR
  file: Configuration.h
  type: int[]
  default: '{  25,  25,  25, 0 }'
  disabled: true
  requires: NEOPIXEL_LED
  comment: R, G, B, W
- name: NEOPIXEL_BKGD_ALWAYS_ON
  file: Configuration.h
  type: switch
  disabled: true
  requires: NEOPIXEL_LED
  comment: Keep the backlight on when other NeoPixels are off
- name: PRINTER_EVENT_LEDS
  file: Configuration.h
  type: switch
  requires: ANY(BLINKM, RGB_LED, RGBW_LED, PCA9632, PCA9533, NEOPIXEL_LED)
  long: |-
    This option causes the printer to give status feedback on the installed color LED, BLINKM, or PCA9632:
    - Gradually change from blue to violet as the heated bed gets to target temp.
    - Gradually change from violet to red as the hotend gets to temperature.
    - Change to white to illuminate work surface.
    - Change to green once print has finished.
    - Turn off after the print has finished and the user has pushed a button.
  comment: |-
    Printer Event LEDs

    During printing, the LEDs will reflect the printer status:

    - Gradually change from blue to violet as the heated bed gets to target temp
    - Gradually change from violet to red as the hotend gets to temperature
    - Change to white to illuminate work surface
    - Change to green once print has finished
    - Turn off after the print has finished and the user has pushed a button
---

Options in the `lights` section of the Marlin configuration files.
