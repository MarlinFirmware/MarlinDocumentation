---
label: LCD
brief: LCD / Controller options
category: [ wip ]
tags: [ lcd, hardware ]
pagetype: toc
author: thinkyhead

settings:

- name: REPRAP_DISCOUNT_SMART_CONTROLLER
  iface: spi
  style: character
  since: 1.1.0
  brief: The common EXP1/2 HD44780 LCD controller (with SD Card slot)

- name: YHCB2004
  iface: spi
  style: character
  brief: GT2560 (YHCB2004) LCD Display
  long: Requires Testato, Koepel `softwarewire` library and Andriy Golovnya's `LiquidCrystal_AIP31068` library.
  since: 1.1.9

- name: RADDS_DISPLAY
  iface: spi
  style: character
  brief: Original RADDS LCD Display+Encoder+SDCardReader
  links:
  - url: //web.archive.org/web/20200719145306/doku.radds.org/dokumentation/lcd-display/
  since: 1.1.0

- name: ULTIMAKERCONTROLLER
  iface: spi
  style: character
  brief: ULTIMAKER Controller
  since: 1.1.0

- name: ULTIPANEL
  iface: spi
  style: character
  brief: Ultipanel - As seen on Thingiverse!
  since: 1.1.0

- name: PANEL_ONE
  iface: spi
  style: character
  brief: PanelOne from T3P3 (via RAMPS 1.4 AUX2/AUX3)
  links:
  - url: //reprap.org/wiki/PanelOne
  since: 1.1.0

- name: G3D_PANEL
  iface: spi
  style: character
  brief: Gadgets3D G3D LCD/SD Controller
  links:
  - url: //reprap.org/wiki/RAMPS_1.3/1.4_GADGETS3D_Shield_with_Panel
  since: 1.1.0

- name: RIGIDBOT_PANEL
  iface: spi
  style: character
  brief: RigidBot Panel V1.0

- name: MAKEBOARD_MINI_2_LINE_DISPLAY_1602
  iface: spi
  style: character
  brief: Makeboard 3D Printer Parts 3D Printer Mini Display 1602 Mini Controller
  links:
  - url: //www.aliexpress.com/item/32765887917.html

- name: ZONESTAR_LCD
  iface: spi
  style: character
  brief: ANET and Tronxy 20x4 Controller, with keypad
  description: |
    Requires ADC_KEYPAD_PIN to be assigned to an analog pin.
    This LCD is known to be susceptible to electrical interference
    which scrambles the display.  Pressing any button clears it up.
    This is a LCD2004 display with 5 analog buttons.

- name: ULTRA_LCD
  iface: spi
  style: character
  brief: Generic 16x2, 16x4, 20x2, or 20x4 character-based LCD.

- name: RA_CONTROL_PANEL
  iface: i2c
  brief: Elefu RA Board Control Panel
  links:
  - url: //web.archive.org/web/20140823033947/www.elefu.com/index.php?route=product/product&product_id=53

- name: LCD_SAINSMART_I2C_1602
  iface: i2c
  brief: Sainsmart (YwRobot) 16x2 LCD Display. Requires the `LiquidCrystal_I2C` library.
  links:
  - url: //github.com/MarlinFirmware/New-LiquidCrystal
  - url: //github.com/fmalpartida/New-LiquidCrystal/wiki

- name: LCD_SAINSMART_I2C_2004
  iface: i2c
  brief: Sainsmart (YwRobot) 20x4 LCD Display. Requires the `LiquidCrystal_I2C` library.
  links:
  - url: //github.com/MarlinFirmware/New-LiquidCrystal
  - url: //github.com/fmalpartida/New-LiquidCrystal/wiki

- name: LCM1602
  iface: i2c
  style: character
  brief: Generic LCM1602 LCD adapter.

