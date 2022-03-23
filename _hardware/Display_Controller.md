---
title:        'Display Controllers and LCDs'
description:  'Display Controllers and LCDs supported by Marlin'
tag: info

author: ellensp
contrib: thinkyhead
category: [ info, hardware, lcd  ]
---

### General information

Marlin supports a wide variety of display controllers, from simple charater based displays, mono grpahics displays through to color displays.

{:.pretty-list.headless}
`Charater LCD`|The charater definitions are stored in ROM on the display controller. Some custom charaters are definable.
`Mono graphics display`|Display is a bitmap. Pixels are indivitually set and cleared to form images and text.
`Color graphical display`|Display is an array of data. Pixels are indivitually set and cleared to form images and text.
`Smart display`|Displays that have their own controller and custom protocols.
`Gcode hosts`|These are small computers with displays actinging as a host. These talk GCODE.

### Character based LCDs


##### REPRAP_DISCOUNT_SMART_CONTROLLER
One of the most common charater displays.
4×20 characters LCD panel
SD Card reader
Reset button
Combined rotary encoder and push button for menu control
Buzzer

<a href="/assets/images/hardware/Display_Controllers/RDSC_front.jpg" ><img src="/assets/images/hardware/Display_Controllers/RDSC_front_thumb.jpg"/></a>
<a href="/assets/images/hardware/Display_Controllers/RDSC_back.jpg" ><img src="/assets/images/hardware/Display_Controllers/RDSC_back_thumb.jpg"/></a>


##### YHCB2004
##### RADDS_DISPLAY
Display for a RADDS Controller.
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
##### PANEL_ONE
// https://reprap.org/wiki/PanelOne
##### G3D_PANEL
// https://reprap.org/wiki/RAMPS_1.3/1.4_GADGETS3D_Shield_with_Panel
##### RIGIDBOT_PANEL
// http://www.inventapart.com/
##### MAKEBOARD_MINI_2_LINE_DISPLAY_1602
// https://www.aliexpress.com/item/32765887917.html
##### ZONESTAR_LCD
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
### Gcode Hosts
To come...
Displays like BTT TFT
