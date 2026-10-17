---
title: Lights and LEDs
description: 'Case lights, RGB and NeoPixel strips and I2C LED drivers in Marlin: pick the option, wire and power it, set colors with M150 and M355, and fix a dark strip.'
parent: Features
nav_order: 37
layout: article
toc: true
---

# Lights and LEDs

Marlin can switch and dim a light inside the enclosure, drive a color LED strip, and use that strip to show what the
printer is doing: blue to red while it heats, white while it prints, green when an SD print is done. The same code
also drives the RGB backlight on several LCD panels. This page helps you match your lighting hardware to the right
option, wire and power it, configure it, and control it from G-code and the LCD.

The light comes in two kinds, and you can have both:

- A **case light**: one plain light on one pin, switched or dimmed. It is controlled with
  [`M355`](/docs/gcode/M355.html).
- **Color LEDs**: an RGB or RGBW strip on three or four pins, an addressable NeoPixel strip, or an I2C LED driver
  chip. These are controlled with [`M150`](/docs/gcode/M150.html), and can show printer events.

Every option mentioned here is listed on the [Lights](/docs/settings/lights.html),
[Case Light](/docs/settings/caselight.html) and [LCD](/docs/settings/lcd.html) settings pages.

## Which option fits your lights

| Your hardware | Option | What you control |
|---|---|---|
| A single-color strip or lamp on a fan or heater MOSFET output, or on a relay | [`CASE_LIGHT_ENABLE`](/docs/settings/caselight.html#CASE_LIGHT_ENABLE) | On/off, plus brightness 0–255 if the pin has PWM |
| A 3-channel RGB strip (common anode, 12 V or 24 V) on three MOSFETs, or a single RGB LED on three pins | [`RGB_LED`](/docs/settings/lights.html#RGB_LED) | Red, green and blue; levels only on PWM pins |
| The same with a fourth white channel | [`RGBW_LED`](/docs/settings/lights.html#RGBW_LED) | Red, green, blue and white |
| WS2812, SK6812 or similar addressable strip with one data wire ("NeoPixel") | [`NEOPIXEL_LED`](/docs/settings/lights.html#NEOPIXEL_LED) | Color per pixel, overall brightness, a second strip |
| A BlinkM / CyzRgb module on the I2C bus | [`BLINKM`](/docs/settings/lights.html#BLINKM) | Red, green, blue |
| A PCA9632 4-channel LED driver on I2C | [`PCA9632`](/docs/settings/lights.html#PCA9632) | Red, green, blue (and white with `PCA9632_RGBW`) |
| A PCA9533 LED driver on I2C | [`PCA9533`](/docs/settings/lights.html#PCA9533) | Red, green, blue |
| A Mini 12864 panel with an RGB backlit knob and screen | Set by the display option; see [Display backlights](#display-backlights) | The panel's backlight color |

A NeoPixel or RGB strip can also be the case light; see [Using color LEDs as the case light](#using-color-leds-as-the-case-light).

The color LED options are independent: Marlin does not refuse two at once, and when several are enabled every color
change is sent to each of them. `RGB_LED` and `RGBW_LED` are the one pair that can't be combined.

## Requirements

The firmware refuses to build when these are not met (`SanityCheck.h`):

- **Case light:** a `CASE_LIGHT_PIN`, or `CASE_LIGHT_USE_NEOPIXEL` / `CASE_LIGHT_USE_RGB_LED`. Most board pin files
  define a default `CASE_LIGHT_PIN` (on RAMPS, pin 6). The pin can't be a part-cooling fan pin or the
  spindle/laser PWM pin. `CASE_LIGHT_USE_NEOPIXEL` needs `NEOPIXEL_LED`.
- **RGB(W):** `RGB_LED_R_PIN`, `RGB_LED_G_PIN` and `RGB_LED_B_PIN`, plus `RGB_LED_W_PIN` for `RGBW_LED`. Only one of
  `RGB_LED` and `RGBW_LED`.
- **NeoPixel:** a `NEOPIXEL_PIN` and a non-zero `NEOPIXEL_PIXELS`. The pin can come from your board
  (`BOARD_NEOPIXEL_PIN`) or display (`LCD_NEOPIXEL_PIN`) pin file, so check whether it is already defined before you
  add one.
- **Second NeoPixel strip:** `NEOPIXEL2_TYPE` and `NEOPIXEL2_PIN`, plus `NEOPIXEL2_PIXELS` for a separate strip.
  Only one of `NEOPIXEL2_SEPARATE` and `NEOPIXEL2_INSERIES`. `NEO2_COLOR_PRESETS` needs `NEOPIXEL2_SEPARATE`.
- **BTT SKR Mini E3 V2.0 and V3.0:** the on-board NeoPixel header is limited to 7 pixels, or 29 with
  `BOARD_HAS_DCDC5V` defined for a board with the optional 5 V DC-DC converter. A longer `NEOPIXEL_PIXELS` on that
  pin stops the build.
- **Printer event LEDs and the LED menu:** at least one of `BLINKM`, `RGB_LED`, `RGBW_LED`, `PCA9533`, `PCA9632` or
  `NEOPIXEL_LED`. [`LED_CONTROL_MENU`](/docs/settings/lcd.html#LED_CONTROL_MENU) also needs a display with MarlinUI
  menus or the Creality ProUI.

## Wiring and power

The controller pin only carries a signal. What lights the LEDs is a separate supply, and getting that supply right
prevents most LED problems. The points below are general electronics practice, not Marlin requirements.

- **Plain and RGB strips at 12 V or 24 V** need a MOSFET per channel between the board pin and the strip. A spare fan
  or heater output on the board is already a MOSFET; a bare signal pin can't drive a strip and can be damaged if you
  try.
- **NeoPixel strips at 5 V** draw much more current than a board's 5 V regulator can supply. A common rule of thumb
  is up to about 60 mA per pixel at full white, so a 30-pixel strip can need nearly 2 A. Feed the strip from its own
  5 V supply (or a DC-DC converter), and connect that supply's ground to the board's ground.
- **NeoPixel data from a 3.3 V board** (most 32-bit boards) is below what many 5 V strips accept as a logic high. A
  level shifter on the data line fixes unreliable or flickering strips. Some boards already have one on their
  NeoPixel header.
- A short data wire, a resistor of a few hundred ohms in series with the data line near the strip, and a large
  capacitor across the strip's power input are the usual recommendations from LED strip makers.

## Case light

### How it works

The case light is one output. At boot it turns on or off according to
[`CASE_LIGHT_DEFAULT_ON`](/docs/settings/caselight.html#CASE_LIGHT_DEFAULT_ON) (default `true`) at
[`CASE_LIGHT_DEFAULT_BRIGHTNESS`](/docs/settings/caselight.html#CASE_LIGHT_DEFAULT_BRIGHTNESS) (default `105` out of
255).

- On a **PWM pin**, brightness 0–255 sets the duty cycle. Switching off and back on restores the last brightness.
- On a **pin without PWM**, the light is only on or off. Brightness values are accepted but have no effect, and the
  LCD shows a plain on/off item.
- [`INVERT_CASE_LIGHT`](/docs/settings/caselight.html#INVERT_CASE_LIGHT) is for a light that is on when the pin is
  LOW. On a PWM pin it inverts the duty cycle.
- [`CASE_LIGHT_MAX_PWM`](/docs/settings/caselight.html#CASE_LIGHT_MAX_PWM) scales 0–255 into 0–`CASE_LIGHT_MAX_PWM`,
  so brightness 255 gives that duty cycle. Use it for a 12 V light on a 24 V supply, or for LEDs that run hot. It
  must be 1 to 255; unset means 255.
- [`CASE_LIGHT_NO_BRIGHTNESS`](/docs/settings/caselight.html#CASE_LIGHT_NO_BRIGHTNESS) removes brightness
  altogether, for a relay or any load that must not be pulsed.

Only the brightness is saved with [`M500`](/docs/gcode/M500.html), and only when the case light uses brightness.
Whether the light is on is not saved; it always starts as `CASE_LIGHT_DEFAULT_ON`. `M502` resets the brightness to
`CASE_LIGHT_DEFAULT_BRIGHTNESS`.

### Configure

In `Configuration_adv.h`:

```cpp
#define CASE_LIGHT_ENABLE
#if ENABLED(CASE_LIGHT_ENABLE)
  //#define CASE_LIGHT_PIN 4                  // Override the default pin if needed
  #define INVERT_CASE_LIGHT false             // Set true if Case Light is ON when pin is LOW
  #define CASE_LIGHT_DEFAULT_ON true          // Set default power-up state on
  #define CASE_LIGHT_DEFAULT_BRIGHTNESS 105   // Set default power-up brightness (0-255, requires PWM pin)
  //#define CASE_LIGHT_NO_BRIGHTNESS          // Disable brightness control. Enable for non-PWM lighting.
  //#define CASE_LIGHT_MAX_PWM 128            // Limit PWM duty cycle (0-255)
  #define CASE_LIGHT_MENU                     // Add Case Light options to the LCD menu
```

Set [`CASE_LIGHT_PIN`](/docs/settings/caselight.html#CASE_LIGHT_PIN) only if your board's pin file has no default or
you wired the light elsewhere. Pick a pin with hardware PWM if you want dimming, and check that the pin is not already
in use (a fan, a servo, the laser).

[`CASE_LIGHT_MENU`](/docs/settings/caselight.html#CASE_LIGHT_MENU) adds **Case Light** to the main menu: an on/off
item, or a submenu with **Light Brightness** (shown as a percentage) and the on/off switch when the pin can dim.
With `LED_CONTROL_MENU` the item moves into the **Lights** menu.

### M355

[`M355`](/docs/gcode/M355.html) switches and dims the case light, and always reports its state.

| Command | Effect |
|---|---|
| `M355` | Report only: `Case light: OFF`, `Case light: ON`, or the brightness value when it can dim |
| `M355 S1` | Turn on at the last brightness |
| `M355 S0` | Turn off; the brightness is kept for the next `S1` |
| `M355 P200` | Set brightness 200. Applied at once if the light is on, otherwise at the next `S1` |
| `M355 S1 P255` | Turn on at full brightness |

`P` is ignored when the light can't dim. A host that reads [`M115`](/docs/gcode/M115.html) sees
`Cap:TOGGLE_LIGHTS:1` when the case light is enabled and `Cap:CASE_LIGHT_BRIGHTNESS:1` when it can dim, and may offer
a light button of its own.

### Using color LEDs as the case light

Instead of a pin, the case light can be a color strip that you already configured:

- [`CASE_LIGHT_USE_NEOPIXEL`](/docs/settings/caselight.html#CASE_LIGHT_USE_NEOPIXEL) (with `NEOPIXEL_LED`): `M355 S1`
  lights the first NeoPixel strip in its current color, with the case-light brightness as the strip brightness.
  `M355 S0` turns the strip off. Brightness always works here, whatever the pin. With `CASE_LIGHT_MENU` enabled, color
  changes from `M150` reach the strip only while the case light is on.
- [`CASE_LIGHT_USE_RGB_LED`](/docs/settings/caselight.html#CASE_LIGHT_USE_RGB_LED) (with `RGB_LED` or `RGBW_LED`):
  the strip shows [`CASE_LIGHT_DEFAULT_COLOR`](/docs/settings/caselight.html#CASE_LIGHT_DEFAULT_COLOR)
  (`{ 255, 255, 255, 255 }`, red, green, blue, white) when on, and all channels are forced to 0 when off. There is no
  brightness control in this mode; `M355 P` does nothing.

Leave `INVERT_CASE_LIGHT` set to `false` with a NeoPixel case light: it is applied to the strip brightness and turns
full brightness into zero.

## RGB and RGBW LEDs on pins

`RGB_LED` drives three outputs, one per color; `RGBW_LED` adds a white channel. In `Configuration.h`:

```cpp
#define RGB_LED
//#define RGBW_LED

#if ANY(RGB_LED, RGBW_LED)
  #define RGB_LED_R_PIN 34
  #define RGB_LED_G_PIN 43
  #define RGB_LED_B_PIN 35
  #define RGB_LED_W_PIN -1
#endif
```

The pin numbers in the example are placeholders; use the pins your MOSFETs are wired to. On a pin with hardware PWM
each channel takes any value from 0 to 255. On a pin without PWM, any non-zero value turns that channel fully on,
which leaves seven colors plus off.

[`RGB_STARTUP_TEST`](/docs/settings/lights.html#RGB_STARTUP_TEST) fades each channel up and down in turn at boot so
you can check the wiring. It runs only when the red, green and blue pins all have PWM.
`RGB_STARTUP_TEST_INNER_MS` (default 10 ms) sets the speed.

## NeoPixel strips

### One strip

A NeoPixel strip takes one data pin and any number of pixels. In `Configuration.h`:

```cpp
#define NEOPIXEL_LED
#if ENABLED(NEOPIXEL_LED)
  #define NEOPIXEL_TYPE          NEO_GRBW // NEO_GRBW, NEO_RGBW, NEO_GRB, NEO_RBG, etc.
  #define NEOPIXEL_PIN                4 // LED driving pin
  #define NEOPIXEL_PIXELS              30 // Number of LEDs in the strip.
  #define NEOPIXEL_IS_SEQUENTIAL          // Sequential display for temperature change - LED by LED.
  #define NEOPIXEL_BRIGHTNESS         127 // Initial brightness (0-255)
  //#define NEOPIXEL_STARTUP_TEST         // Cycle through colors at startup
```

- [`NEOPIXEL_TYPE`](/docs/settings/lights.html#NEOPIXEL_TYPE) is the order in which the strip expects its color bytes,
  and whether it has a white LED. It must match the strip, or the colors come out wrong. The values come from the
  Adafruit NeoPixel library: the 3-color orders `NEO_RGB`, `NEO_RBG`, `NEO_GRB`, `NEO_GBR`, `NEO_BRG`, `NEO_BGR`, and
  4-color orders such as `NEO_RGBW` and `NEO_GRBW`. WS2812B strips are usually `NEO_GRB`; SK6812 RGBW strips are usually
  `NEO_GRBW`. A `W` in the type enables the white channel (the `W` parameter of `M150`).
- [`NEOPIXEL_PIN`](/docs/settings/lights.html#NEOPIXEL_PIN) is often already defined by the board or display pin file.
- [`NEOPIXEL_PIXELS`](/docs/settings/lights.html#NEOPIXEL_PIXELS) is the number of pixels. Fewer than the real strip
  leaves the rest dark; more wastes memory and update time.
- [`NEOPIXEL_BRIGHTNESS`](/docs/settings/lights.html#NEOPIXEL_BRIGHTNESS) is the starting brightness of the whole
  strip, 0–255.
- [`NEOPIXEL_IS_SEQUENTIAL`](/docs/settings/lights.html#NEOPIXEL_IS_SEQUENTIAL) affects only the
  [heating colors](#printer-event-leds): each step of the color ramp is written to the next pixel instead of the whole
  strip, so the new color creeps along the strip as the heater warms up. Disable it to change all pixels at once.
- [`NEOPIXEL_STARTUP_TEST`](/docs/settings/lights.html#NEOPIXEL_STARTUP_TEST) shows red, green, blue (and white on an
  RGBW type) for half a second each at boot.

Without `LED_USER_PRESET_STARTUP` (see [presets](#the-lights-menu-and-presets)) the strip is off after boot until a
command or event sets a color.

### Background pixels

A range of pixels can be kept as a fixed light, for example a few pixels behind the LCD, while the rest of the strip
follows `M150` and printer events:

```cpp
  #define NEOPIXEL_BKGD_INDEX_FIRST   0 // Index of the first background LED
  #define NEOPIXEL_BKGD_INDEX_LAST    5 // Index of the last background LED
  #define NEOPIXEL_BKGD_COLOR         { 255, 255, 255, 0 }  // R, G, B, W
  //#define NEOPIXEL_BKGD_TIMEOUT_COLOR {  25,  25,  25, 0 }  // R, G, B, W
  //#define NEOPIXEL_BKGD_ALWAYS_ON       // Keep the backlight on when other NeoPixels are off
```

Pixels [`NEOPIXEL_BKGD_INDEX_FIRST`](/docs/settings/lights.html#NEOPIXEL_BKGD_INDEX_FIRST) to
[`NEOPIXEL_BKGD_INDEX_LAST`](/docs/settings/lights.html#NEOPIXEL_BKGD_INDEX_LAST) always show
[`NEOPIXEL_BKGD_COLOR`](/docs/settings/lights.html#NEOPIXEL_BKGD_COLOR) when the strip is set to a color. When the
strip is turned off they go off too, unless [`NEOPIXEL_BKGD_ALWAYS_ON`](/docs/settings/lights.html#NEOPIXEL_BKGD_ALWAYS_ON)
is enabled. `M150 I` can still address a background pixel directly. With
[`LCD_BACKLIGHT_TIMEOUT_MINS`](/docs/settings/lcd.html#LCD_BACKLIGHT_TIMEOUT_MINS) these pixels act as the display
backlight; see [Turning lights off automatically](#turning-lights-off-automatically).

### A second strip

A second data pin, [`NEOPIXEL2_PIN`](/docs/settings/lights.html#NEOPIXEL2_PIN), can be used in three ways.
[`NEOPIXEL2_TYPE`](/docs/settings/lights.html#NEOPIXEL2_TYPE) is commented out in the example configuration; uncomment
it and set it to the second strip's type for the in-series and separate modes, which require it.

| Mode | Options | What the second strip does |
|---|---|---|
| Mirror (default) | `NEOPIXEL2_PIN` | Shows the same colors as the first strip, pixel for pixel. Set `NEOPIXEL_PIXELS` to the longer strip. Define `NEOPIXEL2_TYPE` only if the second strip's type differs. |
| In series | add [`NEOPIXEL2_INSERIES`](/docs/settings/lights.html#NEOPIXEL2_INSERIES) | Continues the first strip: its pixels are numbered `NEOPIXEL_PIXELS` to `2 × NEOPIXEL_PIXELS − 1`. Both strips are `NEOPIXEL_PIXELS` long. |
| Separate | add [`NEOPIXEL2_SEPARATE`](/docs/settings/lights.html#NEOPIXEL2_SEPARATE) | An independent strip with its own [`NEOPIXEL2_PIXELS`](/docs/settings/lights.html#NEOPIXEL2_PIXELS) (default 15), [`NEOPIXEL2_BRIGHTNESS`](/docs/settings/lights.html#NEOPIXEL2_BRIGHTNESS) and [`NEOPIXEL2_STARTUP_TEST`](/docs/settings/lights.html#NEOPIXEL2_STARTUP_TEST), addressed with `M150 S1` |

A separate strip is not used by printer events or the case light; those always drive the first strip.
[`NEOPIXEL_M150_DEFAULT`](/docs/settings/lights.html#NEOPIXEL_M150_DEFAULT) chooses which strip an `M150` without `S`
changes: `-1` (default) both, `0` the first, `1` the second.

## I2C LED drivers

[`BLINKM`](/docs/settings/lights.html#BLINKM), [`PCA9632`](/docs/settings/lights.html#PCA9632) and
[`PCA9533`](/docs/settings/lights.html#PCA9533) drive LEDs through a small chip on the I2C bus, so they need no PWM
pins: connect SDA, SCL, power and ground. They take red, green and blue from `M150`; there is no brightness (`P`) or
pixel index.

- **BlinkM** is addressed at I2C address `0x09`. Marlin stops the module's built-in script and sets the color.
- **PCA9632** is addressed at `0b01100000` unless you define `PCA9632_ADDRESS`; the build prints a warning when it uses
  the default. Define `PCA9632_RGBW` to use the fourth output as a white channel. `RGB_STARTUP_TEST` also works on a
  PCA9632. The `ULTI_CONTROLLER` and `OVERLORD_OLED` displays enable `PCA9632` for you.
- **PCA9533** sets red, green and blue only.

## Display backlights

Several Mini 12864 panels light their screen and knob with color LEDs, and the display option needs the matching LED
option:

- [`FYSETC_MINI_12864_2_1`](/docs/settings/lcd.html#FYSETC_MINI_12864_2_1) and the similar MKS, BTT and BEEZ panels,
  and `FYSETC_242_OLED_12864`, use NeoPixels: they require `NEOPIXEL_TYPE NEO_RGB` and `NEOPIXEL_PIXELS` of at least
  3. The build warns unless `NEOPIXEL_LED`, `LED_CONTROL_MENU`, `LED_USER_PRESET_STARTUP` and `LED_COLOR_PRESETS` are
  all enabled, because without a startup preset the backlight stays dark.
- `FYSETC_MINI_12864_1_2` and `FYSETC_MINI_12864_2_0` require `RGB_LED`.

On these panels `M150` and printer events change the backlight color, so plan for that if you add an external strip
on the same pin.

## Setting colors with M150

[`M150`](/docs/gcode/M150.html) sets the color of the color LEDs.

| Parameter | Meaning | With no value | When left out |
|---|---|---|---|
| `R` | Red, 0–255 | 255 | 0 |
| `U` | Green, 0–255 | 255 | 0 |
| `B` | Blue, 0–255 | 255 | 0 |
| `W` | White, 0–255. Only with a white channel (`RGBW_LED`, `PCA9632_RGBW`, or an RGBW `NEOPIXEL_TYPE`) | 255 | 0 |
| `P` | NeoPixel strip brightness, 0–255 | 255 | Unchanged |
| `I` | NeoPixel pixel index, starting at 0 | | All pixels |
| `K` | NeoPixel only: keep the color channels you leave out instead of setting them to 0 | | |
| `S` | With `NEOPIXEL2_SEPARATE`: strip `0` (first) or `1` (second) | | `NEOPIXEL_M150_DEFAULT` |

Every `M150` sets all color channels at once, so a channel you don't name is turned off. `M150` on its own turns the
LEDs off. Examples:

```gcode
M150 R U B          ; white from the three color channels
M150 W              ; white from the white channel (RGBW only)
M150 R255 U80       ; orange (needs PWM on RGB pins)
M150 K P64          ; NeoPixel: set brightness to 64, keep the color
M150 I0 B255        ; NeoPixel: make pixel 0 blue, leave the others alone
M150 I0             ; NeoPixel: turn pixel 0 off
M150 K I3 R255      ; NeoPixel: add full red to pixel 3, keep its green, blue and white
M150 S1 U255        ; second strip green (NEOPIXEL2_SEPARATE)
M150 S0             ; first strip off
```

- `P` sets the brightness of the whole strip, even together with `I`. Without `K`, `M150 P64` also sets the color to
  black; write `M150 K P64` to change only the brightness.
- `K` reads the current color of pixel `I` (or of pixel 0 when there is no `I`) and keeps the channels you don't give.
- `I`, `K`, `P` and `S` are NeoPixel parameters. Other LED types ignore them.
- A color set with `M150` is not saved. Printer events replace it the next time a heater waits or a print ends.

## Printer event LEDs

With any color LED type, [`PRINTER_EVENT_LEDS`](/docs/settings/lights.html#PRINTER_EVENT_LEDS) is enabled
automatically in `Configuration.h`. The LEDs then follow the printer through a print:

![Five color bars in time order: blue to violet while M190 heats the bed, violet to red while M109 heats the hotend, white while printing, green when a media print is done, then the user preset or off after a click](/assets/images/features/printer-event-leds.svg){: .framed }

1. **Bed heating** ([`M190`](/docs/gcode/M190.html) waiting): blue to violet. Red rises with progress, blue stays at
   255.
2. **Hotend heating** ([`M109`](/docs/gcode/M109.html) waiting): violet to red. Red stays at 255, blue falls with
   progress.
3. **Hotend at temperature**: when `M109` finishes waiting the LEDs turn white. On an RGBW strip this is the white
   channel alone. A wait cancelled with `M108` or a click skips this step. `M190` finishing does not change the
   color; the bed ramp stays violet until the hotend wait.
4. **Print done**: after an SD or USB print that ran longer than 60 s, the LEDs turn green and Marlin waits for you
   to click the knob, answer the host's **Print Done** prompt, or send [`M108`](/docs/gcode/M108.html). The wait ends
   by itself after [`PE_LEDS_COMPLETED_TIME`](/docs/settings/lcd.html#PE_LEDS_COMPLETED_TIME) (default `(30*60)`,
   30 minutes) on a MarlinUI display, or after 30 s on other displays.
5. **After the wait**: the LEDs change to your user preset if `LED_COLOR_PRESETS` is enabled, or turn off if not.

Progress is `p = (T − T_start) / (T_target − T_start)`, clamped from 0 to 1, where `T_start` is the temperature when
the wait began. Green is 0 throughout both ramps. If the heater is already at its target when the wait starts, the
`M109` wait ends at once and the LEDs go straight to white.

Some details that follow from the code:

- Only the waiting commands drive the ramps. `M104` and `M140` set a target without waiting, so the color does not
  change. A wait for cooling (for example `M109 R` to a lower temperature) shows no ramp, but still ends in white.
- PID autotuning with [`M303`](/docs/gcode/M303.html) shows the same ramps (and violet to white for a chamber), then
  restores the color from before the tune.
- The print-done step needs a way to resume: an LCD with a click, a host with
  [`HOST_PROMPT_SUPPORT`](/docs/settings/host.html#HOST_PROMPT_SUPPORT) or the emergency parser for `M108`, or an
  ExtUI display. Prints streamed from a host don't show green, because the step runs in `M1001`, which Marlin adds
  at the end of a media print. The wait blocks the command queue, so
  [`SD_FINISHED_RELEASECOMMAND`](/docs/settings/lcd.html#SD_FINISHED_RELEASECOMMAND) runs after it.
- When the printer halts with an error on a MarlinUI display, the LEDs (and NeoPixel background pixels) turn red.
- The event colors replace whatever you set with `M150`. To print in your own color, put an `M150` in the slicer's
  start G-code after `M109`.

To use the LEDs as plain lighting with no events, comment out the `#define PRINTER_EVENT_LEDS` line below the LED
options in `Configuration.h`.

## The Lights menu and presets

[`LED_CONTROL_MENU`](/docs/settings/lcd.html#LED_CONTROL_MENU) adds **Lights** to the main menu. Depending on the
options, it holds:

| Item | Shown with | Does |
|---|---|---|
| **Lights** (or **Light #1**) | always | Turns the color LEDs off, or back on in the last color. Hidden while the PSU is off with `PSU_CONTROL` |
| **Default** | `LED_COLOR_PRESETS` | Sets the user preset color |
| **Light Presets** | `LED_COLOR_PRESETS` | White, Red, Orange, Yellow, Green, Blue, Indigo, Violet |
| **Light #2**, **Default**, **Light #2 Presets** | `NEOPIXEL2_SEPARATE`, `NEO2_COLOR_PRESETS` | The same for the second strip |
| **Custom Lights** | always | Red, Green, Blue and White Intensity, and Brightness (NeoPixel), edited live; a second channel with `NEOPIXEL2_SEPARATE` |
| **Case Light** | `CASE_LIGHT_MENU` | On/off, or a submenu with **Light Brightness** |

The user preset is defined at build time in `Configuration_adv.h`:

```cpp
#define LED_CONTROL_MENU
#if ENABLED(LED_CONTROL_MENU)
  #define LED_COLOR_PRESETS                 // Enable the Preset Color menu option
  //#define NEO2_COLOR_PRESETS              // Enable a second NeoPixel Preset Color menu option
  #if ENABLED(LED_COLOR_PRESETS)
    #define LED_USER_PRESET_RED        255  // User defined RED value
    #define LED_USER_PRESET_GREEN      128  // User defined GREEN value
    #define LED_USER_PRESET_BLUE         0  // User defined BLUE value
    #define LED_USER_PRESET_WHITE      255  // User defined WHITE value
    #define LED_USER_PRESET_BRIGHTNESS 255  // User defined intensity
    //#define LED_USER_PRESET_STARTUP       // Have the printer display the user preset color on startup
  #endif
```

[`LED_USER_PRESET_RED`](/docs/settings/lcd.html#LED_USER_PRESET_RED) and its siblings set the color that **Default**,
the end of a print, and [`LED_USER_PRESET_STARTUP`](/docs/settings/lcd.html#LED_USER_PRESET_STARTUP) use. The
`NEO2_USER_PRESET_*` options and [`NEO2_USER_PRESET_STARTUP`](/docs/settings/lcd.html#NEO2_USER_PRESET_STARTUP) do
the same for a separate second strip.

{: .note }
> No LED color is saved to EEPROM, from the menu or from `M150`. To change the color the printer starts with, edit
> the `LED_USER_PRESET_*` values, enable `LED_USER_PRESET_STARTUP`, and rebuild. The case light brightness is the
> only lighting value that `M500` saves.

## Turning lights off automatically

Two options switch lights off after a delay:

- [`LED_POWEROFF_TIMEOUT`](/docs/settings/psu_control.html#LED_POWEROFF_TIMEOUT) (with
  [`PSU_CONTROL`](/docs/settings/psu_control.html#PSU_CONTROL)): after the power supply is switched off with
  [`M81`](/docs/gcode/M081.html), the color LEDs turn off this many milliseconds later. Turning the knob or inserting
  media while the power is off lights them again for the same time.
- [`LCD_BACKLIGHT_TIMEOUT_MINS`](/docs/settings/lcd.html#LCD_BACKLIGHT_TIMEOUT_MINS) with NeoPixel background pixels:
  after that many idle minutes the background pixels change to `NEOPIXEL_BKGD_TIMEOUT_COLOR` (off if not set), and
  turning the knob restores them. It needs a display with an encoder or keypad and can't be combined with
  `NEOPIXEL_BKGD_ALWAYS_ON` or an `LCD_BACKLIGHT_PIN`. [`M255`](/docs/gcode/M255.html) changes the timeout at runtime.

The case light has no timeout; switch it off with `M355 S0` in your end G-code if you want it dark after a print.

## Check it works

1. Enable the startup test for your type (`NEOPIXEL_STARTUP_TEST` or `RGB_STARTUP_TEST`) for the first boot. You
   should see red, then green, then blue, then white if the strip has a white channel. If the order or colors differ,
   fix `NEOPIXEL_TYPE` or the pin wiring before anything else.
2. Send `M150 R` and confirm the whole strip turns red, then `M150 U` for green and `M150 B` for blue.
3. On a NeoPixel strip send `M150 I` with the last index (`NEOPIXEL_PIXELS` minus one) and a color, and confirm the
   last pixel lights. If it doesn't, `NEOPIXEL_PIXELS` is too small or the strip is broken before that pixel.
4. For a case light, send `M355 S1 P255`, then `M355 P30`, and confirm it dims. Send `M355` and check the report.
5. Heat the hotend with `M109 S200` (or your usual temperature) and watch the ramp end in white.

## Troubleshooting

| What you see | Likely cause | What to do |
|---|---|---|
| The strip stays dark after boot | No color has been set yet: Marlin starts NeoPixels off unless `LED_USER_PRESET_STARTUP` is on | Send `M150 R U B`. If it then lights, enable `LED_USER_PRESET_STARTUP` |
| The strip stays dark after `M150` | Wrong `NEOPIXEL_PIN`, no 5 V or no common ground, data wired to the strip's output end, or a 3.3 V data signal the strip doesn't accept | Check the pin with the board's pin file, the arrow direction on the strip, the supply voltage at the strip and the ground link. Try a level shifter |
| Red and green swapped, or colors are wrong | `NEOPIXEL_TYPE` byte order doesn't match the strip | Use the startup test, then try `NEO_GRB` / `NEO_RGB` (3 colors) or `NEO_GRBW` / `NEO_RGBW` (4 colors) |
| Every other pixel is wrong, or the pattern shifts along the strip | 3-color type on an RGBW strip, or the reverse | Use a `W` type for strips with a white LED and a 3-color type otherwise |
| Only the first pixel, or the first few, light | `NEOPIXEL_PIXELS` too small, a damaged pixel, or an `I` index left in a macro | Set `NEOPIXEL_PIXELS` to the real count; send `M150` without `I` |
| `M150 P64` turns the strip off | Without `K`, the color channels you leave out are set to 0 | Use `M150 K P64` |
| Flicker, random colors, or the far end turns orange or dim | Voltage drop on a long 5 V strip, or a marginal data level | Feed power at both ends of long strips, use thicker wires, add a level shifter and a series resistor |
| The board resets or the LCD glitches when the LEDs go white | The strip draws more than the board's 5 V regulator can supply | Power the strip from its own supply |
| Build stops with `NEOPIXEL_PIXELS exceeds the recommended maximum for your MOTHERBOARD` | The SKR Mini E3 on-board header limit | Use fewer pixels, or add the 5 V DC-DC converter and define `BOARD_HAS_DCDC5V` |
| Case light is on when it should be off, and off when on | Light is switched on the low side, or wired to a pin that is active-low | Set `INVERT_CASE_LIGHT true` |
| Case light doesn't dim; `M355 P` has no effect | The pin has no hardware PWM, `CASE_LIGHT_NO_BRIGHTNESS` is set, or the case light is an RGB strip | Move the light to a PWM-capable pin, or accept on/off |
| Case light buzzes or flickers when dimmed | PWM frequency of that pin interacts with the light's driver or power supply | Use full brightness, `CASE_LIGHT_NO_BRIGHTNESS`, or a different pin |
| LEDs change color on their own during a print | Printer event LEDs | Expected. Set your color after `M109` in start G-code, or disable `PRINTER_EVENT_LEDS` |
| The printer waits at the end of a print and the LEDs are green | Print-done wait of printer event LEDs | Click the knob or send `M108`; shorten `PE_LEDS_COMPLETED_TIME` |

## Pitfalls

- A strip on a bare signal pin, with no MOSFET or separate supply, can damage the board. Check the current before you
  wire anything.

{: .warning }
> Never power a long NeoPixel strip through the board's 5 V pin header. The regulator can overheat, and the voltage
> drop can reset the controller in the middle of a print.

- Updating a long NeoPixel strip takes time during which interrupts are paused. Very long strips can affect other
  timing-sensitive work on slow boards. Keep `NEOPIXEL_PIXELS` to the pixels you actually have.
- `PRINTER_EVENT_LEDS` is turned on by `Configuration.h` itself as soon as any color LED type is enabled. If you only
  want lighting, comment it out.
- `CASE_LIGHT_USE_NEOPIXEL` uses the first strip in its current color; `CASE_LIGHT_DEFAULT_COLOR` applies only to
  `CASE_LIGHT_USE_RGB_LED`.
- `S` in `M150` counts from 0 while the menu says **Light #1** and **Light #2**.
- The case light's on/off state and all LED colors reset at every boot; only the case light brightness is saved.

## Related options and G-codes

- [`TEMP_STAT_LEDS`](/docs/settings/lights.html#TEMP_STAT_LEDS): two plain LEDs on `STAT_LED_RED_PIN` and
  `STAT_LED_BLUE_PIN`. Red is lit when any hotend or bed temperature or target is above 55 °C, blue once all are
  below 54 °C.
- [`MAX7219_DEBUG`](/docs/settings/debug_matrix.html#MAX7219_DEBUG) and [`M7219`](/docs/gcode/M7219.html): an 8x8 LED
  matrix for firmware debugging, not lighting.
- [`M150`](/docs/gcode/M150.html): Set RGB(W) Color
- [`M355`](/docs/gcode/M355.html): Case Light Control
- [`M108`](/docs/gcode/M108.html): end the print-done wait
- [`M255`](/docs/gcode/M255.html): Display sleep and backlight timeout
