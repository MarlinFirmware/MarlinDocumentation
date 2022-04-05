---
title:        'Display Controllers and LCDs'
description:  'Display Controllers and LCDs supported by Marlin'
tag: info

author: ellensp
contrib: thinkyhead
category: [ info, hardware, lcd  ]
---

### General information

Marlin supports a wide variety of display controllers, from simple character based displays, mono graphics displays through to color displays.

{:.pretty-list.headless}
`Character LCD`|The character definitions are stored in ROM on the display controller. Some custom characters are definable.
`Mono graphics display`|Display is a bitmap. Pixels are individually set and cleared to form images and text.
`Color graphical display`|Display is an array of data. Pixels are individually set and cleared to form images and text.
`Smart display`|Displays that have their own controller and custom protocols.
`G-code hosts`|These are small computers with displays acting as a host. These talk GCODE.

### Character based LCDs


##### REPRAP_DISCOUNT_SMART_CONTROLLER
One of the most common character displays.
4×20 characters LCD panel
SD Card reader
Reset button
Combined rotary encoder and push button for menu control
Buzzer

<a href="/assets/images/hardware/Display_Controllers/RDSC_front.jpg" ><img src="/assets/images/hardware/Display_Controllers/RDSC_front_thumb.jpg"/></a>
<a href="/assets/images/hardware/Display_Controllers/RDSC_back.jpg" ><img src="/assets/images/hardware/Display_Controllers/RDSC_back_thumb.jpg"/></a>


##### YHCB2004
4×20 characters LCD panel
Reset button
Combined rotary encoder and push button for menu control
Buzzer

<a href="/assets/images/hardware/Display_Controllers/YHCB2004_front.jpg" ><img src="/assets/images/hardware/Display_Controllers/YHCB2004_front_thumb.jpg"/></a>
<a href="/assets/images/hardware/Display_Controllers/YHCB2004_back.jpg" ><img src="/assets/images/hardware/Display_Controllers/YHCB2004_back_thumb.jpg"/></a>

##### RADDS_DISPLAY
4×20 characters LCD panel
SD Card reader
Back button
Reset button
Combined rotary encoder and push button for menu control
Potentiometer for LCD contrast adjustment
Buzzer

<a href="/assets/images/hardware/Display_Controllers/RADDS_front.jpg" ><img src="/assets/images/hardware/Display_Controllers/RADDS_front_thumb.jpg"/></a>

##### ULTIMAKERCONTROLLER
##### ULTIPANEL
4×20 characters LCD panel
SD Card reader
Combined rotary encoder and push button for menu control
Potentiometer for LCD contrast adjustment
Buzzer

<a href="/assets/images/hardware/Display_Controllers/ULTIPANEL_front.jpg" ><img src="/assets/images/hardware/Display_Controllers/ULTIPANEL_front_thumb.jpg"/></a>
<a href="/assets/images/hardware/Display_Controllers/ULTIPANEL_back.jpg" ><img src="/assets/images/hardware/Display_Controllers/ULTIPANEL_back_thumb.jpg"/></a>

##### PANEL_ONE
4×20 characters LCD panel
SD Card reader
Combined rotary encoder and push button for menu control
Potentiometer for LCD contrast adjustment
Potentiometer for LCD brightness adjustment

<a href="/assets/images/hardware/Display_Controllers/PANELONE_front.jpg" ><img src="/assets/images/hardware/Display_Controllers/PANELONE_front_thumb.jpg"/></a>
<a href="/assets/images/hardware/Display_Controllers/PANELONE_back.jpg" ><img src="/assets/images/hardware/Display_Controllers/PANELONE_back_thumb.jpg"/></a>

##### G3D_PANEL
4×20 characters LCD panel
Combined rotary encoder and push button for menu control

<a href="/assets/images/hardware/Display_Controllers/G3DPANEL_front.jpg" ><img src="/assets/images/hardware/Display_Controllers/G3DPANEL_front_thumb.jpg"/></a>

##### RIGIDBOT_PANEL
// http://www.inventapart.com/
##### MAKEBOARD_MINI_2_LINE_DISPLAY_1602
2×16 characters LCD panel
Reset button
SD Card reader
Combined rotary encoder and push button for menu control

<a href="/assets/images/hardware/Display_Controllers/MAKEBOARD_MINI_2_LINE_DISPLAY_front.jpg" ><img src="/assets/images/hardware/Display_Controllers/MAKEBOARD_MINI_2_LINE_DISPLAY_front_thumb.jpg"/></a>
<a href="/assets/images/hardware/Display_Controllers/MAKEBOARD_MINI_2_LINE_DISPLAY_back.jpg" ><img src="/assets/images/hardware/Display_Controllers/MAKEBOARD_MINI_2_LINE_DISPLAY_back_thumb.jpg"/></a>

##### ZONESTAR_LCD
4×20 characters LCD panel
5 Menu buttons

<a href="/assets/images/hardware/Display_Controllers/ZONESTAR_LCD_front.jpg" ><img src="/assets/images/hardware/Display_Controllers/ZONESTAR_LCD_front_thumb.jpg"/></a>
<a href="/assets/images/hardware/Display_Controllers/ZONESTAR_LCD_back.jpg" ><img src="/assets/images/hardware/Display_Controllers/ZONESTAR_LCD_back_thumb.jpg"/></a>

##### ULTRA_LCD
##### RA_CONTROL_PANEL
// http://www.elefu.com/index.php?route=product/product&product_id=53
##### LCD_SAINSMART_I2C_1602
##### LCD_SAINSMART_I2C_2004
##### LCM1602
##### LCD_I2C_PANELOLU2
##### LCD_I2C_VIKI
##### SAV_3DLCD
// 2-wire Non-latching LCD SR from https://goo.gl/aJJ4sH
// LCD configuration: https://reprap.org/wiki/SAV_3D_LCD
##### FF_INTERFACEBOARD
// https://github.com/mikeshub/SailfishLCD
##### TFTGLCD_PANEL_SPI
##### TFTGLCD_PANEL_I2C
// See https://github.com/Serhiy-K/TFTGLCDAdapter
### Mono graphics displays  
To come...
Displays like REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER
### Color graphical displays
To come...
Displays like MKS_TS35_V2_0
### Smart display
To come...
Displays like E3V2
### G-code Hosts
To come...
Displays like BTT TFT
