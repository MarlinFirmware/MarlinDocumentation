---
title: Hardware Access Layer
description: Overview of the Hardware Access Layer in Marlin
tag: coding

author: chepo92
contrib: thinkyhead
category: [ development ]
---

The Hardware Access Layer –"HAL" for short– allows Marlin to run on a wide variety of boards by providing a common interface for low-level resources like timers, serial ports, i2c and SPI buses, EEPROM, SDIO, and so on.

## HAL Rationale

Marlin was originally derived in 2011 from [Sprinter](//github.com/kliment/Sprinter) and [GRBL](//github.com/gnea/grbl). Initially, Marlin could only run on Arduino's AVR boards, but it was quickly ported to DUE. Soon we saw boards based on the LPC1768/9 appearing, along with a Grbl-based firmware called [Smoothieware](//reprap.org/wiki/Smoothieboard).

Another ARM processor, the STM32, was poised to take over as the new frontrunner, so we put our heads together to pick a course for extended hardware support. We decided not to rebuild Marlin from the ground up, but to preserve the existing work by adding a layer to abstract away the platform.

## HAL Alternatives

We could have chosen to use an RTOS to build this abstraction, but there are just too many points against:

- We want to stay compatible with AVR and small boards. That rules out RTOS.
- While possible to make the AVR version separate it's much simpler to keep a single codebase so everyone gets the latest features, patches and all platforms can benefit from improvements. We also catch bugs much faster when we're running the same code on more architectures.
- Marlin was designed to use direct interrupts, so it requires the least work to keep the same design. The extra benefit is that Marlin continues to run hardware-direct. The aim is for Marlin to obtain the best performance possible on the board using the least amount of power.

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

#### STM32

  boards|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Arduino STM32](//github.com/rogerclarkmelbourne/Arduino_STM32)|[STM32F1](//www.st.com/en/microcontrollers-microprocessors/stm32f103.html) ARM-Cortex M3|72MHz|256-512k|48-64k|3.3V|no
  [Geetech GTM32](//github.com/Geeetech3D/Diagram/blob/master/Rostock301/Hardware_GTM32_PRO_VB.pdf)|[STM32F1](//www.st.com/en/microcontrollers-microprocessors/stm32f103.html) ARM-Cortex M3|72MHz|256-512k|48-64k|3.3V|no
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
