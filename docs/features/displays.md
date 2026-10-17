---
title: Displays and Controllers
description: 'How to identify your printer display, pick the matching Marlin option, wire it to EXP1/EXP2, and fix a blank, garbled, rotated or backwards screen.'
parent: Features
nav_order: 25
layout: article
toc: true
---

# Displays and Controllers

Marlin drives everything from a two-line text LCD to a 7-inch color touch screen. The configuration section for
displays is long because each panel needs its own option, but the panels fall into a handful of families, and the
family decides what you get: which menus exist, whether there is SD printing from the panel, whether the screen can
show your own images, and which first-boot problems to expect.

This page helps you work out which family your screen belongs to, pick the one option that enables it, wire it,
and check it on first boot. The full catalog of supported panels with photos is on the
[Controllers and displays](/docs/appendix/controllers.html) appendix page, and every option mentioned here is
listed in full on the [LCD](/docs/settings/lcd.html) and [Interface](/docs/settings/interface.html) settings pages.

## Which kind of screen do you have?

![RepRapDiscount Smart Controller: a 20x4 blue character LCD with a click wheel and SD slot](/assets/images/hardware/controllers/RDSC_front.jpg){: .float-right .framed }

Look at the screen, the cable, and the printer it came from. The table below maps what you see to a family and
the option most people need. If your exact panel is in the [controller list](/docs/appendix/controllers.html),
use its named option instead of the generic one. The names link to their entries on the settings page.

