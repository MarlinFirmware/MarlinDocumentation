---
title: Controllers and LCDs
description: Controllers and LCDs supported by Marlin
tag: info

author: ellensp
contrib: thinkyhead
category: [ info, hardware, lcd  ]
---

### General information

Marlin supports a wide variety of display controllers, from simple character-based displays and monochrome graphics displays to high resolution color displays that can even display G-code previews.

{:.pretty-list.headless}
`Character LCD`|The character set is stored in ROM on the display, but a few custom characters may be defined.
`Mono Bitmap Display`|A bitmap display. Pixels can be individually controlled to form images and text.
`Color Graphical Display`|Color images and text can be displayed. Typically based on DWIN / DGUS.
`Smart Display`|A display with its own controller and custom protocol.
`G-code Hosts`|Serial-connected controllers can work like a host and command Marlin using G-code.

### Character-based LCDs

##### REPRAP_DISCOUNT_SMART_CONTROLLER
One of the most common character displays.
- 4×20 character LCD panel
- SD Card reader
- Reset button
- Combined rotary encoder and push button for menu control
- Buzzer

[![RDSC Front](/assets/images/hardware/controllers/RDSC_front_thumb.jpg)](/assets/images/hardware/controllers/RDSC_front.jpg){:target="_blank"}
[![RDSC Back](/assets/images/hardware/controllers/RDSC_back_thumb.jpg)](/assets/images/hardware/controllers/RDSC_back.jpg){:target="_blank"}

##### YHCB2004
- 4×20 character LCD panel
- Reset button
- Combined rotary encoder and push button for menu control
- Buzzer

[![YHCB2004 Front](/assets/images/hardware/controllers/YHCB2004_front_thumb.jpg)](/assets/images/hardware/controllers/YHCB2004_front.jpg){:target="_blank"}
[![YHCB2004 Back](/assets/images/hardware/controllers/YHCB2004_back_thumb.jpg)](/assets/images/hardware/controllers/YHCB2004_back.jpg){:target="_blank"}

##### RADDS_DISPLAY
- 4×20 character LCD panel
- SD Card reader
- Back button
- Reset button
- Combined rotary encoder and push button for menu control
- Potentiometer for LCD contrast adjustment
- Buzzer

[![RADDS Front](/assets/images/hardware/controllers/RADDS_front_thumb.jpg)](/assets/images/hardware/controllers/RADDS_front.jpg){:target="_blank"}

##### ULTIMAKERCONTROLLER
##### ULTIPANEL
- 4×20 character LCD panel
- SD Card reader
- Combined rotary encoder and push button for menu control
- Potentiometer for LCD contrast adjustment
- Buzzer

[![ULTIPANEL Front](/assets/images/hardware/controllers/ULTIPANEL_front_thumb.jpg)](/assets/images/hardware/controllers/ULTIPANEL_front.jpg){:target="_blank"}
[![ULTIPANEL Back](/assets/images/hardware/controllers/ULTIPANEL_back_thumb.jpg)](/assets/images/hardware/controllers/ULTIPANEL_back.jpg){:target="_blank"}

##### PANEL_ONE
- 4×20 character LCD panel
- SD Card reader
- Combined rotary encoder and push button for menu control
- Potentiometer for LCD contrast adjustment
- Potentiometer for LCD brightness adjustment

[![PANELONE Front](/assets/images/hardware/controllers/PANELONE_front_thumb.jpg)](/assets/images/hardware/controllers/PANELONE_front.jpg){:target="_blank"}
[![PANELONE Back](/assets/images/hardware/controllers/PANELONE_back_thumb.jpg)](/assets/images/hardware/controllers/PANELONE_back.jpg){:target="_blank"}

##### G3D_PANEL
- 4×20 character LCD panel
- Combined rotary encoder and push button for menu control

[![G3D Panel Front](/assets/images/hardware/controllers/G3DPANEL_front_thumb.jpg)](/assets/images/hardware/controllers/G3DPANEL_front.jpg){:target="_blank"}

##### RIGIDBOT_PANEL
<!-- https://www.inventapart.com/ -->

##### MAKEBOARD_MINI_2_LINE_DISPLAY_1602
- 2×16 character LCD panel
- Reset button
- SD Card reader
- Combined rotary encoder and push button for menu control

[![Makeboard Mini Front](/assets/images/hardware/controllers/MAKEBOARD_MINI_2_LINE_DISPLAY_front_thumb.jpg)](/assets/images/hardware/controllers/MAKEBOARD_MINI_2_LINE_DISPLAY_front.jpg){:target="_blank"}
[![Makeboard Mini Back](/assets/images/hardware/controllers/MAKEBOARD_MINI_2_LINE_DISPLAY_back_thumb.jpg)](/assets/images/hardware/controllers/MAKEBOARD_MINI_2_LINE_DISPLAY_back.jpg){:target="_blank"}

##### ZONESTAR_LCD
- 4×20 character LCD panel
- 5 Menu buttons

[![Zonestar LCD Front](/assets/images/hardware/controllers/ZONESTAR_LCD_front_thumb.jpg)](/assets/images/hardware/controllers/ZONESTAR_LCD_front.jpg){:target="_blank"}
[![Zonestar LCD Back](/assets/images/hardware/controllers/ZONESTAR_LCD_back_thumb.jpg)](/assets/images/hardware/controllers/ZONESTAR_LCD_back.jpg){:target="_blank"}

##### ULTRA_LCD

##### RA_CONTROL_PANEL
<!-- https://www.elefu.com/index.php?route=product/product&product_id=53 -->

##### LCD_SAINSMART_I2C_1602

##### LCD_SAINSMART_I2C_2004

##### LCM1602

##### LCD_I2C_PANELOLU2

##### LCD_I2C_VIKI

##### SAV_3DLCD
<!--
  2-wire Non-latching LCD SR from https://goo.gl/aJJ4sH
  LCD configuration: https://reprap.org/wiki/SAV_3D_LCD
-->

##### FF_INTERFACEBOARD
<!-- https://github.com/mikeshub/SailfishLCD -->

##### TFTGLCD_PANEL_SPI

##### TFTGLCD_PANEL_I2C
<!-- See https://github.com/Serhiy-K/TFTGLCDAdapter -->

### Mono Bitmap Displays
To come...
Displays like REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER

### Color Graphical Displays
To come...
Displays like MKS_TS35_V2_0

### Smart Displays
To come...
Displays like E3V2

### G-code Hosts
To come...
Displays like BTT TFT
