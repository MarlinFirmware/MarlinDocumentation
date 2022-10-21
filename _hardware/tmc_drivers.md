---
title:        Trinamic drivers
description:  Using Trinamic TMC based stepper drivers.

author: teemuatlut
contrib: shitcreek
category: [ features, hardware ]
---

Stepper motors in a 3D printer are controlled by a variety of driver chips such as the common A4988 and DRV8825. These provide signals to the stepper motors to control the magnets and move them by micro-steps. Typically the motor is divided into 3200 steps per revolution, with 80 steps per millimeter of motion. At the movement rates of 3D printers, and due to the ringing produced by stepper motors, the vibrations from these steps can be very loud to the human ear.

Trinamic stepper drivers control stepper motors with greater finesse and interpolate the micro-steps to produce extremely quiet motion. Through SPI or serial control, you can change how the drivers manage motor current as well as the manner of current delivery. These drivers can even detect when a motor hits an obstruction, so they can act as endstops for simplified wiring. You can also set the driver current with Marlin G-code commands, removing the need to adjust physical trimpots.

## Supported TMC drivers and features

Driver  | Control | StealthChop | Sensorless<br>homing/probing | Driver monitoring | Hybrid threshold | Notes
:------:|:-------:|:-----------:|:----------------------------:|:-----------------:|:----------------:|:---------
TMC2100 | none | yes | no | no | no | Standalone mode only
TMC2130 | SPI | yes | yes | yes | yes |
TMC2160 | SPI | ??? | ??? | ??? | ??? |
TMC5130 | SPI | ??? | ??? | ??? | ??? |
TMC5160 | SPI |yes | yes | yes | yes |
TMC2208<br/>TMC2225 | UART | yes | no | yes | yes | UART RX line requires an interrupt capable pin.<br>Software UART not support on all platforms, such as DUE based boards.
TMC2209<br/>TMC2226 | UART | yes | yes | yes | yes |
TMC2660 | SPI | no | not implemented | yes | no |

All configurable drivers can also be operated in standalone mode if so configured in hardware.

## Installing the library
The TMC stepper drivers require an external library that allows Marlin to communicate with each driver.

### For PlatformIO
PlatformIO will automatically download all libraries it requires, so skip directly to **Wiring** below.

### Installing from Arduino IDE library manager
- Open up the Arduino IDE
- Go to Sketch -> Include Library -> Manage Libraries...
- Marlin 1.1.9 and up:
  - Search for **TMCStepper**
- Older versions of Marlin
  - Search for **TMC2130Stepper** or **TMC2208Stepper**
- Click `Install`

