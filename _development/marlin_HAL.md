---
title:        'Marlin HAL'
description:  'Overview of the Marlin HAL'
tag: documentation

author: chepo92
category: [ development ]
---

## Hardware Abstraction Layer

A Hardware Abstraction Layer allows applications to discover and use the hardware of the host system through a simple, portable and abstract API, regardless of the type of the underlying hardware. ([Pennington H., 2003](//ometer.com/hardware.html))

Marlin 1.0 was originally derived from [Sprinter](//github.com/kliment/Sprinter) and [GRBL](//github.com/gnea/grbl) which could only run on 8-bit AVR boards. With the proliferation of new boards based on a variety of processor architectures, for Marlin 2.0 we decided to keep the existing code, but add architecture-specific HALs (AVR, SAM, STM, ESP) as a bridge between Marlin's high-level code and the low-level functions that control the microcontroller's pins, ports, timers, etc.

This way all the existing high-level Marlin code can work on any platform without needing to be concerned about the details. Retaining AVR compatibility and a single codebase is important to us, because we want to make sure that features and patches get as much testing and attention as possible, and that all platforms always benefit from the latest improvements.

### Current Marlin HALs

#### AVR (8-bit)

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Arduino AVR](//www.arduino.cc/)|ATmega, ATTiny, etc.|16-20MHz|64-256k|2-16k|5V|no

#### DUE

  boards|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Arduino Due](//www.arduino.cc/en/Guide/ArduinoDue), [RAMPS-FD](//www.reprap.org/wiki/RAMPS-FD), etc.|[SAM3X8E ARM-Cortex M3](//www.microchip.com/wwwproducts/en/ATsam3x8e)|84MHz|512k|64+32k|3.3V|no

#### ESP32

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [ESP32](//www.espressif.com/en/products/hardware/esp32/overview)|Tensilica Xtensa LX6|240MHz|---|---|3.3V|---

#### LPC1768 / LPC1769

  boards|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Re-ARM](//www.kickstarter.com/projects/1245051645/re-arm-for-ramps-simple-32-bit-upgrade)|[LPC1768 ARM-Cortex M3](//www.nxp.com/products/microcontrollers-and-processors/arm-based-processors-and-mcus/lpc-cortex-m-mcus/lpc1700-cortex-m3/512kb-flash-64kb-sram-ethernet-usb-lqfp100-package:LPC1768FBD100)|100MHz|512k|32+16+16k|3.3-5V|no
  [MKS SBASE](//forums.reprap.org/read.php?13,499322)|LPC1768 ARM-Cortex M3|100MHz|512k|32+16+16k|3.3-5V|no
  [Selena Compact](//github.com/Ales2-k/Selena)|LPC1768 ARM-Cortex M3|100MHz|512k|32+16+16k|3.3-5V|no
  [Azteeg X5 GT](//www.panucatt.com/azteeg_X5_GT_reprap_3d_printer_controller_p/ax5gt.htm)|LPC1769 ARM-Cortex M3|120MHz|512k|32+16+16k|3.3-5V|no
  [Smoothieboard](//reprap.org/wiki/Smoothieboard)|LPC1769 ARM-Cortex M3|120MHz|512k|64k|3.3-5V|no

#### SAMD51

  boards|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Adafruit Grand Central M4](//www.adafruit.com/product/4064)|[SAMD51P20A ARM-Cortex M4](//www.microchip.com/wwwproducts/en/ATSAMD51P20A)|120MHz|1M|256k|3.3V|yes

#### STM32F1

  boards|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Arduino STM32](//github.com/rogerclarkmelbourne/Arduino_STM32)|[STM32F1](//www.st.com/en/microcontrollers-microprocessors/stm32f103.html) ARM-Cortex M3|72MHz|256-512k|48-64k|3.3V|no
  [Geetech GTM32](//github.com/Geeetech3D/Diagram/blob/master/Rostock301/Hardware_GTM32_PRO_VB.pdf)|[STM32F1](//www.st.com/en/microcontrollers-microprocessors/stm32f103.html) ARM-Cortex M3|72MHz|256-512k|48-64k|3.3V|no

#### STM32F4

  boards|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [STEVAL-3DP001V1](//www.st.com/en/evaluation-tools/steval-3dp001v1.html)|[STM32F401VE Arm-Cortex M4](//www.st.com/en/microcontrollers/stm32f401ve.html)|84MHz|512k|64+32k|3.3-5V|yes

#### Teensy++ 2.0

  boards|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Teensy++ 2.0](//www.microchip.com/wwwproducts/en/AT90USB1286)|[AT90USB1286](//www.microchip.com/wwwproducts/en/AT90USB1286)|16MHz|128k|8k|5V|no

#### Teensy 3.1 / 3.2

  boards|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Teensy 3.2](//www.pjrc.com/store/teensy32.html)|[MK20DX256VLH7](//www.mouser.com/ProductDetail/NXP-Freescale/MK20DX256VLH7) ARM-Cortex M4|72MHz|256k|32k|3.3V-5V|yes

#### Teensy 3.5 / 3.6

  boards|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Teensy 3.5](//www.pjrc.com/store/teensy35.html)|[MK64FX512VMD12](//www.mouser.com/ProductDetail/NXP-Freescale/MK64FX512VMD12) ARM-Cortex M4|120MHz|512k|192k|3.3-5V|yes
  [Teensy 3.6](//www.pjrc.com/store/teensy36.html)|[MK66FX1M0VMD18](//www.mouser.com/ProductDetail/NXP-Freescale/MK66FX1M0VMD18) ARM-Cortex M4|180MHz|1M|256k|3.3V|yes
