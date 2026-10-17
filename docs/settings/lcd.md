---
title: LCD
parent: Settings
layout: setting
section: lcd
settings:
- name: REPRAP_DISCOUNT_SMART_CONTROLLER
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.0
  brief: The common EXP1/2 HD44780 LCD controller (with SD Card slot)
  comment: |-
    RepRapDiscount Smart Controller.

    - <https://reprap.org/wiki/RepRapDiscount_Smart_Controller>

    Note: Usually sold with a white PCB.
- name: YHCB2004
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.9
  brief: GT2560 (YHCB2004) LCD Display
  long: Requires Testato, Koepel `softwarewire` library and Andriy Golovnya's `LiquidCrystal_AIP31068` library.
  comment: |-
    GT2560 (YHCB2004) LCD Display

    Requires Testato, Koepel softwarewire library and

    Andriy Golovnya's LiquidCrystal_AIP31068 library.
- name: RADDS_DISPLAY
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.0
  brief: Original RADDS LCD Display+Encoder+SDCardReader
  comment: |-
    Original RADDS LCD Display+Encoder+SDCardReader

    - <https://web.archive.org/web/20200719145306/doku.radds.org/dokumentation/lcd-display/>
- name: ULTIMAKERCONTROLLER
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.0
  brief: ULTIMAKER Controller
  long: |-
    Option|Description
    ------|-----------
    `ULTIMAKERCONTROLLER`|The original Ultimaker Controller.
    `ULTIPANEL`|[ULTIPANEL](//www.thingiverse.com/thing:15081) as seen on Thingiverse.
    `PANEL_ONE`|[PanelOne from T3P3](//reprap.org/wiki/PanelOne) (via RAMPS 1.4 AUX2/AUX3). A variant of `ULTIMAKERCONTROLLER`.
    `REPRAP_DISCOUNT_SMART_CONTROLLER`|[RepRapDiscount Smart Controller](//reprap.org/wiki/RepRapDiscount_Smart_Controller). Usually sold with a white PCB.
    `G3D_PANEL`|[Gadgets3D G3D LCD/SD Controller](//reprap.org/wiki/RAMPS_1.3/1.4_GADGETS3D_Shield_with_Panel). Usually sold with a blue PCB.
    `RIGIDBOT_PANEL`|[RigidBot Panel V1.0](//www.inventapart.com/).
    `ZONESTAR_LCD`|[Anet Keypad LCD](//www.anet3d.com/prod_view.aspx?TypeId=10&Id=178) for the Anet A3
  comment: ULTIMAKER Controller.
- name: ULTIPANEL
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.0
  brief: Ultipanel - As seen on Thingiverse!
  comment: ULTIPANEL as seen on Thingiverse.
- name: PANEL_ONE
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.0
  brief: PanelOne from T3P3 (via RAMPS 1.4 AUX2/AUX3)
  comment: |-
    PanelOne from T3P3 (via RAMPS 1.4 AUX2/AUX3)

    - <https://reprap.org/wiki/PanelOne>
- name: G3D_PANEL
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.0
  brief: Gadgets3D G3D LCD/SD Controller
  comment: |-
    GADGETS3D G3D LCD/SD Controller

    - <https://reprap.org/wiki/RAMPS_1.3/1.4_GADGETS3D_Shield_with_Panel>

    Note: Usually sold with a blue PCB.
- name: RIGIDBOT_PANEL
  file: Configuration.h
  type: switch
  disabled: true
  brief: RigidBot Panel V1.0
  comment: RigidBot Panel V1.0
- name: MAKEBOARD_MINI_2_LINE_DISPLAY_1602
  file: Configuration.h
  type: switch
  disabled: true
  brief: Makeboard 3D Printer Parts 3D Printer Mini Display 1602 Mini Controller
  comment: |-
    Makeboard 3D Printer Parts 3D Printer Mini Display 1602 Mini Controller

    - <https://www.aliexpress.com/item/32765887917.html>
- name: ZONESTAR_LCD
  file: Configuration.h
  type: switch
  disabled: true
  brief: ANET and Tronxy 20x4 Controller, with keypad
  comment: |-
    ANET and Tronxy 20x4 Controller

    LCD2004 display with 5 analog buttons.

    NOTE: Requires ADC_KEYPAD_PIN to be assigned to an analog pin. This LCD is known to be susceptible to electrical interference which scrambles the display. Press any button to clear it up.
- name: ULTRA_LCD
  file: Configuration.h
  type: switch
  disabled: true
  brief: Generic 16x2, 16x4, 20x2, or 20x4 character-based LCD.
  comment: Generic 16x2, 16x4, 20x2, or 20x4 character-based LCD.
- name: RA_CONTROL_PANEL
  file: Configuration.h
  type: switch
  disabled: true
  brief: Elefu RA Board Control Panel
  long: |-
    These controllers all require the [LiquidCrystal_I2C library](//github.com/kiyoshigawa/LiquidCrystal_I2C).

    Option|Description
    ------|-----------
    `RA_CONTROL_PANEL`|Elefu RA Board Control Panel
    `LCD_SAINSMART_I2C_`|Sainsmart [YWRobot LCM1602 LCD Display](//henrysbench.capnfatz.com/henrys-bench/arduino-displays/ywrobot-lcm1602-iic-v1-lcd-arduino-tutorial/).
    `LCM1602`|Generic LCM1602 LCD adapter
    `LCD_I2C_PANELOLU2`|PANELOLU2 LCD with status LEDs, separate encoder and click inputs. The click input can either be directly connected to a pin (if `BTN_ENC` is defined) or read through I2C (with `BTN_ENC` undefined). Requires [LiquidTWI2 library](//github.com/lincomatic/LiquidTWI2) v1.2.3 or later.
    `LCD_I2C_VIKI`|Panucatt VIKI LCD with status LEDs, integrated click & L/R/U/D buttons, separate encoder inputs.
    `SAV_3DLCD`|Shift register panels. [2 wire Non-latching LCD SR](//github.com/fmalpartida/New-LiquidCrystal). See [LCD configuration](//reprap.org/wiki/SAV_3D_LCD).
  comment: |-
    Elefu RA Board Control Panel

    - <https://web.archive.org/web/20140823033947/www.elefu.com/index.php?route=product/product&product_id=53>
- name: LCD_SAINSMART_I2C_1602
  file: Configuration.h
  type: switch
  disabled: true
  brief: Sainsmart (YwRobot) 16x2 LCD Display. Requires the `LiquidCrystal_I2C` library.
  comment: |-
    Sainsmart (YwRobot) LCD Displays

    These require LiquidCrystal_I2C library:

    - <https://github.com/MarlinFirmware/New-LiquidCrystal>
    - <https://github.com/fmalpartida/New-LiquidCrystal/wiki>
- name: LCD_SAINSMART_I2C_2004
  file: Configuration.h
  type: switch
  disabled: true
  brief: Sainsmart (YwRobot) 20x4 LCD Display. Requires the `LiquidCrystal_I2C` library.
  shared_comment: |-
    Sainsmart (YwRobot) LCD Displays

    These require LiquidCrystal_I2C library:

    - <https://github.com/MarlinFirmware/New-LiquidCrystal>
    - <https://github.com/fmalpartida/New-LiquidCrystal/wiki>
- name: LCM1602
  file: Configuration.h
  type: switch
  disabled: true
  brief: Generic LCM1602 LCD adapter.
  comment: Generic LCM1602 LCD adapter
- name: LCD_I2C_PANELOLU2
  file: Configuration.h
  type: switch
  disabled: true
  brief: Panelolu 2 LCD with status LEDs separate encoder and click inputs
  comment: |-
    PANELOLU2 LCD with status LEDs, separate encoder and click inputs.

    Note: This controller requires Arduino's LiquidTWI2 library v1.2.3 or later. For more info: https://github.com/lincomatic/LiquidTWI2

    Note: The PANELOLU2 encoder click input can either be directly connected to a pin (if BTN_ENC defined to != -1) or read through I2C (when BTN_ENC == -1).
- name: LCD_I2C_VIKI
  file: Configuration.h
  type: switch
  disabled: true
  brief: Panucatt VIKI LCD with status LEDs, integrated click &amp; L/R/U/D buttons, separate encoder inputs.
  comment: Panucatt VIKI LCD with status LEDs, integrated click & L/R/U/D buttons, separate encoder inputs.
- name: SAV_3DLCD
  file: Configuration.h
  type: switch
  disabled: true
  brief: 2-wire Non-latching LCD SR
  comment: '2-wire Non-latching LCD SR from https://github.com/fmalpartida/New-LiquidCrystal/wiki/schematics#user-content-ShiftRegister_connection LCD configuration: https://reprap.org/wiki/SAV_3D_LCD'
- name: FF_INTERFACEBOARD
  file: Configuration.h
  type: switch
  disabled: true
  brief: 3-wire SR LCD with strobe using 74HC4094. Uses the code directly from Sailfish.
  comment: |-
    3-wire SR LCD with strobe using 74HC4094

    - <https://github.com/mikeshub/SailfishLCD>

    Uses the code directly from Sailfish
- name: MIGHTYBOARD_LCD
  file: Configuration.h
  type: switch
  disabled: true
  comment: MightyBoard LCD and Interface
- name: MIGHTYBOARD_DEBUG
  file: Configuration.h
  type: switch
  disabled: true
  requires: MIGHTYBOARD_LCD
  comment: Lightweight debug output for buttons and encoder
- name: MIGHTYBOARD_DISABLE_ENC_PULLUP
  file: Configuration.h
  type: switch
  disabled: true
  requires: MIGHTYBOARD_LCD
  comment: Enable if the encoder button is unreliable
- name: MIGHTYBOARD_BUTTON_PULLUPS
  file: Configuration.h
  type: switch
  disabled: true
  requires: MIGHTYBOARD_LCD
  comment: Enable if other buttons are unreliable
- name: MIGHTYBOARD_BACK_STATUS_BUTTONS
  file: Configuration.h
  type: switch
  disabled: true
  requires: MIGHTYBOARD_LCD
  comment: Use LEFT/RIGHT buttons for Back / Home. Otherwise they act like encoder down / up.
- name: TFTGLCD_PANEL_SPI
  file: Configuration.h
  type: switch
  disabled: true
  brief: TFT GLCD Panel with Marlin UI connected by SPI.
  comment: |-
    TFT GLCD Panel with Marlin UI

    Panel connected to main board by SPI or I2C interface.

    - <https://github.com/Serhiy-K/TFTGLCDAdapter>
- name: TFTGLCD_PANEL_I2C
  file: Configuration.h
  type: switch
  disabled: true
  brief: TFT GLCD Panel with Marlin UI connected by I2C.
  shared_comment: |-
    TFT GLCD Panel with Marlin UI

    Panel connected to main board by SPI or I2C interface.

    - <https://github.com/Serhiy-K/TFTGLCDAdapter>
- name: REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.0
  brief: The common EXP1/2 Full Graphic LCD controller (with SD Card slot).
  comment: |-
    RepRapDiscount FULL GRAPHIC Smart Controller

    - <https://reprap.org/wiki/RepRapDiscount_Full_Graphic_Smart_Controller>
- name: K3D_FULL_GRAPHIC_SMART_CONTROLLER
  file: Configuration.h
  type: switch
  disabled: true
  brief: K.3D Full Graphic Smart Controller.
  comment: K.3D Full Graphic Smart Controller
- name: REPRAPWORLD_GRAPHICAL_LCD
  file: Configuration.h
  type: switch
  disabled: true
  brief: ReprapWorld Graphical LCD
  comment: |-
    ReprapWorld Graphical LCD

    - <https://reprapworld.com/electronics/3d-printer-modules/autonomous-printing/graphical-lcd-screen-v1-0/>
- name: VIKI2
  file: Configuration.h
  type: switch
  disabled: true
  brief: Panucatt Device Viki 2.0 with Graphic LCD.
  comment: |-
    Activate one of these if you have a Panucatt Devices

    Viki 2.0 or mini Viki with Graphic LCD

    - <https://www.panucatt.com>
- name: miniVIKI
  file: Configuration.h
  type: switch
  disabled: true
  brief: Panucatt Device mini Viki with Graphic LCD.
  shared_comment: |-
    Activate one of these if you have a Panucatt Devices

    Viki 2.0 or mini Viki with Graphic LCD

    - <https://www.panucatt.com>
- name: WYH_L12864
  file: Configuration.h
  type: switch
  disabled: true
  brief: Alfawise Ex8 printer LCD marked as WYH L12864 COG.
  comment: Alfawise Ex8 printer LCD marked as WYH L12864 COG
- name: MINIPANEL
  file: Configuration.h
  type: switch
  disabled: true
  brief: MakerLab Mini Panel with graphic controller and SD support
  comment: MakerLab Mini Panel with graphic controller and SD support - https://reprap.org/wiki/Mini_panel
- name: MAKRPANEL
  file: Configuration.h
  type: switch
  disabled: true
  brief: MaKr3d Makr-Panel with graphic controller and SD support.
  comment: |-
    MaKr3d Makr-Panel with graphic controller and SD support.

    - <https://reprap.org/wiki/MaKrPanel>
- name: ELB_FULL_GRAPHIC_CONTROLLER
  file: Configuration.h
  type: switch
  disabled: true
  brief: Adafruit ST7565 Full Graphic Controller.
  comment: |-
    Adafruit ST7565 Full Graphic Controller.

    - <https://github.com/eboston/Adafruit-ST7565-Full-Graphic-Controller/>
- name: BQ_LCD_SMART_CONTROLLER
  file: Configuration.h
  type: switch
  disabled: true
  brief: BQ LCD Smart Controller shipped by default with the BQ Hephestos 2 and Witbox 2.
  comment: BQ LCD Smart Controller shipped by default with the BQ Hephestos 2 and Witbox 2.
- name: CARTESIO_UI
  file: Configuration.h
  type: switch
  disabled: true
  brief: Cartesio UI
  long: |-
    Option|Description
    ------|-----------
    `CARTESIO_UI`|[Cartesio UI](//mauk.cc/webshop/cartesio-shop/electronics/user-interface).
    `MAKRPANEL`|[MaKr3d Makr-Panel](//reprap.org/wiki/MaKr3d_MaKrPanel) with graphic controller and SD support.
    `REPRAPWORLD_GRAPHICAL_LCD`|[ReprapWorld Graphical LCD](//reprapworld.com/?products_details&products_id/1218).
    `VIKI2`|[Panucatt Devices](//panucatt.com) [Viki 2.0](//panucatt.com).
    `miniVIKI`|[mini Viki with Graphic LCD](//panucatt.com).
    `ELB_FULL_GRAPHIC_CONTROLLER`|[Adafruit ST7565 Full Graphic Controller](//github.com/eboston/Adafruit-ST7565-Full-Graphic-Controller/).
    `REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER`|[RepRapDiscount Full Graphic Smart Controller](//reprap.org/wiki/RepRapDiscount_Full_Graphic_Smart_Controller).
    `MINIPANEL`|[MakerLab Mini Panel](//reprap.org/wiki/Mini_panel) with graphic controller and SD support.
    `BQ_LCD_SMART_CONTROLLER`|BQ LCD Smart Controller shipped with the BQ Hephestos 2 and Witbox 2.
    `ANET_FULL_GRAPHICS_LCD`|[Anet Full Graphics LCD](//www.anet3d.com/prod_view.aspx?TypeId=10&Id=178) for the Anet A3
  comment: |-
    Cartesio UI

    - <https://web.archive.org/web/20180605050442/mauk.cc/webshop/cartesio-shop/electronics/user-interface>
- name: LCD_FOR_MELZI
  file: Configuration.h
  type: switch
  disabled: true
  brief: LCD for Melzi Card with Graphical LCD.
  comment: LCD for Melzi Card with Graphical LCD
- name: ULTI_CONTROLLER
  file: Configuration.h
  type: switch
  disabled: true
  brief: Original Ulticontroller from Ultimaker 2 printer with SSD1309 I2C display and encoder
  comment: |-
    Original Ulticontroller from Ultimaker 2 printer with SSD1309 I2C display and encoder

    - <https://github.com/Ultimaker/Ultimaker2/tree/master/1249_Ulticontroller_Board_(x1)>
- name: MKS_MINI_12864
  file: Configuration.h
  type: switch
  disabled: true
  brief: MKS MINI12864 with graphic controller and SD support
  comment: |-
    MKS MINI12864 with graphic controller and SD support

    - <https://reprap.org/wiki/MKS_MINI_12864>
- name: MKS_MINI_12864_V3
  file: Configuration.h
  type: switch
  disabled: true
  brief: Alias for `FYSETC_MINI_12864_2_1`. Type A/B. NeoPixel RGB Backlight.
  comment: MKS MINI12864 V3 is an alias for `FYSETC_MINI_12864_2_1`. Type A/B. NeoPixel RGB Backlight.
- name: MKS_LCD12864A
  file: Configuration.h
  type: switch
  disabled: true
  brief: MKS LCD12864A with graphic controller and SD support. Follows `MKS_MINI_12864` pinout.
  comment: |-
    MKS LCD12864A/B with graphic controller and SD support. Follows `MKS_MINI_12864` pinout.

    - <https://www.aliexpress.com/item/33018110072.html>
- name: MKS_LCD12864B
  file: Configuration.h
  type: switch
  disabled: true
  brief: MKS LCD12864B with graphic controller and SD support. Follows `MKS_MINI_12864` pinout.
  shared_comment: |-
    MKS LCD12864A/B with graphic controller and SD support. Follows `MKS_MINI_12864` pinout.

    - <https://www.aliexpress.com/item/33018110072.html>
- name: FYSETC_MINI_12864_X_X
  file: Configuration.h
  type: switch
  disabled: true
  brief: FYSETC variant of the MINI12864 graphic controller with SD support. Type C/D/E/F. No tunable RGB Backlight by default.
  comment: |-
    FYSETC variant of the MINI12864 graphic controller with SD support

    - <https://wiki.fysetc.com/docs/Mini12864Panel>
- name: FYSETC_MINI_12864_1_2
  file: Configuration.h
  type: switch
  disabled: true
  brief: FYSETC variant of the MINI12864 graphic controller with SD support.
  comment: Type C/D/E/F. Simple RGB Backlight (always on)
- name: FYSETC_MINI_12864_2_*
  file: Configuration.h
  type: switch
  comment: Type A/B. Discreet RGB Backlight
  members:
  - id: '0'
    name: FYSETC_MINI_12864_2_0
    disabled: true
  - id: '1'
    name: FYSETC_MINI_12864_2_1
    disabled: true
- name: FYSETC_GENERIC_12864_1_1
  file: Configuration.h
  type: switch
  disabled: true
  brief: FYSETC variant of the MINI12864 graphic controller with SD support.
  comment: Larger display with basic ON/OFF backlight.
- name: BTT_MINI_12864
  file: Configuration.h
  type: switch
  disabled: true
  brief: Alias for `FYSETC_MINI_12864_2_1`. Type A/B. NeoPixel RGB Backlight.
  comment: |-
    BigTreeTech Mini 12864 V1.0 / V2.0 is an alias for `FYSETC_MINI_12864_2_1`. Type A/B. NeoPixel RGB Backlight.

    - <https://github.com/bigtreetech/MINI-12864>
- name: BEEZ_MINI_12864
  file: Configuration.h
  type: switch
  disabled: true
  brief: Alias for `FYSETC_MINI_12864_2_1`. Type A/B. NeoPixel RGB Backlight.
  comment: BEEZ MINI 12864 is an alias for `FYSETC_MINI_12864_2_1`. Type A/B. NeoPixel RGB Backlight.
- name: CR10_STOCKDISPLAY
  file: Configuration.h
  type: switch
  disabled: true
  brief: Factory display for Creality CR-10 / CR-7 / Ender-3. Connect to EXP1 on RAMPS and compatible boards.
  comment: |-
    Factory display for Creality CR-10 / CR-7 / Ender-3

    - <https://marlinfw.org/docs/hardware/controllers.html#cr10_stockdisplay>

    Connect to EXP1 on RAMPS and compatible boards.
- name: ENDER2_STOCKDISPLAY
  file: Configuration.h
  type: switch
  disabled: true
  brief: Ender-2 OEM display, a variant of the `MKS_MINI_12864`.
  comment: Ender-2 OEM display, a variant of the `MKS_MINI_12864`
- name: ANET_FULL_GRAPHICS_LCD
  file: Configuration.h
  type: switch
  disabled: true
  brief: ANET and Tronxy 128×64 Full Graphics Controller as used on Anet A6.
  comment: ANET and Tronxy 128×64 Full Graphics Controller as used on Anet A6
- name: CTC_A10S_A13
  file: Configuration.h
  type: switch
  disabled: true
  brief: GUCOCO CTC 128×64 Full Graphics Controller as used on GUCOCO CTC A10S.
  comment: GUCOCO CTC 128×64 Full Graphics Controller as used on GUCOCO CTC A10S
- name: AZSMZ_12864
  file: Configuration.h
  type: switch
  disabled: true
  brief: AZSMZ 12864 LCD with SD.
  comment: |-
    AZSMZ 12864 LCD with SD

    - <https://www.aliexpress.com/item/32837222770.html>
- name: SILVER_GATE_GLCD_CONTROLLER
  file: Configuration.h
  type: switch
  disabled: true
  brief: Silvergate GLCD controller.
  comment: |-
    Silvergate GLCD controller

    - <https://github.com/android444/Silvergate>
- name: EMOTION_TECH_LCD
  file: Configuration.h
  type: switch
  disabled: true
  brief: eMotion Tech LCD with SD.
  comment: |-
    eMotion Tech LCD with SD

    - <https://www.reprap-france.com/produit/1234568748-ecran-graphique-128-x-64-points-2-1>
- name: U8GLIB_SSD1306
  file: Configuration.h
  type: switch
  disabled: true
  brief: SSD1306 OLED full graphics generic display.
  long: |-
    These controllers all require the [LiquidCrystal_I2C library](//github.com/kiyoshigawa/LiquidCrystal_I2C).

    Option|Description
    ------|-----------
    `U8GLIB_SSD1306`|SSD1306 OLED full graphics generic display.
    `SAV_3DGLCD`|SAV OLED LCD module support using either SSD1306 or SH1106 based LCD modules.
    `OLED_PANEL_TINYBOY2`|TinyBoy2 128x64 OLED / Encoder Panel
  comment: SSD1306 OLED full graphics generic display
- name: SAV_3DGLCD
  file: Configuration.h
  type: switch
  disabled: true
  brief: SAV OLEd LCD module support using either SSD1306 or SH1106 based LCD modules.
  comment: SAV OLEd LCD module support using either SSD1306 or SH1106 based LCD modules
- name: U8GLIB_SH1106
  file: Configuration.h
  type: switch
  disabled: true
  requires: SAV_3DGLCD
- name: OLED_PANEL_TINYBOY2
  file: Configuration.h
  type: switch
  disabled: true
  brief: TinyBoy2 128x64 OLED / Encoder Panel.
  comment: TinyBoy2 128x64 OLED / Encoder Panel
- name: MKS_12864OLED
  file: Configuration.h
  type: switch
  disabled: true
  brief: MKS OLED 1.3" 128×64 Full Graphics Controller. Tiny, but very sharp OLED display using the SH1106 controller.
  comment: |-
    MKS OLED 1.3" 128×64 Full Graphics Controller

    - <https://reprap.org/wiki/MKS_12864OLED>

    Tiny, but very sharp OLED display
- name: MKS_12864OLED_SSD1306
  file: Configuration.h
  type: switch
  disabled: true
  brief: MKS OLED 1.3" 128×64 Full Graphics Controller. Tiny, but very sharp OLED display using the SSD1306 controller.
  comment: Uses the SSD1306 controller
- name: ZONESTAR_12864LCD
  file: Configuration.h
  type: switch
  disabled: true
  brief: Zonestar OLED 128×64 Full Graphics Controller. Graphical (DOGM) with ST7920 controller.
  comment: Zonestar OLED 128×64 Full Graphics Controller
- name: ZONESTAR_12864OLED
  file: Configuration.h
  type: switch
  disabled: true
  brief: Zonestar OLED 128×64 Full Graphics Controller. 1.3" OLED with SH1106 controller.
  comment: 1.3" OLED with SH1106 controller
- name: ZONESTAR_12864OLED_SSD1306
  file: Configuration.h
  type: switch
  disabled: true
  brief: Zonestar OLED 128×64 Full Graphics Controller. 0.96" OLED with SSD1306 controller.
  comment: 0.96" OLED with SSD1306 controller
- name: U8GLIB_SH1106_EINSTART
  file: Configuration.h
  type: switch
  disabled: true
  brief: Einstart S OLED SSD1306.
  comment: Einstart S OLED SSD1306
- name: OVERLORD_OLED
  file: Configuration.h
  type: switch
  disabled: true
  brief: Overlord OLED display/controller with i2c buzzer and LEDs.
  comment: Overlord OLED display/controller with i2c buzzer and LEDs
- name: FYSETC_242_OLED_12864
  file: Configuration.h
  type: switch
  disabled: true
  brief: FYSETC OLED 2.42" 128×64 Full Graphics Controller with WS2812 RGB.
  comment: 'FYSETC OLED 2.42" 128×64 Full Graphics Controller with WS2812 RGB Where to find : https://www.aliexpress.com/item/4000345255731.html'
- name: K3D_242_OLED_CONTROLLER
  file: Configuration.h
  type: switch
  disabled: true
  brief: K.3D SSD1309 OLED 2.42" 128×64 Full Graphics Controller.
  comment: K.3D SSD1309 OLED 2.42" 128×64 Full Graphics Controller
- name: DGUS_LCD_UI
  file: Configuration.h
  type: enum
  default: ORIGIN
  disabled: true
  brief: DGUS Touch Display with DWIN OS. Define UI to use with this display.
  comment: |-
    DGUS Touch Display with DWIN OS. (Choose one.)

    ORIGIN (Marlin DWIN_SET)

    - Download https://github.com/coldtobi/Marlin_DGUS_Resources
    - Copy the downloaded DWIN_SET folder to the SD card.
    - Product: https://www.aliexpress.com/item/32993409517.html

    FYSETC (Supplier default)

    - Download https://github.com/FYSETC/FYSTLCD-2.0
    - Copy the downloaded SCREEN folder to the SD card.
    - Product: https://www.aliexpress.com/item/32961471929.html

    HIPRECY (Supplier default)

    - Download https://github.com/HiPrecy/Touch-Lcd-LEO
    - Copy the downloaded DWIN_SET folder to the SD card.

    MKS (MKS-H43) (Supplier default)

    - Download https://github.com/makerbase-mks/MKS-H43
    - Copy the downloaded DWIN_SET folder to the SD card.
    - Product: https://www.aliexpress.com/item/1005002008179262.html

    RELOADED (T5UID1)

    - Download https://github.com/Neo2003/DGUS-reloaded/releases
    - Copy the downloaded DWIN_SET folder to the SD card.

    IA_CREALITY (T5UID1)

    - Download https://github.com/InsanityAutomation/Marlin/raw/CrealityDwin_2.0/TM3D_Combined480272_Landscape_V7.7z
    - Copy the downloaded DWIN_SET folder to the SD card.

    E3S1PRO (T5L)

    - Download https://github.com/CrealityOfficial/Ender-3S1/archive/3S1_Plus_Screen.zip
    - Copy the downloaded DWIN_SET folder to the SD card.

    CR10SPROV2 (T5UID1)

    - Stock Creality CR-10S Pro V2 screen. Uses the screen's factory DWIN_SET.

    SERMOON_D1 (T5L)

    - Download https://www.crealitycloud.com/downloads/firmware/sermoon-series/sermoon-d1
    - Copy the DWIN_SET folder from the firmware package to the SD card.

    Flash display with DGUS Displays for Marlin:

    - Format the SD card to FAT32 with an allocation size of 4kb.
    - Download files as specified for your type of display.
    - Plug the microSD card into the back of the display.
    - Boot the display and wait for the update to complete.
  options: dgus_lcd_ui
- name: USE_MKS_GREEN_UI
  file: Configuration.h
  type: switch
  requires: DGUS_UI_IS(MKS)
  options: dgus_lcd_ui
- name: LCD_SCREEN_ROTATE
  file: Configuration.h
  type: int
  default: 90
  disabled: true
  requires: DGUS_UI_IS(IA_CREALITY)
  block_clause: '!DGUS_UI_IS(MKS)'
  comment: Portrait Mode or 800x480 displays
  options: dgus_lcd_ui
- name: IA_CREALITY_BOOT_DELAY
  file: Configuration.h
  type: int
  default: 1500
  units: ms
  disabled: true
  requires: DGUS_UI_IS(IA_CREALITY)
  block_clause: '!DGUS_UI_IS(MKS)'
  options: dgus_lcd_ui
- name: MALYAN_LCD
  file: Configuration.h
  type: switch
  disabled: true
  brief: Malyan M200/M300 stock Color LCD with Big Clicky Buttons. **NOT A TOUCH SCREEN!**
  comment: LCD for Malyan M200/M300 printers
- name: TOUCH_UI_FTDI_EVE
  file: Configuration.h
  type: switch
  disabled: true
  brief: Touch UI for FTDI EVE (FT800/FT810) displays. See `Configuration_adv.h` for all configuration options.
  comment: |-
    Touch UI for FTDI EVE (FT800/FT810) displays

    See Configuration_adv.h for all configuration options.
- name: ANYCUBIC_LCD_CHIRON
  file: Configuration.h
  type: switch
  disabled: true
  brief: Touch-screen LCD for Anycubic Chiron.
  comment: Touch-screen LCD for Anycubic Chiron
- name: ANYCUBIC_LCD_I3MEGA
  file: Configuration.h
  type: switch
  disabled: true
  brief: Touch-screen LCD for Anycubic i3 Mega.
  comment: Touch-screen LCD for Anycubic i3 Mega
- name: ANYCUBIC_LCD_GCODE_EXT
  file: Configuration.h
  type: switch
  disabled: true
  requires: ANYCUBIC_LCD_I3MEGA
  brief: Add ".gcode" to menu entries for DGUS clone compatibility.
  comment: Add ".gcode" to menu entries for DGUS clone compatibility
- name: ANYCUBIC_LCD_VYPER
  file: Configuration.h
  type: switch
  disabled: true
  brief: Touch-screen LCD for Anycubic Vyper.
  comment: Touch-screen LCD for Anycubic Vyper
- name: ANYCUBIC_LCD_KOBRA
  file: Configuration.h
  type: switch
  disabled: true
  comment: Touch-screen LCD for Anycubic Kobra
- name: SOVOL_SV06_RTS
  file: Configuration.h
  type: switch
  disabled: true
  brief: Sovol SV-06 Resistive Touch Screen.
  comment: Sovol SV-06 Resistive Touch Screen
- name: NEXTION_TFT
  file: Configuration.h
  type: switch
  disabled: true
  brief: 320x240 Nextion 2.8" serial TFT Resistive Touch Screen NX3224T028.
  comment: 320x240 Nextion 2.8" serial TFT Resistive Touch Screen NX3224T028
- name: ELEGOO_NEPTUNE_3_TFT
  file: Configuration.h
  type: switch
  disabled: true
  comment: |-
    Elegoo Neptune 3 Pro / Plus / Max TJC Touch Screen

    Requires a 6x6 (Pro), 7x7 (Plus), or 7x9 (Max) bilinear leveling grid.
- name: EXTENSIBLE_UI
  file: Configuration.h
  type: switch
  disabled: true
  brief: Third-party or vendor-customized controller interfaces. Sources should be installed in 'src/lcd/extui'.
  comment: Third-party or vendor-customized controller interfaces. Sources should be installed in 'src/lcd/extui'.
- name: EXTUI_LOCAL_BEEPER
  file: Configuration.h
  type: switch
  disabled: true
  requires: EXTENSIBLE_UI
  brief: Use the local Beeper pin with an external display.
  comment: Enables use of local Beeper pin with external display
- name: MKS_TS35_V2_0
  file: Configuration.h
  type: switch
  disabled: true
  brief: 480x320, 3.5", SPI Display with Rotary Encoder from MKS. Usually paired with MKS Robin Nano V2 &amp; V3.
  comment: |-
    480x320, 3.5", SPI Display with Rotary Encoder from MKS

    Usually paired with MKS Robin Nano V2 & V3

    - <https://github.com/makerbase-mks/MKS-TFT-Hardware/tree/master/MKS%20TS35>
- name: MKS_TS24_R_V2_1
  file: Configuration.h
  type: switch
  disabled: true
  comment: MKS TS24-R V2.1 (2.4" 320x240 ST7789V) as shipped with the MKS DLC32
- name: MKS_ROBIN_TFT24
  file: Configuration.h
  type: switch
  disabled: true
  brief: 320x240, 2.4", FSMC Display From MKS. Usually paired with MKS Robin Nano V1.2.
  comment: |-
    320x240, 2.4", FSMC Display From MKS

    Usually paired with MKS Robin Nano V1.2
- name: MKS_ROBIN_TFT28
  file: Configuration.h
  type: switch
  disabled: true
  brief: 320x240, 2.8", FSMC Display From MKS. Usually paired with MKS Robin Nano V1.2.
  comment: |-
    320x240, 2.8", FSMC Display From MKS

    Usually paired with MKS Robin Nano V1.2
- name: MKS_ROBIN_TFT32
  file: Configuration.h
  type: switch
  disabled: true
  brief: 320x240, 3.2", FSMC Display From MKS. Usually paired with MKS Robin Nano V1.2.
  comment: |-
    320x240, 3.2", FSMC Display From MKS

    Usually paired with MKS Robin Nano V1.2
- name: MKS_ROBIN_TFT35
  file: Configuration.h
  type: switch
  disabled: true
  brief: 480x320, 3.5", FSMC Display From MKS. Usually paired with MKS Robin Nano V1.2.
  comment: |-
    480x320, 3.5", FSMC Display From MKS

    Usually paired with MKS Robin Nano V1.2
- name: MKS_ROBIN_TFT43
  file: Configuration.h
  type: switch
  disabled: true
  brief: 480x272, 4.3", FSMC Display From MKS.
  comment: 480x272, 4.3", FSMC Display From MKS
- name: MKS_ROBIN_TFT_V1_1R
  file: Configuration.h
  type: switch
  disabled: true
  brief: 320x240, 3.2", FSMC Display From MKS. Usually paired with MKS Robin.
  comment: |-
    320x240, 3.2", FSMC Display From MKS

    Usually paired with MKS Robin
- name: TFT_TRONXY_X5SA
  file: Configuration.h
  type: switch
  disabled: true
  brief: 480x320, 3.5", FSMC Stock Display from Tronxy.
  comment: 480x320, 3.5", FSMC Stock Display from Tronxy
- name: ANYCUBIC_TFT35
  file: Configuration.h
  type: switch
  disabled: true
  brief: 480x320, 3.5", FSMC Stock Display from AnyCubic.
  comment: 480x320, 3.5", FSMC Stock Display from AnyCubic
- name: LONGER_LK_TFT28
  file: Configuration.h
  type: switch
  disabled: true
  brief: 320x240, 2.8", FSMC Stock Display from Longer/Alfawise.
  comment: 320x240, 2.8", FSMC Stock Display from Longer/Alfawise
- name: ANET_ET4_TFT28
  file: Configuration.h
  type: switch
  disabled: true
  brief: 320x240, 2.8", FSMC Stock Display from ET4.
  comment: 320x240, 2.8", FSMC Stock Display from ET4
- name: ANET_ET5_TFT35
  file: Configuration.h
  type: switch
  disabled: true
  brief: 480x320, 3.5", FSMC Stock Display from ET5.
  comment: 480x320, 3.5", FSMC Stock Display from ET5
- name: BIQU_BX_TFT70
  file: Configuration.h
  type: switch
  disabled: true
  brief: 1024x600, 7", RGB Stock Display with Rotary Encoder from BIQU BX.
  comment: |-
    1024x600, 7", RGB Stock Display with Rotary Encoder from BIQU BX

    - <https://github.com/bigtreetech/BIQU-BX/tree/master/Hardware>
- name: BTT_TFT35_SPI_V1_0
  file: Configuration.h
  type: switch
  disabled: true
  brief: 480x320, 3.5", SPI Stock Display with Rotary Encoder from BIQU B1 SE Series.
  comment: |-
    480x320, 3.5", SPI Stock Display with Rotary Encoder from BIQU B1 SE Series

    - <https://github.com/bigtreetech/TFT35-SPI/tree/master/v1>
- name: PRUSA_MINI_LCD
  file: Configuration.h
  type: switch
  disabled: true
  comment: 240x320, 2.8", SPI Stock Display with Rotary Encoder from Prusa MINI
- name: TFT_GENERIC
  file: Configuration.h
  type: switch
  disabled: true
  brief: Generic TFT with detailed sub-options.
  comment: Generic TFT with detailed options
- name: TFT_DRIVER
  file: Configuration.h
  type: enum
  default: AUTO
  requires: TFT_GENERIC
- name: TFT_INTERFACE_FSMC
  file: Configuration.h
  type: switch
  disabled: true
  requires: TFT_GENERIC
  brief: Use the FSMC interface.
  comment: 'Interface. Enable one of the following options:'
- name: TFT_INTERFACE_SPI
  file: Configuration.h
  type: switch
  disabled: true
  requires: TFT_GENERIC
  brief: Use the SPI interface.
  shared_comment: 'Interface. Enable one of the following options:'
- name: TFT_RES_320x240
  file: Configuration.h
  type: switch
  disabled: true
  requires: TFT_GENERIC
  brief: Use TFT Resolution 320 x 240.
  comment: 'TFT Resolution. Enable one of the following options:'
- name: TFT_RES_480x272
  file: Configuration.h
  type: switch
  disabled: true
  requires: TFT_GENERIC
  brief: Use TFT Resolution 480 x 272.
  shared_comment: 'TFT Resolution. Enable one of the following options:'
- name: TFT_RES_480x320
  file: Configuration.h
  type: switch
  disabled: true
  requires: TFT_GENERIC
  brief: Use TFT Resolution 480 x 320.
  shared_comment: 'TFT Resolution. Enable one of the following options:'
- name: TFT_RES_1024x600
  file: Configuration.h
  type: switch
  disabled: true
  requires: TFT_GENERIC
  brief: Use TFT Resolution 1024 x 600.
  shared_comment: 'TFT Resolution. Enable one of the following options:'
- name: TFT_CLASSIC_UI
  file: Configuration.h
  type: switch
  disabled: true
  brief: TFT with emulated DOGM - 128x64 Upscaled.
  comment: |-
    TFT UI - User Interface Selection. Enable one of the following options:

    `TFT_CLASSIC_UI` - Emulated DOGM - 128x64 Upscaled

    `TFT_COLOR_UI`   - Marlin Default Menus, Touch Friendly, using full TFT capabilities `TFT_LVGL_UI`    - A Modern UI using LVGL

    For LVGL_UI also copy the 'assets' folder from the build directory to the root of your SD card, together with the compiled firmware.
- name: TFT_COLOR_UI
  file: Configuration.h
  type: switch
  disabled: true
  brief: TFT with Marlin Default Menus, Touch Friendly, using full TFT capabilities.
  shared_comment: |-
    TFT UI - User Interface Selection. Enable one of the following options:

    `TFT_CLASSIC_UI` - Emulated DOGM - 128x64 Upscaled

    `TFT_COLOR_UI`   - Marlin Default Menus, Touch Friendly, using full TFT capabilities `TFT_LVGL_UI`    - A Modern UI using LVGL

    For LVGL_UI also copy the 'assets' folder from the build directory to the root of your SD card, together with the compiled firmware.
- name: TFT_LVGL_UI
  file: Configuration.h
  type: switch
  disabled: true
  brief: TFT with a modern UI using LVGL.
  shared_comment: |-
    TFT UI - User Interface Selection. Enable one of the following options:

    `TFT_CLASSIC_UI` - Emulated DOGM - 128x64 Upscaled

    `TFT_COLOR_UI`   - Marlin Default Menus, Touch Friendly, using full TFT capabilities `TFT_LVGL_UI`    - A Modern UI using LVGL

    For LVGL_UI also copy the 'assets' folder from the build directory to the root of your SD card, together with the compiled firmware.
- name: TFT_FONT
  file: Configuration.h
  type: enum
  default: NOTOSANS
  requires: TFT_COLOR_UI
  brief: TFT Font for Color UI.
  comment: |-
    TFT Font for Color UI. Choose one of the following:

    NOTOSANS  - Default font with anti-aliasing. Supports Latin Extended and non-Latin characters. UNIFONT   - Lightweight font, no anti-aliasing. Supports Latin Extended and non-Latin characters. HELVETICA - Lightweight font, no anti-aliasing. Supports Basic Latin (0x0020-0x007F) and Latin-1 Supplement (0x0080-0x00FF) characters only.
  options: tft_font
- name: TFT_FONT_LARGE
  file: Configuration.h
  type: switch
  disabled: true
  requires: TFT_COLOR_UI
  comment: Use larger fonts for better visibility. (`TFT_RES_1024x600` with NOTOSANS or UNIFONT)
  options: tft_font
- name: TFT_NO_TINY_FONT
  file: Configuration.h
  type: switch
  disabled: true
  requires: TFT_COLOR_UI
  comment: Eschew the small numerical font used for meshes to recover Flash space.
  options: tft_font
- name: TFT_THEME
  file: Configuration.h
  type: enum
  default: BLACK_MARLIN
  requires: TFT_COLOR_UI
  brief: TFT Theme for Color UI. Choose one of the following or add a new one to 'Marlin/src/lcd/tft/themes' directory.
  comment: |-
    TFT Theme for Color UI. Choose one of the following or add a new one to 'Marlin/src/lcd/tft/themes' directory

    BLUE_MARLIN  - Default theme with 'midnight blue' background BLACK_MARLIN - Theme with 'black' background ANET_BLACK   - Theme used for Anet ET4/5
  options:
  - value: BLUE_MARLIN
  - value: BLACK_MARLIN
  - value: ANET_BLACK
- name: TFT_SHARED_IO
  file: Configuration.h
  type: switch
  disabled: true
  requires: TFT_COLOR_UI
  brief: I/O is shared between TFT display and other devices. Disable async data transfer.
  comment: I/O is shared between TFT display and other devices. Disable async data transfer.
- name: COMPACT_MARLIN_BOOT_LOGO
  file: Configuration.h
  type: switch
  requires: TFT_COLOR_UI
  brief: Use compressed data to save Flash space.
  comment: Use compressed data to save Flash space
- name: MKS_WIFI_MODULE
  file: Configuration.h
  type: switch
  disabled: true
  requires: TFT_LVGL_UI
  brief: Use the onboard MKS WiFi module.
  comment: MKS WiFi module
- name: TFT_ROTATION
  file: Configuration.h
  type: enum
  default: TFT_NO_ROTATION
  disabled: true
  brief: Set the TFT rotation angle. Only applies to some TFT displays.
  comment: |-
    TFT Rotation. Set to one of the following values:

    TFT_ROTATE_90,  TFT_ROTATE_90_MIRROR_X,  TFT_ROTATE_90_MIRROR_Y, TFT_ROTATE_180, TFT_ROTATE_180_MIRROR_X, TFT_ROTATE_180_MIRROR_Y, TFT_ROTATE_270, TFT_ROTATE_270_MIRROR_X, TFT_ROTATE_270_MIRROR_Y, TFT_MIRROR_X, TFT_MIRROR_Y, TFT_NO_ROTATION
  options:
  - value: TFT_NO_ROTATION
  - value: None
  - value: TFT_ROTATE_90
  - value: 90°
  - value: TFT_ROTATE_90_MIRROR_X
  - value: 90° (Mirror X)
  - value: TFT_ROTATE_90_MIRROR_Y
  - value: 90° (Mirror Y)
  - value: TFT_ROTATE_180
  - value: 180°
  - value: TFT_ROTATE_180_MIRROR_X
  - value: 180° (Mirror X)
  - value: TFT_ROTATE_180_MIRROR_Y
  - value: 180° (Mirror Y)
  - value: TFT_ROTATE_270
  - value: 270°
  - value: TFT_ROTATE_270_MIRROR_X
  - value: 270° (Mirror X)
  - value: TFT_ROTATE_270_MIRROR_Y
  - value: 270° (Mirror Y)
  - value: TFT_MIRROR_X
  - value: Mirror X
  - value: TFT_MIRROR_Y
  - value: Mirror Y
- name: DWIN_CREALITY_LCD
  file: Configuration.h
  type: switch
  disabled: true
  since: 2.0.8
  brief: The Ender-3 V2 display with Creality UI. Requires Marlin supplied DWIN_SET.
  comment: Ender-3 v2 OEM display. A DWIN display with Rotary Encoder.
- name: DWIN_LCD_PROUI
  file: Configuration.h
  type: switch
  disabled: true
  since: 2.1.0
  brief: The Ender-3 V2 display with Pro UI by MRISCOC. Requires Marlin supplied DWIN_SET.
  comment: Pro UI by MRiscoC
- name: DWIN_CREALITY_LCD_JYERSUI
  file: Configuration.h
  type: switch
  disabled: true
  since: 2.0.8
  brief: The Ender-3 V2 display with Jyers UI. Requires Marlin supplied DWIN_SET.
  comment: Jyers UI by Jacob Myers
- name: DWIN_MARLINUI_PORTRAIT
  file: Configuration.h
  type: switch
  disabled: true
  since: 2.0.9
  brief: The Ender-3 V2 display with Marlin UI in portrait (tall) orientation. Requires Marlin supplied DWIN_SET.
  comment: MarlinUI (portrait orientation)
- name: DWIN_MARLINUI_LANDSCAPE
  file: Configuration.h
  type: switch
  disabled: true
  since: 2.0.9
  brief: The Ender-3 V2 display with Marlin UI in landscape (wide) orientation. Requires Marlin supplied DWIN_SET.
  comment: MarlinUI (landscape orientation)
- name: USE_STRING_HEADINGS
  file: Configuration.h
  type: switch
  disabled: true
  requires: DWIN_CREALITY_LCD
  comment: Use string headings for Creality UI instead of images
- name: USE_STRING_TITLES
  file: Configuration.h
  type: switch
  disabled: true
  requires: DWIN_CREALITY_LCD
  comment: Use string titles for Creality UI instead of images
- name: TOUCH_SCREEN
  file: Configuration.h
  type: switch
  disabled: true
  brief: Enable touch interface processing for displays that support it.
  comment: Touch Screen Settings
- name: BUTTON_DELAY_EDIT
  file: Configuration.h
  type: int
  default: 50
  units: ms
  requires: TOUCH_SCREEN
  brief: Button repeat delay for edit screens.
  comment: (ms) Button repeat delay for edit screens
  example:
  - value: 50
- name: BUTTON_DELAY_MENU
  file: Configuration.h
  type: int
  default: 250
  units: ms
  requires: TOUCH_SCREEN
  brief: Button repeat delay for menus.
  comment: (ms) Button repeat delay for menus
  example:
  - value: 250
- name: NO_BACK_MENU_ITEM
  file: Configuration.h
  type: switch
  disabled: true
  requires: TOUCH_SCREEN && ANY(TFT_CLASSIC_UI, TFT_COLOR_UI)
  brief: Don't display a top menu item to go back to the parent menu.
  comment: Don't display a top menu item to go back to the parent menu
- name: TOUCH_SCREEN_CALIBRATION
  file: Configuration.h
  type: switch
  requires: TOUCH_SCREEN
  brief: Provide a utility screen to recalibrate screen touch.
- name: TOUCH_CALIBRATION_*
  file: Configuration.h
  type: int
  requires: TOUCH_SCREEN
  members:
  - id: X
    name: TOUCH_CALIBRATION_X
    default: 12316
    disabled: true
  - id: Y
    name: TOUCH_CALIBRATION_Y
    default: -8981
    disabled: true
- name: TOUCH_OFFSET_*
  file: Configuration.h
  type: int
  requires: TOUCH_SCREEN
  members:
  - id: X
    name: TOUCH_OFFSET_X
    default: -43
    disabled: true
  - id: Y
    name: TOUCH_OFFSET_Y
    default: 257
    disabled: true
- name: TOUCH_ORIENTATION
  file: Configuration.h
  type: enum
  default: TOUCH_LANDSCAPE
  disabled: true
  requires: TOUCH_SCREEN
- name: TOUCH_CALIBRATION_AUTO_SAVE
  file: Configuration.h
  type: switch
  requires: TOUCH_SCREEN && ALL(TOUCH_SCREEN_CALIBRATION, EEPROM_SETTINGS)
  comment: Auto save successful calibration values to EEPROM
- name: SINGLE_TOUCH_NAVIGATION
  file: Configuration.h
  type: switch
  disabled: true
  requires: TOUCH_SCREEN && TFT_COLOR_UI
- name: REPRAPWORLD_KEYPAD
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    Option|Description
    ------|-----------
    `REPRAPWORLD_KEYPAD`|[RepRapWorld Keypad v1.1](//reprapworld.com/?products_details&products_id=202&cPath=1591_1626) Use `REPRAPWORLD_KEYPAD_MOVE_STEP` to set how much the robot should move on each keypress (e.g., 10mm per click).
  comment: |-
    RepRapWorld `REPRAPWORLD_KEYPAD` v1.1

    - <https://reprapworld.com/products/electronics/ramps/keypad_v1_0_fully_assembled/>
- name: REPRAPWORLD_KEYPAD_MOVE_STEP
  file: Configuration.h
  type: float
  default: 10.0
  units: mm
  disabled: true
  requires: REPRAPWORLD_KEYPAD
  comment: (mm) Distance to move per key-press
- name: EASYTHREED_UI
  file: Configuration.h
  type: switch
  disabled: true
  brief: EasyThreeD ET-4000+ with button input and status LED.
  comment: EasyThreeD ET-4000+ with button input and status LED
- name: DISABLE_REDUCED_ACCURACY_WARNING
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Enable this option to suppress the warning given in cases when reduced accuracy is likely to occur.
  comment: Turn off the display blinking that warns about possible accuracy reduction
- name: MANUAL_FEEDRATE
  file: Configuration_adv.h
  type: int[]
  default: '{ 50*60, 50*60, 4*60, 2*60 }'
  units: mm/min
  requires: HAS_MANUAL_MOVE_MENU
  comment: (mm/min) Feedrates for manual moves along X, Y, Z, E from panel
- name: FINE_MANUAL_MOVE
  file: Configuration_adv.h
  type: float
  default: 0.025
  units: mm
  requires: HAS_MANUAL_MOVE_MENU
  comment: (mm) Smallest manual move (&lt; 0.1mm) applying to Z on most machines
- name: MANUAL_E_MOVES_RELATIVE
  file: Configuration_adv.h
  type: switch
  requires: HAS_MANUAL_MOVE_MENU && IS_ULTIPANEL
  comment: Display extruder move distance rather than "position"
- name: ULTIPANEL_FEEDMULTIPLY
  file: Configuration_adv.h
  type: switch
  requires: HAS_MANUAL_MOVE_MENU && IS_ULTIPANEL
  comment: Encoder sets the feedrate multiplier on the Status Screen
- name: ULTIPANEL_FLOWPERCENT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MANUAL_MOVE_MENU && IS_ULTIPANEL
  comment: Encoder sets the flow percentage on the Status Screen
- name: ENCODER_RATE_MULTIPLIER
  file: Configuration_adv.h
  type: switch
  comment: Change values more rapidly when the encoder is rotated faster
- name: ENCODER_10X_STEPS_PER_SEC
  file: Configuration_adv.h
  type: int
  default: 30
  units: steps/s
  requires: ENCODER_RATE_MULTIPLIER
  comment: (steps/s) Encoder rate for 10x speed
- name: ENCODER_100X_STEPS_PER_SEC
  file: Configuration_adv.h
  type: int
  default: 80
  units: steps/s
  requires: ENCODER_RATE_MULTIPLIER
  comment: (steps/s) Encoder rate for 100x speed
- name: BEEP_ON_FEEDRATE_CHANGE
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Play a beep when the feedrate is changed from the Status Screen
- name: FEEDRATE_CHANGE_BEEP_DURATION
  file: Configuration_adv.h
  type: int
  default: 10
  requires: BEEP_ON_FEEDRATE_CHANGE
- name: FEEDRATE_CHANGE_BEEP_FREQUENCY
  file: Configuration_adv.h
  type: int
  default: 440
  requires: BEEP_ON_FEEDRATE_CHANGE
- name: PROBE_DEPLOY_STOW_MENU
  file: Configuration_adv.h
  type: switch
  requires: HAS_BED_PROBE && HAS_MARLINUI_MENU
  comment: Show Deploy / Stow Probe options in the Motion menu.
- name: PROBE_OFFSET_WIZARD
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_BED_PROBE && ANY(HAS_MARLINUI_MENU, HAS_TFT_LVGL_UI)
  comment: |-
    Probe Offset Wizard

    Add a Probe Z Offset calibration option to the LCD menu. Use this helper to get a perfect 'M851 Z' probe offset. When launched this powerful wizard:

    - Measures the bed height at the configured position with the probe.
    - Moves the nozzle to the same position for a "paper" measurement.
    - The difference is used to set the probe Z offset.
- name: PROBE_OFFSET_WIZARD_START_Z
  file: Configuration_adv.h
  type: float
  default: -4.0
  disabled: true
  requires: HAS_BED_PROBE && ANY(HAS_MARLINUI_MENU, HAS_TFT_LVGL_UI) && PROBE_OFFSET_WIZARD
  comment: Enable to init the Probe Z-Offset when starting the Wizard. Use a height slightly above the estimated nozzle-to-probe Z offset. For example, with an offset of -5, consider a starting height of -4.
- name: PROBE_OFFSET_WIZARD_XY_POS
  file: Configuration_adv.h
  type: array
  default: '{ X_CENTER, Y_CENTER }'
  disabled: true
  requires: HAS_BED_PROBE && ANY(HAS_MARLINUI_MENU, HAS_TFT_LVGL_UI) && PROBE_OFFSET_WIZARD
  comment: Set a convenient position to do the calibration (probing point and nozzle/bed-distance)
- name: X_AXIS_TWIST_COMPENSATION
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_BED_PROBE
  comment: |-
    - `M423` X-Axis Twist Compensation

    If probing with an off-center probe produces an unreliable mesh, it may be a twisted X axis. Use this feature to measure and compensate.
- name: XATC_MAX_POINTS
  file: Configuration_adv.h
  type: int
  default: 3
  requires: HAS_BED_PROBE && X_AXIS_TWIST_COMPENSATION
  comment: Number of points to probe in the wizard
- name: XATC_Z_OFFSETS
  file: Configuration_adv.h
  type: int[]
  default: '{ 0, 0, 0 }'
  requires: HAS_BED_PROBE && X_AXIS_TWIST_COMPENSATION
  comment: Z offsets for X axis sample points
- name: XATC_START_Z
  file: Configuration_adv.h
  type: float
  default: 0.0
  requires: HAS_BED_PROBE && X_AXIS_TWIST_COMPENSATION && HAS_MARLINUI_MENU
  comment: Set non-zero to init the Probe Z-Offset when starting the Wizard. Use an offset slightly higher than the estimated nozzle-to-probe Z offset. For example, with an offset of -5, consider a starting offset of -4.
- name: XATC_Y_POSITION
  file: Configuration_adv.h
  type: enum
  default: Y_CENTER
  units: mm
  requires: HAS_BED_PROBE && X_AXIS_TWIST_COMPENSATION && HAS_MARLINUI_MENU
  comment: (mm) Y position to probe
- name: LCD_INFO_MENU
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_MENU
  comment: Include a page of printer information in the LCD Main Menu
- name: LCD_PRINTER_INFO_IS_BOOTSCREEN
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_MENU && LCD_INFO_MENU
  comment: Show bootscreen(s) instead of Printer Info pages
- name: BUILD_INFO_MENU_ITEM
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_MENU && LCD_INFO_MENU
  comment: Add a menu item to display the build date and time
- name: MANUAL_MOVE_DISTANCE_MM
  file: Configuration_adv.h
  default: 10, 1.0, 0.1
  units: mm
  requires: HAS_MARLINUI_MENU
  comment: MarlinUI "Move Axis" menu distances. Comma-separated list. Values are displayed as-defined, so always use plain numbers here. Axis moves &lt;= 1/2 the axis length and Extruder moves &lt;= `EXTRUDE_MAXLENGTH` will be shown in the move submenus.
- name: MANUAL_MOVE_DISTANCE_IN
  file: Configuration_adv.h
  type: floats
  default: 0.100, 0.010, 0.001
  units: in
  requires: HAS_MARLINUI_MENU
  comment: Manual move distances for `INCH_MODE_SUPPORT`
- name: MANUAL_MOVE_DISTANCE_DEG
  file: Configuration_adv.h
  default: 90, 45, 22.5, 5, 1
  units: °
  requires: HAS_MARLINUI_MENU
  comment: Manual move distances for rotational axes
- name: TURBO_BACK_MENU_ITEM
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_MENU
  comment: BACK menu items keep the highlight at the top
- name: GENERIC_BACK_MENU_ITEM
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_MENU
  comment: BACK menu items show "Back" instead of the previous menu name
- name: PREHEAT_SHORTCUT_MENU_ITEM
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_MENU
  comment: Insert a menu for preheating at the top level to allow for quick access
- name: LCD_ENDSTOP_TEST
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_MENU
  comment: Add Configuration &gt; Debug Menu &gt; Endstop Test for endstop/probe/runout testing
- name: SHOW_BOOTSCREEN
  file: Configuration_adv.h
  type: switch
  requires: HAS_DISPLAY
  comment: |-
    *** VENDORS PLEASE READ ***

    Marlin allows you to add a custom boot image for Graphical LCDs. With this option Marlin will first show your custom screen followed by the standard Marlin logo with version number and web URL.

    We encourage you to take advantage of this new feature and we also respectfully request that you retain the unmodified Marlin boot screen.
- name: BOOTSCREEN_TIMEOUT
  file: Configuration_adv.h
  type: int
  default: 3000
  units: ms
  requires: HAS_DISPLAY && SHOW_BOOTSCREEN
  long: See `Configuration_adv.h` for further information.
  comment: (ms) Total Duration to display the boot screen(s)
- name: BOOT_MARLIN_LOGO_SMALL
  file: Configuration_adv.h
  type: switch
  requires: HAS_DISPLAY && SHOW_BOOTSCREEN && ANY(HAS_MARLINUI_U8GLIB, TFT_COLOR_UI)
  comment: Show a smaller Marlin logo on the Boot Screen (saving lots of flash)
- name: BOOT_MARLIN_LOGO_ANIMATED
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY && SHOW_BOOTSCREEN && HAS_MARLINUI_U8GLIB
  comment: Animated Marlin logo. Costs ~3260 (or ~940) bytes of flash.
- name: SHOW_CUSTOM_BOOTSCREEN
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY && SHOW_BOOTSCREEN && ANY(HAS_MARLINUI_U8GLIB, TOUCH_UI_FTDI_EVE, HAS_MARLINUI_HD44780, HAS_GRAPHICAL_TFT)
  comment: Show the bitmap in Marlin/_Bootscreen.h on startup.
- name: CUSTOM_STATUS_SCREEN_IMAGE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY && HAS_MARLINUI_U8GLIB
  comment: Show the bitmap in Marlin/_Statusscreen.h on the status screen.
- name: SOUND_MENU_ITEM
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY
  comment: Add a mute option to the LCD menu
- name: SOUND_ON_DEFAULT
  file: Configuration_adv.h
  type: switch
  requires: HAS_DISPLAY
  comment: Buzzer/speaker default enabled state
- name: LCD_DOUBLE_BUFFER
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY && U8GLIB_SSD1309
  comment: Optimize display updates. Costs ~1K of SRAM.
- name: DOUBLE_LCD_FRAMERATE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY && HAS_WIRED_LCD
  comment: Not recommended for slow boards.
- name: LCD_TIMEOUT_TO_STATUS
  file: Configuration_adv.h
  type: int
  default: 15000
  units: ms
  disabled: true
  requires: HAS_DISPLAY
  comment: The timeout to return to the status screen from sub-menus
- name: STATUS_MESSAGE_SCROLLING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY
  comment: Scroll a longer status message into view
- name: STATUS_MESSAGE_TIMEOUT_SEC
  file: Configuration_adv.h
  type: int
  default: 30
  units: seconds
  disabled: true
  requires: HAS_DISPLAY
  comment: Apply a timeout to low-priority status messages
- name: LCD_DECIMAL_SMALL_XY
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY
  comment: On the Info Screen, display XY with one decimal place when possible
- name: LCD_SHOW_E_TOTAL
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY
  long: Show the total filament used amount during printing.
  comment: Show the E position (filament used) during printing
- name: SHOW_TEMPERATURE_BELOW_ZERO
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY
  comment: Display a negative temperature instead of "err"
- name: LED_CONTROL_MENU
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY
  comment: |-
    LED Control Menu

    Add LED Control to the LCD menu
- name: LED_COLOR_PRESETS
  file: Configuration_adv.h
  type: switch
  requires: HAS_DISPLAY && LED_CONTROL_MENU
  comment: Enable the Preset Color menu option
- name: NEO2_COLOR_PRESETS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY && LED_CONTROL_MENU
  comment: Enable a second NeoPixel Preset Color menu option
- name: LED_USER_PRESET_RED
  file: Configuration_adv.h
  type: int
  default: 255
  requires: HAS_DISPLAY && LED_CONTROL_MENU && LED_COLOR_PRESETS
  comment: User defined RED value
- name: LED_USER_PRESET_GREEN
  file: Configuration_adv.h
  type: int
  default: 128
  requires: HAS_DISPLAY && LED_CONTROL_MENU && LED_COLOR_PRESETS
  comment: User defined GREEN value
- name: LED_USER_PRESET_BLUE
  file: Configuration_adv.h
  type: int
  default: 0
  requires: HAS_DISPLAY && LED_CONTROL_MENU && LED_COLOR_PRESETS
  comment: User defined BLUE value
- name: LED_USER_PRESET_WHITE
  file: Configuration_adv.h
  type: int
  default: 255
  requires: HAS_DISPLAY && LED_CONTROL_MENU && LED_COLOR_PRESETS
  comment: User defined WHITE value
- name: LED_USER_PRESET_BRIGHTNESS
  file: Configuration_adv.h
  type: int
  default: 255
  requires: HAS_DISPLAY && LED_CONTROL_MENU && LED_COLOR_PRESETS
  comment: User defined intensity
- name: LED_USER_PRESET_STARTUP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY && LED_CONTROL_MENU && LED_COLOR_PRESETS
  comment: Have the printer display the user preset color on startup
- name: NEO2_USER_PRESET_RED
  file: Configuration_adv.h
  type: int
  default: 255
  requires: HAS_DISPLAY && LED_CONTROL_MENU && NEO2_COLOR_PRESETS
  comment: User defined RED value
- name: NEO2_USER_PRESET_GREEN
  file: Configuration_adv.h
  type: int
  default: 128
  requires: HAS_DISPLAY && LED_CONTROL_MENU && NEO2_COLOR_PRESETS
  comment: User defined GREEN value
- name: NEO2_USER_PRESET_BLUE
  file: Configuration_adv.h
  type: int
  default: 0
  requires: HAS_DISPLAY && LED_CONTROL_MENU && NEO2_COLOR_PRESETS
  comment: User defined BLUE value
- name: NEO2_USER_PRESET_WHITE
  file: Configuration_adv.h
  type: int
  default: 255
  requires: HAS_DISPLAY && LED_CONTROL_MENU && NEO2_COLOR_PRESETS
  comment: User defined WHITE value
- name: NEO2_USER_PRESET_BRIGHTNESS
  file: Configuration_adv.h
  type: int
  default: 255
  requires: HAS_DISPLAY && LED_CONTROL_MENU && NEO2_COLOR_PRESETS
  comment: User defined intensity
- name: NEO2_USER_PRESET_STARTUP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY && LED_CONTROL_MENU && NEO2_COLOR_PRESETS
  comment: Have the printer display the user preset color on startup for the second strip
- name: SPEED_EDIT_*
  file: Configuration_adv.h
  type: int
  units: '%'
  requires: ANY(HAS_MARLINUI_MENU, DWIN_CREALITY_LCD, DWIN_LCD_PROUI, MALYAN_LCD, TOUCH_SCREEN, ULTIPANEL_FEEDMULTIPLY)
  comment: Some displays offer Feedrate / Flow editing.
  members:
  - id: MIN
    name: SPEED_EDIT_MIN
    default: 10
  - id: MAX
    name: SPEED_EDIT_MAX
    default: 999
- name: FLOW_EDIT_*
  file: Configuration_adv.h
  type: int
  units: '%'
  requires: ANY(HAS_MARLINUI_MENU, DWIN_CREALITY_LCD, DWIN_LCD_PROUI, MALYAN_LCD, TOUCH_SCREEN)
  comment: (%) Flow percentage edit range minimum
  members:
  - id: MIN
    name: FLOW_EDIT_MIN
    default: 10
  - id: MAX
    name: FLOW_EDIT_MAX
    default: 999
- name: SET_PROGRESS_MANUALLY
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Add an [`M73`](/docs/gcode/M073.html) G-code to set the current percentage.
  comment: Add 'M73' to set print job progress, overrides Marlin's built-in estimate
- name: SET_PROGRESS_PERCENT
  file: Configuration_adv.h
  type: switch
  requires: SET_PROGRESS_MANUALLY
  comment: Add 'P' parameter to set percentage done
- name: SET_REMAINING_TIME
  file: Configuration_adv.h
  type: switch
  requires: SET_PROGRESS_MANUALLY
  comment: Add 'R' parameter to set remaining time
- name: SET_INTERACTION_TIME
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: SET_PROGRESS_MANUALLY
  comment: Add 'C' parameter to set time until next filament change or other user interaction
- name: M73_REPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: SET_PROGRESS_MANUALLY
  comment: Report M73 values to host
- name: M73_REPORT_SD_ONLY
  file: Configuration_adv.h
  type: switch
  requires: SET_PROGRESS_MANUALLY && ALL(M73_REPORT, HAS_MEDIA)
  comment: Report only when printing from SD
- name: SHOW_PROGRESS_PERCENT
  file: Configuration_adv.h
  type: switch
  requires: HAS_DISPLAY && ANY(HAS_MEDIA, SET_PROGRESS_MANUALLY)
  long: |-
    Use the optimizations here to improve printing performance, which can be adversely affected by graphical display drawing, especially when doing several short moves, and when printing on DELTA and SCARA machines.

    Some of these options may result in the display lagging behind controller events, as there is a trade-off between reliable printing performance versus fast display updates.
  comment: LCD Print Progress options. Multiple times may be displayed in turn.
- name: SHOW_ELAPSED_TIME
  file: Configuration_adv.h
  type: switch
  requires: HAS_DISPLAY && ANY(HAS_MEDIA, SET_PROGRESS_MANUALLY)
  comment: Display elapsed printing time (prefix 'E')
- name: SHOW_REMAINING_TIME
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY && ANY(HAS_MEDIA, SET_PROGRESS_MANUALLY)
  comment: Display estimated time to completion (prefix 'R')
- name: SHOW_INTERACTION_TIME
  file: Configuration_adv.h
  type: switch
  requires: HAS_DISPLAY && ANY(HAS_MEDIA, SET_PROGRESS_MANUALLY) && SET_INTERACTION_TIME
  comment: Display time until next user interaction ('C' = filament change)
- name: PRINT_PROGRESS_SHOW_DECIMALS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY && ANY(HAS_MEDIA, SET_PROGRESS_MANUALLY)
  comment: Show/report progress with decimal digits, not all UIs support this
- name: LCD_PROGRESS_BAR
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY && ANY(HAS_MEDIA, SET_PROGRESS_MANUALLY) && ANY(HAS_MARLINUI_HD44780, IS_TFTGLCD_PANEL)
  long: Show a progress bar on HD44780 LCDs for SD printing. Sub-options determine how long to show the progress bar and status message, how long to retain the status message, and whether to include a progress bar test in the Debug menu.
  comment: Show a progress bar on HD44780 LCDs for SD printing
- name: PROGRESS_BAR_BAR_TIME
  file: Configuration_adv.h
  type: int
  default: 2000
  units: ms
  requires: HAS_DISPLAY && ANY(HAS_MEDIA, SET_PROGRESS_MANUALLY) && ANY(HAS_MARLINUI_HD44780, IS_TFTGLCD_PANEL) && LCD_PROGRESS_BAR
  comment: (ms) Amount of time to show the bar
- name: PROGRESS_BAR_MSG_TIME
  file: Configuration_adv.h
  type: int
  default: 3000
  units: ms
  requires: HAS_DISPLAY && ANY(HAS_MEDIA, SET_PROGRESS_MANUALLY) && ANY(HAS_MARLINUI_HD44780, IS_TFTGLCD_PANEL) && LCD_PROGRESS_BAR
  comment: (ms) Amount of time to show the status message
- name: PROGRESS_MSG_EXPIRE
  file: Configuration_adv.h
  type: int
  default: 0
  units: ms
  requires: HAS_DISPLAY && ANY(HAS_MEDIA, SET_PROGRESS_MANUALLY) && ANY(HAS_MARLINUI_HD44780, IS_TFTGLCD_PANEL) && LCD_PROGRESS_BAR
  comment: (ms) Amount of time to retain the status message (0=forever)
- name: PROGRESS_MSG_ONCE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY && ANY(HAS_MEDIA, SET_PROGRESS_MANUALLY) && ANY(HAS_MARLINUI_HD44780, IS_TFTGLCD_PANEL) && LCD_PROGRESS_BAR
  comment: Show the message for MSG_TIME then clear it
- name: LCD_PROGRESS_BAR_TEST
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DISPLAY && ANY(HAS_MEDIA, SET_PROGRESS_MANUALLY) && ANY(HAS_MARLINUI_HD44780, IS_TFTGLCD_PANEL) && LCD_PROGRESS_BAR
  comment: Add a menu item to test the progress bar
- name: SD_SPI_SPEED
  file: Configuration_adv.h
  type: enum
  default: SPI_HALF_SPEED
  disabled: true
  requires: HAS_MEDIA
  long: |-
    Uncomment to enable and set ONE of these options to use a slower SPI transfer speed, otherwise full speed will be applied:
    - `SPI_HALF_SPEED`
    - `SPI_QUARTER_SPEED`
    - `SPI_EIGHTH_SPEED`
    This is usually required if you're getting volume init errors.
  comment: |-
    SD Card SPI Speed

    May be required to resolve "volume init" errors.

    Enable and set to SPI_HALF_SPEED, SPI_QUARTER_SPEED, or SPI_EIGHTH_SPEED otherwise full speed will be applied.
  options:
  - value: SPI_HALF_SPEED
  - value: SPI_QUARTER_SPEED
  - value: SPI_EIGHTH_SPEED
- name: REINIT_NOISY_LCD
  file: Configuration_adv.h
  type: switch
  requires: HAS_MEDIA
  comment: Reinit the LCD after SD Card insert/remove or when entering the menu. Required for some LCDs that use shared SPI with an external SD Card reader.
- name: SD_DETECT_STATE
  file: Configuration_adv.h
  type: state
  default: HIGH
  disabled: true
  requires: HAS_MEDIA
  long: See `Configuration_adv.h` for more details.
  comment: The standard SD detect circuit reads LOW when media is inserted and HIGH when empty. Enable this option and set to HIGH if your SD cards are incorrectly detected.
- name: SD_IGNORE_AT_STARTUP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Don't mount the SD card when starting up
- name: SDCARD_READONLY
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Read-only SD card (to save over 2K of flash)
- name: GCODE_REPEAT_MARKERS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Enable G-code M808 to set repeat markers and do looping
- name: SD_PROCEDURE_DEPTH
  file: Configuration_adv.h
  type: int
  default: 1
  requires: HAS_MEDIA
  comment: Increase if you need more nested M32 calls
- name: SD_FINISHED_STEPPERRELEASE
  file: Configuration_adv.h
  type: bool
  default: true
  requires: HAS_MEDIA
  comment: Disable steppers when SD Print is finished
- name: SD_FINISHED_RELEASECOMMAND
  file: Configuration_adv.h
  type: string
  default: '"M84"'
  requires: HAS_MEDIA
  comment: Use "M84XYE" to keep Z enabled so your bed stays in place
- name: SDCARD_RATHERRECENTFIRST
  file: Configuration_adv.h
  type: switch
  requires: HAS_MEDIA
  comment: Reverse SD sort to show "more recent" files first, according to the card's FAT. Since the FAT gets out of order with usage, `SDCARD_SORT_ALPHA` is recommended.
- name: SD_MENU_CONFIRM_START
  file: Configuration_adv.h
  type: switch
  requires: HAS_MEDIA
  comment: Confirm the selected SD file before printing
- name: NO_SD_AUTOSTART
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Remove auto#.g file support completely to save some Flash, SRAM
- name: MENU_ADDAUTOSTART
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Add a menu option to run auto#.g files
- name: ONE_CLICK_PRINT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Prompt to print the newest file on inserted media
- name: BROWSE_MEDIA_ON_INSERT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Open the file browser when media is inserted
- name: MEDIA_MENU_AT_TOP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Force the media menu to be listed on the top of the main menu
- name: EVENT_GCODE_SD_ABORT
  file: Configuration_adv.h
  type: string
  default: '"G28XY"'
  requires: HAS_MEDIA
  comment: G-code to run on SD Abort Print (e.g., "G28XY" or "G27")
- name: PE_LEDS_COMPLETED_TIME
  file: Configuration_adv.h
  default: (30*60)
  units: seconds
  requires: HAS_MEDIA && PRINTER_EVENT_LEDS
  comment: (seconds) Time to keep the LED "done" color before restoring normal illumination
- name: REMAINING_TIME_PRIME
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: |-
    Priming for the Remaining Time estimate

    Long processes at the start of a G-code file can skew the Remaining Time estimate. Enable these options to start this estimation at a later point in the G-code file.
- name: REMAINING_TIME_AUTOPRIME
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Prime the Remaining Time estimate later (e.g., at the end of 'M109')
- name: POWER_LOSS_RECOVERY
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  long: See `Configuration_adv.h` for more details.
  comment: |-
    Continue after Power-Loss (Creality3D)

    Store the current state to the SD Card at the start of each layer during SD printing. If the recovery file is found at boot time, present an option on the LCD screen to continue the print from the last-known point in the file.
- name: PLR_ENABLED_DEFAULT
  file: Configuration_adv.h
  type: bool
  default: false
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY
  comment: Power-Loss Recovery enabled by default. (Set with 'M413 Sn' & M500)
- name: PLR_HEAT_BED_ON_REBOOT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY
  comment: Heat up bed immediately on reboot to mitigate object detaching/warping.
- name: PLR_HEAT_BED_EXTRA
  file: Configuration_adv.h
  type: int
  default: 0
  units: °C
  disabled: true
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY
  comment: (°C) Relative increase of bed temperature for better adhesion (limited by max temp).
- name: PLR_BED_THRESHOLD
  file: Configuration_adv.h
  type: enum
  default: BED_MAXTEMP
  units: °C
  disabled: true
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY
  comment: (°C) Skip user confirmation at or above this bed temperature (0 to disable)
- name: POWER_LOSS_PIN
  file: Configuration_adv.h
  type: int
  default: 44
  disabled: true
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY
  comment: Pin to detect power-loss. Set to -1 to disable default pin on boards without module, or comment to use board default.
- name: POWER_LOSS_STATE
  file: Configuration_adv.h
  type: state
  default: HIGH
  disabled: true
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY
  comment: State of pin indicating power-loss
- name: POWER_LOSS_PULLUP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY
  comment: Set pullup / pulldown as appropriate for your sensor
- name: POWER_LOSS_PULLDOWN
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY
- name: POWER_LOSS_ZRAISE
  file: Configuration_adv.h
  type: int
  default: 2
  units: mm
  disabled: true
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY
  comment: (mm) Z axis raise on resume (on power-loss with UPS)
- name: POWER_LOSS_PURGE_LEN
  file: Configuration_adv.h
  type: int
  default: 20
  units: mm
  disabled: true
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY
  comment: (mm) Length of filament to purge on resume
- name: POWER_LOSS_MIN_Z_CHANGE
  file: Configuration_adv.h
  type: float
  default: 0.05
  units: mm
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY
  comment: Without a `POWER_LOSS_PIN` the following option helps reduce wear on the SD card, especially with "vase mode" printing. Set too high and vases cannot be continued.
- name: BACKUP_POWER_SUPPLY
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY
  comment: Backup power / UPS to move the steppers on power-loss
- name: POWER_LOSS_RETRACT_LEN
  file: Configuration_adv.h
  type: int
  default: 10
  units: mm
  disabled: true
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY && BACKUP_POWER_SUPPLY
  comment: (mm) Length of filament to retract on fail
- name: POWER_LOSS_RECOVER_ZHOME
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY
  comment: Enable if Z homing is needed for proper recovery. 99.9% of the time this should be disabled!
- name: POWER_LOSS_ZHOME_POS
  file: Configuration_adv.h
  type: int[]
  default: '{ 0, 0 }'
  disabled: true
  requires: HAS_MEDIA && POWER_LOSS_RECOVERY && POWER_LOSS_RECOVER_ZHOME
  comment: Safe XY position to home Z while avoiding objects on the bed
- name: SDCARD_SORT_ALPHA
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  long: See `Configuration_adv.h` for more details.
  comment: |-
    Sort SD file listings in alphabetical order.

    With this option enabled, items on SD cards will be sorted by name for easier navigation.

    By default...

    - Use the slowest -but safest- method for sorting.
    - Folders are sorted to the top.
    - The sort key is statically allocated.
    - No added G-code (M34) support.
    - 40 item sorting limit. (Items after the first 40 are unsorted.)

    SD sorting uses static allocation (as set by `SDSORT_LIMIT`), allowing the compiler to calculate the worst-case usage and throw an error if the SRAM limit is exceeded.

    - `SDSORT_USES_RAM` provides faster sorting via a static directory buffer.
    - `SDSORT_USES_STACK` does the same, but uses a local stack-based buffer.
    - `SDSORT_CACHE_NAMES` will retain the sorted file listing in RAM. (Expensive!)
    - `SDSORT_DYNAMIC_RAM` only uses RAM when the SD menu is visible. (Use with caution!)
- name: SDSORT_QUICK
  file: Configuration_adv.h
  type: bool
  default: true
  requires: HAS_MEDIA && SDCARD_SORT_ALPHA
  comment: SD Card Sorting options
- name: SDSORT_REVERSE
  file: Configuration_adv.h
  type: bool
  default: false
  requires: HAS_MEDIA && SDCARD_SORT_ALPHA
  comment: Default to sorting file names in reverse order.
- name: SDSORT_LIMIT
  file: Configuration_adv.h
  type: int
  default: 40
  requires: HAS_MEDIA && SDCARD_SORT_ALPHA
  comment: Maximum number of sorted items (10-256). Costs 27 bytes each.
- name: SDSORT_FOLDERS
  file: Configuration_adv.h
  type: int
  default: -1
  requires: HAS_MEDIA && SDCARD_SORT_ALPHA
  comment: -1=above  0=none  1=below
- name: SDSORT_GCODE
  file: Configuration_adv.h
  type: bool
  default: false
  requires: HAS_MEDIA && SDCARD_SORT_ALPHA
  comment: 'Enable G-code M34 to set sorting behaviors: M34 S&lt;-1|0|1&gt; F&lt;-1|0|1&gt;'
- name: SDSORT_USES_STACK
  file: Configuration_adv.h
  type: bool
  default: false
  requires: HAS_MEDIA && SDCARD_SORT_ALPHA
  comment: Prefer the stack for pre-sorting to give back some SRAM. (Negated by next 2 options.)
- name: SDSORT_USES_RAM
  file: Configuration_adv.h
  type: bool
  default: false
  requires: HAS_MEDIA && SDCARD_SORT_ALPHA
  comment: Pre-allocate a static array for faster pre-sorting.
- name: SDSORT_CACHE_NAMES
  file: Configuration_adv.h
  type: bool
  default: false
  requires: HAS_MEDIA && SDCARD_SORT_ALPHA && SDSORT_USES_RAM
  comment: Keep sorted items in RAM longer for speedy performance. Most expensive option.
- name: SDSORT_DYNAMIC_RAM
  file: Configuration_adv.h
  type: bool
  default: false
  requires: HAS_MEDIA && SDCARD_SORT_ALPHA && SDSORT_USES_RAM && SDSORT_CACHE_NAMES
  comment: Use dynamic allocation (within SD menus). Least expensive option. Set `SDSORT_LIMIT` before use!
- name: SDSORT_CACHE_VFATS
  file: Configuration_adv.h
  type: int
  default: 2
  requires: HAS_MEDIA && SDCARD_SORT_ALPHA && SDSORT_USES_RAM && SDSORT_CACHE_NAMES
  comment: 'Maximum number of 13-byte VFAT entries to use for sorting. Note: Only affects `SCROLL_LONG_FILENAMES` with `SDSORT_CACHE_NAMES` but not `SDSORT_DYNAMIC_RAM`.'
- name: UTF_FILENAME_SUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Allow international symbols in long filenames. To display correctly, the LCD's font must contain the characters. Check your selected LCD language.
- name: LONG_FILENAME_HOST_SUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  long: This allows hosts to request long names for files and folders with [`M33`](/docs/gcode/M033.html)
  comment: Get the long filename of a file/folder with 'M33 &lt;dosname&gt;' and list long filenames with 'M20 L'
- name: LONG_FILENAME_WRITE_SUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Create / delete files with long filenames via M28, M30, and Binary Transfer Protocol
- name: M20_TIMESTAMP_SUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Include timestamps by adding the 'T' flag to M20 commands
- name: SCROLL_LONG_FILENAMES
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  long: Enable this option to scroll long filenames in the SD card menu
  comment: Scroll long filenames in the SD card menu
- name: SD_ABORT_NO_COOLDOWN
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  long: Leave the heaters on after Stop Print (not recommended!)
  comment: Leave the heaters on after Stop Print (not recommended!)
- name: SD_ABORT_ON_ENDSTOP_HIT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  long: Add an option for the firmware to abort SD printing if any endstop is triggered. Turn on with [`M540`](/docs/gcode/M540.html) `S1` (or from the LCD menu) and make sure endstops are enabled ([`M120`](/docs/gcode/M120.html)) during SD printing.
  comment: Abort SD printing when any endstop is triggered. This feature is enabled with 'M540 S1' or from the LCD menu. Endstops must be activated for this option to work.
- name: SD_ABORT_ON_ENDSTOP_HIT_GCODE
  file: Configuration_adv.h
  type: string
  default: '"G28XY"'
  disabled: true
  requires: HAS_MEDIA && SD_ABORT_ON_ENDSTOP_HIT
  comment: G-code to run on endstop hit (e.g., "G28XY" or "G27")
- name: SD_REPRINT_LAST_SELECTED_FILE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  long: This option makes it easier to print the same SD Card file again. Whenever an SD print completes the LCD Menu will open with the same file selected. From there you can click to start a new print, or you can navigate elsewhere.
  comment: On print completion open the LCD Menu and select the same file
- name: AUTO_REPORT_SD_STATUS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  long: Auto-report SD card status with [`M27`](/docs/gcode/M027.html) S<seconds>
  comment: Auto-report media status with 'M27 S&lt;seconds&gt;'
- name: USB_FLASH_DRIVE_SUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  long: See `Configuration_adv.h` for more details.
  comment: |-
    Support for USB thumb drives using an Arduino USB Host Shield or equivalent MAX3421E breakout board. The USB thumb drive will appear to Marlin as an SD card.

    The MAX3421E can be assigned the same pins as the SD card reader, with the following pin mapping:

    SCLK, MOSI, MISO --&gt; SCLK, MOSI, MISO

    INT              --&gt; SD_DETECT_PIN [1]

    SS               --&gt; SD_SS_PIN

    [1] On AVR an interrupt-capable pin is best for UHS3 compatibility.
- name: USE_UHS2_USB
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA && USB_FLASH_DRIVE_SUPPORT
  comment: |-
    USB Host Shield Library

    - UHS2 uses no interrupts and has been production-tested on a LulzBot TAZ Pro with a 32-bit Archim board.

    - UHS3 is newer code with better USB compatibility. But it is less tested and is known to interfere with Servos. [1] This requires `USB_INTR_PIN` to be interrupt-capable.
- name: USE_UHS3_USB
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA && USB_FLASH_DRIVE_SUPPORT
  shared_comment: |-
    USB Host Shield Library

    - UHS2 uses no interrupts and has been production-tested on a LulzBot TAZ Pro with a 32-bit Archim board.

    - UHS3 is newer code with better USB compatibility. But it is less tested and is known to interfere with Servos. [1] This requires `USB_INTR_PIN` to be interrupt-capable.
- name: DISABLE_DUE_SD_MMC
  file: Configuration_adv.h
  type: switch
  requires: HAS_MEDIA && USB_FLASH_DRIVE_SUPPORT
  comment: Disable USB Host access to USB Drive to prevent hangs on block access for DUE platform
- name: USE_OTG_USB_HOST
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA && USB_FLASH_DRIVE_SUPPORT
  comment: Native USB Host supported by some boards (USB OTG)
- name: USB_CS_PIN
  file: Configuration_adv.h
  type: enum
  default: SD_SS_PIN
  requires: HAS_MEDIA && USB_FLASH_DRIVE_SUPPORT && !USE_OTG_USB_HOST
- name: USB_INTR_PIN
  file: Configuration_adv.h
  type: enum
  default: SD_DETECT_PIN
  requires: HAS_MEDIA && USB_FLASH_DRIVE_SUPPORT && !USE_OTG_USB_HOST
- name: SD_FIRMWARE_UPDATE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  long: See `Configuration_adv.h` for more details.
  comment: |-
    When using a bootloader that supports SD-Firmware-Flashing, add a menu item to activate SD-FW-Update on the next reboot.

    Requires ATMEGA2560 (Arduino Mega)

    Tested with this bootloader:

    - <https://github.com/FleetProbe/MicroBridge-Arduino-ATMega2560>
- name: SD_FIRMWARE_UPDATE_EEPROM_ADDR
  file: Configuration_adv.h
  type: enum
  default: '0x1FF'
  requires: HAS_MEDIA && SD_FIRMWARE_UPDATE
- name: SD_FIRMWARE_UPDATE_ACTIVE_VALUE
  file: Configuration_adv.h
  type: enum
  default: '0xF0'
  requires: HAS_MEDIA && SD_FIRMWARE_UPDATE
- name: SD_FIRMWARE_UPDATE_INACTIVE_VALUE
  file: Configuration_adv.h
  type: enum
  default: '0xFF'
  requires: HAS_MEDIA && SD_FIRMWARE_UPDATE
- name: CONFIGURATION_EMBEDDING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Enable this option if you have more than ~3K of unused flash space. Marlin will embed all settings in the firmware binary as compressed data. Use 'M503 C' to write the settings out to the SD Card as 'mc.zip'. See docs/ConfigEmbedding.md for details on how to use 'mc-apply.py'.
- name: BINARY_FILE_TRANSFER
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  long: See `Configuration_adv.h` for more details.
  comment: Add an optimized binary file transfer mode, initiated with 'M28 B1'
- name: CUSTOM_FIRMWARE_UPLOAD
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA && BINARY_FILE_TRANSFER
  comment: Include extra facilities (e.g., 'M20 F') supporting firmware upload via `BINARY_FILE_TRANSFER`
- name: OTA_FIRMWARE_UPDATE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: '"Over-the-air" Firmware Update with M936 - Required to set EEPROM flag'
- name: SDCARD_CONNECTION
  file: Configuration_adv.h
  type: enum
  default: LCD
  disabled: true
  requires: HAS_MEDIA
  long: Choose between `LCD`,  `ONBOARD` or `CUSTOM_CABLE` or use the board's default.
  comment: |-
    Set this option to one of the following (or the board's defaults apply):

    LCD - Use the SD drive in the external LCD controller. ONBOARD - Use the SD drive on the control board. CUSTOM_CABLE - Use a custom cable to access the SD (as defined in a pins file).
  options:
  - value: LCD
  - value: ONBOARD
  - value: CUSTOM_CABLE
- name: NO_SD_DETECT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Enable if SD detect is rendered useless (e.g., by using an SD extender)
- name: MULTI_VOLUME
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MEDIA
  comment: Multiple volume support - EXPERIMENTAL. Adds 'M21 Pm' / 'M21 S' / 'M21 U' to mount SD Card / USB Drive.
- name: VOLUME_SD_ONBOARD
  file: Configuration_adv.h
  type: switch
  requires: HAS_MEDIA && MULTI_VOLUME
- name: VOLUME_USB_FLASH_DRIVE
  file: Configuration_adv.h
  type: switch
  requires: HAS_MEDIA && MULTI_VOLUME
- name: DEFAULT_VOLUME
  file: Configuration_adv.h
  type: enum
  default: SD_ONBOARD
  requires: HAS_MEDIA && MULTI_VOLUME
  options: default_volume
- name: DEFAULT_SHARED_VOLUME
  file: Configuration_adv.h
  type: enum
  default: USB_FLASH_DRIVE
  requires: HAS_MEDIA && MULTI_VOLUME
  options: default_volume
- name: SD_MAX_READ_ERRORS
  file: Configuration_adv.h
  type: int
  default: 5
  requires: HAS_MEDIA
  comment: Maximum number of consecutive SD card read errors before aborting the print Prevents infinite loops when reading from SD card with hardware/communication faults
- name: NO_SD_HOST_DRIVE
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Disable SD Card access over USB (for security). This option hides the SD card from the host PC.
  comment: By default an onboard SD card reader may be shared as a USB mass- storage device. This option hides the SD card from the host PC.
- name: XYZ_NO_FRAME
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_U8GLIB
  comment: Save many cycles by drawing a hollow frame or no frame on the Info Screen
- name: XYZ_HOLLOW_FRAME
  file: Configuration_adv.h
  type: switch
  requires: HAS_MARLINUI_U8GLIB
  shared_comment: Save many cycles by drawing a hollow frame or no frame on the Info Screen
- name: USE_BIG_EDIT_FONT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_U8GLIB
  comment: A bigger font is available for edit items. Costs 3120 bytes of flash. Western only. Not available for Cyrillic, Kana, Turkish, Greek, or Chinese.
- name: USE_SMALL_INFOFONT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_U8GLIB
  comment: A smaller font may be used on the Info Screen. Costs 2434 bytes of flash. Western only. Not available for Cyrillic, Kana, Turkish, Greek, or Chinese.
- name: DOGM_SPI_DELAY_US
  file: Configuration_adv.h
  type: int
  default: 5
  units: µs
  disabled: true
  requires: HAS_MARLINUI_U8GLIB && IS_U8GLIB_ST7920
  comment: Enable this option and reduce the value to optimize screen updates. The normal delay is 10µs. Use the lowest value that still gives a reliable display.
- name: LIGHTWEIGHT_UI
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_U8GLIB && IS_U8GLIB_ST7920
- name: STATUS_EXPIRE_SECONDS
  file: Configuration_adv.h
  type: int
  default: 20
  requires: HAS_MARLINUI_U8GLIB && IS_U8GLIB_ST7920 && LIGHTWEIGHT_UI
- name: STATUS_COMBINE_HEATERS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_U8GLIB
  comment: |-
    Status (Info) Screen customization

    These options may affect code size and screen render time. Custom status screens can forcibly override these settings.
- name: STATUS_HOTEND_NUMBERLESS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_U8GLIB
  comment: Use plain hotend icons instead of numbered ones (with 2+ hotends)
- name: STATUS_HOTEND_INVERTED
  file: Configuration_adv.h
  type: switch
  requires: HAS_MARLINUI_U8GLIB
  comment: Show solid nozzle bitmaps when heating (Requires `STATUS_HOTEND_ANIM` for numbered hotends)
- name: STATUS_HOTEND_ANIM
  file: Configuration_adv.h
  type: switch
  requires: HAS_MARLINUI_U8GLIB
  comment: Use a second bitmap to indicate hotend heating
- name: STATUS_*_ANIM
  file: Configuration_adv.h
  type: switch
  requires: HAS_MARLINUI_U8GLIB
  comment: Use a second bitmap to indicate bed heating
  members:
  - id: BED
    name: STATUS_BED_ANIM
  - id: COOLER
    name: STATUS_COOLER_ANIM
    disabled: true
- name: STATUS_CHAMBER_ANIM
  file: Configuration_adv.h
  type: switch
  requires: HAS_MARLINUI_U8GLIB
  comment: Use a second bitmap to indicate chamber heating
- name: STATUS_CUTTER_ANIM
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_U8GLIB
  comment: Use a second bitmap to indicate spindle / laser active
- name: STATUS_FLOWMETER_ANIM
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_U8GLIB
  comment: Use multiple bitmaps to indicate coolant flow
- name: STATUS_ALT_BED_BITMAP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_U8GLIB
  comment: Use the alternative bed bitmap
- name: STATUS_ALT_FAN_BITMAP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_U8GLIB
  comment: Use the alternative fan bitmap
- name: STATUS_FAN_FRAMES
  file: Configuration_adv.h
  type: int
  default: 3
  disabled: true
  requires: HAS_MARLINUI_U8GLIB
  comment: Number of fan animation frames
- name: STATUS_HEAT_PERCENT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_U8GLIB
  comment: Only one `STATUS_HEAT_*` option can be enabled
- name: STATUS_HEAT_POWER
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_MARLINUI_U8GLIB
  comment: Show heater output power as a vertical bar
- name: MENU_HOLLOW_FRAME
  file: Configuration_adv.h
  type: switch
  requires: (HAS_MARLINUI_U8GLIB || IS_DWIN_MARLINUI)
  comment: HAS_MARLINUI_U8GLIB
- name: OVERLAY_GFX_REVERSE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: (HAS_MARLINUI_U8GLIB || IS_DWIN_MARLINUI)
  comment: Swap the CW/CCW indicators in the graphics overlay
- name: MARLIN_BRICKOUT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: (HAS_MARLINUI_U8GLIB || IS_DWIN_MARLINUI)
  comment: Frivolous Game Options
- name: MARLIN_INVADERS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: (HAS_MARLINUI_U8GLIB || IS_DWIN_MARLINUI)
  shared_comment: Frivolous Game Options
- name: MARLIN_SNAKE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: (HAS_MARLINUI_U8GLIB || IS_DWIN_MARLINUI)
  shared_comment: Frivolous Game Options
- name: GAMES_EASTER_EGG
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: (HAS_MARLINUI_U8GLIB || IS_DWIN_MARLINUI)
  comment: Add extra blank lines above the "Games" sub-menu
- name: LCD_BAUDRATE
  file: Configuration_adv.h
  type: int
  default: 115200
  requires: HAS_DGUS_LCD
  long: See `Configuration_adv.h` for more details.
  comment: Additional options for DGUS / DWIN displays
- name: DGUS_RX_BUFFER_SIZE
  file: Configuration_adv.h
  type: int
  default: 128
  requires: HAS_DGUS_LCD
- name: DGUS_TX_BUFFER_SIZE
  file: Configuration_adv.h
  type: int
  default: 48
  requires: HAS_DGUS_LCD
- name: SERIAL_STATS_RX_BUFFER_OVERRUNS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DGUS_LCD
  comment: Fix Rx overrun situation (Currently only for AVR)
- name: DGUS_UPDATE_INTERVAL_MS
  file: Configuration_adv.h
  type: int
  default: 500
  units: ms
  requires: HAS_DGUS_LCD
  comment: (ms) Interval between automatic screen updates
- name: DGUS_PRINT_FILENAME
  file: Configuration_adv.h
  type: switch
  requires: HAS_DGUS_LCD && DGUS_UI_IS(FYSETC, MKS, HIPRECY)
  comment: Display the filename during printing
- name: DGUS_PREHEAT_UI
  file: Configuration_adv.h
  type: switch
  requires: HAS_DGUS_LCD && DGUS_UI_IS(FYSETC, MKS, HIPRECY)
  comment: Display a preheat screen during heatup
- name: DGUS_UI_MOVE_DIS_OPTION
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HAS_DGUS_LCD && DGUS_UI_IS(FYSETC, MKS, HIPRECY) && DGUS_UI_IS(FYSETC, MKS)
  comment: Disabled by default for FYSETC and MKS
- name: DGUS_FILAMENT_LOADUNLOAD
  file: Configuration_adv.h
  type: switch
  requires: HAS_DGUS_LCD && DGUS_UI_IS(FYSETC, MKS, HIPRECY)
- name: DGUS_FILAMENT_PURGE_LENGTH
  file: Configuration_adv.h
  type: int
  default: 10
  requires: HAS_DGUS_LCD && DGUS_UI_IS(FYSETC, MKS, HIPRECY) && DGUS_FILAMENT_LOADUNLOAD
- name: DGUS_FILAMENT_LOAD_LENGTH_PER_TIME
  file: Configuration_adv.h
  type: float
  default: 0.5
  units: mm
  requires: HAS_DGUS_LCD && DGUS_UI_IS(FYSETC, MKS, HIPRECY) && DGUS_FILAMENT_LOADUNLOAD
  comment: (mm) Adjust in proportion to `DGUS_UPDATE_INTERVAL_MS`
- name: DGUS_UI_WAITING
  file: Configuration_adv.h
  type: switch
  requires: HAS_DGUS_LCD && DGUS_UI_IS(FYSETC, MKS, HIPRECY)
  comment: Show a "waiting" screen between some screens
- name: DGUS_UI_WAITING_STATUS
  file: Configuration_adv.h
  type: int
  default: 10
  requires: HAS_DGUS_LCD && DGUS_UI_IS(FYSETC, MKS, HIPRECY) && DGUS_UI_WAITING
- name: DGUS_UI_WAITING_STATUS_PERIOD
  file: Configuration_adv.h
  type: int
  default: 8
  requires: HAS_DGUS_LCD && DGUS_UI_IS(FYSETC, MKS, HIPRECY) && DGUS_UI_WAITING
  comment: Increase to slower waiting status looping
- name: DGUS_SOFTWARE_AUTOSCROLL
  file: Configuration_adv.h
  type: switch
  requires: HAS_DGUS_LCD && DGUS_UI_IS(E3S1PRO)
  block_clause: '!DGUS_UI_IS(FYSETC, MKS, HIPRECY)'
  comment: |-
    The stock Ender-3 S1 Pro/Plus display firmware has rather poor SD file handling.

    The autoscroll is mainly useful for status messages, filenames, and the "About" page.

    NOTE: The Advanced SD Card option is affected by the stock touchscreen firmware, so pages 5 and up will display "4/4". This may get fixed in a screen firmware update.
- name: DGUS_AUTOSCROLL_START_CYCLES
  file: Configuration_adv.h
  type: int
  default: 1
  requires: HAS_DGUS_LCD && DGUS_UI_IS(E3S1PRO)
  block_clause: '!DGUS_UI_IS(FYSETC, MKS, HIPRECY)'
  comment: Refresh cycles without scrolling at the beginning of text strings
- name: DGUS_AUTOSCROLL_END_CYCLES
  file: Configuration_adv.h
  type: int
  default: 1
  requires: HAS_DGUS_LCD && DGUS_UI_IS(E3S1PRO)
  block_clause: '!DGUS_UI_IS(FYSETC, MKS, HIPRECY)'
  comment: '... at the end of text strings'
- name: DGUS_ADVANCED_SDCARD
  file: Configuration_adv.h
  type: switch
  requires: HAS_DGUS_LCD && DGUS_UI_IS(E3S1PRO)
  block_clause: '!DGUS_UI_IS(FYSETC, MKS, HIPRECY)'
  comment: Allow more than 20 files and navigating directories
- name: DGUS_USERCONFIRM
  file: Configuration_adv.h
  type: switch
  requires: HAS_DGUS_LCD && DGUS_UI_IS(E3S1PRO)
  block_clause: '!DGUS_UI_IS(FYSETC, MKS, HIPRECY)'
  comment: Reuse the SD Card page to show various messages
- name: CHIRON_TFT_STANDARD
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANYCUBIC_LCD_CHIRON
  comment: By default the type of panel is automatically detected. Enable one of these options if you know the panel type.
- name: CHIRON_TFT_NEW
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANYCUBIC_LCD_CHIRON
  shared_comment: By default the type of panel is automatically detected. Enable one of these options if you know the panel type.
- name: AC_DEFAULT_STARTUP_TUNE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANYCUBIC_LCD_CHIRON
  comment: Enable the longer Anycubic powerup startup tune
- name: AC_SD_FOLDER_VIEW
  file: Configuration_adv.h
  type: switch
  requires: ANYCUBIC_LCD_CHIRON
  comment: |-
    Display Folders

    By default the file browser lists all G-code files (including those in subfolders) in a flat list. Enable this option to display a hierarchical file browser.

    NOTES:

    - Without this option it helps to enable `SDCARD_SORT_ALPHA` so files are sorted before/after folders.
    - When used with the "new" panel, folder names will also have '.gcode' appended to their names. This hack is currently required to force the panel to show folders.
- name: LCD_LANGUAGE_*
  file: Configuration_adv.h
  requires: ANY(DOGLCD, TFT_COLOR_UI, TOUCH_UI_FTDI_EVE, IS_DWIN_MARLINUI, ANYCUBIC_LCD_VYPER)
  comment: Specify additional languages for the UI. Default specified by `LCD_LANGUAGE`.
  members:
  - id: '2'
    name: LCD_LANGUAGE_2
    default: fr
    disabled: true
  - id: '3'
    name: LCD_LANGUAGE_3
    default: de
    disabled: true
  - id: '4'
    name: LCD_LANGUAGE_4
    default: es
    disabled: true
  - id: '5'
    name: LCD_LANGUAGE_5
    default: it
    disabled: true
- name: LCD_LANGUAGE_AUTO_SAVE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(DOGLCD, TFT_COLOR_UI, TOUCH_UI_FTDI_EVE, IS_DWIN_MARLINUI, ANYCUBIC_LCD_VYPER) && LCD_LANGUAGE_2
  comment: Automatically save language to EEPROM on change
- name: LCD_FTDI_VM800B35A
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  long: See `Configuration_adv.h` for more details.
  comment: Display board used
- name: LCD_4DSYSTEMS_4DLCD_FT843
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: 4D Systems 4.3" (480x272)
- name: LCD_HAOYU_FT800CB
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: Haoyu with 4.3" or 5" (480x272)
- name: LCD_HAOYU_FT810CB
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: Haoyu with 5" (800x480)
- name: LCD_LULZBOT_CLCD_UI
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: LulzBot Color LCD UI
- name: LCD_FYSETC_TFT81050
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: FYSETC with 5" (800x480)
- name: LCD_EVE3_50G
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: Matrix Orbital 5.0", 800x480, BT815
- name: LCD_EVE2_50G
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: Matrix Orbital 5.0", 800x480, FT813
- name: TOUCH_UI_320x240
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: Correct the resolution if not using the stock TFT panel.
- name: TOUCH_UI_480x272
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  shared_comment: Correct the resolution if not using the stock TFT panel.
- name: TOUCH_UI_800x480
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  shared_comment: Correct the resolution if not using the stock TFT panel.
- name: AO_EXP1_PINMAP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: Mappings for boards with a standard RepRapDiscount Display connector
- name: AO_EXP2_PINMAP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: LulzBot CLCD UI EXP2 mapping
- name: CR10_TFT_PINMAP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: Rudolph Riedel's CR10 pin mapping
- name: S6_TFT_PINMAP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: FYSETC S6 pin mapping
- name: F6_TFT_PINMAP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: FYSETC F6 pin mapping
- name: OTHER_PIN_LAYOUT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: Define pins manually below
- name: CLCD_MOD_RESET
  file: Configuration_adv.h
  type: int
  default: 9
  requires: TOUCH_UI_FTDI_EVE && OTHER_PIN_LAYOUT
  comment: Pins for CS and MOD_RESET (PD) must be chosen
- name: CLCD_SPI_CS
  file: Configuration_adv.h
  type: int
  default: 10
  requires: TOUCH_UI_FTDI_EVE && OTHER_PIN_LAYOUT
  shared_comment: Pins for CS and MOD_RESET (PD) must be chosen
- name: CLCD_USE_SOFT_SPI
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE && OTHER_PIN_LAYOUT
  comment: If using software SPI, specify pins for SCLK, MOSI, MISO
- name: CLCD_SOFT_SPI_MOSI
  file: Configuration_adv.h
  type: int
  default: 11
  requires: TOUCH_UI_FTDI_EVE && OTHER_PIN_LAYOUT && CLCD_USE_SOFT_SPI
- name: CLCD_SOFT_SPI_MISO
  file: Configuration_adv.h
  type: int
  default: 12
  requires: TOUCH_UI_FTDI_EVE && OTHER_PIN_LAYOUT && CLCD_USE_SOFT_SPI
- name: CLCD_SOFT_SPI_SCLK
  file: Configuration_adv.h
  type: int
  default: 13
  requires: TOUCH_UI_FTDI_EVE && OTHER_PIN_LAYOUT && CLCD_USE_SOFT_SPI
- name: TOUCH_UI_INVERTED
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: Display Orientation. An inverted (i.e. upside-down) display is supported on the FT800. The FT810 and beyond also support portrait and mirrored orientations.
- name: TOUCH_UI_PORTRAIT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  shared_comment: Display Orientation. An inverted (i.e. upside-down) display is supported on the FT800. The FT810 and beyond also support portrait and mirrored orientations.
- name: TOUCH_UI_MIRRORED
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  shared_comment: Display Orientation. An inverted (i.e. upside-down) display is supported on the FT800. The FT810 and beyond also support portrait and mirrored orientations.
- name: TOUCH_UI_USE_UTF8
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: UTF8 processing and rendering. Unsupported characters are shown as '?'.
- name: TOUCH_UI_UTF8_WESTERN_CHARSET
  file: Configuration_adv.h
  type: switch
  requires: TOUCH_UI_FTDI_EVE && TOUCH_UI_USE_UTF8
  comment: Western accents support. These accented characters use combined bitmaps and require relatively little storage.
- name: TOUCH_UI_UTF8_SUPERSCRIPTS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE && TOUCH_UI_USE_UTF8 && TOUCH_UI_UTF8_WESTERN_CHARSET
  comment: 'Additional character groups. These characters require full bitmaps and take up considerable storage:'
- name: TOUCH_UI_UTF8_COPYRIGHT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE && TOUCH_UI_USE_UTF8 && TOUCH_UI_UTF8_WESTERN_CHARSET
  comment: © ®
- name: TOUCH_UI_UTF8_GERMANIC
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE && TOUCH_UI_USE_UTF8 && TOUCH_UI_UTF8_WESTERN_CHARSET
  comment: ß
- name: TOUCH_UI_UTF8_SCANDINAVIAN
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE && TOUCH_UI_USE_UTF8 && TOUCH_UI_UTF8_WESTERN_CHARSET
  comment: Æ Ð Ø Þ æ ð ø þ
- name: TOUCH_UI_UTF8_PUNCTUATION
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE && TOUCH_UI_USE_UTF8 && TOUCH_UI_UTF8_WESTERN_CHARSET
  comment: « » ¿ ¡
- name: TOUCH_UI_UTF8_CURRENCY
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE && TOUCH_UI_USE_UTF8 && TOUCH_UI_UTF8_WESTERN_CHARSET
  comment: ¢ £ ¤ ¥
- name: TOUCH_UI_UTF8_ORDINALS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE && TOUCH_UI_USE_UTF8 && TOUCH_UI_UTF8_WESTERN_CHARSET
  comment: º ª
- name: TOUCH_UI_UTF8_MATHEMATICS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE && TOUCH_UI_USE_UTF8 && TOUCH_UI_UTF8_WESTERN_CHARSET
  comment: ± × ÷
- name: TOUCH_UI_UTF8_FRACTIONS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE && TOUCH_UI_USE_UTF8 && TOUCH_UI_UTF8_WESTERN_CHARSET
  comment: ¼ ½ ¾
- name: TOUCH_UI_UTF8_SYMBOLS
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE && TOUCH_UI_USE_UTF8 && TOUCH_UI_UTF8_WESTERN_CHARSET
  comment: µ ¶ ¦ § ¬
- name: TOUCH_UI_UTF8_CYRILLIC_CHARSET
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE && TOUCH_UI_USE_UTF8
  comment: Cyrillic character set, costs about 27KiB of flash
- name: TOUCH_UI_FIT_TEXT
  file: Configuration_adv.h
  type: switch
  requires: TOUCH_UI_FTDI_EVE
  comment: Use a smaller font when labels don't fit buttons
- name: TOUCH_UI_PASSCODE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: Use a numeric passcode for "Screen lock" keypad. (recommended for smaller displays)
- name: TOUCH_UI_DEBUG
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: Output extra debug info for Touch UI events
- name: TOUCH_UI_DEVELOPER_MENU
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: TOUCH_UI_FTDI_EVE
  comment: Developer menu (accessed by touching "About Printer" copyright text)
- name: TFT_MARLINUI_COLOR
  file: Configuration_adv.h
  type: enum
  default: '0xFFFF'
  disabled: true
  requires: TFT_SCALED_DOGLCD
  comment: Classic UI Options
- name: TFT_MARLINBG_COLOR
  file: Configuration_adv.h
  type: enum
  default: '0x0000'
  disabled: true
  requires: TFT_SCALED_DOGLCD
  comment: Black
- name: TFT_DISABLED_COLOR
  file: Configuration_adv.h
  type: enum
  default: '0x0003'
  disabled: true
  requires: TFT_SCALED_DOGLCD
  comment: Almost black
- name: TFT_BTCANCEL_COLOR
  file: Configuration_adv.h
  type: enum
  default: '0xF800'
  disabled: true
  requires: TFT_SCALED_DOGLCD
  comment: Red
- name: TFT_BTARROWS_COLOR
  file: Configuration_adv.h
  type: enum
  default: '0xDEE6'
  disabled: true
  requires: TFT_SCALED_DOGLCD
  comment: 11011 110111 00110 Yellow
- name: TFT_BTOKMENU_COLOR
  file: Configuration_adv.h
  type: enum
  default: '0x145F'
  disabled: true
  requires: TFT_SCALED_DOGLCD
  comment: 00010 100010 11111 Cyan
- name: DISPLAY_SLEEP_MINUTES
  file: Configuration_adv.h
  type: int
  default: 2
  units: minutes
  disabled: true
  comment: |-
    Display Sleep

    Enable this option to save energy and prevent OLED pixel burn-in.
- name: LCD_BACKLIGHT_TIMEOUT_MINS
  file: Configuration_adv.h
  type: int
  default: 1
  units: minutes
  disabled: true
  comment: |-
    LCD Backlight Timeout

    Requires a display with a controllable backlight
- name: EDITABLE_DISPLAY_TIMEOUT
  file: Configuration_adv.h
  type: switch
  requires: (defined(DISPLAY_SLEEP_MINUTES) || defined(LCD_BACKLIGHT_TIMEOUT_MINS))
  comment: Edit sleep / backlight timeout with M255 S&lt;minutes&gt; and a menu item
- name: ADC_BUTTON_DEBOUNCE_DELAY
  file: Configuration_adv.h
  type: int
  default: 16
  units: count
  requires: HAS_ADC_BUTTONS
  comment: ADC Button Debounce
- name: FAST_BUTTON_POLLING
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Poll buttons at ~1kHz on 8-bit AVR. Set to 'false' for slow polling on 32-bit.
lists:
  dgus_lcd_ui:
  - value: ORIGIN
  - value: FYSETC
  - value: HYPRECY
  - value: MKS
  - value: RELOADED
  - value: IA_CREALITY
  - value: E3S1PRO
  - value: CR10SPROV2
  - value: SERMOON_D1
  tft_font:
  - value: NOTOSANS
  - value: UNIFONT
  - value: HELVETICA
  default_volume:
  - value: SD_ONBOARD
  - value: USB_FLASH_DRIVE
---

Options for displays, controllers and their menus. For an overview of the display families and which option to pick, see [Displays and Controllers](/docs/features/displays.html); for `POWER_LOSS_RECOVERY` see [Power-Loss Recovery](/docs/features/power_loss_recovery.html); for `BABYSTEPPING` and `PROBE_OFFSET_WIZARD` see [Z Offset and Babystepping](/docs/features/z_offset_babystepping.html).
