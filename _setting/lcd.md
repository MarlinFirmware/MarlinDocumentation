---
label: LCD
brief: LCD / Controller options
category: [ wip ]
tags: [ lcd, hardware ]
pagetype: toc
author: thinkyhead

settings:

- name: REPRAP_DISCOUNT_SMART_CONTROLLER
  style: character
  since: 1.1.0
  brief: The common EXP1/2 HD44780 LCD controller (with SD Card slot)

- name: YHCB2004
  style: character
  brief: GT2560 (YHCB2004) LCD Display
  long: Requires Testato, Koepel `softwarewire` library and Andriy Golovnya's `LiquidCrystal_AIP31068` library.
  since: 1.1.9

- name: RADDS_DISPLAY
  style: character
  brief: Original RADDS LCD Display+Encoder+SDCardReader
  links:
  - url: //web.archive.org/web/20200719145306/doku.radds.org/dokumentation/lcd-display/
  since: 1.1.0

- name: ULTIMAKERCONTROLLER
  style: character
  brief: ULTIMAKER Controller
  since: 1.1.0

- name: ULTIPANEL
  style: character
  brief: Ultipanel - As seen on Thingiverse!
  since: 1.1.0

- name: PANEL_ONE
  style: character
  brief: PanelOne from T3P3 (via RAMPS 1.4 AUX2/AUX3)
  links:
  - url: //reprap.org/wiki/PanelOne
  since: 1.1.0

- name: G3D_PANEL
  style: character
  brief: Gadgets3D G3D LCD/SD Controller
  links:
  - url: //reprap.org/wiki/RAMPS_1.3/1.4_GADGETS3D_Shield_with_Panel
  since: 1.1.0

- name: RIGIDBOT_PANEL
  style: character
  brief: RigidBot Panel V1.0

- name: MAKEBOARD_MINI_2_LINE_DISPLAY_1602
  style: character
  brief: Makeboard 3D Printer Parts 3D Printer Mini Display 1602 Mini Controller
  links:
  - url: //www.aliexpress.com/item/32765887917.html

- name: ZONESTAR_LCD
  style: character
  brief: ANET and Tronxy 20x4 Controller, with keypad
  description: |
    Requires ADC_KEYPAD_PIN to be assigned to an analog pin.
    This LCD is known to be susceptible to electrical interference
    which scrambles the display.  Pressing any button clears it up.
    This is a LCD2004 display with 5 analog buttons.

- name: ULTRA_LCD
  style: character
  brief: Generic 16x2, 16x4, 20x2, or 20x4 character-based LCD.

- name: RA_CONTROL_PANEL
  style: i2c
  brief: Elefu RA Board Control Panel
  links:
  - url: //web.archive.org/web/20140823033947/www.elefu.com/index.php?route=product/product&product_id=53

- name: LCD_SAINSMART_I2C_1602
  style: i2c
  brief: Sainsmart (YwRobot) 16x2 LCD Display. Requires the `LiquidCrystal_I2C` library.
  links:
  - url: //github.com/MarlinFirmware/New-LiquidCrystal
  - url: //github.com/fmalpartida/New-LiquidCrystal/wiki

- name: LCD_SAINSMART_I2C_2004
  style: i2c
  brief: Sainsmart (YwRobot) 20x4 LCD Display. Requires the `LiquidCrystal_I2C` library.
  links:
  - url: //github.com/MarlinFirmware/New-LiquidCrystal
  - url: //github.com/fmalpartida/New-LiquidCrystal/wiki

- name: LCM1602
  style: i2c
  brief: Generic LCM1602 LCD adapter.

- name: LCD_I2C_PANELOLU2
  style: i2c
  brief: Panelolu 2 LCD with status LEDs separate encoder and click inputs
  description: |
    Note: This controller requires Arduino's LiquidTWI2 library v1.2.3 or later.
    For more info: https://github.com/lincomatic/LiquidTWI2
    Note: The PANELOLU2 encoder click input can either be directly connected to
    a pin (if BTN_ENC defined to != -1) or read through I2C (when BTN_ENC == -1).

- name: LCD_I2C_VIKI
  style: i2c
  brief: Panucatt VIKI LCD with status LEDs, integrated click & L/R/U/D buttons, separate encoder inputs.

- name: SAV_3DLCD
  style: shift-register
  brief: 2-wire Non-latching LCD SR
  links:
  - url: //github.com/fmalpartida/New-LiquidCrystal/wiki/schematics#user-content-ShiftRegister_connection
  - url: //reprap.org/wiki/SAV_3D_LCD

- name: FF_INTERFACEBOARD
  brief: 

- name: TFTGLCD_PANEL_SPI
  brief: 

- name: TFTGLCD_PANEL_I2C
  brief: 

