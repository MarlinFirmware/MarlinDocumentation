---
title:        'Endstops'
description:  'Endstop purpose, types and EMI effects'

author: Sineos
category: hardware
---

Endstops or limit switches are used on every moving axes of a 3D printer. The following chapter will provide information on:
* Purpose of the endstop
* Types of endstops
* Electromagnetic Interference / Electric Noise impact on endstops

# Endstops purpose
Endstops fulfill two important functions in a 3D printer: Reference system for the axes system and safety.
<br>

## Reference for the axes system
After powering up a 3D printer the printer's controller board does not know at which position its axes are. Marlin indicates this by blinking question-marks in place of X, Y and Z on the LCD screen (v1.1.8 and older) or blinking '?' in place of the coordinates besides X,Y and Z (Marlin v1.1.9 / v2.0.0 and newer).

This means the system needs first to establish its starting point of the physical (machine) coordinate system, a process called *Homing*. Homing can be initiated either via the [G28 G-code](http://marlinfw.org/docs/gcode/G028.html) or via the LCD controller. 

![real](/assets/images/docs/hardware/endstops/not_homed.jpg)
{: style="text-align: center;"}

Illustration 1: LCD indication not homed axes (Marlin <= v1.1.8)
{: style="color:gray; font-size: 80%; text-align: center;"}

## Safety
The other important aspect of an endstop is protecting the hardware from damage. Should any movement try to exceed the physical limits of the machine, the endstop will cut the movement.

<br>

# Types of endstops
There are two main types of endstops. Hardware endstops and software endstops.

<br>

## Hardware endstops
Hardware endstops are electrically connected to the endstop ports of the printer control board and will provide a signal when the endstop condition is met.

![endstop_types](/assets/images/docs/hardware/endstops/endstop_types.png)
{: style="text-align: center;"}

Illustration 2: Most common endstops (left to right): Micro switch, optical endstop (light barrier), hall sensor (magnetic)
{: style="color:gray; font-size: 80%; text-align: center;"}

Regardless of the type the basic way of working is the same:

 - A typically 5 Volt signal (High) drops to 0 Volt (Low): Normally closed (NC) switch
 - A 0 Volt signal (Low) rises to 5 Volts (High): Normally open (NO) switch
 
{% panel info Note %}
Since endstops are a safety feature NC switches are recommended as they will halt the machine should the switch be damaged, e.g. by a broken cable etc.
{% endpanel %}

### Probe as Z-Endstop
Probes can act like an endstop for the minimum Z-axis. While the typical endstop has a fixed position, the probe is mounted on the print-head and can freely move around the bed. 

![probes](/assets/images/docs/hardware/endstops/probes.png)
{: style="text-align: center;"}

Illustration 3: Common probe types: Inductive (left), solenoid touch probe (right)
{: style="color:gray; font-size: 80%; text-align: center;"}

Probes and their configuration are beyond this endstop introduction. Further reading is provided in the Chapter [Probes Configuration](http://marlinfw.org/docs/configuration/probes.html), [Auto Bed Leveling](http://marlinfw.org/docs/features/auto_bed_leveling.html) and [Unified Bed Leveling](http://marlinfw.org/docs/features/unified_bed_leveling.html).

## Software Endstops
Typically 3D printers are only equipped with hardware endstops on one side of each axis (Minimum or Maximum of the respective axis). As discussed above this is used to determine the starting point (origin) of the machine coordinate system. 

In order to also protect the other side of the axes software endstops should be defined in the firmware via the `#define MAX_SOFTWARE_ENDSTOPS` /  `#define MIN_SOFTWARE_ENDSTOPS` directive. This then uses the value from `#define [XYZ]_MAX_POS` / `#define [XYZ]_MIN_POS` to determine the maximum distance between the physical endstop and the software commanded stop of the axis. Software endstops can be (de-)activated via the [M211 G-code](http://marlinfw.org/docs/gcode/M211.html).
 
<br>

# Endstops and Electromagnetic Interference (EMI)

Electromagnetic Interference (EMI) or electric noise, is an effect which can ruin the clean signal needed to properly and precisely measure electronically, be it temperature, endstop hits or any other value.

<br>

## Sources and effect of EMI
In today's life an abundance of sources for Electric Noise exists: Mobile phones, microwaves, WIFI, power supplies etc.
In a 3D printer itself, there are also some prominent and strong sources of such noise:

 - Heated beds
 - Hot ends
 - Stepper motors
 - PWM modulation 

The Electromagnetic Interference created by these sources are picked up by other components, either because they are directly connected or via radiation.
The useful signal needed by the other components will be disturbed or even altered so much that it is no longer useful.

<br>

## Effect on endstops / limit switches
In the following *High = Logic 1 = 5 Volt* will be used for a pressed switch and *Low = Logic 0 = 0 Volt* for a not triggered switch.

<br>

### Ideal endstop characteristic

![ideal](/assets/images/docs/hardware/endstops/switch_ideal.png)
{: style="text-align: center;"}

Illustration 4: Ideal Endstop
{: style="color:gray; font-size: 80%; text-align: center;"}

The above Illustration 4 shows an ideal endstop characteristic: Once pressed it jumps from Low to High and the printer control board realizes this in virtually no time.

<br>

### Real endstop characteristic with low noise

![real](/assets/images/docs/hardware/endstops/switch_real.png)
{: style="text-align: center;"}

Illustration 5: Real endstop characteristic
{: style="color:gray; font-size: 80%; text-align: center;"}

Illustration 5 shows:

 - There is no clean Low or High. Both states are somewhat unclean 
 - Around the trigger point (marked in orange) an effect known as bouncing is shown: Due to mechanical influences the switch bounces between Low and High a few times before settling to High
 - Bouncing is unwanted but in case of endstops not a show stopper

<br>

### Real endstop characteristic with peak noise

![noise](/assets/images/docs/hardware/endstops/switch_noise.png)
{: style="text-align: center;"}

Illustration 6: Real endstop with EMI 
{: style="color:gray; font-size: 80%; text-align: center;"}

This Illustration 6 shows:

 - Same characteristic as above but with a peak caused by EMI (marked in red)
 - The peak is high enough to be falsely detected by the printer control board as pressed switch, potentially ruining a running print

<br>

## Countermeasures
There are numerous counter measures preventing noise:

 1. Shielded cables / twisted cable pairs
 2. Cable routing (route signal cables away from power cables)
 3. Software filtering
 4. Hardware filtering

In the following the options 3 and 4 will be discussed further.

<br>

### Software filtering
Beginning with Marlin v1.1.9 and v2.0 the software measures against endstop noise are improved and exposed as a setting. Prior versions already implemented filtering that is permanently active. 
For the sake of precision, this now has been exposed as a user setting in `Configuration.h` and deactivated by default.

     /**
     * Endstop Noise Filter
     *
     * Enable this option if endstops falsely trigger due to noise.
     * NOTE: Enabling this feature means adds an error of +/-0.2mm, so homing
     * will end up at a slightly different position on each G28. This will also
     * reduce accuracy of some bed probes.
     * For mechanical switches, the better approach to reduce noise is to install
     * a 100 nanofarads ceramic capacitor in parallel with the switch, making it
     * essentially noise-proof without sacrificing accuracy.
     * This option also increases MCU load when endstops or the probe are enabled.
     * So this is not recommended. USE AT YOUR OWN RISK.
     * (This feature is not required for common micro-switches mounted on PCBs
     * based on the Makerbot design, since they already include the 100nF capacitor.)
     */
    //#define ENDSTOP_NOISE_FILTER

Activating this option will lead to following endstop characteristics:

![software](/assets/images/docs/hardware/endstops/switch_software.png)
{: style="text-align: center;"}

Illustration 7: Endstop with software filtering
{: style="color:gray; font-size: 80%; text-align: center;"}

The yellow marked area in Illustration 7 shows the area where the software compensation is active. 
The first yellow area is an effect due to noise and the algorithm decides that no endstop is triggered since the signal falls back to a Low state. 

The second yellow area marks the spot where a real and wanted endstop triggering has happened. Now the algorithm basically "watches" the situation for some milliseconds until deciding if the endstop really is triggered or if an EMI / Noise effect needs to be compensated. 
This will lead to delays and finally to a precision loss in the detection of the endstop. 

{% panel danger Note %}
Depending on the printer's geometry and affected endstop, this precision loss may result in issues especially concerning the bed leveling. Using this feature is not recommended. Implementing some type of hardware filtering is strongly preferred.
{% endpanel %}

### Hardware Filtering
Hardware filtering can range from a simple capacitor in parallel to the switch over a resistor / capacitor combination (RC-unit) up to opto-couplers and flip-flops.

<br>

#### Board
Some printer controller boards already contain such filters located at the endstop connectors. Unfortunately the popular RAMPS v1.4 design does not. A deficit that has been corrected with the RAMPS v1.4.2 design:


![ramps](/assets/images/docs/hardware/endstops/ramps_endstop_compare.png)
{: style="text-align: center;"}

Illustration 8: RAMPS v1.4 vs v1.4.2
{: style="color:gray; font-size: 80%; text-align: center;"}

<br>

#### Endstop PCB 
For 3D printing ready made filtered endstops are available, e.g. according to the Makerbot design:

![ramps](/assets/images/docs/hardware/endstops/makerbot_endstop.png)
{: style="text-align: center;"} 

Illustration 9: Endstop PCB with RC unit
{: style="color:gray; font-size: 80%; text-align: center;"}

<br>

#### Endstop with capacitor
A more simple variant, that can easily be fitted to existing endstops is a 100nF capacitor, soldered over the two endstop connector pins (in parallel):

![filter](/assets/images/docs/hardware/endstops/switch_cap.png)
{: style="text-align: center;"}

Illustration 10: Endstop with 100nF capacitor
{: style="color:gray; font-size: 80%; text-align: center"}

<br>

#### Effect of the hardware filtering
Illustration 8 below shows the effect of such hardware filtering: The noise level is smoothed and peaks will be reduced so much that they no longer will cause false readings. Additionally the fast bouncing at the beginning of the triggering will also be damped. 

![filter](/assets/images/docs/hardware/endstops/switch_filter.png)
{: style="text-align: center;"}

Illustration 11: Endstop characteristic with hardware filter
{: style="color:gray; font-size: 80%; text-align: center"}

## Conclusion
Electrical Noise should not be underestimated. It is invisible but it may lead to strange effects that are very hard to diagnose due to its spurious nature. Simple measures like adding a capacitor will already improve the situation considerably, overall improving reliability of the machine. 