| What you see | Family | Typical option(s) |
|---|---|---|
| 16x2 or 20x4 text LCD (usually blue or green), a click wheel, often an SD slot and a buzzer | Character LCD (HD44780) | [`REPRAP_DISCOUNT_SMART_CONTROLLER`](/docs/settings/lcd.html#REPRAP_DISCOUNT_SMART_CONTROLLER), [`ULTRA_LCD`](/docs/settings/lcd.html#ULTRA_LCD) for an unbranded panel |
| 20x4 text LCD with five push buttons instead of a wheel (Anet A8, Tronxy) | Character LCD with ADC keypad | [`ZONESTAR_LCD`](/docs/settings/lcd.html#ZONESTAR_LCD) |
| 128x64 monochrome graphic display with a click wheel, two 10-pin ribbons | Graphical LCD (DOGM / U8glib) | [`REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER`](/docs/settings/lcd.html#REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER) |
| Small 128x64 graphic display with an RGB backlit wheel, one or two ribbons (Mini 12864) | Graphical LCD (DOGM / U8glib) | [`MKS_MINI_12864`](/docs/settings/lcd.html#MKS_MINI_12864), [`FYSETC_MINI_12864_2_1`](/docs/settings/lcd.html#FYSETC_MINI_12864_2_1), [`BTT_MINI_12864`](/docs/settings/lcd.html#BTT_MINI_12864), [`MKS_MINI_12864_V3`](/docs/settings/lcd.html#MKS_MINI_12864_V3) |
| Monochrome Creality screen on a single ribbon (CR-10, Ender-3, Ender-2) | Graphical LCD (DOGM / U8glib) | [`CR10_STOCKDISPLAY`](/docs/settings/lcd.html#CR10_STOCKDISPLAY), [`ENDER2_STOCKDISPLAY`](/docs/settings/lcd.html#ENDER2_STOCKDISPLAY) |
| Tiny, very sharp 0.96" to 2.42" OLED | Graphical OLED (U8glib) | [`U8GLIB_SSD1306`](/docs/settings/lcd.html#U8GLIB_SSD1306), [`MKS_12864OLED`](/docs/settings/lcd.html#MKS_12864OLED), [`FYSETC_242_OLED_12864`](/docs/settings/lcd.html#FYSETC_242_OLED_12864) |
| 4.3" color screen with a click wheel on a 10-pin ribbon (Ender-3 V2, Ender-3 S1, Voxelab Aquila) | Creality DWIN | [`DWIN_CREALITY_LCD`](/docs/settings/lcd.html#DWIN_CREALITY_LCD), [`DWIN_LCD_PROUI`](/docs/settings/lcd.html#DWIN_LCD_PROUI), [`DWIN_CREALITY_LCD_JYERSUI`](/docs/settings/lcd.html#DWIN_CREALITY_LCD_JYERSUI), [`DWIN_MARLINUI_PORTRAIT`](/docs/settings/lcd.html#DWIN_MARLINUI_PORTRAIT), [`DWIN_MARLINUI_LANDSCAPE`](/docs/settings/lcd.html#DWIN_MARLINUI_LANDSCAPE) |
| 2.4" to 3.5" color screen, usually touch, from MKS, BTT, Anet, Tronxy, Anycubic, Longer, Prusa MINI; wired by a wide FSMC ribbon or by SPI through EXP1/EXP2 | Color TFT (Marlin draws the UI) | A preset such as [`MKS_ROBIN_TFT35`](/docs/settings/lcd.html#MKS_ROBIN_TFT35), [`MKS_TS35_V2_0`](/docs/settings/lcd.html#MKS_TS35_V2_0) or [`BTT_TFT35_SPI_V1_0`](/docs/settings/lcd.html#BTT_TFT35_SPI_V1_0), or [`TFT_GENERIC`](/docs/settings/lcd.html#TFT_GENERIC); plus one of [`TFT_COLOR_UI`](/docs/settings/lcd.html#TFT_COLOR_UI), [`TFT_CLASSIC_UI`](/docs/settings/lcd.html#TFT_CLASSIC_UI), [`TFT_LVGL_UI`](/docs/settings/lcd.html#TFT_LVGL_UI); [`TOUCH_SCREEN`](/docs/settings/lcd.html#TOUCH_SCREEN) if it is a touch panel |
| Color touch screen on a 4- or 5-wire serial cable that boots and shows a menu by itself, before the board is even flashed (DGUS/DWIN T5, Anycubic, Sovol, Nextion, Elegoo, BTT TFT in its own touch mode) | Serial "smart" display (ExtUI) | [`DGUS_LCD_UI`](/docs/settings/lcd.html#DGUS_LCD_UI), [`ANYCUBIC_LCD_CHIRON`](/docs/settings/lcd.html#ANYCUBIC_LCD_CHIRON), [`SOVOL_SV06_RTS`](/docs/settings/lcd.html#SOVOL_SV06_RTS), [`NEXTION_TFT`](/docs/settings/lcd.html#NEXTION_TFT), [`ELEGOO_NEPTUNE_3_TFT`](/docs/settings/lcd.html#ELEGOO_NEPTUNE_3_TFT), or none at all |
| No screen; you print from OctoPrint, Klipper-style hosts, or a slicer over USB | Host only | No display option. Keep [`HOST_ACTION_COMMANDS`](/docs/settings/host.html#HOST_ACTION_COMMANDS) and [`HOST_PROMPT_SUPPORT`](/docs/settings/host.html#HOST_PROMPT_SUPPORT) enabled |

{: .note }
> A panel's own name is often printed on the back of its PCB. Search for that name in `Configuration.h`;
> the comment above each option usually names the board or printer it ships with.

## The display families

Internally Marlin sorts every panel into one of a few code paths (the flags that do this live in
`src/inc/Conditionals-2-LCD.h`). The code path is what matters for features and troubleshooting, so it is worth
knowing which one your option lands in.

### Character LCDs (HD44780)

Text-only panels built around the HD44780 controller: 16x2, 16x4, 20x2 or 20x4 characters. Marlin's own menu
system (MarlinUI) runs on them with a status screen made of text and a few custom glyphs. They connect directly to
EXP1/EXP2, over I2C through a port expander (`LCD_I2C_PANELOLU2`, `LCD_SAINSMART_I2C_2004`), or through a shift
register (`SAV_3DLCD`, `FF_INTERFACEBOARD`).

Two options apply only to this family. `DISPLAY_CHARSET_HD44780` must match the character ROM soldered into
your panel (`JAPANESE` is by far the most common, then `WESTERN` and `CYRILLIC`), and `LCD_INFO_SCREEN_STYLE` picks
the layout of the status screen on a 20x4 panel. Because the character set lives in the panel, only languages that
fit that ROM display correctly. On SD printing, `LCD_PROGRESS_BAR` turns the status line into a progress bar; it
applies to this family only.

### Graphical LCDs and OLEDs (DOGM / U8glib)

![RepRapDiscount Full Graphic Smart Controller: a 128x64 monochrome LCD with a click wheel](/assets/images/hardware/controllers/RDFGSC_front.jpg){: .float-right .framed }

128x64 monochrome panels driven through the U8glib library: the RepRapDiscount Full Graphic controller and its
many clones (ST7920), the Mini 12864 family (ST7567), and the small OLEDs (SSD1306, SH1106, SSD1309). The Creality
`CR10_STOCKDISPLAY` and `ENDER2_STOCKDISPLAY` belong here too. All of them run MarlinUI with bitmap status
screens, icons, and the graphical overlays for babystepping and mesh editing.

This family is the only one that can show a custom bitmap on the status screen (`CUSTOM_STATUS_SCREEN_IMAGE`) and
it supports a custom boot image (`SHOW_CUSTOM_BOOTSCREEN`); see [Boot and Status Screens](/docs/configuration/boot_status_screen.html).
It also supports extra languages selectable from the menu (`LCD_LANGUAGE_2` to `LCD_LANGUAGE_5`), the
`LIGHTWEIGHT_UI` text mode on ST7920 panels for slow boards, and the games.

Drawing a 128x64 bitmap over SPI takes time on an 8-bit board. If a delta or SCARA stutters on short moves with a
graphical LCD, the options under "Additional options for Graphical Displays" in `Configuration_adv.h`
(`XYZ_HOLLOW_FRAME`, `MENU_HOLLOW_FRAME`, `LIGHTWEIGHT_UI`, `DOGM_SPI_DELAY_US`) trade display detail for
print quality.

### Color TFT panels

![MKS Robin TFT35: a 3.5-inch color touch panel on a 32-pin FSMC ribbon](/assets/images/hardware/controllers/MKS_ROBIN_TFT35_front.jpg){: .float-right .framed }

Color panels where the main board drives every pixel over a parallel FSMC bus, SPI, or (on the BIQU BX) LTDC.
Enabling one is a two-step choice:

1. **The panel.** Either a preset that sets driver, resolution, interface and default orientation for you
   (`MKS_ROBIN_TFT35`, `MKS_TS35_V2_0`, `BTT_TFT35_SPI_V1_0`, `ANET_ET4_TFT28`, `TFT_TRONXY_X5SA`,
   `PRUSA_MINI_LCD`, …), or `TFT_GENERIC` with `TFT_DRIVER`, one `TFT_INTERFACE_FSMC` / `TFT_INTERFACE_SPI`,
   and one `TFT_RES_*` resolution.
2. **The UI** drawn on it. Exactly one of:
   - `TFT_COLOR_UI`: MarlinUI redrawn in color with touch-friendly buttons; the usual choice. `TFT_FONT` and
     `TFT_THEME` tune its look.
   - `TFT_CLASSIC_UI`: the 128x64 graphical UI scaled up. Smallest and fastest, and it accepts the same
     `_Bootscreen.h` as the monochrome panels.
   - `TFT_LVGL_UI`: the MKS-style icon UI built on LVGL. It requires a 480x320 panel and SD support, and the
     `assets` folder from the build must be copied to the SD card. `MKS_WIFI_MODULE` is only available here.

Add `TOUCH_SCREEN` for a touch panel. With `TOUCH_SCREEN_CALIBRATION` (on by default) the Color UI has a
calibration screen in its menus and [`M995`](/docs/gcode/M995.html) starts it from the host; with
`TOUCH_CALIBRATION_AUTO_SAVE` the result goes to EEPROM. Without calibration you must supply
`TOUCH_CALIBRATION_X`/`Y` and `TOUCH_OFFSET_X`/`Y` yourself, or the build fails. `TFT_ROTATION` turns or mirrors
the image when the preset's default orientation does not match how the panel is mounted.

### Creality DWIN screens (Ender-3 V2 family)

The 4.3" DWIN T5UIC1 panel that Creality ships on the Ender-3 V2, Ender-3 S1 and similar machines is a serial
device with its own small firmware and its own image set. Marlin sends draw commands over a serial port at
115200 baud (`LCD_BAUDRATE`), and the panel renders them with icons from a `DWIN_SET` folder stored on the
panel's own flash. The encoder on the panel is read by the main board. Five user interfaces are available for it;
enable exactly one:

| Option | What you get |
|---|---|
| `DWIN_CREALITY_LCD` | The stock Creality look with Marlin behind it. Requires SD support and temperature presets. Does not support the PID or MPC edit menus or bed tramming. |
| `DWIN_LCD_PROUI` | Professional UI by Miguel Risco-Castillo: the largest feature set, including mesh viewer, PID/MPC tuning and more. Also registers as an ExtUI display. |
| `DWIN_CREALITY_LCD_JYERSUI` | Jyers UI by Jacob Myers, an alternative layout with its own leveling and tuning screens. |
| `DWIN_MARLINUI_PORTRAIT` / `DWIN_MARLINUI_LANDSCAPE` | Standard MarlinUI menus, drawn on the DWIN panel. Behaves like a graphical LCD, including games and `LCD_LANGUAGE_2`. |

All of them need the matching `DWIN_SET` installed on the screen itself; see the first-boot table below.

### Serial "smart" displays (ExtUI)

Some screens are complete computers: they boot on their own, hold their menus and pictures in their own flash,
and talk to the main board over a plain serial link. In Marlin these go through the Extensible UI layer
(`src/lcd/extui/`): the DGUS family (`DGUS_LCD_UI` with a variant such as `ORIGIN`, `RELOADED`, `FYSETC`,
`MKS`, `IA_CREALITY`, `E3S1PRO`, `CR10SPROV2`, `SERMOON_D1`), Anycubic (`ANYCUBIC_LCD_I3MEGA`,
`ANYCUBIC_LCD_CHIRON`, `ANYCUBIC_LCD_VYPER`, `ANYCUBIC_LCD_KOBRA`), `SOVOL_SV06_RTS`, `NEXTION_TFT`,
`ELEGOO_NEPTUNE_3_TFT`, `MALYAN_LCD`, and the FTDI EVE touch panels (`TOUCH_UI_FTDI_EVE`). Vendors and
developers can add their own with `EXTENSIBLE_UI` and the `example` implementation.

Two things follow from this design. The screen's own firmware must match what Marlin expects (each DGUS variant
in `Configuration.h` links the `DWIN_SET` or `SCREEN` folder to load on the panel's SD slot), and the menus and
languages you see are decided by that screen firmware, not by `LCD_LANGUAGE`. Options that depend on MarlinUI
menus (`PROBE_OFFSET_WIZARD`, `LCD_INFO_MENU`, `MMU_MENUS`, games) are not available.

A BigTreeTech TFT in its touch mode runs its own UI on the screen and sends G-code to Marlin over a serial
port, so Marlin needs no display option for it; it only needs `LCD_SERIAL_PORT` set to the port the screen is
wired to. In its 12864 mode the same screen behaves exactly like a 128x64 RepRap Discount Full Graphic
controller with a knob, so you configure `REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER` and wire EXP1/EXP2.

### No display at all

Marlin runs fine headless. A host such as OctoPrint provides the menus and status, and
`HOST_ACTION_COMMANDS` with `HOST_PROMPT_SUPPORT` lets Marlin ask the host for the confirmations a panel would
normally handle (filament change, pause, [`M0`](/docs/gcode/M000-M001.html) waits). Features that need a way for
you to answer a prompt, such as `ADVANCED_PAUSE_FEATURE`, require either a display or `EMERGENCY_PARSER` so the
host's [`M108`](/docs/gcode/M108.html) is heard while Marlin waits. [`M117`](/docs/gcode/M117.html) messages
still go to the host as notifications when `HOST_STATUS_NOTIFICATIONS` is on.

## What each family gives you

| | Character LCD | Graphical LCD / OLED | Color TFT (Color / Classic / LVGL UI) | DWIN (Creality, ProUI, Jyers) | Serial smart display (ExtUI) | No display |
|---|---|---|---|---|---|---|
| Menus | MarlinUI | MarlinUI | MarlinUI (LVGL has its own) | UI-specific | Screen firmware | Host |
| Status screen | Text, 2 styles on 20x4 | Bitmaps, animated heaters | Color | Yes | Screen firmware | [`M117`](/docs/gcode/M117.html) to host |
| SD printing from the panel | Yes (needs `SDSUPPORT`) | Yes | Yes | Yes (`SDSUPPORT` is required by the Creality UI and ProUI) | Yes | Host streams |
| Babystepping (`BABYSTEPPING`) | Menu | Menu + graphic overlay | Menu | Yes | Depends on screen | [`M290`](/docs/gcode/M290.html) |
| Wizards (`PROBE_OFFSET_WIZARD`, `LCD_BED_LEVELING`, `LCD_BED_TRAMMING`) | Yes | Yes | Yes (`PROBE_OFFSET_WIZARD` also in LVGL) | Partly, per UI | No (screen may have its own) | No |
| Languages | `LCD_LANGUAGE`, limited by `DISPLAY_CHARSET_HD44780` | `LCD_LANGUAGE` plus `LCD_LANGUAGE_2` to `_5` | `LCD_LANGUAGE` (+ extra languages with Color UI) | Fixed per UI (MarlinUI variants follow `LCD_LANGUAGE`) | Screen firmware | n/a |
| Custom boot image | Yes | Yes | Color UI and Classic UI | MarlinUI variants | FTDI EVE only | n/a |
| Custom status image | No | Yes | Classic UI only | No | No | n/a |
| Touch | No | No | Optional (`TOUCH_SCREEN`) | No (encoder) | Yes | n/a |

The `SHOW_BOOTSCREEN` logo, `LCD_TIMEOUT_TO_STATUS`, `STATUS_MESSAGE_SCROLLING`, print progress display
(`SHOW_REMAINING_TIME`, `SET_PROGRESS_MANUALLY` with [`M73`](/docs/gcode/M073.html)), `SDCARD_SORT_ALPHA`,
`SD_MENU_CONFIRM_START` and the `LCD_INFO_MENU` all apply to the MarlinUI families and are described on the
[LCD settings page](/docs/settings/lcd.html). Custom images are covered on
[Boot and Status Screens](/docs/configuration/boot_status_screen.html).

## Enabling the display

1. Uncomment **one** controller option in the "LCD / Controller Selection" part of `Configuration.h`. Marlin
   counts the enabled options and stops the build with `Please select only one LCD controller option.` if there
   are two, including aliases of the same panel. The only intentional pairs are a TFT panel plus its `TFT_*_UI`,
   `TOUCH_SCREEN` on top of a TFT, and `SAV_3DGLCD` plus its `U8GLIB_SSD1306` / `U8GLIB_SH1106` chip select.
2. Set `MOTHERBOARD` correctly first. The pins file for the board decides which connector each panel uses, and
   many boards emit a `CONTROLLER_WARNING` at build time when a panel needs a custom cable.
3. For a panel with an SD slot, enable `SDSUPPORT` and check `SDCARD_CONNECTION`: `LCD` uses the slot on the
   panel, `ONBOARD` the slot on the board. Panels without a reader (`CR10_STOCKDISPLAY`, `MKS_TS35_V2_0`) refuse
   `SDCARD_CONNECTION LCD`.
4. Set `LCD_LANGUAGE`. The available codes are listed above the option; `test` is a special language that
   prints the character set so you can identify an HD44780 ROM.
5. Add the behavior you want: `BABYSTEPPING` (with `DOUBLECLICK_FOR_Z_BABYSTEPPING` and
   `BABYSTEP_ZPROBE_OFFSET`), `PROBE_OFFSET_WIZARD`, `LCD_BED_LEVELING`, `LCD_BED_TRAMMING`,
   `INDIVIDUAL_AXIS_HOMING_MENU`, `LCD_INFO_MENU`, [`SPEAKER`](/docs/features/accessories.html#buzzer-and-speaker) for a real speaker instead of a fixed-tone buzzer, and
   `LCD_FEEDBACK_FREQUENCY_HZ` / `LCD_FEEDBACK_FREQUENCY_DURATION_MS` for the click sound.
6. For a serial display (DWIN or ExtUI), Marlin picks `LCD_SERIAL_PORT` for known boards; otherwise define it in
   `Configuration.h`. It cannot be the same port as `SERIAL_PORT`.

{: .important }
> `NO_LCD_MENUS` keeps the status screen but removes every menu, and `SLIM_LCD_MENUS` trims the menus to recover
> flash on small boards. Check these two before concluding that a menu item is missing.

## Wiring: EXP1 and EXP2

Most wheel-and-screen panels use two keyed 10-pin IDC headers called EXP1 and EXP2. EXP1 carries power, the
beeper, the encoder button and the LCD data lines; EXP2 carries the SPI bus for the panel's SD slot, the two
encoder lines and reset. Each pins file documents its own layout; this is the SKR 1.4 (`pins_BTT_SKR_V1_4.h`):

```text
       ------                ------
 1.30 | 1  2 | 0.28    0.17 | 1  2 | 0.15
 1.18 | 3  4 | 1.19    3.26 | 3  4 | 0.16
 1.20   5  6 | 1.21    3.25   5  6 | 0.18
 1.22 | 7  8 | 1.23    1.31 | 7  8 | RESET
  GND | 9 10 | 5V       GND | 9 10 | --
       ------                ------
        EXP1                  EXP2
```

Small boards often have a single EXP1 that carries a reduced set of signals, and the same ten pins are remapped
per panel. The SKR Mini E3 V3.0 (`pins_BTT_SKR_MINI_E3_V3_0.h`) is typical: its EXP1 is laid out for the
Creality `CR10_STOCKDISPLAY`, a DWIN screen on the same header needs a custom cable (the pins file says so with a
`CONTROLLER_WARNING`), and a Mini 12864 needs either the `SKR_MINI_SCREEN_ADAPTER` (which also uses the board's
SPI header) or a custom cable; the pins file warns about that too.

```text
             SKR Mini E3 V3.0
                 ------
 (BEEPER)  PB5  | 1  2 | PA15 (BTN_ENC)
 (BTN_EN1) PA9  | 3  4 | RESET
 (BTN_EN2) PA10   5  6 | PB9  (LCD_D4)
 (LCD_RS)  PB8  | 7  8 | PD6  (LCD_EN)
            GND | 9 10 | 5V
                 ------
                  EXP1
```

{: .warning }
> Never force a plug. The RAMPS pins file notes that "the socket keys can be on either side, and may be backwards
> on some boards / displays", and `Configuration.h` adds "if the LCD is unresponsive you may need to reverse the
> plugs", but swapping a cable end-for-end also swaps GND and 5V on some panels. The SKR Mini E3 pins files warn
> that the Melzi graphical LCD needs a cable with reversed GND/5V and that a standard cable can damage the board
> or the LCD (V1.x/V2.0), and that the 5 V Anet keypad must be level-shifted to 3.3 V before it meets the board
> (V3.0). Read the
> pinout comment for your board before you plug anything in.

A few more wiring facts from the pins files:

- Boards that offer a motor-expansion module on EXP1/EXP2 (the LPC1768 SKR family) cannot use it and an LCD at
  the same time; the build stops if both are enabled.
- On the SKR 1.4 the EXP ports are rotated 180° relative to the MKS TS35 cable; the pins file prints a warning.
- Some panels set `FORCE_SOFT_SPI` because their data lines are not on a hardware SPI port. Soft SPI is slower
  and can disturb TMC UART drivers; `LCD_FORCE_SOFT_SPI` limits it to the panel when the SD card has its own bus.

## First boot: what to check

Flash the firmware with the display enabled and watch the first ten seconds.

1. **Boot screen.** With `SHOW_BOOTSCREEN` enabled you should see the Marlin logo (or your custom image) for
   `BOOTSCREEN_TIMEOUT` milliseconds, then the status screen with temperatures.
2. **Encoder.** Turn the wheel clockwise on the status screen: the feedrate percentage should go up
   (`ULTIPANEL_FEEDMULTIPLY`). Click once: the main menu should open. Turn clockwise: the highlight should move
   down one item per detent.
3. **Beeper.** Send [`M300 S440 P200`](/docs/gcode/M300.html) from the host; you should hear one tone.
4. **SD card.** Insert a card; the status line should report media inserted and the menu should list files.
5. **Touch.** On a TFT with `TOUCH_SCREEN`, run the calibration from the menu or with [`M995`](/docs/gcode/M995.html)
   and save with [`M500`](/docs/gcode/M500.html).
6. **Message.** Send [`M117 Hello`](/docs/gcode/M117.html); it should appear on the status line.

If the screen is right but the wheel, beeper or SD misbehave, the problem is in a pin assignment or cable, not in
the display family.

## Troubleshooting

| Symptom | Likely cause | What to change |
|---|---|---|
| Backlight on, nothing drawn | Wrong family (a graphical panel configured as a character one or the reverse), plugs reversed, or contrast at an extreme | Re-check the option against the table above; swap EXP1/EXP2 or reverse the plugs if the board's pinout comment allows it; on a DOGM panel adjust contrast with [`M250 C`](/docs/gcode/M250.html) or the Configuration > Contrast menu item, and put the value that works in `LCD_CONTRAST_INIT` (Marlin supplies a per-panel default; your own define overrides it) |
| Blocks, random symbols or a shifted layout on a text LCD | Wrong HD44780 type or character ROM, or electrical noise | Make sure a character option is selected (not a graphical one); set `DISPLAY_CHARSET_HD44780` to match the panel, using `LCD_LANGUAGE test` to find out which ROM it has; the Anet keypad panel is known to scramble on interference and clears on a button press |
| Wheel goes the wrong way | Encoder phases swapped on this panel | `REVERSE_ENCODER_DIRECTION` if both menus and value edits are backwards; `REVERSE_MENU_DIRECTION` if only the menus are; both if only value editing is; `REVERSE_SELECT_DIRECTION` for Yes/No screens. Do not use a negative `ENCODER_PULSES_PER_STEP`; the build rejects it |
| One detent moves two items, or every other detent is skipped | Pulses per detent do not match this encoder | Set `ENCODER_PULSES_PER_STEP` (2 or 4 are the usual values; each panel has a built-in default) and, if needed, `ENCODER_STEPS_PER_MENU_ITEM`. Phantom clicks with nothing touched: `ENCODER_NOISE_FILTER` |
| Touch lands beside the button you pressed | Uncalibrated or wrongly oriented resistive touch | Run [`M995`](/docs/gcode/M995.html) (needs `TOUCH_SCREEN_CALIBRATION`), check `TOUCH_ORIENTATION`, then save with [`M500`](/docs/gcode/M500.html) or enable `TOUCH_CALIBRATION_AUTO_SAVE` |
| TFT image upside down, sideways or mirrored | Panel mounted differently from the preset's default | Set `TFT_ROTATION` to one of `TFT_ROTATE_90/180/270`, their `_MIRROR_X`/`_MIRROR_Y` variants, or `TFT_MIRROR_X`/`TFT_MIRROR_Y`; on the DGUS IA_CREALITY UI use `LCD_SCREEN_ROTATE` (0, 90, 180 or 270) |
| TFT shows nothing or only noise | No UI selected, wrong interface, or wrong driver | Enable one of `TFT_COLOR_UI` / `TFT_CLASSIC_UI` / `TFT_LVGL_UI` (the build stops otherwise); with `TFT_GENERIC` set exactly one of `TFT_INTERFACE_FSMC` / `TFT_INTERFACE_SPI` and the right `TFT_RES_*`; try `TFT_DRIVER AUTO` |
| DWIN screen stays blue, or shows Creality's boot image and nothing else | The screen firmware does not match the UI, or the serial link is wrong | Copy the `DWIN_SET` folder for your UI onto a microSD card, insert it into the slot on the back of the screen, power up and wait for the screen to turn from blue to orange, then power off and remove the card. Check `LCD_SERIAL_PORT` for your board and that `LCD_BAUDRATE` is 115200 |
| Serial smart display (DGUS, Anycubic, Sovol) ignores Marlin | Screen firmware mismatch or wrong serial port | Load the screen firmware named in the `Configuration.h` comment for your `DGUS_LCD_UI` variant; verify `LCD_SERIAL_PORT` is not the same as `SERIAL_PORT` and that the TX/RX lines are crossed correctly |
| Menu items you expect are missing | `SLIM_LCD_MENUS`, `NO_LCD_MENUS`, or a feature that only MarlinUI panels support | Check those two options; on DWIN Creality UI and ExtUI screens, items such as PID tuning, the info menu and the probe offset wizard are not available |
| Screen goes dark during long prints | A sleep or backlight timeout is set | `DISPLAY_SLEEP_MINUTES` or `LCD_BACKLIGHT_TIMEOUT_MINS`, adjustable at runtime with [`M255`](/docs/gcode/M255.html) when `EDITABLE_DISPLAY_TIMEOUT` is on; DWIN panels also take [`M256`](/docs/gcode/M256.html) for brightness |

{: .more }
> **Want to Know More?** `src/inc/Conditionals-2-LCD.h` turns the option you enabled into the flags the rest of
> Marlin uses: `HAS_MARLINUI_HD44780` for character panels, `HAS_MARLINUI_U8GLIB` (via `DOGLCD`) for the
> monochrome bitmaps, `HAS_GRAPHICAL_TFT` for the Color UI, `TFT_SCALED_DOGLCD` for the Classic UI,
> `HAS_TFT_LVGL_UI`, `HAS_DWIN_E3V2` for the Creality DWIN UIs, `IS_DWIN_MARLINUI` for MarlinUI on DWIN, and
> `EXTENSIBLE_UI` for the serial screens. Anything that sets `IS_ULTIPANEL` gets MarlinUI menus
> (`HAS_MARLINUI_MENU`), and `HAS_DISPLAY` is true for every family except host-only. `src/inc/SanityCheck.h`
> holds the `#error` lines quoted on this page; when a build fails on a display option, the message there names the
> missing or conflicting setting.

## Related pages

- [Controllers and displays](/docs/appendix/controllers.html): every supported panel with photos, grouped as
  [character LCDs](/docs/appendix/controllers.html#character-based-lcds),
  [mono bitmap displays](/docs/appendix/controllers.html#mono-bitmap-displays),
  [color graphical displays](/docs/appendix/controllers.html#color-graphical-displays),
  [smart displays](/docs/appendix/controllers.html#smart-displays) and
  [G-code hosts](/docs/appendix/controllers.html#g-code-hosts).
- [LCD settings](/docs/settings/lcd.html) and [Interface settings](/docs/settings/interface.html): every option.
- [Boot and Status Screens](/docs/configuration/boot_status_screen.html): custom boot and status images.
- [`M117`](/docs/gcode/M117.html), [`M300`](/docs/gcode/M300.html), [`M73`](/docs/gcode/M073.html),
  [`M250`](/docs/gcode/M250.html), [`M255`](/docs/gcode/M255.html), [`M256`](/docs/gcode/M256.html),
  [`M995`](/docs/gcode/M995.html).