- name: LCD_I2C_PANELOLU2
  iface: i2c
  brief: Panelolu 2 LCD with status LEDs separate encoder and click inputs
  description: |
    Note: The PANELOLU2 encoder can be directly connected to a pin (`BTN_ENC`) or read through I2C (when `BTN_ENC` == -1).
  links:
  - url: //github.com/lincomatic/LiquidTWI2
    label: "Requires Arduino's LiquidTWI2 library v1.2.3 or later."

- name: LCD_I2C_VIKI
  iface: i2c
  brief: Panucatt VIKI LCD with status LEDs, integrated click &amp; L/R/U/D buttons, separate encoder inputs.

- name: SAV_3DLCD
  iface: shift-register
  brief: 2-wire Non-latching LCD SR
  links:
  - url: //github.com/fmalpartida/New-LiquidCrystal/wiki/schematics#user-content-ShiftRegister_connection
  - url: //reprap.org/wiki/SAV_3D_LCD

- name: FF_INTERFACEBOARD
  iface: shift-register
  brief: 3-wire SR LCD with strobe using 74HC4094. Uses the code directly from Sailfish.
  links:
  - url: //github.com/mikeshub/SailfishLC

- name: TFTGLCD_PANEL_SPI
  iface: spi
  brief: TFT GLCD Panel with Marlin UI connected by SPI.
  links:
  - url: //github.com/Serhiy-K/TFTGLCDAdapter

- name: TFTGLCD_PANEL_I2C
  iface: i2c
  brief: TFT GLCD Panel with Marlin UI connected by I2C.
  links:
  - url: //github.com/Serhiy-K/TFTGLCDAdapter

- name: REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER
  iface: spi
  since: 1.1.0
  brief: The common EXP1/2 Full Graphic LCD controller (with SD Card slot).
  links:
  - url: //reprap.org/wiki/RepRapDiscount_Full_Graphic_Smart_Controller

- name: K3D_FULL_GRAPHIC_SMART_CONTROLLER
  iface: spi
  brief: K.3D Full Graphic Smart Controller.

- name: REPRAPWORLD_GRAPHICAL_LCD
  iface: spi
  brief: ReprapWorld Graphical LCD
  links: 
  - url: //reprapworld.com/electronics/3d-printer-modules/autonomous-printing/graphical-lcd-screen-v1-0

- name: VIKI2
  iface: spi
  brief: Panucatt Device Viki 2.0 with Graphic LCD.
  links:
  - url: //www.panucatt.com

- name: miniVIKI
  iface: spi
  brief: Panucatt Device mini Viki with Graphic LCD.
  links:
  - url: //www.panucatt.com

- name: WYH_L12864
  iface: spi
  brief: Alfawise Ex8 printer LCD marked as WYH L12864 COG.

- name: MINIPANEL
  iface: spi
  brief: MakerLab Mini Panel with graphic controller and SD support
  links:
  - url: //reprap.org/wiki/Mini_panel

- name: MAKRPANEL
  iface: spi
  brief: MaKr3d Makr-Panel with graphic controller and SD support.
  links:
  - url: //reprap.org/wiki/MaKrPanel

- name: ELB_FULL_GRAPHIC_CONTROLLER
  iface: spi
  brief: Adafruit ST7565 Full Graphic Controller.
  links:
  - url: //github.com/eboston/Adafruit-ST7565-Full-Graphic-Controller/

- name: BQ_LCD_SMART_CONTROLLER
  iface: spi
  brief: BQ LCD Smart Controller shipped by default with the BQ Hephestos 2 and Witbox 2.

- name: CARTESIO_UI
  brief: Cartesio UI
  links:
  - url: //web.archive.org/web/20180605050442/mauk.cc/webshop/cartesio-shop/electronics/user-interface

- name: LCD_FOR_MELZI
  brief: LCD for Melzi Card with Graphical LCD.

- name: ULTI_CONTROLLER
  iface: i2c
  brief: Original Ulticontroller from Ultimaker 2 printer with SSD1309 I2C display and encoder
  links:
  - url: //github.com/Ultimaker/Ultimaker2/tree/master/1249_Ulticontroller_Board_(x1)

