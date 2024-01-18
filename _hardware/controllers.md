---
title: Controllers and displays
description: Controllers and displays supported by Marlin
tag: info

author: ellensp
contrib: thinkyhead
category: [ info, hardware, lcd, wip ]

groups:

  #
  # CHARACTER-BASED LCDs
  #

  - name: Character-based LCDs
    summary: The character set is stored in ROM on the display, but a few custom characters may be defined.
    controllers:

    - name: REPRAP_DISCOUNT_SMART_CONTROLLER
      description: |
        One of the most common character displays. Comes in white and red PCBs
        - 20×4 character LCD panel
        - SD Card reader
        - Reset button
        - Rotary encoder click wheel
        - Buzzer
      images:
        - alt: RRDSC
          front: RDSC
          back: RDSC

    - name: YHCB2004
      description: |
        - 20×4 character LCD panel
        - Reset button
        - Rotary encoder click wheel
        - Buzzer
      images:
        - alt: YHCB2004
          front: YHCB2004
          back: YHCB2004

    - name: RADDS_DISPLAY
      description: |
        - 20×4 character LCD panel
        - SD Card reader
        - Back button
        - Reset button
        - Rotary encoder click wheel
        - Potentiometer for LCD contrast adjustment
        - Buzzer
      images:
        - alt: RADDS
          front: RADDS

    - name: ULTIMAKERCONTROLLER
      description:

    - name: ULTIPANEL
      description: |
        - 20×4 character LCD panel
        - SD Card reader
        - Rotary encoder click wheel
        - Potentiometer for LCD contrast adjustment
        - Buzzer
      images:
        - alt: ULTIPANEL
          front: ULTIPANEL
          back: ULTIPANEL

    - name: PANEL_ONE
      description: |
        - 20×4 character LCD panel
        - SD Card reader
        - Rotary encoder click wheel
        - Potentiometer for LCD contrast adjustment
        - Potentiometer for LCD brightness adjustment
      images:
        - alt: PANELONE
          front: PANELONE
          back: PANELONE

    - name: G3D_PANEL
      description: |
        - 20×4 character LCD panel
        - Rotary encoder click wheel
        - Requires an adapter slightly different from the RRDSC
      images:
        - alt: G3D Panel
          front: G3DPANEL

    - name: RIGIDBOT_PANEL
      description: <https://www.inventapart.com/>

    - name: MAKEBOARD_MINI_2_LINE_DISPLAY_1602
      description: |
        - 16×2 character LCD panel
        - Reset button
        - SD Card reader
        - Rotary encoder click wheel
      images:
        - alt: Makeboard Mini
          front: MAKEBOARD_MINI_2_LINE_DISPLAY
          back: MAKEBOARD_MINI_2_LINE_DISPLAY

    - name: ZONESTAR_LCD
      description: |
        - 20×4 character LCD panel
        - 5 Menu buttons
      images:
        - alt: Zonestar LCD
          front: ZONESTAR_LCD
          back: ZONESTAR_LCD

    - name: ULTRA_LCD
      description: Generic 16×2, 16×4, 20×2, or 20×4 character-based LCD.

    - name: RA_CONTROL_PANEL
      description: Elefu RA board control panel.
      url: web.archive.org/web/20140823033947/http://www.elefu.com/index.php?route=product/product&product_id=53
      interface: I2C

    - name: LCD_SAINSMART_I2C_1602
      description: Sainsmart (YwRobot) LCD Displays.
      interface: I2C
      url: github.com/fmalpartida/New-LiquidCrystal

    - name: LCD_SAINSMART_I2C_2004
      description: Generic LCM1602 16×2 character LCD.
      interface: I2C
      url: github.com/fmalpartida/New-LiquidCrystal

    - name: LCM1602
      description: Generic LCM1602 16×2 character LCD.
      interface: I2C
      protocol: LCM1602

    - name: LCD_I2C_PANELOLU2
      description: PANELOLU2 LCD with status LEDs, separate encoder and click inputs.
      interface: I2C

    - name: LCD_I2C_VIKI
      description: Panucatt VIKI LCD with status LEDs, integrated click & L/R/U/D buttons, separate encoder inputs.
      interface: I2C

    - name: SAV_3DLCD
      description: 2-wire Non-latching LCD SR.
      interface: 2-wire
      url: [ github.com/fmalpartida/New-LiquidCrystal, reprap.org/wiki/SAV_3D_LCD ]

    - name: FF_INTERFACEBOARD
      description: 3-wire SR LCD with strobe using 74HC4094. Using code from Sailfish.
      interface: 3-wire
      protocol: 74HC4094
      url: github.com/mikeshub/SailfishLCD

    - name: TFTGLCD_PANEL_SPI
      description: TFT GLCD Panel with Marlin UI with SPI controller.
      interface: SPI

    - name: TFTGLCD_PANEL_I2C
      description: TFT GLCD Panel with Marlin UI with I2C controller.
      interface: I2C
      url: github.com/Serhiy-K/TFTGLCDAdapter

  #
  # MONO BITMAP DISPLAYS
  #

  - name: Mono Bitmap Displays
    summary: A bitmap display. Pixels can be individually controlled to form images and text.
    description: |
      A bitmap display. Pixels can be individually controlled to form images and text.
      Displays like `REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER`
      More details pending…
    controllers:

    - name: REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER
      description: |
        One of the most common mono bitmap displays. Comes in white and red PCBs.
        - 128×64 pixel LCD panel
        - SD Card reader
        - Reset button
        - Rotary encoder click wheel
        - Buzzer
      images:
        - alt: RDFGSC
          front: RDFGSC
          back: RDFGSC

    - name: K3D_FULL_GRAPHIC_SMART_CONTROLLER
      description: K.3D Full Graphic Smart Controller.

    - name: REPRAPWORLD_GRAPHICAL_LCD
      description: ReprapWorld Graphical LCD.
      url: reprapworld.com/electronics/3d-printer-modules/autonomous-printing/graphical-lcd-screen-v1-0/

    - name: VIKI2
      description: Panucatt mini Viki with Graphic LCD
      url: www.panucatt.com

    - name: miniVIKI
      description: Panucatt mini Viki with Graphic LCD
      url: www.panucatt.com

    - name: WYH_L12864
      description: Alfawise Ex8 printer LCD marked as WYH L12864 COG

    - name: MINIPANEL
      description: MakerLab Mini Panel with graphic controller and SD Support.
      url: reprap.org/wiki/Mini_panel

    - name: MAKRPANEL
      description: MaKr3d Makr-Panel with graphic controller and SD support.
      url: reprap.org/wiki/MaKr3d_MaKrPanel

    - name: ELB_FULL_GRAPHIC_CONTROLLER
      description: Adafruit ST7565 Full Graphic Controller.
      url: github.com/eboston/Adafruit-ST7565-Full-Graphic-Controller/

    - name: BQ_LCD_SMART_CONTROLLER
      description: BQ LCD Smart Controller included with the BQ Hephestos 2 and Witbox 2.

    - name: CARTESIO_UI
      description: Cartesio UI display with ADC keypad.
      url: mauk.cc/webshop/cartesio-shop/electronics/user-interface

    - name: LCD_FOR_MELZI
      description: |
        LCD for Melzi board with Graphical LCD.
        - 128×64 LCD panel
        - Reset button
        - Rotary encoder click wheel
        - Buzzer
      images:
        - alt: LCD_FOR_MELZI
          front: LCD_FOR_MELZI
          back: LCD_FOR_MELZI

    - name: ULTI_CONTROLLER
      description: Original Ulticontroller from Ultimaker 2 printer with SSD1309 I2C display and encoder.
      url: github.com/Ultimaker/Ultimaker2/tree/master/1249_Ulticontroller_Board_(x1)
      interface: SPI
      protocol: SSD1309

    - name: MKS_MINI_12864
      description: MKS MINI12864 with graphic controller and SD support.
      url: reprap.org/wiki/MKS_MINI_12864

    - name: MKS_MINI_12864_V3
      description: |
        MKS MINI12864 V3 is an alias for FYSETC_MINI_12864_2_1. Type A/B.
        - 128×64 pixel LCD panel
        - SD Card reader
        - Reset button
        - Rotary encoder click wheel
        - Buzzer
        - NeoPixel backlight
        - Option of a front or side facing SD slot.
      images:
        - alt: MKS_MINI_12864_V3
          front: MKS_MINI_12864_V3
          back: MKS_MINI_12864_V3

    - name: MKS_LCD12864A
      description: |
        Uses the MKS_MINI_12864 pinout. Designed for 5V 8-bit motherboards.
        - 128×64 pixel LCD panel
        - SD Card reader
        - Reset button
        - Rotary encoder click wheel
        - Speaker
        - *Some have a jumper on the back to switch logic level voltage
      images:
        - alt: MKS_LCD12864A
          front: MKS_LCD12864A
          back: MKS_LCD12864A

    - name: MKS_LCD12864B
      description: |
        Uses the MKS_MINI_12864 pinout. Designed for 3.3V 32-bit motherboards.
        - 128×64 pixel LCD panel
        - SD Card reader
        - Reset button
        - Rotary encoder click wheel
        - Speaker
      images:
        - alt: MKS_LCD12864B
          front: MKS_LCD12864B
          back: MKS_LCD12864B

    - name: FYSETC_MINI_12864_X_X
      description: FYSETC variant of the MINI12864 graphic controller with SD support. Type C/D/E/F. No tunable RGB backlight by default.

    - name: FYSETC_MINI_12864_1_2
      description: |
        FYSETC variant of the MINI12864 graphic controller. Type C/D/E/F.
        - 128×64 pixel LCD panel
        - SD Card reader
        - Reset button
        - Rotary encoder click wheel
        - Buzzer
        - RGB backlight (no PWM)

    - name: FYSETC_MINI_12864_2_0
      description: |
        FYSETC variant of the MINI12864 graphic controller. Type A/B.
        - 128×64 pixel LCD panel
        - SD Card reader
        - Reset button
        - Rotary encoder click wheel
        - Buzzer
        - RGB LEDs backlight

    - name: FYSETC_MINI_12864_2_1
      description: |
        FYSETC variant of the MINI12864 graphic controller. Type A/B.
        - 128×64 pixel LCD panel
        - SD Card reader
        - Reset button
        - Rotary encoder click wheel
        - Buzzer
        - NeoPixel backlight
      images:
        - alt: FYSETC_MINI_12864_2_1
          front: FYSETC_MINI_12864_2_1
          back: FYSETC_MINI_12864_2_1

    - name: FYSETC_GENERIC_12864_1_1
      description: |
        Larger display with basic ON/OFF backlight.
        - 128×64 pixel LCD panel
        - SD Card reader
        - Reset button
        - Rotary encoder click wheel
        - Buzzer

    - name: BTT_MINI_12864
      description: |
        BigTreeTech Mini 12864 V1.0. Clone of FYSETC_MINI_12864_2_1. Type A/B.
        - 128×64 pixel LCD panel
        - SD Card reader
        - Reset button
        - Rotary encoder click wheel
        - Buzzer
        - NeoPixel backlight
      images:
        - alt: BTT_MINI_12864
          front: BTT_MINI_12864
          back: BTT_MINI_12864

    - name: CR10_STOCKDISPLAY
      description: |
        Factory display for Creality CR-10, and one of the most common Creality mono bitmap displays.
        - 128×64 pixel LCD panel
        - Rotary encoder click wheel
        - Buzzer
        - Can be configured as a REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER
      url: www.aliexpress.com/item/32833148327.html
      images:
        - alt: CR10_STOCK
          front: CR10_STOCK
          back: CR10_STOCK

    - name: ENDER2_STOCKDISPLAY
      description: |
        Ender-2 OEM display, a variant of the MKS_MINI_12864.
        - 128×64 pixel LCD panel
        - Rotary encoder click wheel
      images:
        - alt: ENDER2_STOCK
          front: ENDER2_STOCK
          back: ENDER2_STOCK

    - name: ANET_FULL_GRAPHICS_LCD
      also: ANET_FULL_GRAPHICS_LCD_ALT_WIRING
      description: |
        Anet 128×64 full graphics lcd with rotary encoder as used on Anet A6.
        A clone of the RepRapDiscount full graphics display but with different
        pins/wiring (see pins_ANET_10.h).
        - 128x64 pixel LCD panel
        - Reset button
        - Rotary encoder click wheel
        - Buzzer
        - Option for a Bluetooth module
      images:
        - alt: ANET_FULL_GRAPHICS_LCD
          front: ANET_FULL_GRAPHICS_LCD
          back: ANET_FULL_GRAPHICS_LCD

    - name: CTC_A10S_A13
      since: 2.1.3
      description: |
        - 128×64 pixel LCD panel
        - Rotary encoder click wheel
        - Option for a Buzzer
      images:
        - alt: CTC_A10S_A13
          front: CTC_A10S_A13
          back: CTC_A10S_A13

    - name: AZSMZ_12864
      description: AZSMZ 12864 LCD with SD.
      url: www.aliexpress.com/item/32837222770.html

    - name: SILVER_GATE_GLCD_CONTROLLER
      description: Silvergate GLCD controller.
      url: github.com/android444/Silvergate

    - name: EMOTION_TECH_LCD
      description: eMotion Tech LCD with SD.
      url: www.reprap-france.com/produit/1234568748-ecran-graphique-128-x-64-points-2-1

    - name: U8GLIB_SSD1306
      description: Generic OLED full graphics display (SSD1306).
      interface: SPI
      protocol: SSD1306

    - name: SAV_3DGLCD
      description: SAV OLEd LCD based on SSD1306 or SH1106.
      interface: SPI
      protocol: [ SSD1306, SH1106 ]

    - name: OLED_PANEL_TINYBOY2
      description: TinyBoy2 128×64 OLED / Encoder Panel.

    - name: MKS_12864OLED
      description: MKS OLED 1.3" 128×64 Full Graphics Controller (SH1106). A tiny but very sharp OLED display.
      interface: SPI
      protocol: SH1106

    - name: MKS_12864OLED_SSD1306
      description: MKS OLED 1.3" 128×64 Full Graphics Controller (SSD1306).  A tiny but very sharp OLED display.
      interface: SPI
      protocol: SSD1306

    - name: ZONESTAR_12864LCD
      description: Zonestar OLED 128×64 Full Graphics Controller (ST7920).
      interface: SPI
      protocol: ST7920

    - name: ZONESTAR_12864OLED
      description: Zonestar OLED 128×64 Full Graphics Controller (SH1106).
      interface: SPI
      protocol: SH1106

    - name: ZONESTAR_12864OLED_SSD1306
      description: Zonestar OLED 128×64 Full Graphics Controller (SSD1306).
      interface: SPI
      protocol: SSD1306

    - name: U8GLIB_SH1106_EINSTART
      description: Einstart S OLED (SSD1306).
      interface: SPI
      protocol: SSD1306

    - name: OVERLORD_OLED
      description: Overlord OLED display/controller with i2c buzzer and LEDs.

    - name: FYSETC_242_OLED_12864
      description: FYSETC OLED 2.42" 128×64 Full Graphics Controller with WS2812 RGB.
      url: www.aliexpress.com/item/4000345255731.html

    - name: K3D_242_OLED_CONTROLLER
      description: K.3D OLED 2.42" 128×64 Full Graphics Controller.
      interface: SSD1309

  #
  # COLOR GRAPHICAL DISPLAYS
  #

  - name: Color Graphical Displays
    summary: Color images and text can be displayed.
    controllers:

    - name: MKS_TS35_V2_0
      description: |
        3.5" TFT Display From MKS. Usually paired with MKS Robin Nano V2 & V3.
        - 480×320
        - 3.5"
        - SPI
        - Reset* (* some are not populated)
        - Rotary encoder click wheel
        - Buzzer
      images:
        - alt: MKS_TS35_V2_0
          front: MKS_TS35_V2_0
          back: MKS_TS35_V2_0

    - name: MKS_ROBIN_TFT24
      description: |
        2.4" TFT Display From MKS. Usually paired with MKS Robin Nano V1.2
        - 320×240
        - 2.4"
        - FSMC
        - Buzzer

    - name: MKS_ROBIN_TFT28
      description: |
        2.8" TFT Display From MKS. Usually paired with MKS Robin Nano V1.2
        - 320×240
        - 2.8"
        - FSMC
        - Buzzer

    - name: MKS_ROBIN_TFT32
      description: |
        3.2" TFT Display From MKS. Usually paired with MKS Robin Nano V1.2
        - 320×240
        - 3.2"
        - FSMC
        - Buzzer

    - name: MKS_ROBIN_TFT35
      description: |
        3.5" TFT Display From MKS. Usually paired with MKS Robin Nano V1.2
        - 480×320
        - 3.5"
        - FSMC
        - Buzzer
      images:
        - alt: MKS_ROBIN_TFT35
          front: MKS_ROBIN_TFT35
          back: MKS_ROBIN_TFT35
      videos: [ EWMw57MFD3c ]

    - name: MKS_ROBIN_TFT43
      description: |
        4.3" TFT Display From MKS. Usually paired with MKS Robin.
        - 480×272
        - 4.3"
        - FSMC

    - name: MKS_ROBIN_TFT_V1_1R
      description: |
        3.2" TFT Display From MKS. Usually paired with MKS Robin.
        - 320×240
        - 3.2"
        - FSMC

    - name: TFT_TRONXY_X5SA
      description: |
        Stock display from Tronxy.
        - 480×320
        - 3.5"
        - FSMC
      interface: FSMC
      size: 3.5"
      res: 480×320
      images:
        - alt: TFT_TRONXY_X5SA
          front: TFT_TRONXY_X5SA
          back: TFT_TRONXY_X5SA

    - name: ANYCUBIC_TFT35
      description: Stock display from AnyCubic.
      interface: FSMC

    - name: LONGER_LK_TFT28
      description: |
        Stock display from Longer/Alfawise.
        - 320×240
        - 2.8"
        - FSMC
      interface: FSMC
      size: 2.8"
      res: 320×240

    - name: ANET_ET4_TFT28
      description: |
        Stock display from the Anet ET4.
        - 320×240
        - 2.8"
        - FSMC
      interface: FSMC
      size: 2.8"
      res: 320×240

    - name: ANET_ET5_TFT35
      description: |
        Stock display from the Anet ET5.
        - 480×320
        - 3.5"
        - FSMC 
      interface: FSMC
      size: 3.5"
      res: 480×320

    - name: BIQU_BX_TFT70
      description: |
        7" stock display included with the BIQU BX.
        - 1024×600
        - 7"
        - Rotary encoder click wheel

    - name: BTT_TFT35_SPI_V1_0
      description: 480×320, 3.5", SPI Stock Display with Rotary Encoder from BIQU B1 SE Series

  #
  # SMART DISPLAYS
  #

  - name: Smart Displays
    summary: A display with its own controller and custom protocol. Typically based on DWIN / DGUS.
    controllers:

    - name: DGUS_LCD_UI (ORIGIN|RELOADED|IA_CREALITY)
      description: |
        TFT touchscreen included with the Ender-5+ and Ender-6.
        - 480×272
        - 4.3"
        - Serial (DWIN T5UID1)
      interface: Serial
      protocol: T5UID1
      images:
        - alt: T5UID1
          back: T5UID1

    - name: DGUS_LCD_UI FYSETC
      description:

    - name: DGUS_LCD_UI HIPRECY
      description:

    - name: DGUS_LCD_UI MKS
      description: |
        - 480*800
        - 4.3"
        - Serial (DWIN T5LC18)
      interface: Serial
      protocol: T5LC18
      images:
        - alt: T5LC18
          back: T5LC18

    - name: DGUS_LCD_UI HIPRECY
      description:

    - name: DGUS_LCD_UI E3S1PRO
      description: |
        Touchscreen found in E3S1PRO
        - 480×800
        - 4.3"
        - Serial (DWIN T5LC1)
      interface: Serial
      protocol: T5LC1
      images:
        - alt: T5LC1
          back: T5LC1

    - name: DGUS_LCD_UI CREALITY_TOUCH
      since: 2.1.4
      description: TFT touchscreen included with the Ender-5 S1.

    - name: MALYAN_LCD
      description: Touchscreen LCD included with the Malyan M200/M300.

    - name: TOUCH_UI_FTDI_EVE
      description: Touch UI for FTDI EVE (FT800/FT810) displays for Lulzbot printers.

    - name: ANYCUBIC_LCD_CHIRON
      description: Touchscreen included with the Anycubic Chiron.

    - name: ANYCUBIC_LCD_I3MEGA
      description: Touchscreen included with the Anycubic i3 Mega.

    - name: ANYCUBIC_LCD_VYPER
      description: Touchscreen included with the Anycubic Vyper.

    - name: NEXTION_TFT
      description: 320×240 Nextion 2.8" serial TFT Resistive Touch Screen. Model NX3224T028.

    - name: EXTENSIBLE_UI
      description: Not a specific display but a generic API to support third-party or vendor-customized controllers.

    - name: DWIN_CREALITY_LCD
      description: |
        Display included with the Creality Ender-3 V2. There are several variants of this display. This selects the Creality UI with Chinese language support.
        - 480×272
        - 4.3"
        - Serial (DWIN T5UIC1)
        - Rotary encoder click wheel
        - Buzzer
      interface: Serial
      protocol: T5UIC1
      images:
        - alt: T5UIC1
          back: [ T5UIC1_DWIN, T5UIC1_DACAI, T5UIC1_SYNWIT1, T5UIC1_SYNWIT2, T5UIC1_TJC ]

    - name: DWIN_LCD_PROUI
      description: Creality Ender-3 V2 display with ProUI.

    - name: DWIN_CREALITY_LCD_JYERSUI
      description: Creality Ender-3 V2 display with JyersUI.

    - name: DWIN_MARLINUI_PORTRAIT
      description: Creality Ender-3 V2 display with MarlinUI in portrait orientation.

    - name: DWIN_MARLINUI_LANDSCAPE
      description: Creality Ender-3 V2 display with MarlinUI in landscape orientation.

  #
  # G-CODE HOSTS
  #

  - name: G-code Hosts
    summary: Serial-connected controllers work like a host and send commands to Marlin using G-code.
    description: |
      Displays like BTT TFT
      More details pending…
    controllers:

    - name: PANELDUE
      since: 2.1.4
      description: Serial controller by Duet included with the E3D Toolchanger.

