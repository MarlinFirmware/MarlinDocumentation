---
title: Controllers and displays
description: Controllers and displays supported by Marlin
tag: info

author: ellensp
contrib: thinkyhead
category: [ info, hardware, lcd, wip ]

groups:
  - name: Character-based LCDs
    summary: The character set is stored in ROM on the display, but a few custom characters may be defined.
    controllers:

    - name: REPRAP_DISCOUNT_SMART_CONTROLLER
      description: |
        One of the most common character displays. Comes in white and red PCBs
        - 20×4 character LCD panel
        - SD Card reader
        - Reset button
        - Combined rotary encoder and push button for menu control
        - Buzzer
      images:
        - alt: RRDSC
          front: RDSC
          back: RDSC

    - name: YHCB2004
      description: |
        - 20×4 character LCD panel
        - Reset button
        - Combined rotary encoder and push button for menu control
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
        - Combined rotary encoder and push button for menu control
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
        - Combined rotary encoder and push button for menu control
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
        - Combined rotary encoder and push button for menu control
        - Potentiometer for LCD contrast adjustment
        - Potentiometer for LCD brightness adjustment
      images:
        - alt: PANELONE
          front: PANELONE
          back: PANELONE

    - name: G3D_PANEL
      description: |
        - 20×4 character LCD panel
        - Combined rotary encoder and push button for menu control
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
        - Combined rotary encoder and push button for menu control
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
      description:

    - name: RA_CONTROL_PANEL
      description: <https://www.elefu.com/index.php?route=product/product&product_id=53>

    - name: LCD_SAINSMART_I2C_1602
      description:

    - name: LCD_SAINSMART_I2C_2004
      description:

    - name: LCM1602
      description:

    - name: LCD_I2C_PANELOLU2
      description:

    - name: LCD_I2C_VIKI
      description:

    - name: SAV_3DLCD
      description: |
          2-wire Non-latching LCD SR from <https://goo.gl/aJJ4sH>
          LCD configuration: <https://reprap.org/wiki/SAV_3D_LCD>

    - name: FF_INTERFACEBOARD
      description: <https://github.com/mikeshub/SailfishLCD>

    - name: TFTGLCD_PANEL_SPI
      description:

    - name: TFTGLCD_PANEL_I2C
      description: See <https://github.com/Serhiy-K/TFTGLCDAdapter>

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
        - 128x64 pixel LCD panel
        - SD Card reader
        - Reset button
        - Combined rotary encoder and push button for menu control
        - Buzzer
      images:
        - alt: RDFGSC
          front: RDFGSC
          back: RDFGSC

    - name: K3D_FULL_GRAPHIC_SMART_CONTROLLER
      description:

    - name: REPRAPWORLD_GRAPHICAL_LCD
      description:

    - name: VIKI2
      description:

    - name: miniVIKI
      description:

    - name: WYH_L12864
      description:

    - name: MINIPANEL
      description:

    - name: MAKRPANEL
      description:

    - name: ELB_FULL_GRAPHIC_CONTROLLER
      description:

    - name: BQ_LCD_SMART_CONTROLLER
      description:

    - name: CARTESIO_UI
      description:

    - name: LCD_FOR_MELZI
      description: |
        - 128x64 pixel LCD panel
        - Reset button
        - Combined rotary encoder and push button for menu control
        - Buzzer
      images:
        - alt: LCD_FOR_MELZI
          front: LCD_FOR_MELZI
          back: LCD_FOR_MELZI

    - name: ULTI_CONTROLLER
      description:

    - name: MKS_MINI_12864
      description:

    - name: MKS_MINI_12864_V3
      description:

    - name: MKS_LCD12864A
      description: |
        Designed for 5V 8-bit motherboards.
        - 128x64 pixel LCD panel
        - SD Card reader
        - Reset button
        - Combined rotary encoder and push button for menu control
        - Speaker
        - *Some have a jumper on the back to switch logic level voltage
      images:
        - alt: MKS_LCD12864A
          front: MKS_LCD12864A
          back: MKS_LCD12864A

    - name: MKS_LCD12864B
      description: |
        Designed for 3.3V 32-bit motherboards.
        - 128x64 pixel LCD panel
        - SD Card reader
        - Reset button
        - Combined rotary encoder and push button for menu control
        - Speaker
      images:
        - alt: MKS_LCD12864B
          front: MKS_LCD12864B
          back: MKS_LCD12864B

    - name: FYSETC_MINI_12864_X_X
      description:

    - name: FYSETC_MINI_12864_1_2
      description: |
        - 128x64 pixel LCD panel
        - Reset button
        - Combined rotary encoder and push button for menu control
        - Buzzer
        - RGB backlight (no PWM)

    - name: FYSETC_MINI_12864_2_0
      description: |
        - 128x64 pixel LCD panel
        - Reset button
        - Combined rotary encoder and push button for menu control
        - Buzzer
        - RGB LEDs backlight

    - name: FYSETC_MINI_12864_2_1
      description: |
        - 128x64 pixel LCD panel
        - Reset button
        - Combined rotary encoder and push button for menu control
        - Buzzer
        - Neopixel backlight
      images:
        - alt: FYSETC_MINI_12864_2_1
          front: FYSETC_MINI_12864_2_1
          back: FYSETC_MINI_12864_2_1

    - name: FYSETC_GENERIC_12864_1_1
      description: |
        Larger display with basic ON/OFF backlight.
        - 128x64 pixel LCD panel
        - Reset button
        - Combined rotary encoder and push button for menu control
        - Buzzer

    - name: BTT_MINI_12864
      description: |
        Clone of FYSETC_MINI_12864_2_1
        - 128x64 pixel LCD panel
        - Reset button
        - Combined rotary encoder and push button for menu control
        - Buzzer
        - Neopixel backlight
      images:
        - alt: BTT_MINI_12864
          front: BTT_MINI_12864
          back: BTT_MINI_12864

    - name: CR10_STOCKDISPLAY
      description: |
        One of the most common Creality mono bitmap displays.
        - 128x64 pixel LCD panel
        - Combined rotary encoder and push button for menu control
        - Buzzer
        - Cen be configuraed as a REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER
      images:
        - alt: CR10_STOCK
          front: CR10_STOCK
          back: CR10_STOCK

    - name: ENDER2_STOCKDISPLAY
      description: |
        - 128x64 pixel LCD panel
        - Combined rotary encoder and push button for menu control
      images:
        - alt: ENDER2_STOCK
          front: ENDER2_STOCK
          back: ENDER2_STOCK

    - name: ANET_FULL_GRAPHICS_LCD
      description: |
        - 128x64 pixel LCD panel
        - Reset button
        - Combined rotary encoder and push button for menu control
        - Buzzer
        - Option for a Bluetooth module
      images:
        - alt: ANET_FULL_GRAPHICS_LCD
          front: ANET_FULL_GRAPHICS_LCD
          back: ANET_FULL_GRAPHICS_LCD

    - name: CTC_A10S_A13
      description: |
        - 128x64 pixel LCD panel
        - Combined rotary encoder and push button for menu control
        - Option for a Buzzer
      images:
        - alt: CTC_A10S_A13
          front: CTC_A10S_A13
          back: CTC_A10S_A13

    - name: AZSMZ_12864
      description:

    - name: SILVER_GATE_GLCD_CONTROLLER
      description:

    - name: EMOTION_TECH_LCD
      description:

    - name: U8GLIB_SSD1306
      description:

    - name: OLED_PANEL_TINYBOY2
      description:

    - name: MKS_12864OLED
      description:

    - name: MKS_12864OLED_SSD1306
      description:

    - name: ZONESTAR_12864LCD
      description:

    - name: ZONESTAR_12864OLED
      description:

    - name: ZONESTAR_12864OLED_SSD1306
      description:

    - name: U8GLIB_SH1106_EINSTART
      description:

    - name: OVERLORD_OLED
      description:

    - name: FYSETC_242_OLED_12864
      description:

    - name: K3D_242_OLED_CONTROLLER
      description:

  - name: Color Graphical Displays
    summary: Color images and text can be displayed.
    controllers:

    - name: MKS_TS35_V2_0
      description: |
        Usually paired with MKS Robin Nano V2 & V3
        - 480x320
        - 3.5"
        - SPI
        - Reset* (* some are not populated)
        - Combined rotary encoder and push button
        - Buzzer
      images:
        - alt: MKS_TS35_V2_0
          front: MKS_TS35_V2_0
          back: MKS_TS35_V2_0


    - name: MKS_ROBIN_TFT24
      description: |
        Usually paired with MKS Robin Nano V1.2
        - 320x240
        - 2.4"
        - FSMC
        - Buzzer

    - name: MKS_ROBIN_TFT28
      description: |
        Usually paired with MKS Robin Nano V1.2
        - 320x240
        - 2.8"
        - FSMC
        - Buzzer

    - name: MKS_ROBIN_TFT32
      description: |
        Usually paired with MKS Robin Nano V1.2
        - 320x240
        - 3.2"
        - FSMC
        - Buzzer

    - name: MKS_ROBIN_TFT35
      description: |
        Usually paired with MKS Robin Nano V1.2
        - 480x320
        - 3.5"
        - FSMC
        - Buzzer
      images:
        - alt: MKS_ROBIN_TFT35
          front: MKS_ROBIN_TFT35
          back: MKS_ROBIN_TFT35
      videos: [ EWMw57MFD3c ]

    - name: MKS_ROBIN_TFT43
      description:

    - name: MKS_ROBIN_TFT_V1_1R
      description:

    - name: TFT_TRONXY_X5SA
      description:

    - name: ANYCUBIC_TFT35
      description:

    - name: LONGER_LK_TFT28
      description:

    - name: ANET_ET4_TFT28
      description:

    - name: ANET_ET5_TFT35
      description:

    - name: BIQU_BX_TFT70
      description:

    - name: BTT_TFT35_SPI_V1_0
      description:

  - name: Smart Displays
    summary: A display with its own controller and custom protocol.       Typically based on DWIN / DGUS.
    controllers:

    - name: DGUS_LCD_UI (ORIGIN|RELOADED|IA_CREALITY)
      description: |
        Touch screen found in Ender-5+ and Ender-6
        - 480x272
        - 4.3"
        - serial (DWIN T5UID1)
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
        - serial (DWIN T5LC18)
      images:
        - alt: T5LC18
          back: T5LC18

    - name: DGUS_LCD_UI HIPRECY
      description:

    - name: DGUS_LCD_UI E3S1PRO
      description: |
        Touch screen found in E3S1PRO
        - 480x800
        - 4.3"
        - serial (DWIN T5LC1)
      images:
        - alt: T5LC1
          back: T5LC1

    - name: DGUS_LCD_UI CREALITY_TOUCH
      description:

    - name: MALYAN_LCD
      description:

    - name: TOUCH_UI_FTDI_EVE
      description:

    - name: ANYCUBIC_LCD_CHIRON
      description:

    - name: ANYCUBIC_LCD_I3MEGA
      description:

    - name: ANYCUBIC_LCD_VYPER
      description:

    - name: NEXTION_TFT
      description:

    - name: PANELDUE
      description:

    - name: EXTENSIBLE_UI
      description:

    - name: DWIN_CREALITY_LCD

      description: |
        Usually paired with Creality Ender-3 V2. There are many clones of this board.
        - 480x272
        - 4.3"
        - Serial (DWIN T5UIC1)
        - Combined rotary encoder and push button
        - Buzzer

      images:
        - alt: T5UIC1
          back: [ T5UIC1_DWIN, T5UIC1_DACAI, T5UIC1_SYNWIT1, T5UIC1_SYNWIT2, T5UIC1_TJC ]

    - name: DWIN_LCD_PROUI
      description: The same hardware as `DWIN_CREALITY_LCD` with the ProUI user interface.

    - name: DWIN_CREALITY_LCD_JYERSUI
      description: The same hardware as `DWIN_CREALITY_LCD` with the JyersUI user interface.

    - name: DWIN_MARLINUI_PORTRAIT
      description: The same hardware as `DWIN_CREALITY_LCD` with the MarlinUI user interface in portrait orientation.

    - name: DWIN_MARLINUI_LANDSCAPE
      description: The same hardware as `DWIN_CREALITY_LCD` with the MarlinUI user interface in landscape orientation.

  - name: G-code Hosts
    summary: Serial-connected controllers can work like a host and command Marlin using G-code.
    description: |
      Displays like BTT TFT
      More details pending…
    controllers:

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