- name: MKS_MINI_12864
  iface: spi
  adapter: mks
  brief: MKS MINI12864 with graphic controller and SD support

- name: MKS_MINI_12864_V3
  iface: spi
  adapter: mks
  brief: Alias for `FYSETC_MINI_12864_2_1`. Type A/B. NeoPixel RGB Backlight.

- name: MKS_LCD12864A
  iface: spi
  adapter: mks
  brief: MKS LCD12864A with graphic controller and SD support. Follows `MKS_MINI_12864` pinout.

- name: MKS_LCD12864B
  iface: spi
  adapter: mks
  brief: MKS LCD12864B with graphic controller and SD support. Follows `MKS_MINI_12864` pinout.

- name: FYSETC_MINI_12864_X_X
  iface: spi
  brief: FYSETC variant of the MINI12864 graphic controller with SD support.
         Type C/D/E/F. No tunable RGB Backlight by default.
  links:
  - url: //wiki.fysetc.com/docs/Mini12864Panel

- name: FYSETC_MINI_12864_1_2
  iface: spi
  brief: FYSETC variant of the MINI12864 graphic controller with SD support.
  links:
  - url: //wiki.fysetc.com/docs/Mini12864Panel

- name: FYSETC_MINI_12864_2_0
  iface: spi
  brief: FYSETC variant of the MINI12864 graphic controller with SD support.
  links:
  - url: //wiki.fysetc.com/docs/Mini12864Panel

- name: FYSETC_MINI_12864_2_1
  iface: spi
  brief: FYSETC variant of the MINI12864 graphic controller with SD support.
  links:
  - url: //wiki.fysetc.com/docs/Mini12864Panel

- name: FYSETC_GENERIC_12864_1_1
  iface: spi
  brief: FYSETC variant of the MINI12864 graphic controller with SD support.
  links:
  - url: //wiki.fysetc.com/docs/Mini12864Panel

- name: BTT_MINI_12864
  iface: spi
  brief: Alias for `FYSETC_MINI_12864_2_1`. Type A/B. NeoPixel RGB Backlight.
  links:
  - url: //github.com/bigtreetech/MINI-12864

- name: BEEZ_MINI_12864
  iface: spi
  brief: Alias for `FYSETC_MINI_12864_2_1`. Type A/B. NeoPixel RGB Backlight.

- name: CR10_STOCKDISPLAY
  iface: spi
  brief: Factory display for Creality CR-10 / CR-7 / Ender-3. Connect to EXP1 on RAMPS and compatible boards.

- name: ENDER2_STOCKDISPLAY
  iface: spi
  brief: Ender-2 OEM display, a variant of the `MKS_MINI_12864`.

- name: ANET_FULL_GRAPHICS_LCD
  brief: ANET and Tronxy 128×64 Full Graphics Controller as used on Anet A6.

- name: CTC_A10S_A13
  brief: GUCOCO CTC 128×64 Full Graphics Controller as used on GUCOCO CTC A10S.

- name: AZSMZ_12864
  brief: AZSMZ 12864 LCD with SD.
  links:
  - url: //www.aliexpress.com/item/32837222770.html

- name: SILVER_GATE_GLCD_CONTROLLER
  brief: Silvergate GLCD controller.
  links:
  - url: //github.com/android444/Silvergate

- name: EMOTION_TECH_LCD
  brief: eMotion Tech LCD with SD.
  links:
  - url: //www.reprap-france.com/produit/1234568748-ecran-graphique-128-x-64-points-2-1

- name: U8GLIB_SSD1306
  brief: SSD1306 OLED full graphics generic display.

- name: SAV_3DGLCD
  brief: SAV OLEd LCD module support using either SSD1306 or SH1106 based LCD modules.
  subopts:
  - name: U8GLIB_SSD1306
  - name: U8GLIB_SH1106

