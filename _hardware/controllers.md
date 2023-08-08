---
title: Controllers and LCDs
description: Controllers and LCDs supported by Marlin
tag: info

author: ellensp
contrib: thinkyhead
category: [ info, hardware, lcd  ]

groups:
  - name: Character-based LCDs
    summary: The character set is stored in ROM on the display, but a few custom characters may be defined.
    controllers:

    - name: REPRAP_DISCOUNT_SMART_CONTROLLER
      description: |
        One of the most common character displays. Comes in white and red PCBs
        - 4×20 character LCD panel
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
        - 4×20 character LCD panel
        - Reset button
        - Combined rotary encoder and push button for menu control
        - Buzzer
      images:
        - alt: YHCB2004
          front: YHCB2004
          back: YHCB2004

    - name: RADDS_DISPLAY
      description: |
        - 4×20 character LCD panel
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
        - 4×20 character LCD panel
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
        - 4×20 character LCD panel
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
        - 4×20 character LCD panel
        - Combined rotary encoder and push button for menu control
      images:
        - alt: G3D Panel
          front: G3DPANEL

    - name: RIGIDBOT_PANEL
      description: <https://www.inventapart.com/>

    - name: MAKEBOARD_MINI_2_LINE_DISPLAY_1602
      description: |
        - 2×16 character LCD panel
        - Reset button
        - SD Card reader
        - Combined rotary encoder and push button for menu control
      images:
        - alt: Makeboard Mini
          front: MAKEBOARD_MINI_2_LINE_DISPLAY
          back: MAKEBOARD_MINI_2_LINE_DISPLAY

    - name: ZONESTAR_LCD
      description: |
        - 4×20 character LCD panel
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
      More to come...
    controllers:

    - name: REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER
      description: |
        One of the most common mono bitmap displays. Comes in white and red PCBs
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
      description:

    - name: ULTI_CONTROLLER
      description:

    - name: MKS_MINI_12864
      description:

    - name: MKS_MINI_12864_V3
      description:

    - name: MKS_LCD12864A/MKS_LCD12864B
      description:

    - name: FYSETC_MINI_12864_X_X
      description:

    - name: FYSETC_MINI_12864_1_2
      description:

    - name: FYSETC_MINI_12864_2_0
      description:

    - name: FYSETC_MINI_12864_2_1
      description:

    - name: FYSETC_GENERIC_12864_1_1
      description:

    - name: BTT_MINI_12864_V1
      description:

    - name: CR10_STOCKDISPLAY
      description:

    - name: ENDER2_STOCKDISPLAY
      description:

    - name: ANET_FULL_GRAPHICS_LCD
      description:

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
    summary: Color images and text can be displayed. Typically based on DWIN / DGUS.
    description: |
      Color images and text can be displayed. Typically based on DWIN / DGUS.
      Displays like `MKS_TS35_V2_0`
      More to come...
    controllers:

  - name: Smart Displays
    summary: A display with its own controller and custom protocol.
    description: |
      Displays like E3V2
      More to come...
    controllers:

  - name: G-code Hosts
    summary: Serial-connected controllers can work like a host and command Marlin using G-code.
    description: |
      Displays like BTT TFT
      More to come...
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
  {% for img in cont.images %}
    {% if img.front %}<a href="{{ fldr }}{{ img.front }}_front.jpg" target="_blank" title="{{ img.alt }} Front"><img src="{{ fldr }}{{ img.front }}_front_thumb.jpg" alt="{{ img.alt }} Front"></a>{% endif %}
    {% if img.back %}<a href="{{ fldr }}{{ img.back }}_back.jpg" target="_blank" title="{{ img.alt }} Back"><img src="{{ fldr }}{{ img.back }}_back_thumb.jpg" alt="{{ img.alt }} Back"></a>{% endif %}
  {% endfor %}
</div>
{% endif %}
<div class="desc">{% if cont.description %}{{ cont.description | markdownify }}{% else %}More to come…{% endif %}</div>
</div>
{% endfor %}
{% else %}
**More to come…**
{% endif %}
{% endfor %}
<!-- end: Generated by Jekyll -->
