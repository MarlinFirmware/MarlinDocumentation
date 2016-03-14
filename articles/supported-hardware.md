---
layout: articles

meta:
  title:        'Supported Hardware'
  description:  ''
  categories:   [ development, hardware ]

navigation:
  show_description: false
---
Marlin supports a wide variety of 3D printers, including all RAMPS variants, and is adaptable to virtually any Arduino-based electronics through pin-mapping – assigning the right name to each pin.

Several files in the Marlin source code provide hardware support, but the core files supporting electronics are:

 - `boards.h` contains the full list of boards supported by Marlin. Set `MOTHERBOARD` to one of the boards listed here.
 - `pins.h` manages pin definitions and includes the appropriate `pins_BOARD.h` file for the `MOTHERBOARD`.
 - The `pins_BOARDNAME.h` files contain the pin definitions for each board. Many of these just include RAMPS_13 and alter some pins.

If you're making a custom Arduino-based board, you should try to use standard RAMPS 1.3 pinouts as much as possible, or map closely with some other board that has a good layout. The more a new board is like an existing board, the easier it will be to integrate with Marlin.

## Supported Boards

To select your particular board, in `Configuration.h` file you simply change the line `#define MOTHERBOARD BOARD_RAMPS_EFB` to your particular board's name, which can be found in `boards.h`.

