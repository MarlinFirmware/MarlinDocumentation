---
title:        Trinamic drivers
description:  Using Trinamic TMC based stepper drivers.

author: teemuatlut
category: [ features ]
---

Trinamic stepper drivers allow you to have better control of your stepper motors and achieve extremely quiet motion. You can influence how the driver manages motor current as well as the manner of current delivery. The drivers can act as endstops allowing you simplify wiring. Marlin also supports setting the driver current by using software commands, negating the need for adjusting trimpots.

## Installing the library
The TMC stepper drivers require an external library that allows Marlin to communicate with each driver.

### Installing from Arduino IDE library manager
* Open up the Arduino IDE
* Go to Sketch -> Include Library -> Manage Libraries...
* Search for **TMC2130Stepper** or **TMC2208Stepper**
* Click `Install`

### Installing from a zip file
* TMC2130: Go to the library homepage at <https://github.com/teemuatlut/TMC2130Stepper>
* TMC2208: Go to the library homepage at <https://github.com/teemuatlut/TMC2208Stepper>
* Click `Clone or download` and `Download ZIP`
* In Arduino IDE and go to Sketch -> Include Library -> Add .ZIP Library...
* Point to the downloaded file and click `Open`

## Wiring
Because the TMC drivers require a way for communication and configuring the drivers (outside of standalone mode) they also require additional setup. TMC2130 uses SPI for communication and TMC2208 uses UART (Serial).

### TMC2130

Motherboard | Driver
---:|:---
SCK | SCK
MOSI | SDI
MISO | SDO
CS | CS

#### Software SPI

You can use other than the HW SPI pins by enabling `TMC_USE_SW_SPI` and defining the required pins:
```cpp
TMC_SW_MOSI
TMC_SW_MISO
TMC_SW_SCK
```

### TMC2208

A 1 kilo-ohm resistor is required between TX and PD_UART

Motherboard | | Driver
---:|---|:---
RX | | PD_UART
TX | (1kohm) | PD_UART

The serial port on master is selected in your `pins` file. Alternatively you can use the slower software serial by not selecting any of the hardware serial ports.
Typically one port per one driver is needed.

#### Software UART

You can use free pins as UART by disabling all of the hardware serial options in your `pins` file and by defining the `_SERIAL_TX_PIN` and `_SERIAL_RX_PIN` pins.

**Note:** The receive (RX) pins are limited to only interrupt capable pins. Transmit (TX) pins do not have the same limitation.

## FYSETC drivers
We recommend getting the original Watterott drivers or the revised FYSETC v1.1 drivers to avoid additional headaches.

The FYSETC v1.0 drivers come pre-configured in standalone mode. This means that the drivers should work for moving the axis but you will not be able to configure them nor take advantage of the additional features of the drivers. To get the drivers working as intended you will need to modify three solder bridges on the driver PCB.

![FYSETC_TMC2130](/assets/images/features/FYSETC_tmc2130._SPI.jpg)

Some versions of the FYSETC v1.0 drivers come with a solder bridge left of the chip, some come with a bridging resistor. This connection needs to be opened for SPI connection to work.
The two smaller bridges need to be configured as shown.

## Features and configuration options
There are several technologies specific to Trinamic drivers that are supported by Marlin.
* [stealthChop] is a technology that drives the motors using PWM voltage instead of current. The result is nearly inaudible stepping at low velocities. StealthChop has a lower stepping speed limit and if you need to move faster, for example travel moves, you may want to use spreadCycle or configure Hybrid Mode.
* [spreadCycle] is an alternative stepping mode. The driver will use four stages to drive the desired current into the stepper motor. SpreadCycle provides greater torque which might be useful if you're experiencing skipped steps. The downside is slightly higher noise levels.
* [stallGuard] measures the load that is applied to the motor. If the load is sufficiently high, Marlin can react to the event. Such an event can be when we drive an axis to its physical limit and the signal provided by the driver can be detected just like an endstop. That way you can use the driver itself as an axis sensor negating the need to an additional endstop and the wiring needed. StallGuard is only active when the driver is in spreadCycle mode.
* Hybrid Mode: Marlin can configure the driver to automatically change between stepping modes using a user configured switching velocity. If the velocity is lower than the threshold the stepper is in quiet stealthChop mode. When the axis velocity increases the driver will automatically switch to spreadCycle.

[stealthChop]: https://www.trinamic.com/technology/adv-technologies/stealthchop/
[spreadCycle]: https://www.trinamic.com/technology/adv-technologies/spreadcycle/
[stallGuard]: https://www.trinamic.com/technology/adv-technologies/stallguard/