### Installing from a zip file
- Marlin 1.1.9 and up:
  - Go to [TMC library homepage](//github.com/teemuatlut/TMCStepper)
- Older versions of Marlin
  - Go to the [TMC2130 library page](//github.com/teemuatlut/TMC2130Stepper)
  - Go to the [TMC2208 library page](//github.com/teemuatlut/TMC2208Stepper)
- Click **Clone or download** -> **Download ZIP**
- In Arduino IDE and go to **Sketch** -> **Include Library** -> **Add .ZIP Library**…
- Navigate to the downloaded file and click the **Open** button.

## Wiring
Because the TMC drivers require a way for communication and configuring the drivers (outside of standalone mode) they also require additional setup. TMC2130 and TMC2660 use SPI for communication and TMC2208 uses UART (Serial).

### TMC2130

Motherboard | Driver
-----------:|:-------
SCK         | SCK
MOSI        | SDI
MISO        | SDO
CS          | CS

#### Software SPI

You can use other than the HW SPI pins by enabling `TMC_USE_SW_SPI` and defining the required pins:
```cpp
TMC_SW_MOSI
TMC_SW_MISO
TMC_SW_SCK
```

### TMC2208

A 1K resistor is required between `TX` and `PD_UART`.

Motherboard |         | Driver
-----------:|---------|:--------
RX          |         | PD_UART
TX          | (1kohm) | PD_UART

The serial port on master is selected in the pins file for your board. Alternatively you can use the slower software serial by not selecting any of the hardware serial ports. Typically one port per one driver is needed.

### Software UART

You can use free pins for UART by disabling all of the hardware serial options in your board's pins file and by defining the `_SERIAL_TX_PIN` and `_SERIAL_RX_PIN` pins.

**Note:** The receive (RX) pins must be interrupt-capable pins. Transmit (TX) pins don't have this limitation.

## FYSETC drivers
As of this writing, we recommend getting the original Watterott drivers or the revised FYSETC v1.1 drivers to avoid additional headaches.

The FYSETC v1.0 drivers come pre-configured in standalone mode. So the drivers should work for moving the axes but you won't be able to configure them or take advantage of their extra features. For full-featured drivers you'll need to modify three solder bridges on the driver PCB.

![FYSETC_TMC2130](/assets/images/features/FYSETC_tmc2130._SPI.jpg)

Some versions of the FYSETC v1.0 drivers come with a solder bridge left of the chip, some come with a bridging resistor. This connection needs to be opened for SPI connection to work.
The two smaller bridges need to be configured as shown.

## Features and configuration options
Several Trinamic-specific technologies are supported by Marlin.
- [stealthChop](//www.trinamic.com/technology/adv-technologies/stealthchop/) is a technology that drives the motors using PWM voltage instead of current. The result is nearly inaudible stepping at low velocities. StealthChop has a lower stepping speed limit and if you need to move faster, for example travel moves, you may want to use spreadCycle or configure Hybrid Mode.
- [spreadCycle](//www.trinamic.com/technology/adv-technologies/spreadcycle/) is an alternative stepping mode. The driver will use four stages to drive the desired current into the stepper motor. SpreadCycle provides greater torque which might be useful if you're experiencing skipped steps. The downside is slightly higher noise levels.
- [stallGuard](//www.trinamic.com/technology/adv-technologies/stallguard/) measures the load that is applied to the motor. If the load is sufficiently high, Marlin can react to the event. Such an event can be when we drive an axis to its physical limit and the signal provided by the driver can be detected just like an endstop. That way you can use the driver itself as an axis sensor negating the need to an additional endstop and the wiring needed. StallGuard is only active when the driver is in spreadCycle mode.
* Hybrid Mode: Marlin can configure the driver to automatically change between stepping modes using a user configured switching velocity. If the velocity is lower than the threshold the stepper is in quiet stealthChop mode. When the axis velocity increases the driver will automatically switch to spreadCycle.

Option | Description
---:|:---
R_SENSE                   | The current sense resistor used in your product.<br>* Watterott SilentStepSticks typically use 0.11ohm values.<br>* Ultimachine Archim2 board has 0.22ohms.<br>* Panucatt TMC2660 BigFoot drivers use 0.1ohms.
HOLD_MULTIPLIER           | After the stepper hasn't been moving for a short while, the driver can decrease the current and let the driver cool down. The multiplier is expressed as a decimal value in the range of 0.0 to 1.0.
INTERPOLATE               | TMC drivers can take lower microstepping inputs, like the typical 16 and interpolate that to 256 microsteps which provides smoother movement.
CURRENT                   | Driver current expressed in milliamps. Higher current values will need active cooling and a heatsink. Low current values may warrant lower acceleration values to prevent skipping steps.
MICROSTEPS                | Configures the driver to divide a full step into smaller microsteps which provide smoother movement.
SOFTWARE_DRIVER_ENABLE    | Some drivers do not have a dedicated enable (EN) line and require the same function to be handled through software commands.
STEALTHCHOP               | Default state for stepping mode on supporting TMC drivers.
CHOPPER_TIMING            | Fine tune the *spreadCycle* chopper timings to optimize noise performance.<br>A set of presets has been provided according to used driver voltage level, but a customized set can be used by specifying<br>`{ <off_time[1..15]>, <hysteresis_end[-3..12]>, hysteresis_start[1..8] }`
MONITOR_DRIVER_STATUS     | Periodically poll the drivers to determine their status. Marlin can automatically reduce the driver current if the driver report overtemperature prewarn condition. The firmware can also react to error states like short to ground or open load conditions.
CURRENT_STEP              | Reduce current value when Marlin sees OTPW error.
REPORT_CURRENT_CHANGE     | Report to the user when automatically changing current setting.
STOP_ON_ERROR             | If Marlin detects an error where the driver has shut down to protect itself, it can stop the print to save both time and material.
HYBRID_THRESHOLD          | Configure the axis speed when the driver should switch between stealthChop and spreadCycle modes.
SENSORLESS_HOMING         | Use the TMC drivers that support this feature to act as endstops by using stallGuard to detect a physical limit.
SENSORLESS_PROBING        | Use stallGuard on supporting TMC drivers to replace a bed probe.<br>Recommended to be used on delta printers only.
HOMING_SENSITIVITY        | The Sensorless Homing sensitivity can be tuned to suit the specific machine.<br>A **higher** value will make homing **less** sensitive.<br>A **lower** value will make homing **more** sensitive.
TMC_DEBUG                 | Extend the information [`M122`](/docs/gcode/M122.html) reports. This will give you _a lot_ of additional information about the status of your TMC drivers.
TMC_ADV                   | You can use this to add your own configuration settings. The requirement is that the command used must be part of the respective TMC stepper library. Remember to add a backslash after each command!
AUTOMATIC_CURRENT_CONTROL | Replaced by `MONITOR_DRIVER_STATUS`.<br>Marlin will poll the driver twice a second to see if the driver is in an error state. Such an error can be overtemperature pre-warn condition (OTPW) or short to ground or open load. Marlin can react to the temperature warning and automatically reduce the driver current. Short to ground error will disable the driver and Marlin can terminate the print to save time and material.

## G-codes

Command | Configuration<br>required | Description
-------:|:-------------------------:|:-----------
[`M122`](/docs/gcode/M122.html) | none                      | Test driver communication line and get debugging information of your drivers. `TMC_DEBUG` adds more reported information.
[`M569`](/docs/gcode/M569.html) | `TMC2130` or `TMC2208`    | Toggle between stealthChop and spreadCycle on supporting drivers.
[`M906`](/docs/gcode/M906.html) | none                      | Set the driver current using axis letters X/Y/Z/E.
[`M911`](/docs/gcode/M911.html) | `MONITOR_DRIVER_STATUS`   | Report TMC prewarn triggered flags held by the library.
[`M912`](/docs/gcode/M912.html) | `MONITOR_DRIVER_STATUS`   | Clear TMC prewarn triggered flags.
[`M913`](/docs/gcode/M913.html) | `HYBRID_THRESHOLD`        | Set HYBRID_THRESHOLD speed.
[`M914`](/docs/gcode/M914.html) | `SENSORLESS_HOMING`       | Set SENSORLESS_HOMING sensitivity.
[`M915`](/docs/gcode/M915.html) | `TMC_Z_CALIBRATION`       | (Deprecated in Marlin 2.0.)<br>Level your X axis by trying to move the Z axis past its physical limit. The movement is done at a reduced motor current to prevent breaking parts and promote skipped steps. Marlin will then rehome Z axis and restore normal current setting.

## Troubleshooting

- Some SilentStepSticks with variable 3-5V logic voltage (VIO) [might get damaged](//github.com/MarlinFirmware/Marlin/issues/10162#issuecomment-397844847) if only powered over USB.
- Test driver communication status with [`M122`](/docs/gcode/M122.html).
- Test Marlin's **bugfix** branch (on GitHub) to see if your issue is fixed.
- Test the latest TMCStepper library to see if your issue is fixed.
- Check all wiring and wire crimps.
  - **SPI**: Use a multimeter to check connectivity all the way down the chain on all the communication lines.
  - **SPI** conflict with the **SD card**? Solutions vary.
  - **UART**:
    - Make sure your receive (RX) pin is interrupt capable
    - Check the resistance value between receive (RX) and transmit (TX) lines. You should see 1kOhm.
    - Check connectivity from RX to the TMC chip
- Check **12V** (**24V**) power in the **Vm** pin and **5V** (**3.3V**) in the **Vio** pin.
- Check that configured pins match your firmware configuration.
- Enable `TMC_DEBUG` and send [`M122`](/docs/gcode/M122.html) to see further debugging output.
  - Reported register values of either `0x00000000` or `0xFFFFFFFF` are bad responses.
- Try the examples provided by the respective library. Please detach any belts beforehand however, as the examples will not respect any endstop signals or physical limits. You may need to change the pin definitions.
- If you're experiencing skipped steps there are a few things you can try
  - First check for mechanical obstructions and that the parts move freely and do not bind
  - Check that your nozzle doesn't bump into your print if it starts curling upwards (cooling issue)
  - Lower acceleration and jerk values
  - Increase driver cooling
  - Increase motor current
  - Disable `INTERPOLATE`

## External resources

- [Arduino library for TMC drivers](//github.com/teemuatlut/TMCStepper) (Replaces the following two)
- For older Marlin you may need [TMC2130 Arduino library](//github.com/teemuatlut/TMC2130Stepper) or [TMC2208 Arduino library](//github.com/teemuatlut/TMC2208Stepper)

- [SilentStepStick TMC2130 schematic and pinout](//github.com/watterott/SilentStepStick/blob/master/hardware/
SlentStepStick-TMC2130_v11.pdf)
- [SilentStepStick TMC2208 schematic and pinout](//github.com/watterott/SilentStepStick/blob/master/hardware/SlentStepStick-TMC2208_v12.pdf)

- [Trinamic](//www.trinamic.com)
- [Watterott documentation](//learn.watterott.com/silentstepstick/)
- [stallGuard](//www.trinamic.com/technology/adv-technologies/stallguard/)
- [stealthChop](//www.trinamic.com/technology/adv-technologies/stealthchop/)
- [spreadCycle](//www.trinamic.com/technology/adv-technologies/spreadcycle/)
- Datasheets for [TMC2130](//www.trinamic.com/fileadmin/assets/Products/ICs_Documents/TMC2130_datasheet.pdf) and [TMC2208](//www.trinamic.com/fileadmin/assets/Products/ICs_Documents/TC220x_TMC2224_Datasheet_Rev1.10.pdf)

- [TMC2130 Hackaday article by Moritz Walter](//hackaday.com/2016/09/30/3-printering-trinamic-tmc2130-stepper-motor-drivers-shifting-the-gears/)

- [Video guide by Thomas Sanladerer](//youtu.be/sPvTB3irCxQ)
- [TMC2208 Torque testing by Alex Kenis](//youtu.be/GVs2d-TOims)