- name: OLED_PANEL_TINYBOY2
  brief: TinyBoy2 128x64 OLED / Encoder Panel.

- name: MKS_12864OLED
  brief: MKS OLED 1.3" 128×64 Full Graphics Controller. Tiny, but very sharp OLED display using the SH1106 controller.
  links:
  - url: //reprap.org/wiki/MKS_12864OLED

- name: MKS_12864OLED_SSD1306
  brief: MKS OLED 1.3" 128×64 Full Graphics Controller. Tiny, but very sharp OLED display using the SSD1306 controller.
  links:
  - url: //reprap.org/wiki/MKS_12864OLED

- name: ZONESTAR_12864LCD
  brief: Zonestar OLED 128×64 Full Graphics Controller. Graphical (DOGM) with ST7920 controller.

- name: ZONESTAR_12864OLED
  brief: Zonestar OLED 128×64 Full Graphics Controller. 1.3" OLED with SH1106 controller.

- name: ZONESTAR_12864OLED_SSD1306
  brief: Zonestar OLED 128×64 Full Graphics Controller. 0.96" OLED with SSD1306 controller.

- name: U8GLIB_SH1106_EINSTART
  brief: Einstart S OLED SSD1306.

- name: OVERLORD_OLED
  iface: i2c
  brief: Overlord OLED display/controller with i2c buzzer and LEDs.

- name: FYSETC_242_OLED_12864
  brief: FYSETC OLED 2.42" 128×64 Full Graphics Controller with WS2812 RGB.
  links:
  - url: //www.aliexpress.com/item/4000345255731.html

- name: K3D_242_OLED_CONTROLLER
  brief: K.3D SSD1309 OLED 2.42" 128×64 Full Graphics Controller.

- name: DGUS_LCD_UI
  type: name
  brief: DGUS Touch Display with DWIN OS. Define UI to use with this display.
  options: [ ORIGIN, FYSETC, HYPRECY, MKS, RELOADED, IA_CREALITY, E3S1PRO ]
  subopts:
  - name: USE_MKS_GREEN_UI
  - name: LCD_SCREEN_ROTATE
    type: rotation
    options: [ 0, 90, 180, 270 ]
  - name: IA_CREALITY_BOOT_DELAY
    type: ms

- name: MALYAN_LCD
  iface: serial
  brief: Malyan M200/M300 stock Color LCD with Big Clicky Buttons. **NOT A TOUCH SCREEN!**

- name: TOUCH_UI_FTDI_EVE
  brief: Touch UI for FTDI EVE (FT800/FT810) displays. See `Configuration_adv.h` for all configuration options.

- name: ANYCUBIC_LCD_CHIRON
  iface: serial
  brief: Touch-screen LCD for Anycubic Chiron.

- name: ANYCUBIC_LCD_I3MEGA
  brief: Touch-screen LCD for Anycubic i3 Mega.
  subopts:
  - name: ANYCUBIC_LCD_GCODE_EXT
    brief: Add ".gcode" to menu entries for DGUS clone compatibility.

- name: ANYCUBIC_LCD_VYPER
  iface: serial
  brief: Touch-screen LCD for Anycubic Vyper.

- name: SOVOL_SV06_RTS
  brief: Sovol SV-06 Resistive Touch Screen.

- name: NEXTION_TFT
  brief: 320x240 Nextion 2.8" serial TFT Resistive Touch Screen NX3224T028.

- name: EXTENSIBLE_UI
  style: extui
  brief: Third-party or vendor-customized controller interfaces. Sources should be installed in 'src/lcd/extui'.
  subopts:
  - name: EXTUI_LOCAL_BEEPER
    brief: Use the local Beeper pin with an external display.

- name: MKS_TS35_V2_0
  style: tft
  brief: 480x320, 3.5", SPI Display with Rotary Encoder from MKS. Usually paired with MKS Robin Nano V2 &amp; V3.
  links:
  - url: //github.com/makerbase-mks/MKS-TFT-Hardware/tree/master/MKS%20TS35

