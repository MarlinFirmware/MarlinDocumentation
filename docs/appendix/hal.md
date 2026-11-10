---
title: Hardware Abstraction Layer
description: Overview of the Hardware Abstraction Layer in Marlin
parent: Appendix
layout: article
nav_order: 39
nav_enabled: true
toc: true
has_toc: true
back_to_top: true
---

The Hardware Abstraction Layer –"HAL" for short– allows Marlin to run on a wide variety of boards by providing a common interface for low-level resources like timers, [serial ports](/docs/settings/serial.html), i2c and SPI buses, [EEPROM](/docs/features/eeprom.html), SDIO, and so on.

## HAL Rationale

Marlin was originally derived in 2011 from [Sprinter](//github.com/kliment/Sprinter) and [GRBL](//github.com/gnea/grbl). Initially, Marlin could only run on Arduino's AVR boards, but it was quickly ported to DUE. Soon we saw boards based on the LPC1768/9 appearing, along with a Grbl-based firmware called [Smoothieware](//reprap.org/wiki/Smoothieboard).

Another ARM processor, the STM32, was poised to take over as the new frontrunner, so we put our heads together to pick a course for extended hardware support. We decided not to rebuild Marlin from the ground up, but to preserve the existing work by adding a layer to abstract away the platform.

## HAL Alternatives

We could have chosen to use an RTOS to build this abstraction, but there are just too many points against:

- We want to stay compatible with AVR and small boards. That rules out RTOS.
- While possible to make the AVR version separate it's much simpler to keep a single codebase so everyone gets the latest features, patches and all platforms can benefit from improvements. We also catch bugs much faster when we're running the same code on more architectures.
- Marlin was designed to use direct interrupts, so it requires the least work to keep the same design. The extra benefit is that Marlin continues to run hardware-direct. The aim is for Marlin to obtain the best performance possible on the board using the least amount of power.

### Current Marlin HALs

#### AT32 (Cortex-M4F)

Artery Technology's AT32 is its own Cortex-M4F MCU family with its own Arduino core. It is not register-compatible with STM32, so it has its own HAL. The framework is [MarlinFirmware/ArduinoCore-AT32F4](//github.com/MarlinFirmware/ArduinoCore-AT32F4) (a fork of rizacelik/ArduinoCore-AT32F4) and the PlatformIO platform is [MarlinFirmware/platform-at32](//github.com/MarlinFirmware/platform-at32). PlatformIO downloads both automatically.

*Experimental.* The pin assignments for the Wanhao 0327001 and EasyThreed K7 ET4000+ are placeholders, not yet verified against the schematic, so these boards are not yet usable. The EasyThreed K7 Rev. B pins are derived from the MKS Robin Lite mapping and are not yet validated on AT32 hardware. No AT32 board has been reported tested on real hardware with this HAL, so testers are welcome. Graphical (U8glib) LCDs, including ST7920 and 12864, are not yet supported.

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  Wanhao 0327001 v2.0|[AT32F403ARGT7](//www.arterychip.com/en/product/AT32F403A.jsp) ARM Cortex-M4F|240MHz|1M|96-224k|3.3V|yes
  EasyThreed K7 ET4000+|[AT32F403ARCT7](//www.arterychip.com/en/product/AT32F403A.jsp) ARM Cortex-M4F|240MHz|256k|96-224k|3.3V|yes
  EasyThreed K7 Rev. B ET4000+|[AT32F407RCT7](//www.arterychip.com/en/product/AT32F407.jsp) ARM Cortex-M4F|240MHz|256k|96-224k|3.3V|yes

#### AVR (8-bit)

Legacy 8-bit AVR MCUs built on the stock Arduino AVR core. The Teensy++ 2.0 uses the AT90USB1286 AVR and is covered by this HAL.

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Arduino AVR](//www.arduino.cc/)|ATmega, ATTiny, etc.|16-20MHz|64-256k|2-16k|5V|no
  [Teensy++ 2.0](//www.pjrc.com/store/teensypp.html)|AT90USB1286 AVR|16MHz|128k|8k|5V|no

#### AT32 (Cortex-M4F)

Artery Technology's AT32 is its own Cortex-M4F MCU family with its own Arduino core. It is not register-compatible with STM32, so it has its own HAL. The framework is [MarlinFirmware/ArduinoCore-AT32F4](//github.com/MarlinFirmware/ArduinoCore-AT32F4) (a fork of rizacelik/ArduinoCore-AT32F4) and the PlatformIO platform is [MarlinFirmware/platform-at32](//github.com/MarlinFirmware/platform-at32). PlatformIO downloads both automatically.

*Experimental.* The pin assignments for the Wanhao 0327001 and EasyThreed K7 ET4000+ are placeholders, not yet verified against the schematic, so these boards are not yet usable. The EasyThreed K7 Rev. B pins are derived from the MKS Robin Lite mapping and are not yet validated on AT32 hardware. No AT32 board has been reported tested on real hardware with this HAL, so testers are welcome. Graphical (U8glib) LCDs, including ST7920 and 12864, are not yet supported.

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  Wanhao 0327001 v2.0|[AT32F403ARGT7](//www.arterychip.com/en/product/AT32F403A.jsp) ARM Cortex-M4F|240MHz|1M|96-224k|3.3V|yes
  EasyThreed K7 ET4000+|[AT32F403ARCT7](//www.arterychip.com/en/product/AT32F403A.jsp) ARM Cortex-M4F|240MHz|256k|96-224k|3.3V|yes
  EasyThreed K7 Rev. B ET4000+|[AT32F407RCT7](//www.arterychip.com/en/product/AT32F407.jsp) ARM Cortex-M4F|240MHz|256k|96-224k|3.3V|yes

#### DUE

Arduino Due and compatibles built on the Atmel/Microchip SAM3X8E, using the upstream Arduino SAM core.

  boards|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Arduino Due](//www.arduino.cc/en/Guide/ArduinoDue), [RAMPS-FD](//www.reprap.org/wiki/RAMPS-FD), etc.|[SAM3X8E ARM-Cortex M3](//www.microchip.com/en-us/product/ATSAM3X8E)|84MHz|512k|64+32k|3.3V|no

#### ESP32

Espressif ESP32 (dual-core Xtensa) using the upstream Arduino-ESP32 core on the `espressif32` PlatformIO platform.

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [ESP32](//www.espressif.com/en/products/socs/esp32)|Tensilica Xtensa LX6|240MHz|---|---|3.3V|---

#### GD32_MFL

GigaDevice GD32F1/GD32F3 MCUs using the third-party MFL Arduino core ([bmourit/ArduinoCore-MFL](//github.com/bmourit/ArduinoCore-MFL)). This is not the Maple or STM32duino core.

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  Creality V4.2.x|[GD32F303RE](//www.gigadevice.com/) ARM Cortex-M4F|120MHz|512k|64k|3.3V|yes
  Voxelab Aquila V1.0.1|[GD32F103RC](//www.gigadevice.com/) ARM Cortex-M3|108MHz|256k|48k|3.3V|no

#### HC32

XHSC HC32F460 Cortex-M4F family using the upstream `platform-hc32f46x` PlatformIO platform and Arduino core. No framework is vendored in Marlin.

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  Voxelab Aquila V1.0.x|[HC32F460C](//www.xhsc.com.cn/) ARM Cortex-M4F|200MHz|256k|192k|3.3V|yes
  Creality Kobra Neo|[HC32F460E](//www.xhsc.com.cn/) ARM Cortex-M4F|200MHz|512k|192k|3.3V|yes

#### LINUX

A host build for Linux. Marlin compiles as a console application on the host CPU, with no MCU and no Arduino framework. GPIO is a software array, so there are no physical pins.

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  Linux host (`BOARD_SIMULATED`)|Host CPU|---|---|---|---|---

#### LPC1768 / LPC1769

NXP LPC176x Cortex-M3 family using an upstream community Arduino core ([p3p/pio-nxplpc-arduino-lpc176x](//github.com/p3p/pio-nxplpc-arduino-lpc176x)).

  boards|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Re-ARM](//www.kickstarter.com/projects/1245051645/re-arm-for-ramps-simple-32-bit-upgrade)|[LPC1768 ARM-Cortex M3](//www.nxp.com/products/microcontrollers-and-processors/arm-based-processors-and-mcus/lpc-cortex-m-mcus/lpc1700-cortex-m3/512kb-flash-64kb-sram-ethernet-usb-lqfp100-package:LPC1768FBD100)|100MHz|512k|32+16+16k|3.3-5V|no
  [MKS SBASE](//forums.reprap.org/read.php?13,499322)|LPC1768 ARM-Cortex M3|100MHz|512k|32+16+16k|3.3-5V|no
  [Selena Compact](//github.com/Ales2-k/Selena)|LPC1768 ARM-Cortex M3|100MHz|512k|32+16+16k|3.3-5V|no
  [Azteeg X5 GT](//www.panucatt.com/azteeg_X5_GT_reprap_3d_printer_controller_p/ax5gt.htm)|LPC1769 ARM-Cortex M3|120MHz|512k|32+16+16k|3.3-5V|no
  [Smoothieboard](//reprap.org/wiki/Smoothieboard)|LPC1769 ARM-Cortex M3|120MHz|512k|64k|3.3-5V|no

#### NATIVE_SIM

A desktop simulator. Marlin's firmware runs on the host with a graphical printer UI built on SDL2 and OpenGL. See the [Simulator](/docs/printers/simulator.html) page.

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  Marlin Simulator (`BOARD_SIMULATED`)|Host CPU (Linux, macOS, Windows)|---|---|---|---|---

#### RP2040

Raspberry Pi RP2040 dual-core Cortex-M0+ using the Arduino-Pico core (earlephilhower) on the Pico SDK.

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  BIGTREETECH SKR Pico 1.x, Raspberry Pi Pico boards|[RP2040](//www.raspberrypi.com/products/rp2040/) dual ARM Cortex-M0+|133MHz|external QSPI|264k|3.3V|no

#### SAMD21

Microchip SAMD21 Cortex-M0+ using the upstream Arduino SAMD core via the `atmelsam` PlatformIO platform.

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [ReprapWorld Minitronics 2.0](//reprap.org/wiki/Minitronics_20)|[SAMD21J18 ARM Cortex-M0+](//www.microchip.com/en-us/product/ATSAMD21J18)|48MHz|256k|32k|3.3V|no

#### SAMD51

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Adafruit Grand Central M4](//www.adafruit.com/product/4064)|[SAMD51P20A ARM-Cortex M4](//www.microchip.com/en-us/product/ATSAMD51P20)|120MHz|1M|256k|3.3V|yes

#### STM32

The official STM32duino core (Arduino_Core_STM32) serves the STM32 F0, F1, F4, F7, G0, and H7 families. Older F1 boards on the libmaple core are covered in [STM32F1 (Maple)](#stm32f1-maple) below.

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  Malyan M200 v2 / M300|[STM32F070CB/RB](//www.st.com/en/microcontrollers-microprocessors/stm32f070rb.html) ARM-Cortex M0|48MHz|128k|16k|3.3V|no
  BIGTREETECH SKR Mini E3, Creality V4.2.x (F1 envs)|[STM32F103RC/RE/VE](//www.st.com/en/microcontrollers-microprocessors/stm32f103.html) ARM-Cortex M3|72MHz|256-512k|48-64k|3.3V|no
  [STEVAL-3DP001V1](//www.st.com/en/evaluation-tools/steval-3dp001v1.html)|[STM32F401VE Arm-Cortex M4](//www.st.com/en/microcontrollers/stm32f401ve.html)|84MHz|512k|64+32k|3.3-5V|yes
  BIGTREETECH SKR Pro (F407 envs)|STM32F407VG ARM-Cortex M4|168MHz|1M|192k|3.3V|yes
  FYSETC S6 / Spider (F446 envs)|STM32F446VE ARM-Cortex M4|180MHz|512k|128k|3.3V|yes
  [NUCLEO-F767ZI](//www.st.com/en/evaluation-tools/nucleo-f767zi.html), REMRAM V1|STM32F767 ARM-Cortex M7|216MHz|2M|512k|3.3V|yes
  BIGTREETECH G0B1 boards (EBB42 V1.1, etc.)|STM32G0B1 ARM-Cortex M0+|64MHz|512k|144k|3.3V|no
  BIGTREETECH SKR SE BX (H723 envs)|STM32H723 ARM-Cortex M7|550MHz|1M|564k|3.3V|yes

#### STM32F1 (Maple)

The legacy libmaple HAL (Roger Clark's Arduino_STM32 "maple" core) for older STM32F103 boards, and for GD32F103 and N32G455 clones. Boards on the official STM32duino core use the [STM32](#stm32) HAL instead.

  boards|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  MKS Robin / Robin Nano, BIGTREETECH SKR Mini E3 1.0 (maple envs), etc.|[STM32F103RC/RE/VE](//www.st.com/en/microcontrollers-microprocessors/stm32f103.html) ARM-Cortex M3|72MHz|256-512k|48-64k|3.3V|no
  Voxelab Aquila / N32G455 clones (maple envs)|GD32F103RC / N32G455RE ARM-Cortex M3|108-120MHz|256-512k|48-64k|3.3V|no

#### Teensy 3.1 / 3.2

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Teensy 3.2](//www.pjrc.com/store/teensy32.html)|MK20DX256VLH7 ARM-Cortex M4|72MHz|256k|64k|3.3V-5V|yes

#### Teensy 3.5 / 3.6

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Teensy 3.5](//www.pjrc.com/store/teensy35.html)|MK64FX512VMD12 ARM-Cortex M4|120MHz|512k|192k|3.3-5V|yes
  [Teensy 3.6](//www.pjrc.com/store/teensy36.html)|MK66FX1M0VMD18 ARM-Cortex M4|180MHz|1M|256k|3.3V|yes

#### Teensy 4.0 / 4.1

Teensy 4.x uses the NXP i.MX RT1062 and the upstream Teensyduino core.

  board|processor|speed|flash|sram|logic|fpu
  ----|---------|-----|-----|----|-----|---
  [Teensy 4.0](//www.pjrc.com/store/teensy40.html)|[i.MX RT1062](//www.nxp.com/products/processors-and-microcontrollers/arm-microcontrollers/i-mx-rt-crossover-mcus/i-mx-rt1060-crossover-processor-with-arm-cortex-m7-cores:i.MX-RT1060) ARM-Cortex M7|600MHz|2M|1024k|3.3V|yes
  [Teensy 4.1](//www.pjrc.com/store/teensy41.html)|[i.MX RT1062](//www.nxp.com/products/processors-and-microcontrollers/arm-microcontrollers/i-mx-rt-crossover-mcus/i-mx-rt1060-crossover-processor-with-arm-cortex-m7-cores:i.MX-RT1060) ARM-Cortex M7|600MHz|8M|1024k|3.3V|yes
