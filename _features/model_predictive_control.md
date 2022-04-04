---
title:        Model Predictive Temperature Control
description:  Control temperatures using a physical model of the system

author: tombrazier
category: [ features ]
---

<script type="text/javascript" id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
</script>

<!-- ## Background -->

Temperature is commonly controlled with a PID algorithm. The basic premise of PID is that the further the
temperature is from the setpoint, the more power is applied. If you could supply PID with perfect temperature
information, it could, in principle, apply perfect control. However real life temperature information comes
from sensors which exhibit both latency and noise.

Model predictive control takes a different approach to PID. Instead of trying to control against the sensor
output, it maintains a simulation of the system and uses that to plan an optimal power output. The simulation
has no noise and no latency, making near perfect control possible. To prevent the simulated sytem state diverging
from the real life hotend state, the simulated state is continually gently dragged towards the temperature measure
from the sensor. This does introduce a little noise and latency into the simulated system but the effect is
far smaller than for PID.

Configure with [`M306`](/docs/gcode/M306.html).

<br>
# Advantages

- Easy to configure.
- Stable.
- Responsive.
- Easily models heat losses to part cooling fan and filament. No need for `PID_EXTRUSION_SCALING` and `PID_FAN_SCALING`.

<br>

# Configuration

1. Disable `PIDTEMP` and enable `MPCTEMP` in `Configuration.h`.
1. Set your heater power(s) in `MPC_HEATER_POWER`.
1. Install the firmware and run `M306 T` to tune the active hotend.
1. Save MPC constants with `M500` and/or set them in Configuration.h
1. Set a hotend temperature to give it a test.

Note that during `M306 T` the printer will home and then position the hotend just above the bed. Ensure
`MPC_TUNING_POS` leaves space not to crash into the bed.

Example output from `M306 T`:
```
Measuring MPC constants for E0
Moving to tuning position
Cooling to ambient
Heating to 200C
Measuring ambient heatloss at target 209.64
Measuring ambient heatloss with full fan
Done
MPC_BLOCK_HEAT_CAPACITY 18.42
MPC_SENSOR_RESPONSIVENESS 0.2176
MPC_AMBIENT_XFER_COEFF 0.0664
MPC_AMBIENT_XFER_COEFF_FAN255 0.0998
```

[`M306`](/docs/gcode/M306.html) can also be used to change constants at runtime.

# Advanced configuration

`MPC_FAN_0_ALL_HOTENDS` and `MPC_FAN_0_ACTIVE_HOTEND`: Marlin assumes fan _N_ cools parts printed by hotend _N_.
However some multi-hotend machines have only one fan. In these cases MPC needs to know whether the cooling fan
cools all hotends simultatneously or whether it cools only the active hotend. Enable the appropriate option.

`FILAMENT_HEAT_CAPACITY_PERMM`: MPC models heat loss from melting filament. Set the filament heat capcity here.

`MPC_SMOOTHING_FACTOR`, `MPC_MIN_AMBIENT_CHANGE` and `MPC_STEADYSTATE`: These may be tweaked for stability. See
the alogithm description for details.

# The MPC algorithm used in Marlin

MPC models the hotend system as four thermal masses: ambient air, filament, the heatblock and the sensor. Heater power
heats the modeled heatblock directly. Ambient air heats or cools the heatblock. Filament cools the heatblock. The heatblock
heats or cools the sensor.

Every time the MPC algorithm runs it uses the following information to calculate a new temperature for the
simulated hotend and sensor:
- The last power setting for the hotend.
- The present best guess at ambient temperature.
- The effect of the fan on heatloss to ambient air.
- The effect of filament feedrate on heatloss to the filament. Filament is assumed to be at the same temperature
as the ambient air.

Once this calculation is complete the simulated sensor temperature is compared to the measured temperature and a
fraction of the difference is applied to the modeled sensor and heatblock temperature. This drags the simulated
system in the direction of the modeled system. Because only a fraction of the difference is applied, sensor noise
is diminished and averages out to zero over time. Both the simulated and the real sensor exhibit the same (or very
similar) latency. Consequently the effects of latency are eliminated when these values are compared to each other.
So the simulated hotend is only minimally affected by sensor noise and latency. This is where the real magic of
the MPC algorithm lies.