- name: MKS_ROBIN_TFT24
  style: tft
  brief: 320x240, 2.4", FSMC Display From MKS. Usually paired with MKS Robin Nano V1.2.

- name: MKS_ROBIN_TFT28
  brief: 320x240, 2.8", FSMC Display From MKS. Usually paired with MKS Robin Nano V1.2.

- name: MKS_ROBIN_TFT32
  brief: 320x240, 3.2", FSMC Display From MKS. Usually paired with MKS Robin Nano V1.2.

- name: MKS_ROBIN_TFT35
  brief: 480x320, 3.5", FSMC Display From MKS. Usually paired with MKS Robin Nano V1.2.

- name: MKS_ROBIN_TFT43
  brief: 480x272, 4.3", FSMC Display From MKS.

- name: MKS_ROBIN_TFT_V1_1R
  brief: 320x240, 3.2", FSMC Display From MKS. Usually paired with MKS Robin.

- name: TFT_TRONXY_X5SA
  brief: 480x320, 3.5", FSMC Stock Display from Tronxy.

- name: ANYCUBIC_TFT35
  brief: 480x320, 3.5", FSMC Stock Display from AnyCubic.

- name: LONGER_LK_TFT28
  brief: 320x240, 2.8", FSMC Stock Display from Longer/Alfawise.

- name: ANET_ET4_TFT28
  brief: 320x240, 2.8", FSMC Stock Display from ET4.

- name: ANET_ET5_TFT35
  brief: 480x320, 3.5", FSMC Stock Display from ET5.

- name: BIQU_BX_TFT70
  brief: 1024x600, 7", RGB Stock Display with Rotary Encoder from BIQU BX.
  links:
  - url: //github.com/bigtreetech/BIQU-BX/tree/master/Hardware

- name: BTT_TFT35_SPI_V1_0
  brief: 480x320, 3.5", SPI Stock Display with Rotary Encoder from BIQU B1 SE Series.
  links:
  - url: //github.com/bigtreetech/TFT35-SPI/tree/master/v1

- name: TFT_GENERIC
  brief: Generic TFT with detailed sub-options.
  subopts:
  - name: TFT_DRIVER AUTO
    type: enum
    options: [ AUTO, ST7735, ST7789, ST7796, R61505, ILI9328, ILI9341, ILI9488 ]
  - name: TFT_INTERFACE_FSMC
    brief: Use the FSMC interface.
  - name: TFT_INTERFACE_SPI
    brief: Use the SPI interface.
  - name: TFT_RES_320x240
    brief: Use TFT Resolution 320 x 240.
  - name: TFT_RES_480x272
    brief: Use TFT Resolution 480 x 272.
  - name: TFT_RES_480x320
    brief: Use TFT Resolution 480 x 320.
  - name: TFT_RES_1024x600
    brief: Use TFT Resolution 1024 x 600.

- name: TFT_CLASSIC_UI
  brief: TFT with emulated DOGM - 128x64 Upscaled.

- name: TFT_COLOR_UI
  brief: TFT with Marlin Default Menus, Touch Friendly, using full TFT capabilities.
  subopts:
  - name: TFT_FONT
    type: enum
    brief: TFT Font for Color UI.
    options: [ NOTOSANS, UNIFONT, HELVETICA ]
  - name: TFT_THEME
    type: enum
    brief: TFT Theme for Color UI. Choose one of the following or add a new one to 'Marlin/src/lcd/tft/themes' directory.
    options: [ BLUE_MARLIN, BLACK_MARLIN, ANET_BLACK ]
  - name: TFT_SHARED_IO
    brief: I/O is shared between TFT display and other devices. Disable async data transfer.
  - name: COMPACT_MARLIN_BOOT_LOGO
    brief: Use compressed data to save Flash space.