- name: REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER
  since: 1.1.0
  brief: The common EXP1/2 Full Graphic LCD controller (with SD Card slot.

- name: K3D_FULL_GRAPHIC_SMART_CONTROLLER
  brief: 

- name: REPRAPWORLD_GRAPHICAL_LCD
  brief: 

- name: VIKI2
  brief: 

- name: miniVIKI
  brief: 

- name: WYH_L12864
  brief: 

- name: MINIPANEL
  brief: 

- name: MAKRPANEL
  brief: 

- name: ELB_FULL_GRAPHIC_CONTROLLER
  brief: 

- name: BQ_LCD_SMART_CONTROLLER
  brief: 

- name: CARTESIO_UI
  brief: 

- name: LCD_FOR_MELZI
  brief: 

- name: ULTI_CONTROLLER
  brief: 

- name: MKS_MINI_12864
  brief: 

- name: MKS_MINI_12864_V3
  brief: 

- name: MKS_LCD12864A
  brief: 

- name: MKS_LCD12864B
  brief: 

- name: FYSETC_MINI_12864_X_X
  brief: 

- name: FYSETC_MINI_12864_1_2
  brief: 

- name: FYSETC_MINI_12864_2_0
  brief: 

- name: FYSETC_MINI_12864_2_1
  brief: 

- name: FYSETC_GENERIC_12864_1_1
  brief: 

- name: BTT_MINI_12864
  brief: 

- name: BEEZ_MINI_12864
  brief: 

- name: CR10_STOCKDISPLAY
  brief: 

- name: ENDER2_STOCKDISPLAY
  brief: 

- name: ANET_FULL_GRAPHICS_LCD
  brief: 

- name: CTC_A10S_A13
  brief: 

- name: AZSMZ_12864
  brief: 

- name: SILVER_GATE_GLCD_CONTROLLER
  brief: 

- name: EMOTION_TECH_LCD
  brief: 

- name: U8GLIB_SSD1306
  brief: 

- name: SAV_3DGLCD
  subopts:
  - name: U8GLIB_SSD1306
  - name: U8GLIB_SH1106

- name: OLED_PANEL_TINYBOY2
  brief: 

- name: MKS_12864OLED
  brief: 

- name: MKS_12864OLED_SSD1306
  brief: 

- name: ZONESTAR_12864LCD
  brief: 

- name: ZONESTAR_12864OLED
  brief: 

- name: ZONESTAR_12864OLED_SSD1306
  brief: 

- name: U8GLIB_SH1106_EINSTART
  brief: 

- name: OVERLORD_OLED
  brief: 

- name: FYSETC_242_OLED_12864
  brief: 

- name: K3D_242_OLED_CONTROLLER
  brief: 

- name: DGUS_LCD_UI
  brief: 
  subopts:
  - name: USE_MKS_GREEN_UI
  - name: LCD_SCREEN_ROTATE
    type: rotation
    options: [ 0, 90, 180, 270 ]
  - name: IA_CREALITY_BOOT_DELAY
    type: ms

- name: MALYAN_LCD
  brief: 

- name: TOUCH_UI_FTDI_EVE
  brief: 

- name: ANYCUBIC_LCD_CHIRON
  brief: 

- name: ANYCUBIC_LCD_I3MEGA
  brief: 

- name: ANYCUBIC_LCD_VYPER
  brief: 

- name: SOVOL_SV06_RTS
  brief: 

- name: NEXTION_TFT
  brief: 

- name: EXTENSIBLE_UI
  brief: 

- name: MKS_TS35_V2_0
  brief: 

- name: MKS_ROBIN_TFT24
  brief: 

- name: MKS_ROBIN_TFT28
  brief: 

- name: MKS_ROBIN_TFT32
  brief: 

- name: MKS_ROBIN_TFT35
  brief: 

- name: MKS_ROBIN_TFT43
  brief: 

- name: MKS_ROBIN_TFT_V1_1R
  brief: 

- name: TFT_TRONXY_X5SA
  brief: 

- name: ANYCUBIC_TFT35
  brief: 

- name: LONGER_LK_TFT28
  brief: 

- name: ANET_ET4_TFT28
  brief: 

- name: ANET_ET5_TFT35
  brief: 

- name: BIQU_BX_TFT70
  brief: 

- name: BTT_TFT35_SPI_V1_0
  brief: 

- name: TFT_GENERIC
  brief: 

- name: TFT_CLASSIC_UI
  brief: 

- name: TFT_COLOR_UI
  brief: 

- name: TFT_LVGL_UI
  brief: 

- name: TFT_ROTATION
  brief: Set the TFT rotation angle. Only applies to some TFT displays.

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
  brief: 

- name: REPRAPWORLD_KEYPAD
  brief: 
  subopts:
  - name: REPRAPWORLD_KEYPAD_MOVE_STEP
    type: int

- name: EASYTHREED_UI
  brief: 

---
These options are used to select and configure Marlin to communicate with an LCD controller directly connected to your board.

Marlin supports a huge number of LCD controllers, from simple character LCDs with a click-wheel to graphical OLED touchscreen displays. See the [LCD Controllers](/docs/hardware/controllers.html) page for full details about all the supported displays and controllers.