---

### General information
Marlin supports a wide variety of display controllers, from simple character-based displays and monochrome graphics displays to high resolution color displays that can even display G-code previews.

{:.pretty-list.headless}
{% for group in page.groups %}{% if group.name %}`{{ group.name }}`|{% if group.summary %}{{ group.summary }}{% endif %}
{% endif %}{% endfor %}

<!-- begin: Generated by Jekyll -->
{% assign fldr = '/assets/images/hardware/controllers/' %}
{% for group in page.groups %}
{% if group.name %}{{ group.name | prepend: '### ' | markdownify }}{% endif %}
{% if group.controllers %}
{% for cont in group.controllers %}
{{ cont.name | prepend: '#### ' | markdownify }}
<div class="lcd">
{% if cont.images %}
<div class="gallery">
  {% for videoid in cont.videos %}
    <iframe class="youtube rj" width="300" height="225" src="https://youtube.com/embed/{{ videoid }}"></iframe>
  {% endfor %}
  {% for img in cont.images %}
    {% if img.front %}<a href="{{ fldr }}{{ img.front }}_front.jpg" target="_blank" title="{{ img.alt }} Front"><img src="{{ fldr }}{{ img.front }}_front_thumb.jpg" alt="{{ img.alt }} Front"></a>{% endif %}
    {% if img.back -%}
      {% if img.back.size > 1 %}
        {% for bimg in img.back %}
          <a href="{{ fldr }}{{ bimg }}_back.jpg" target="_blank" title="{{ img.alt }} Back"><img src="{{ fldr }}{{ bimg }}_back_thumb.jpg" alt="{{ img.alt }} Back"></a>
        {% endfor %}
      {% else %}
        <a href="{{ fldr }}{{ img.back }}_back.jpg" target="_blank" title="{{ img.alt }} Back"><img src="{{ fldr }}{{ img.back }}_back_thumb.jpg" alt="{{ img.alt }} Back"></a>
      {% endif %}
    {%- endif %}
  {% endfor %}
</div>
{% endif %}
<div class="desc">{% if cont.description %}{{ cont.description | markdownify }}{% else %}{{ "[Please contribute…](/docs/development/contributing.html#contribute-documentation)" | markdownify }}{% endif %}</div>
</div>
{% endfor %}
{% else %}
**[Please contribute…](/docs/development/contributing.html#contribute-documentation)**
{% endif %}
{% endfor %}
<!-- end: Generated by Jekyll -->