- name: TFT_LVGL_UI
  brief: TFT with a modern UI using LVGL.
  subopts:
  - name: MKS_WIFI_MODULE
    brief: Use the onboard MKS WiFi module.

- name: TFT_ROTATION
  type: enum
  brief: Set the TFT rotation angle. Only applies to some TFT displays.
  options: [ 'TFT_NO_ROTATION', 'TFT_ROTATE_90', 'TFT_ROTATE_90_MIRROR_X', 'TFT_ROTATE_90_MIRROR_Y', 'TFT_ROTATE_180', 'TFT_ROTATE_180_MIRROR_X', 'TFT_ROTATE_180_MIRROR_Y', 'TFT_ROTATE_270', 'TFT_ROTATE_270_MIRROR_X', 'TFT_ROTATE_270_MIRROR_Y', 'TFT_MIRROR_X', 'TFT_MIRROR_Y' ]

- name: DWIN_CREALITY_LCD
  since: 2.0.8
  brief: The Ender-3 V2 display with Creality UI. Requires Marlin supplied DWIN_SET.
- name: DWIN_LCD_PROUI
  since: 2.1.0
  brief: The Ender-3 V2 display with Pro UI by MRISCOC. Requires Marlin supplied DWIN_SET.
- name: DWIN_CREALITY_LCD_JYERSUI
  since: 2.0.8
  brief: The Ender-3 V2 display with Jyers UI. Requires Marlin supplied DWIN_SET.
- name: DWIN_MARLINUI_PORTRAIT
  since: 2.0.9
  brief: The Ender-3 V2 display with Marlin UI in portrait (tall) orientation. Requires Marlin supplied DWIN_SET.
- name: DWIN_MARLINUI_LANDSCAPE
  since: 2.0.9
  brief: The Ender-3 V2 display with Marlin UI in landscape (wide) orientation. Requires Marlin supplied DWIN_SET.

- name: TOUCH_SCREEN
  brief: Enable touch interface processing for displays that support it.
  subopts:
  - name: BUTTON_DELAY_EDIT
    type: ms
    brief: Button repeat delay for edit screens.
    example:
    - value: 50
  - name: BUTTON_DELAY_MENU
    type: ms
    brief: Button repeat delay for menus.
    example:
    - value: 250
  - name: NO_BACK_MENU_ITEM
    requires: TFT_CLASSIC_UI or TFT_COLOR_UI
    brief: Don't display a top menu item to go back to the parent menu.
  - name: TOUCH_SCREEN_CALIBRATION
    brief: Provide a utility screen to recalibrate screen touch.
  - name: TOUCH_CALIBRATION_X
    type: int
    example:
    - value: 12316
  - name: TOUCH_CALIBRATION_Y
    type: int
    example:
    - value: -8981
  - name: TOUCH_OFFSET_X
    type: int
    example:
    - value: -43
  - name: TOUCH_OFFSET_Y
    type: int
    example:
    - value: 257
  - name: TOUCH_ORIENTATION
    type: enum
    options: [ TOUCH_LANDSCAPE, TOUCH_PORTRAIT ]
  - name: TOUCH_CALIBRATION_AUTO_SAVE
    requires: TOUCH_SCREEN_CALIBRATION and EEPROM_SETTINGS
  - name: SINGLE_TOUCH_NAVIGATION
    requires: TFT_COLOR_UI

- name: REPRAPWORLD_KEYPAD
  brief: 
  subopts:
  - name: REPRAPWORLD_KEYPAD_MOVE_STEP
    type: int

- name: EASYTHREED_UI
  brief: EasyThreeD ET-4000+ with button input and status LED.

---
These options are used to select and configure Marlin to communicate with an LCD controller directly connected to your board.

Marlin supports a huge number of LCD controllers, from simple character LCDs with a click-wheel to graphical OLED touchscreen displays. See the [LCD Controllers](/docs/hardware/controllers.html) page for full details about all the supported displays and controllers.