`MPC_SMOOTHING_FACTOR` is the factor applied to the difference between simulated and measured sensor temperature.
At its maximum value of 1, the simulated sensor temperature is continually set equal to the measured sensor temperature.
A lower value will result in greater stability in MPC output power but also in decreased responsiveness. A value around
0.25 seems to work quite well.

No simulation is perfect and, anyway, real life ambient temperature changes. So MPC also maintains a best guess
estimate of ambient temperature. When the simulated system is close to steady state the simulated ambient temperature
is continually adjusted. Steady state is determined to be when the MPC algorithm is not driving the hotend at its limits
(i.e. full or zero heater power) or when it is at its limit but temperatures are still not changing very much - which
will occur at asymptotic temperature (usually when target temperature is zero and the hotend is at ambient).

`MPC_STEADYSTATE` is used to recognise the asymptotic condition. If the simulated hotend temperature changes at an absolute
rate less than `MPC_STEADYSTATE` over two successive runs of the algorithm, the steady state logic is applied. Since the
algorithm runs frequently (6 times a second on an AVR mainboard), even a fairly smally amount of noise can make the short
term rate of change in hotend temperature seem quite high. In practice 1°C/s seems to work well for `MPC_STEADYSTATE`.

When in steady state, the difference between real and simulated sensor temperatures is used to drive the changes
to ambient temperature. However when the temperatures are really close `MPC_MIN_AMBIENT_CHANGE` ensures that the
simulated ambient temperature converges relatively quickly. Larger values of `MPC_MIN_AMBIENT_CHANGE` will result
in faster convergence but will also cause the simulated ambient temperature to flutter somewhat chaotically around
the ideal value. This is not a problem because the effect of ambient temperature is fairly small and short term
variations of even 10°C or more will not have a noticeable effect.

Finally, it is important to note that the simulated ambient temperature will only converge on real world ambient
temperature if the ambient heat transfer coefficients are excactly accurate. In practice this will not be the case
and the simulated ambient temperature therefore also acts a correction to these inaccuracies.

# The MPC model in detail and tuning


The model is not a physically accurate representation of the hotend system but it is good enough. Differences from
real life include:
- The real heating element is a separate thermal mass which is somewhat thermally insulated from the hearblock.
- The real heatblock is cooled by the heatsink which slowly heats to some asymptotic temperature.
- The real sensor heats/cools the heatblock to a tiny degree.

None of these effects is signficant enough to affect the fundtioning of MPC. So for the sake of simplicity and performance omitted.

For those who like that sort of thing, the differential equations are:

$$ \dfrac{dT_b}{dt} = \dfrac{P + h_a (T_a - T_b)}{C_b} $$

$$ \dfrac{dT_s}{dt} = \dfrac{h_a (T_b - T_s)}{C_s} $$

where

$$T_b$$ = temperature of the heatblock.

$$T_s$$ = temperature of the sensor.

$$T_a$$ = temperature of the ambient air.

$$t$$ = time.

$$P$$ = heater power.

$$h_a$$ = coefficient of heat transfer from heatblock to ambient. This one constant encapsulates the effect of
fan speed and filament feedrate as both room air and filament are assumed to start at thea same ambient temperature.

$$h_s$$ = coefficient of heat transfer from heatblock to sensor.

$$C_b$$ = heat capacity of the heatblock.

$$C_s$$ = heat capacity of the sensor.

These differential equations are continually solved numerically by MPC. However they are also easy to solve
analytically and the analytical solution is used by `M306 T`:

Tb = Tasymp + (Ta - Tasymp) . exp(

# What `M306 T` does
Move center and close to bed. Because printing occurs close to bed or model.
Cool to ambient.
Heat past 200C.
Hold temperature whilst measuring ambient heatlos without (and optionally with) fan.