Option | Description
---:|:---
R_SENSE                   | The current sense resistor used in your product.<br>* Watterott SilentStepSticks typically use 0.11ohm values.<br>* Ultimachine Archim2 board has 0.22ohms.<br>* Panucatt TMC2660 BigFoot drivers use 0.1ohms.
HOLD_MULTIPLIER           | After the stepper hasn't been moving for a short while, the driver can decrease the current and let the driver cool down. The multiplier is expressed as a decimal value in the range of 0.0 to 1.0.
INTERPOLATE               | TMC drivers can take lower microstepping inputs, like the typical 16 and interpolate that to 256 microsteps which provides smoother movement.
CURRENT                   | Driver current expressed in milliamps. Higher current values will need active cooling and a heatsink. Low current values may warrant lower acceleration values to prevent skipping steps.
MICROSTEPS                | Configures the driver to divide a full step into smaller microsteps which provide smoother movement.
STEALTHCHOP               | Enable PWM driven stepping mode.
AUTOMATIC_CURRENT_CONTROL | Marlin will poll the driver twice a second to see if the driver is in an error state. Such an error can be overtemperature pre-warn condition (OTPW) or short to ground or open load. Marlin can react to the temperature warning and automatically reduce the driver current. Short to ground error will disable the driver and Marlin can terminate the print to save time and material.
CURRENT_STEP              | Reduce current value when Marlin sees OTPW error.
REPORT_CURRENT_CHANGE     | Report to the user when automatically changing current setting.
HYBRID_THRESHOLD          | Configure the axis speed when the driver should switch between stealthChop and spreadCycle modes.
SENSORLESS_HOMING         | Use the TMC drivers that support this feature to act as endstops by using stallGuard to detect a physical limit.
HOMING_SENSITIVITY        | The Sensorless Homing sensitivity can be tuned to suit the specific machine.<br>A **higher** value will make homing **less** sensitive.<br>A **lower** value will make homing **more** sensitive.
TMC_DEBUG                 | Enable M122 debugging command. This will give you _a lot_ of additional information about the status of your TMC drivers.
TMC_ADV                   | You can use this to add your own configuration settings. The requirement is that the command used must be part of the respective TMC stepper library. Remember to add a backslash after every command!

## GCodes

Command | Configuration<br>required | Description
-------:|:------------------:|:-----------
[M122]  | `TMC_DEBUG` | Get debugging information of your drivers.
[M906]  | none | Set the driver current using axis letters X/Y/Z/E.
[M911]  | none | Report TMC prewarn triggered flags held by the library.
[M912]  | none | Clear TMC prewarn triggered flags.
[M913]  | `HYBRID_THRESHOLD` | Set HYBRID_THRESHOLD speed.
[M914]  | `SENSORLESS_HOMING` | Set SENSORLESS_HOMING sensitivity.
[M915]  | `TMC_Z_CALIBRATION` | Level your X axis by trying to move the Z axis past its physical limit. The movement is done at a reduced motor current to prevent breaking parts and promote skipped steps. Marlin will then rehome Z axis and restore normal current setting.

[M122]: /docs/gcode/M122.html
[M906]: /docs/gcode/M906.html
[M911]: /docs/gcode/M911.html
[M912]: /docs/gcode/M912.html
[M913]: /docs/gcode/M913.html
[M914]: /docs/gcode/M914.html
[M915]: /docs/gcode/M915.html

## Troubleshooting

- Use the latest **bugfix** firmware from github
- Check wiring and your wire grimps
- Check that configured pins match with your firmware configuration
- Enable `TMC_DEBUG` and send `M122` to see the debugging output
  - Reported register values of either `0x00000000` or `0xFFFFFFFF` are bad responses
- Try the examples provided by the respective library. Please detach any belts beforehand however, as the examples will not respect any endstop signals or physical limits. You may need to change the pin definitions.

## External resources

[Arduino library for TMC2130](https://github.com/teemuatlut/TMC2130Stepper)

[Arduino library for TMC2208](https://github.com/teemuatlut/TMC2208Stepper)

[Trinamic.com](https://www.trinamic.com)

[Watterott documentation](http://learn.watterott.com/silentstepstick/)

[stallGuard](https://www.trinamic.com/technology/adv-technologies/stallguard/)

[stealthChop](https://www.trinamic.com/technology/adv-technologies/stealthchop/)

[spreadCycle](https://www.trinamic.com/technology/adv-technologies/spreadcycle/)

[Hackaday article by Moritz Walter](https://hackaday.com/2016/09/30/3d-printering-trinamic-tmc2130-stepper-motor-drivers-shifting-the-gears/)

[Video guide by Thomas Sanladerer](https://www.youtube.com/watch?v=sPvTB3irCxQ)