| Family | ID | Board |  |
|--------------|-----|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Gen 3 | 9 | GEN3_PLUS | [Gen3+](http://reprap.org/wiki/Generation_3_Electronics) (ATmega644P/ATmega1284P) |
| Gen 3 | 22 | GEN3_MONOLITHIC | [Gen3 Monolithic Electronics](http://reprap.org/wiki/Generation_3_Electronics) (ATmega644P) |
| Gen 6 | 5 | GEN6 | [Gen6](http://reprap.org/wiki/Gen6) (ATmega644P/ATmega1284P) |
| Gen 6 | 51 | GEN6_DELUXE | [Gen6 "Deluxe"](http://reprap.org/wiki/Gen6) (ATmega644P/ATmega1284P) |
| Gen 7 | 11 | GEN7_12 | [Generation 7 Electronics v1.1](http://reprap.org/wiki/Generation_7_Electronics#12._May_2011:_v1.2), [v1.2](http://reprap.org/wiki/Generation_7_Electronics#12._May_2011:_v1.2) (ATmega644P/ATmega1284P) |
| Gen 7 | 12 | GEN7_13 | [Generation 7 Electronics Generation 7 Electronics v1.3](http://reprap.org/wiki/Generation_7_Electronics#22._July_2011:_1.3) (ATmega644P/ATmega1284P) |
| Gen 7 | 13 | GEN7_14 | [Generation 7 Electronics v1.4](http://reprap.org/wiki/Generation_7_Electronics#15._May_2012:_Gen7Board_v1.4) (ATmega644P/ATmega1284P) |
| Gen 7 | 10 | GEN7_CUSTOM | [Alfons3's custom Generation 7 Electronics](https://github.com/Alfons3/Generation_7_Electronics) (ATmega644P/ATmega1284P) |
| RAMPS | 3 | RAMPS_OLD | [MEGA/RAMPS up to 1.2](http://reprap.org/wiki/RAMPS_1.2) (ATmega1280/ATmega2560) |
| RAMPS | 33 | RAMPS_13_EFB | [RAMPS 1.3](http://reprap.org/wiki/RAMPS_1.3)/[1.4](http://reprap.org/wiki/RAMPS_1.4),with outputs: Extruder, Fan, Bed (ATmega1280/ATmega2560) |
| RAMPS | 34 | RAMPS_13_EEB | [RAMPS 1.3](http://reprap.org/wiki/RAMPS_1.3)/[1.4](http://reprap.org/wiki/RAMPS_1.4),with outputs:Extruder0, Extruder1, Bed |
| RAMPS | 35 | RAMPS_13_EFF | [RAMPS 1.3](http://reprap.org/wiki/RAMPS_1.3)/[1.4](http://reprap.org/wiki/RAMPS_1.4),with outputs: Extruder, Fan, Fan |
| RAMPS | 36 | RAMPS_13_EEF | [RAMPS 1.3](http://reprap.org/wiki/RAMPS_1.3)/[1.4](http://reprap.org/wiki/RAMPS_1.4),with outputs: Extruder0, Extruder1, Fan |
| RAMPS | 77 | 3DRAG | [3Drag Controller](http://reprap.org/wiki/3Drag_controller) (ATmega1280/ATmega2560) |
| RAMPS | 78 | K8200 | [Velleman K8200](http://www.k8200.eu/) (ATmega1280/ATmega2560) is derived from 3Drag Controller and has identical pin assignments. |
| RAMPS | 37 | FELIX2 | [Felix 2.0+](http://shop.felixprinters.com/product-catalog/spare-parts/3d-printer-electronics-board-felixprinters.html) (ATmega1280/ATmega2560) |
| RAMPS | 40 | MKS_BASE | The [MKS BASE 1.0](http://reprap.org/wiki/MKS_BASE_1.0) (ATmega1280/ATmega2560) is a custom board with pin assignments nearly identical to RAMPS 1.4. |
| RAMPS | 503 | BQ_ZUM_MEGA_3D | [bq ZUM Mega 3D](https://github.com/bq/zum/tree/master/zum-mega3d) controller is an ATmega2560 based controller powering the [bq Hephestos 2](https://github.com/bq/hephestos-2) and [bq Witbox 2](https://github.com/bq/witbox-2) 3D printer. |
| RAMPS | 41 | WITBOX | The [bq WITBOX](https://github.com/bq/witbox) (ATmega1280/ATmega2560) is not a controller board, but an open source box cartesian RAMPS-based printer. The controller is a standard Mega2560 with RAMPS 1.4 configured for a single extruder. Essentially equivalent to RAMPS_13_EFB. |
| RAMPS | 42 | HEPHESTOS | The [bq Prusa i3 Hephestos](https://github.com/bq/prusa-i3-hephestos) (ATmega1280/ATmega2560) is not a controller board, but an open source variant of the popular Prusa i3 Mendel RepRap. The controller is a standard Mega2560 with RAMPS 1.4 configured for a single extruder. |
| RAMPS | 401 | BAM_DICE | [2PrintBeta BAM&DICE](http://www.2printbeta.de/) (ATmega1280/ATmega2560) with STK drivers. The Beta Arduino Mega (BAM) shield is a crowd-funded open source RAMPS shield with 5 slots for plugin modules instead of the standard stepper driver sockets. The DICE-STK module a stepper driver module utilizing the STK682-010-E with up to 128X micro-stepping. (A4988 also available.) |
| RAMPS | 67 | AZTEEG_X3 | [Azteeg X3](http://reprap.org/wiki/Azteeg_X3) (ATmega1280/ATmega2560) is essentially equivalent to RAMPS_13_EFB, with specialized pins for a VIKI display. |
| RAMPS | 68 | AZTEEG_X3_PRO | [Azteeg X3 Pro](http://reprap.org/wiki/Azteeg_X3) (ATmega1280/ATmega2560) is essentially equivalent to RAMPS_13_EFB, with specialized pins for a VIKI display. |
| RAMPS | 310 | MEGACONTROLLER | [Mega Controller](http://reprap.org/wiki/Mega_controller) (ATmega2560) is an all-in-one board with connectors for 2 extruders, 3 heaters, and 3 fans. Its accompanying display is the MINIPANEL, basically a standard DOGM display. |
| Sanguinololu | 6 | SANGUINOLOLU_11 | [Sanguinololu](http://reprap.org/wiki/Mega_controller) |
| Sanguinololu | 62 | SANGUINOLOLU_12 | [Sanguinololu](http://reprap.org/wiki/Ultimaker%27s_v1.5.7_PCB) 1.2 and above (ATmega644P/ATmega1284P) |
| Sanguinololu | 65 | AZTEEG_X1 | [Azteeg X1](http://reprap.org/wiki/Ultimaker%27s_v1.5.3_PCB) (ATmega644P/ATmega1284P) |
| Sanguinololu | 63 | MELZI | [Melzi](http://reprap.org/wiki/Melzi) (ATmega644P/ATmega1284P) |
| Sanguinololu | 66 | MELZI_MAKR3D | [MaKrMelzi](http://reprap.org/wiki/MaKrMelzi) (ATmega1284/ATmega1284P) |
| Sanguinololu | 64 | STB_11 | [STB Electronics](STB Electronics V1.1 (ATmega1284P) V1.1 (ATmega1284P)) |
| Ultimaker | 7 | ULTIMAKER | [Ultimaker](http://reprap.org/wiki/Ultimaker%27s_v1.5.7_PCB) (ATmega1280/ATmega2560) |
| Ultimaker | 71 | ULTIMAKER_OLD | [Ultimaker](http://reprap.org/wiki/Ultimaker%27s_v1.5.3_PCB) (ATmega1280/ATmega2560) with older electronics. Pre [1.5.4](http://reprap.org/wiki/Ultimaker%27s_v1.5.4_PCB). This is rare! |
| Ultimaker | 72 | ULTIMAIN_2 | Ultimainboard 2.x (ATmega2560) (Uses TEMP_SENSOR 20) |
| ReprapWorld | 70 | MEGATRONICS | [Megatronics](http://reprap.org/wiki/Megatronics) (ATmega2560) |
| ReprapWorld | 701 | MEGATRONICS_2 | [Megatronics v2.0](http://reprap.org/wiki/Megatronics_2.0) (ATmega2560) |
| ReprapWorld | 702 | MEGATRONICS_1 | [Minitronics v1.0](http://reprap.org/wiki/Minitronics_10) (ATmega1281) |
| ReprapWorld | 703 | MEGATRONICS_3 | [Megatronics v3.0](http://reprap.org/wiki/Megatronics_3.0) (ATmega2560) |
| OMC | 90 | OMCA_A | [Alpha Open Motion Controller](http://solderpad.com/folknology/open-motion-controller/) (ATmega644) |
| OMC | 91 | OMCA | [Final Open Motion Controller](http://solderpad.com/folknology/open-motion-controller/) (ATmega644P/ATmega644) |
| ATmega328P | 4 | DUEMILANOVE_328P | [Duemilanove](http://www.arduino.cc/en/Main/ArduinoBoardDuemilanove) (ATmega328P) |
| ATmega328P | 402 | BAM_DICE_DUE | [2PrintBeta BAM&DICE Due](http://www.2printbeta.de/) (AT91SAM3X8E) with STK drivers. This variant of the BAM&DICE is made for the Due instead of the Mega. |
| AT90USB1286 | 81 | PRINTRBOARD | [Printrboard](http://reprap.org/wiki/Printrboard) (AT90USB1286) |
| AT90USB1286 | 88 | 5DPRINT | The [5DPrint D8 Controller](https://bitbucket.org/makible/5dprint-d8-controller-board) (AT90USB1286) is an open source 3D printer controller, designed for controlling the MakiBox A6 and other RepRap type/small consumer grade 3D printers. |
| AT90USB1286 | 85 | BRAINWAVE_PRO | [Brainwave Pro](http://www.metrixcreatespace.com/store/brainwave) (AT90USB1286) |
| AT90USB1286 | 83 | SAV_MKI | The [SAV Mk-I](http://reprap.org/wiki/SAV_MKI) (AT90USB1286) is an improvement on the previous production-grade electronics set (Gen6, Sanguinololu) addressing many shortcomings, designed and developed with contributions and feedback from the RepRap CloneWars group in Spain. |
| AT90USB1286 | 8 | TEENSYLU | [Teensylu](http://reprap.org/wiki/Teensylu) (AT90USB1286) |
| AT90USB1286 | 84 | TEENSY2 | [Teensy++2.0](http://reprap.org/wiki/Teensy_Breadboard#Teensy.2B.2B_2.0) (AT90USB1286)To compile from the command-line: `DEFINES=AT90USBxx_TEENSYPP_ASSIGNMENTS HARDWARE_MOTHERBOARD=84 make` |
| Others | 80 | RUMBA | [RUMBA](http://reprap.org/wiki/RUMBA) (ATmega2560) |
| Others | 2 | CHEAPTRONIC | [Cheaptronic v1.0](http://reprap.org/wiki/Cheaptronic) (ATmega2560) |
| Others | 21 | ELEFU_3 | [Elefu Ra v3](https://github.com/kiyoshigawa/Elefu-RAv3) (ATmega2560) |
| Others | 999 | LEAPFROG | [Leapfrog](http://www.lpfrg.com/) (ATmega1280/ATmega2560) |
| Others | 301 | RAMBO | [RAMBo](http://reprap.org/wiki/Rambo) (ATmega2560) |
| AT90USB646 | 82 | BRAINWAVE | [Brainwave](http://www.metrixcreatespace.com/store/brainwave) (AT90USB646) |
| Others | 20 | SETHI | [Sethi 3D 1E](http://www.sethi3d.com.br/produto/cpu-sethi3d-1e.html) (ATmega644P/ATmega644/ATmega1284P) |

## Supported Add-ons

- LCD Controllers
- SD Cards
- Filament Width Sensor
- Filament Runout Sensor
- BlinkM Color LEDs
